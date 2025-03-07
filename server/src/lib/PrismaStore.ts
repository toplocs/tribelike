import { PrismaClient } from '@prisma/client';
import { IStore } from './Store';
import { Uuid, GenericObject } from '@tribelike/types/Uuid';

export class PrismaStore<T extends GenericObject> implements IStore<T> {
    private prisma: PrismaClient;
    private model: string;

    constructor(model: string) {
        this.prisma = new PrismaClient();
        this.model = model;
    }

    async getAll(): Promise<T[]> {
        return await (this.prisma[this.model as keyof PrismaClient] as any).findMany();
    }

    async add(newData: T): Promise<T | null> {
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