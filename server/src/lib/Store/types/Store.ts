import { Uuid, GenericObject } from '@tribelike/types';

export type StoreType = 'memory' | 'file' | 'prisma';

export interface StoreOptions<T extends GenericObject> {
    constructor?: new (...args: any[]) => T;
}

export interface IStore<T extends GenericObject> {
    // name is used to identify the store
    // the name is used to create foreign key relationships
    name: string;
    // setRelatedStore is used to register related stores for foreign key relationships
    setRelatedStore(key: string, store: IStore<any>): void;
    // clear is used to clear all data in the store
    clear(): Promise<void>;

    // CRUD operations
    getAll(filter?: any, include?: any, limit?: number): Promise<T[]>;
    create(newData: T): Promise<T | null>;
    getById(id: Uuid, include?: any): Promise<T | null>;
    update(id: Uuid, newData: Partial<T>): Promise<T | null>;
    delete(id: Uuid): Promise<boolean>;

    // index is used to create an index for a specific key
    index(key: keyof T): Promise<boolean>;
    // getBy is used to retrieve an unique item by a specific key and value
    getBy(key: keyof T, value: string, include?: any): Promise<T | null>;
}