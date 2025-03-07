import { Uuid, GenericObject } from '@tribelike/types/Uuid';
import { v4 as uuidv4 } from 'uuid';
import { IStore, Store } from './Store';

interface ModelOptions {
    getAll?: boolean;
    create?: boolean;
    getById?: boolean;
    update?: boolean;
    delete?: boolean;
}

export default class Model<T extends GenericObject> {
    public store: IStore<T>;
    private options: ModelOptions;

    constructor(storeName: string, options: ModelOptions = {
        getAll: true,
        create: true,
        getById: true,
        update: true,
        delete: true
    }) {
        this.store = Store.getInstance().getStore<T>(storeName);
        this.options = options;
    }

    async clear(): Promise<void> {
        await this.store.clear();
    }

    async getAll(limit?: number): Promise<T[]> {
        if (!this.options.getAll) throw new Error('Method not available');
        return await this.store.getAll(limit);
    }

    async create(item: Partial<T>): Promise<T | null> {
        if (!this.options.create) throw new Error('Method not available');
        item.id = item.id || uuidv4() as Uuid;
        return await this.store.create(item as T);
    }

    async getById(id: Uuid): Promise<T | null> {
        if (!this.options.getById) throw new Error('Method not available');
        return await this.store.getById(id);
    }

    async update(id: Uuid, updatedItem: Partial<T>): Promise<T | null> {
        if (!this.options.update) throw new Error('Method not available');
        return await this.store.update(id, updatedItem);
    }

    async delete(id: Uuid): Promise<boolean> {
        if (!this.options.delete) throw new Error('Method not available');
        return await this.store.delete(id);
    }
}
