import { PrismaClient } from '@prisma/client';
import { IStore } from './Store';
import { Uuid, GenericObject } from '@tribelike/types/Uuid';

export class PrismaStore<T extends GenericObject> implements IStore<T> {
    public name: string;
    private prisma: PrismaClient;
    private model: string;

    constructor(model: string) {
        this.name = model;
        this.prisma = new PrismaClient();
        this.model = model;
    }

    async clear(): Promise<void> {
        await (this.prisma[this.model as keyof PrismaClient] as any).deleteMany({});
    }
    
    async getAll(filter: any = {}, limit?: number): Promise<T[]> {
        return await (this.prisma[this.model as keyof PrismaClient] as any).findMany({
            take: limit,
            where: filter
        });
    }

    async create(newData: T): Promise<T | null> {
        return await (this.prisma[this.model as keyof PrismaClient] as any).create({ data: newData });
    }

    async getById(id: Uuid): Promise<T | null> {
        return await (this.prisma[this.model as keyof PrismaClient] as any).findUnique({ where: { id } });
    }

    async update(id: Uuid, newData: Partial<T>): Promise<T | null> {
        return await (this.prisma[this.model as keyof PrismaClient] as any).update({ where: { id }, data: newData });
    }

    async delete(id: Uuid): Promise<boolean> {
        const result = await (this.prisma[this.model as keyof PrismaClient] as any).delete({ where: { id } });
        return result !== null;
    }
}