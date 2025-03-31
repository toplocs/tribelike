import { console } from 'inspector';
import { StoreOptions, IStore } from './Store';
import { Uuid, GenericObject } from '@tribelike/types/Uuid';

export class MemoryStore<T extends GenericObject> implements IStore<T> {
    public name: string;
    protected items: Map<Uuid, T> = new Map();
    protected itemConstructor: new (...args: any[]) => T;
    private relatedStores: Record<string, IStore<any>> = {};
    private indexKeys: (keyof T)[] = [];
    private indexes: Partial<Record<keyof T, Map<string, Uuid>>> = {};

    constructor(name: string, options?: StoreOptions<T>) {
        this.name = name;
        this.itemConstructor = options?.constructor || Object as any;
    }

    public async debug(): Promise<void> {
        console.log('Debug Info:');
        console.log('Items:', Array.from(this.items.values()));
        console.log('Indexes:', this.indexes);
        console.log('Related Stores:', this.relatedStores);
    }

    // Add method to register related stores
    public setRelatedStore(key: string, store: IStore<any>): void {
        this.relatedStores[key] = store;
    }

    public async index(key: keyof T): Promise<boolean> {
        if (typeof key === 'string' && !this.indexKeys.includes(key)) {
            this.indexKeys.push(key);
            this.indexes[key] = new Map();
            this.items.forEach(item => {
                this.indexes[key]?.set(item[key] as string, item.id);
            });
            return true;
        }
        return false;
    }

    async clear(): Promise<void> {
        this.items.forEach((item: T, id: Uuid) => {
            this.deleteItem(id);
        });
        this.items.clear();
        for (const key of this.indexKeys) {
            this.indexes[key] = new Map();
        }
    }

    private async includeRelatedData(item: T, include: any): Promise<T> {
        for (const key of Object.keys(include)) {
            const relatedStore = this.relatedStores[key];
            if (relatedStore) {
                const relationFieldName = this.name.toLowerCase() + 'Id';
                const filter = { [`${relationFieldName}`]: item.id };
                const relatedItems = await relatedStore.getAll(filter);
                if (item[key as keyof T] && typeof item[key as keyof T] === 'object') {
                    item[key as keyof T] = relatedItems as unknown as T[keyof T];
                }
            }
        }
        return item;
    }

    async getAll(filter: any = {}, include: any = {}, limit?: number): Promise<T[]> {
        // TODO: use index if filter given
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

    async getById(id: Uuid, include: any = {}): Promise<T | null> {
        const item = this.items.get(id);
        if (!item) return null;
        const instance = this.instantiate(item);
        
        console.log('Include:', include, this.name);
        if (include) {
            await this.includeRelatedData(instance, include);
        }

        return instance;
    }

    async getBy(key: keyof T, value: string): Promise<T | null> {
        const index = this.indexes[key];
        if (index) {
            const id = index.get(value);
            if (!id) return null;
            const item = this.items.get(id);
            if (!item) return null;
            return this.instantiate(item);
        } else {
            throw new Error(`Index for key "${String(key)}" not found in store "${this.name}".`);
        }
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

    protected async load(): Promise<void> {
        return;
    }

    protected async saveItem(item: T): Promise<void> {
       return;
    }

    protected async deleteItem(id: Uuid): Promise<boolean> {
        return true;
    }
}