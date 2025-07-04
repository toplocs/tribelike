"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MemoryStore = void 0;
const inspector_1 = require("inspector");
class MemoryStore {
    constructor(name, options) {
        this.items = new Map();
        this.relatedStores = {};
        this.indexKeys = [];
        this.indexes = {};
        this.name = name;
        this.itemConstructor = options?.constructor || Object;
    }
    async debug() {
        inspector_1.console.log('Debug Info:');
        inspector_1.console.log('Items:', Array.from(this.items.values()));
        inspector_1.console.log('Indexes:', this.indexes);
        inspector_1.console.log('Related Stores:', this.relatedStores);
    }
    // Add method to register related stores
    setRelatedStore(key, store) {
        this.relatedStores[key] = store;
    }
    async index(key) {
        if (typeof key === 'string' && !this.indexKeys.includes(key)) {
            this.indexKeys.push(key);
            this.indexes[key] = new Map();
            this.items.forEach(item => {
                this.indexes[key]?.set(item[key], item.id);
            });
            return true;
        }
        return false;
    }
    async clear() {
        this.items.forEach((item, id) => {
            this.deleteItem(id);
        });
        this.items.clear();
        for (const key of this.indexKeys) {
            this.indexes[key] = new Map();
        }
    }
    async includeRelatedData(item, include) {
        for (const key of Object.keys(include)) {
            const relatedStore = this.relatedStores[key];
            if (relatedStore) {
                const relationFieldName = this.name.toLowerCase() + 'Id';
                const filter = { [`${relationFieldName}`]: item.id };
                const relatedItems = await relatedStore.getAll(filter);
                if (item[key] && typeof item[key] === 'object') {
                    item[key] = relatedItems;
                }
            }
        }
        return item;
    }
    async getAll(filter = {}, include = {}, limit) {
        // TODO: use index if filter given
        const items = Array.from(this.items.values());
        const filteredItems = items.filter(item => {
            return Object.keys(filter).every(key => item[key] === filter[key]);
        });
        const result = limit ? filteredItems.slice(0, limit) : filteredItems;
        return result.map(item => this.instantiate(item));
    }
    async create(newData) {
        await this.saveItem(newData);
        this.items.set(newData.id, newData);
        await this.setIndexes(newData.id, newData);
        return this.instantiate(this.items.get(newData.id));
    }
    async getById(id, include = {}) {
        const item = this.items.get(id);
        if (!item)
            return null;
        const instance = this.instantiate(item);
        inspector_1.console.log('Include:', include, this.name);
        if (include) {
            await this.includeRelatedData(instance, include);
        }
        return instance;
    }
    async getBy(key, value) {
        const index = this.indexes[key];
        if (index) {
            const id = index.get(value);
            if (!id)
                return null;
            const item = this.items.get(id);
            if (!item)
                return null;
            return this.instantiate(item);
        }
        else {
            throw new Error(`Index for key "${String(key)}" not found in store "${this.name}".`);
        }
    }
    async update(id, newData) {
        const existingItem = this.items.get(id);
        if (existingItem) {
            const updatedData = { ...existingItem, ...newData };
            await this.saveItem(updatedData);
            this.items.set(id, updatedData);
            await this.setIndexes(id, newData);
            const result = await this.getById(updatedData.id);
            return result;
        }
        return null;
    }
    async delete(id) {
        const item = this.items.get(id);
        if (!item)
            return false;
        await this.removeIndexes(id, item);
        const success = this.items.delete(id);
        if (!success)
            return false;
        return await this.deleteItem(id);
    }
    async setIndexes(id, newData) {
        for (const key of this.indexKeys) {
            if (typeof key === 'string') {
                const value = newData[key];
                if (value) {
                    this.indexes[key]?.set(value, id);
                }
            }
        }
    }
    async removeIndexes(id, data) {
        for (const key of this.indexKeys) {
            if (typeof key === 'string') {
                this.indexes[key]?.delete(data[key]);
            }
        }
    }
    instantiate(data) {
        if (this.itemConstructor === Object)
            return data;
        const instance = new this.itemConstructor();
        return Object.assign(instance, data);
    }
    async load() {
        return;
    }
    async saveItem(item) {
        return;
    }
    async deleteItem(id) {
        return true;
    }
}
exports.MemoryStore = MemoryStore;
