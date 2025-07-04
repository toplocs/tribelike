"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.FileStore = void 0;
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const jsonl_parse_stringify_1 = __importDefault(require("jsonl-parse-stringify"));
const memoryStore_1 = require("./memoryStore");
const config_1 = require("../../config");
class FileStore extends memoryStore_1.MemoryStore {
    constructor(modelName, options) {
        const dataPath = path_1.default.join(config_1.dataFolder, modelName);
        fs_1.default.mkdirSync(dataPath, { recursive: true });
        super(modelName, options);
        this.dataPath = dataPath;
        this.load();
    }
    async load() {
        try {
            const files = fs_1.default.readdirSync(this.dataPath);
            for (const file of files) {
                if (file.endsWith('.jsonl')) {
                    const content = fs_1.default.readFileSync(path_1.default.join(this.dataPath, file), 'utf8');
                    const items = jsonl_parse_stringify_1.default.parse(content);
                    items.forEach(item => this.items.set(item.id, item));
                }
            }
        }
        catch (err) {
            console.error(`Error reading data for ${this.dataPath}:`, err);
        }
    }
    async saveItem(item) {
        try {
            const dataString = jsonl_parse_stringify_1.default.stringify([item]);
            fs_1.default.writeFileSync(path_1.default.join(this.dataPath, `${item.id}.jsonl`), dataString, { encoding: 'utf8', flush: true });
        }
        catch (err) {
            console.error(`Error saving item ${item.id} for ${this.dataPath}:`, err);
        }
    }
    async deleteItem(id) {
        try {
            if (fs_1.default.statSync(path_1.default.join(this.dataPath, `${id}.jsonl`))) {
                fs_1.default.unlinkSync(path_1.default.join(this.dataPath, `${id}.jsonl`));
                return true;
            }
            else {
                console.warn(`File ${id}.jsonl does not exist for ${this.dataPath}`);
                return false;
            }
        }
        catch (err) {
            console.error(`Error deleting item ${id} for ${this.dataPath}:`, err);
            return false;
        }
    }
}
exports.FileStore = FileStore;
