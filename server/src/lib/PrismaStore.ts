import { PrismaClient } from '@prisma/client';
import { prisma } from './prisma';
import { IStore } from './Store';
import { Uuid, GenericObject } from '@tribelike/types/Uuid';

export class PrismaStore<T extends GenericObject> implements IStore<T> {
    public name: string;
    private model: string;

    constructor(model: string) {
        this.name = model;
        this.model = model;
    }

    async clear(): Promise<void> {
        await (prisma[this.model as keyof PrismaClient] as any).deleteMany({});
    }
    
    async getAll(query?: Object, limit: number = 50): Promise<T[]> {
        return await (prisma[this.model as keyof PrismaClient] as any).findMany({
            where: query,
            take: limit
        });
    }

    async create(newData: T): Promise<T | null> {
        return await (prisma[this.model as keyof PrismaClient] as any).create({ data: newData });
    }

    async getById(id: Uuid): Promise<T | null> {
        console.log(this.model)
        return await (prisma[this.model as keyof PrismaClient] as any).findUnique({ where: { id } });
    }

    async update(id: Uuid, newData: Partial<T>): Promise<T | null> {
        return await (prisma[this.model as keyof PrismaClient] as any).update({ where: { id }, data: newData });
    }

    async delete(id: Uuid): Promise<boolean> {
        const result = await (prisma[this.model as keyof PrismaClient] as any).delete({ where: { id } });
        return result !== null;
    }
}