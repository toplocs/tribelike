// Key features of StoreManager:
// - Uses the Singleton pattern for StoreManager
// - Environment variable controls store type
// - All store operations are async
// - Common interface ensures consistency
// - Models are decoupled from storage implementation
// - Easy to add new store types in the future

import { FileStore } from './FileStore';
import { PrismaStore } from './PrismaStore';
import { storeType } from '../config';
import { Uuid, GenericObject } from '@tribelike/types/Uuid';

export interface IStore<T extends GenericObject> {
    getAll(): Promise<T[]>;
    add(newData: T): Promise<T | null>;
    getById(id: Uuid): Promise<T | null>;
    update(id: Uuid, newData: Partial<T>): Promise<T | null>;
    delete(id: Uuid): Promise<boolean>;
}

export type StoreType = 'file' | 'prisma';

export class Store {
    private static instance: Store;
    private storeType: StoreType;

    private constructor() {
        this.storeType = storeType;
    }

    public static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }

    public getStore<T extends GenericObject>(name: string): IStore<T> {
        switch (this.storeType) {
            case 'prisma':
                return new PrismaStore<T>(name) as IStore<T>;
            case 'file':
            default:
                return new FileStore<T>(name) as IStore<T>;
        }
    }
}