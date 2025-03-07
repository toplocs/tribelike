import fs from 'fs/promises';
import path from 'path';
import { IStore } from './Store';
import { dataFolder } from '../config';
import { Uuid, GenericObject } from '@tribelike/types/Uuid';

export class FileStore<T extends GenericObject> implements IStore<T> {
    private dataPath: string;
    private list: T[] = [];

    constructor(filename: string) {
        this.dataPath = path.join(dataFolder, `${filename}.json`);;
        this.initializeStore();
    }

    private async initializeStore(): Promise<void> {
        try {
            await fs.access(this.dataPath);
        } catch {
            await fs.writeFile(this.dataPath, JSON.stringify([]), 'utf8');
        }
        this.list = await this.load();
    }

    async getAll(): Promise<T[]> {
        return this.list;
    }

    async add(newData: T): Promise<T | null> {
        this.list.push(newData);
        await this.save(this.list);
        return newData;
    }

    async getById(id: Uuid): Promise<T | null> {
        return this.list.find(item => item.id === id) || null;
    }

    async update(id: Uuid, newData: Partial<T>): Promise<T | null> {
        const index = this.list.findIndex(i => i.id === id);
        if (index !== -1) {
            this.list[index] = { ...this.list[index], ...newData };
            await this.save(this.list);
            return this.list[index];
        }
        return null;
    }

    async delete(id: Uuid): Promise<boolean> {
        const initialLength = this.list.length;
        this.list = this.list.filter(item => item.id !== id);
        await this.save(this.list);
        return this.list.length < initialLength;
    }

    private async load(): Promise<T[]> {
        try {
            const content = await fs.readFile(this.dataPath, 'utf8');
            return JSON.parse(content);
        } catch (err) {
            console.error(`Error reading data for ${this.dataPath}:`, err);
            return [];
        }
    }

    private async save(data: T[]): Promise<void> {
        try {
            await fs.writeFile(this.dataPath, JSON.stringify(data, null, 2));
        } catch (err) {
            console.error(`Error writing data for ${this.dataPath}:`, err);
        }
    }
}