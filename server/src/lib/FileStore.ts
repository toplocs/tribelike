import fs from 'fs';
import path from 'path';
import JSONL from "jsonl-parse-stringify";
import { FileStoreOptions, IStore } from './Store';
import { dataFolder } from '../config';
import { Uuid, GenericObject } from '@tribelike/types/Uuid';

export class FileStore<T extends GenericObject> implements IStore<T> {
    public name: string;
    private dataPath: string;
    private items: Map<Uuid, T> = new Map();
    // Example for indexKeys: ['username', 'email']
    private indexKeys: (keyof T)[] = [];
    private indexes: Partial<Record<keyof T, Map<string, Uuid>>> = {};
    private itemConstructor: new (...args: any[]) => T;

    constructor(modelName: string, options?: FileStoreOptions<T>) {
        this.name = modelName;
        this.indexKeys = options?.indexKeys || [];
        this.dataPath = path.join(dataFolder, this.name);
        this.itemConstructor = options?.constructor || Object as any;
        this.initializeStore();
    }

    private async initializeStore(): Promise<void> {
        try {
            fs.mkdirSync(this.dataPath, { recursive: true });
        } catch (err) {
            console.error(`Error creating directory ${this.dataPath}:`, err);
        }
        await this.load();
        await this.initializeIndexes();
    }

    async clear(): Promise<void> {
        this.items.forEach((item: T, id: Uuid) => {
            this.deleteItem(id);
        });
        this.items.clear();
        this.initializeIndexes();
    }

    async getAll(filter: any = {}, limit?: number): Promise<T[]> {
        const items = Array.from<T>(this.items.values() as MapIterator<T>);
        const filteredItems = items.filter(item => {
            return Object.keys(filter).every(key => item[key as keyof T] === filter[key]);
        });
        const result = limit ? filteredItems.slice(0, limit) : filteredItems;
        return result.map(item => this.instantiate(item));
    }

    async create(newData: T): Promise<T | null> {
        await this.saveItem(newData);
        this.items.set(newData.id as Uuid, newData as T);
        await this.setIndexes(newData.id, newData);
        return this.instantiate(this.items.get(newData.id) as T);
    }

    async getById(id: Uuid): Promise<T | null> {
        const item = this.items.get(id);
        if (!item) return null;
        return this.instantiate(item);
    }

    async getBy(key: keyof T, value: string): Promise<T | null> {
        const index = this.indexes[key];
        if (!index) return null;
        const id = index.get(value);
        if (!id) return null;
        const item = this.items.get(id);
        if (!item) return null;
        return this.instantiate(item);
    }

    async update(id: Uuid, newData: Partial<T>): Promise<T | null> {
        const existingItem = this.items.get(id) as T;
        if (existingItem) {
            const updatedData = { ...existingItem, ...newData };
            await this.saveItem(updatedData);
            this.items.set(id as Uuid, updatedData as T);
            await this.setIndexes(id, newData);
            const result = await this.getById(updatedData.id);
            return result;
        }
        return null;
    }

    async delete(id: Uuid): Promise<boolean> {
        const item = this.items.get(id) as T;
        if (!item) return false;
        await this.removeIndexes(id, item);
        const success = this.items.delete(id);
        if (!success) return false;
        return await this.deleteItem(id);
    }

    private async load(): Promise<void> {
        try {
            const files = fs.readdirSync(this.dataPath);
            for (const file of files) {
                if (file.endsWith('.jsonl')) {
                    const content = fs.readFileSync(path.join(this.dataPath, file), 'utf8');
                    const items: T[] = JSONL.parse<T>(content);
                    items.forEach(item => this.items.set(item.id as Uuid, item as T));
                }
            }
        } catch (err) {
            console.error(`Error reading data for ${this.dataPath}:`, err);
        }
    }

    private async saveItem(item: T): Promise<void> {
        try {
            const dataString = JSONL.stringify([item]);
            fs.writeFileSync(path.join(this.dataPath, `${item.id}.jsonl`), dataString, { encoding: 'utf8', flush: true });
        } catch (err) {
            console.error(`Error saving item ${item.id} for ${this.dataPath}:`, err);
        }
    }

    private async deleteItem(id: Uuid): Promise<boolean> {
        try {
            if (fs.statSync(path.join(this.dataPath, `${id}.jsonl`))) {
                fs.unlinkSync(path.join(this.dataPath, `${id}.jsonl`));
                return true;
            }  else {
                console.warn(`File ${id}.jsonl does not exist for ${this.dataPath}`);
                return false;
            }
        } catch (err) {
            console.error(`Error deleting item ${id} for ${this.dataPath}:`, err);
            return false;
        }
    }

    private async initializeIndexes(): Promise<void> {
        for (const key of this.indexKeys) {
            if (typeof key === 'string') {
                this.indexes[key] = new Map();
                this.items.forEach(item => {
                    this.indexes[key]?.set(item[key] as string, item.id);
                });
            }
        }
    }

    private async setIndexes(id: Uuid, newData: Partial<T>): Promise<void> {
        for (const key of this.indexKeys) {
            if (typeof key === 'string') {
                const value = newData[key] as string;
                if (value) {
                    this.indexes[key]?.set(value, id);
                }
            }
        }
    }

    private async removeIndexes(id: Uuid, data: Partial<T>): Promise<void> {
        for (const key of this.indexKeys) {
            if (typeof key === 'string') {
                this.indexes[key]?.delete(data[key] as string);
            }
        }
    }

    private instantiate(data: T): T {
        if (this.itemConstructor === (Object as unknown as new (...args: any[]) => T)) return data;
        const instance = new this.itemConstructor();
        return Object.assign(instance, data);
    }
}