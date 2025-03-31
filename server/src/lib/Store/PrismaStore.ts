import { PrismaClient } from '@prisma/client';
import { Uuid, GenericObject } from '@tribelike/types';
import { StoreOptions, IStore } from './Store';

export class PrismaStore<T extends GenericObject> implements IStore<T> {
    public name: string;
    private prisma: PrismaClient;
    private model: string;

    constructor(model: string, options?: StoreOptions<T>) {
        this.name = model;
        this.prisma = new PrismaClient();
        this.model = model;
    }

    public setRelatedStore(key: string, store: IStore<any>): void {
        return;
    }

    async index(key: keyof T): Promise<boolean> {
        // Todo: check if an index exists in Prisma?
        return true;
    }

    async clear(): Promise<void> {
        await (this.prisma[this.model as keyof PrismaClient] as any).deleteMany({});
    }
    
    async getAll(filter: any = {}, include: any = {}, limit?: number): Promise<T[]> {
        return await (this.prisma[this.model as keyof PrismaClient] as any).findMany({
            take: limit,
            where: filter,
            include: include
        });
    }

    async create(newData: T): Promise<T | null> {
        return await (this.prisma[this.model as keyof PrismaClient] as any).create({ data: newData });
    }

    async getById(id: Uuid, include: any = {}): Promise<T | null> {
        return await (this.prisma[this.model as keyof PrismaClient] as any).findUnique({ 
            where: { id }, 
            include: include 
        });
    }

    async getBy(key: keyof T, value: string): Promise<T | null> {
        return await (this.prisma[this.model as keyof PrismaClient] as any).findFirst({
            where: { [key]: value }
        });
    }

    async update(id: Uuid, newData: Partial<T>): Promise<T | null> {
        return await (this.prisma[this.model as keyof PrismaClient] as any).update({ where: { id }, data: newData });
    }

    async delete(id: Uuid): Promise<boolean> {
        const result = await (this.prisma[this.model as keyof PrismaClient] as any).delete({ where: { id } });
        return result !== null;
    }
}