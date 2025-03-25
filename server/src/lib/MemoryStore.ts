import { IStore } from './Store';
import { Uuid, GenericObject } from '@tribelike/types/Uuid';

export class MemoryStore<T extends GenericObject> implements IStore<T> {
    public name: string;
    private list: T[] = [];

    constructor(filename: string) {
        this.name = filename;
        this.list = [];
    }

    async clear(): Promise<void> {
        this.list = [];
    }

    async getAll(filter: any = {}, limit?: number): Promise<T[]> {
        const filteredItems = this.list.filter(item => {
            return Object.keys(filter).every(key => item[key as keyof T] === filter[key]);
        });
        return limit ? filteredItems.slice(0, limit) : filteredItems;
    }

    async create(newData: T): Promise<T | null> {
        this.list.push(newData);
        return newData;
    }

    async getById(id: Uuid): Promise<T | null> {
        return this.list.find(item => item.id === id) || null;
    }

    async update(id: Uuid, newData: Partial<T>): Promise<T | null> {
        const index = this.list.findIndex(i => i.id === id);
        if (index !== -1) {
            this.list[index] = { ...this.list[index], ...newData };
            return this.list[index];
        }
        return null;
    }

    async delete(id: Uuid): Promise<boolean> {
        const initialLength = this.list.length;
        this.list = this.list.filter(item => item.id !== id);
        return this.list.length < initialLength;
    }
}