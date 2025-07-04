"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Model = void 0;
const uuid_1 = require("uuid");
class Model {
    constructor(store, options = {
        getAll: true,
        create: true,
        getById: true,
        update: true,
        delete: true
    }) {
        this.store = store;
        this.options = options;
    }
    async clear() {
        await this.store.clear();
    }
    async getAll(filter = {}, limit) {
        if (!this.options.getAll)
            throw new Error('Method not available');
        return await this.store.getAll(filter, limit);
    }
    async create(item) {
        if (!this.options.create)
            throw new Error('Method not available');
        item.id = item.id || (0, uuid_1.v4)();
        try {
            return await this.store.create(item);
        }
        catch (error) {
            console.error('Error creating item:', error);
            return null;
        }
    }
    async getById(id, include = {}) {
        if (!this.options.getById)
            throw new Error('Method not available');
        const item = await this.store.getById(id, include);
        return item;
    }
    async update(id, updatedItem) {
        if (!this.options.update)
            throw new Error('Method not available');
        return await this.store.update(id, updatedItem);
    }
    async delete(id) {
        if (!this.options.delete)
            throw new Error('Method not available');
        return await this.store.delete(id);
    }
}
exports.Model = Model;
