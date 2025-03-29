// Key features of StoreManager:
// - Uses the Singleton pattern for StoreManager
// - Environment variable controls store type
// - All store operations are async
// - Common interface ensures consistency
// - Models are decoupled from storage implementation
// - Easy to add new store types in the future

import { Uuid, GenericObject } from '@tribelike/types/Uuid';
import { MemoryStore } from './MemoryStore';
import { FileStore } from './FileStore';
import { PrismaStore } from './PrismaStore';
import { storeType } from '../config';

export type StoreType = 'memory' | 'file' | 'prisma';

export interface IStore<T extends GenericObject> {
    name: string;
    setRelatedStore(key: string, store: IStore<any>): void;
    clear(): Promise<void>;
    getAll(filter?: any, include?: any, limit?: number): Promise<T[]>;
    create(newData: T): Promise<T | null>;
    getById(id: Uuid, include?: any): Promise<T | null>;
    update(id: Uuid, newData: Partial<T>): Promise<T | null>;
    delete(id: Uuid): Promise<boolean>;
    index(key: keyof T): Promise<boolean>;
    getBy(key: keyof T, value: string): Promise<T | null>;
}

export interface StoreOptions<T extends GenericObject> {
    constructor?: new (...args: any[]) => T;
}

export class Store {
    private static instance: Store;
    private storeType: StoreType;

    private constructor() {
        this.storeType = storeType as StoreType;
    }

    public static getInstance(): Store {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }

    public setStoreType(type: StoreType): void {
        this.storeType = type;
    }

    public getStoreType(): StoreType {
        return this.storeType;
    }

    public getStore<T extends GenericObject>(name: string, options?: StoreOptions<T>): IStore<T> {
        switch (this.storeType) {
            case 'memory':
                return new MemoryStore<T>(name, options) as IStore<T>;
            case 'prisma':
                return new PrismaStore<T>(name, options) as IStore<T>;
            case 'file':
            default:
                return new FileStore<T>(name, options) as IStore<T>;
        }
    }
}