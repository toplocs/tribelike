"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PrismaStore = void 0;
const client_1 = require("@prisma/client");
class PrismaStore {
    constructor(model, options) {
        this.name = model;
        this.prisma = new client_1.PrismaClient();
        this.model = model;
    }
    setRelatedStore(key, store) {
        return;
    }
    async index(key) {
        // Todo: check if an index exists in Prisma?
        return true;
    }
    async clear() {
        await this.prisma[this.model].deleteMany({});
    }
    async getAll(filter = {}, include = {}, limit) {
        return await this.prisma[this.model].findMany({
            take: limit,
            where: filter,
            include: include
        });
    }
    async create(newData) {
        return await this.prisma[this.model].create({ data: newData });
    }
    async getById(id, include = {}) {
        return await this.prisma[this.model].findUnique({
            where: { id },
            include: include
        });
    }
    async getBy(key, value, include = {}) {
        return await this.prisma[this.model].findUnique({
            where: { [key]: value },
            include: include
        });
    }
    async update(id, newData) {
        return await this.prisma[this.model].update({ where: { id }, data: newData });
    }
    async delete(id) {
        const result = await this.prisma[this.model].delete({ where: { id } });
        return result !== null;
    }
}
exports.PrismaStore = PrismaStore;
