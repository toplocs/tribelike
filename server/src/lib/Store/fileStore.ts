import fs from 'fs';
import path from 'path';
import JSONL from "jsonl-parse-stringify";
import { Uuid, GenericObject } from '@tribelike/types/Uuid';
import { StoreOptions, IStore } from './types/Store';
import { MemoryStore } from './memoryStore';
import { dataFolder } from '../../config';

export class FileStore<T extends GenericObject> extends MemoryStore<T> implements IStore<T> {
    private dataPath: string;

    constructor(modelName: string, options?: StoreOptions<T>) {
        const dataPath = path.join(dataFolder, modelName);
        fs.mkdirSync(dataPath, { recursive: true });

        super(modelName, options);
        this.dataPath = dataPath;
        this.load();
    }

    protected async load(): Promise<void> {
        try {
            const files = fs.readdirSync(this.dataPath);
            for (const file of files) {
                if (file.endsWith('.jsonl')) {
                    const content = fs.readFileSync(path.join(this.dataPath, file), 'utf8');
                    const items: T[] = JSONL.parse<T>(content);
                    items.forEach(item => this.items.set(item.id as Uuid, item as T));
                }
            }
        } catch (err) {
            console.error(`Error reading data for ${this.dataPath}:`, err);
        }
    }

    protected async saveItem(item: T): Promise<void> {
        try {
            const dataString = JSONL.stringify([item]);
            fs.writeFileSync(path.join(this.dataPath, `${item.id}.jsonl`), dataString, { encoding: 'utf8', flush: true });
        } catch (err) {
            console.error(`Error saving item ${item.id} for ${this.dataPath}:`, err);
        }
    }

    protected async deleteItem(id: Uuid): Promise<boolean> {
        try {
            if (fs.statSync(path.join(this.dataPath, `${id}.jsonl`))) {
                fs.unlinkSync(path.join(this.dataPath, `${id}.jsonl`));
                return true;
            }  else {
                console.warn(`File ${id}.jsonl does not exist for ${this.dataPath}`);
                return false;
            }
        } catch (err) {
            console.error(`Error deleting item ${id} for ${this.dataPath}:`, err);
            return false;
        }
    }
}