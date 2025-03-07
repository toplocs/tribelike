import { beforeEach, describe, expect, it } from '@jest/globals';
import { FileStore } from '../../src/lib/FileStore';
import { Uuid, GenericObject } from '@tribelike/types/Uuid';
import { FileStoreOptions } from '../../src/lib/Store';

interface iTestData extends GenericObject {
    id: Uuid;
    name: string;
}

class TestData implements iTestData {
    id: Uuid;
    name: string;
    constructor(id: Uuid, name: string) {
        this.id = id;
        this.name = name;
    }
    getName(): string {
        return this.name;
    }
}

const mockData: TestData[] = [
    new TestData('1', 'Alice'),
    new TestData('2', 'Bob'),
];

describe('FileStore', () => {
    const fileStoreOptions: FileStoreOptions<TestData> = { 
        indexKeys: ['name'],
        constructor: TestData 
    };
    let fileStore: FileStore<TestData> = new FileStore<TestData>(
        'FileStore.test', fileStoreOptions
    );

    beforeEach(async () => {
        await fileStore.clear();
        await fileStore.create(mockData[0]);
        await fileStore.create(mockData[1]);
    });

    it('should get all data', async () => {
        const data: TestData[] = await fileStore.getAll();
        expect(data).toEqual(mockData);
        expect(data).toBeInstanceOf(Array<TestData>);
        expect(data[0].getName()).toEqual(mockData[0].name);
    });

    it('should create new data', async () => {
        const newData: TestData = new TestData('3', 'Charlie');
        const created: TestData | null = await fileStore.create(newData);
        const data = await fileStore.getAll();
        expect(data).toContainEqual(newData);
        expect(created).toEqual(newData);
        expect(created).toBeInstanceOf(TestData);
    });

    it('should get data by id', async () => {
        const data = await fileStore.getById('1');
        expect(data).toEqual(mockData[0]);
        expect(data?.getName()).toEqual(mockData[0].name);
        expect(data).toBeInstanceOf(TestData);
    });

    it('should get data by name', async () => {
        const data = await fileStore.getBy('name', 'Alice');
        expect(data).toEqual(mockData[0]);
        expect(data?.getName()).toEqual(mockData[0].name);
        expect(data).toBeInstanceOf(TestData);
    });

    it('should update data', async () => {
        const updatedData = new TestData('1', 'Alice Updated');
        const updated = await fileStore.update('1', updatedData);
        const data: TestData | null = await fileStore.getById('1');
        expect(data?.name).toBe('Alice Updated');
        
        expect(data?.getName()).toEqual(updatedData.name);
        expect(updated?.name).toBe('Alice Updated');
    
        expect(updated?.getName()).toEqual(updatedData.name);
    });

    it('should delete data', async () => {
        const databefore = await fileStore.getById('1');
        const success = await fileStore.delete('1');
        expect(success).toBe(true);
        const data = await fileStore.getById('1');
        expect(data).toBeNull();
    });

    it('should clear all data', async () => {
        await fileStore.clear();
        const data = await fileStore.getAll();
        expect(data).toEqual([]);
    });
});
