"use strict";
// Key features of StoreManager:
// - Uses the Singleton pattern for StoreManager
// - Environment variable controls store type
// - All store operations are async
// - Common interface ensures consistency
// - Models are decoupled from storage implementation
// - Easy to add new store types in the future
Object.defineProperty(exports, "__esModule", { value: true });
exports.Store = void 0;
const memoryStore_1 = require("./memoryStore");
const fileStore_1 = require("./fileStore");
const prismaStore_1 = require("./prismaStore");
class Store {
    constructor() {
        this.storeType = 'memory';
    }
    static getInstance() {
        if (!Store.instance) {
            Store.instance = new Store();
        }
        return Store.instance;
    }
    setStoreType(type) {
        this.storeType = type;
    }
    getStoreType() {
        return this.storeType;
    }
    getStore(name, options) {
        switch (this.storeType) {
            case 'memory':
                return new memoryStore_1.MemoryStore(name, options);
            case 'prisma':
                return new prismaStore_1.PrismaStore(name, options);
            case 'file':
            default:
                return new fileStore_1.FileStore(name, options);
        }
    }
}
exports.Store = Store;
