// Key features of StoreManager:
// - Uses the Singleton pattern for StoreManager
// - Environment variable controls store type
// - All store operations are async
// - Common interface ensures consistency
// - Models are decoupled from storage implementation
// - Easy to add new store types in the future

import { GenericObject } from '@tribelike/types';
import { MemoryStore } from './memoryStore';
import { FileStore } from './fileStore';
import { PrismaStore } from './prismaStore';
import { IStore, StoreType, StoreOptions } from './types/Store';

export class Store {
    private static instance: Store;
    private storeType: StoreType;

    private constructor() {
        this.storeType = 'memory';
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