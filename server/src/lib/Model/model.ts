import { Uuid } from '@tribelike/types/Uuid';
import { v4 as uuidv4 } from 'uuid';
import { IStore } from '../Store';
import { ModelOptions } from './types/ModelOptions';
import { GenericObject } from './genericObject';

export class Model<T extends GenericObject> {
    public store: IStore<T>;
    private options: ModelOptions;

    constructor(store: IStore<T>, options: ModelOptions = {
        getAll: true,
        create: true,
        getById: true,
        update: true,
        delete: true
    }) {
        this.store = store;
        this.options = options;
    }

    public async clear(): Promise<void> {
        await this.store.clear();
    }

    public async getAll(filter: any = {}, limit?: number): Promise<T[]> {
        if (!this.options.getAll) throw new Error('Method not available');
        return await this.store.getAll(filter, limit);
    }

    public async create(item: Partial<T>): Promise<T | null> {
        if (!this.options.create) throw new Error('Method not available');
        item.id = item.id || uuidv4() as Uuid;
        try {
            return await this.store.create(item as T);
        } catch (error) {
            console.error('Error creating item:', error);
            return null;
        }
    }

    public async getById(id: Uuid, include: any = {}): Promise<T | null> {
        if (!this.options.getById) throw new Error('Method not available');
        const item = await this.store.getById(id, include);
        return item;
    }

    public async update(id: Uuid, updatedItem: Partial<T>): Promise<T | null> {
        if (!this.options.update) throw new Error('Method not available');
        return await this.store.update(id, updatedItem);
    }

    public async delete(id: Uuid): Promise<boolean> {
        if (!this.options.delete) throw new Error('Method not available');
        return await this.store.delete(id);
    }
}
