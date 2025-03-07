import { Store, IStore } from '../../src/lib/Store';
import { Uuid, GenericObject } from '@tribelike/types/Uuid';

interface TestObject extends GenericObject {
    id: Uuid;
    name: string;
}

const testObject: TestObject = { id: '1', name: 'Test Object' };

beforeAll(() => {
    process.env.STORE_TYPE = 'file';
});

describe('Store', () => {
    let store: IStore<TestObject>;

    beforeEach(() => {
        store = Store.getInstance().getStore<TestObject>('test_objects');
    });

    test('should add a new object', async () => {
        const addedObject = await store.add(testObject);
        expect(addedObject).toEqual(testObject);
    });

    test('should get all objects', async () => {
        await store.add(testObject);
        const objects = await store.getAll();
        expect(objects).toContainEqual(testObject);
    });

    test('should get an object by id', async () => {
        await store.add(testObject);
        const object = await store.getById('1');
        expect(object).toEqual(testObject);
    });

    test('should update an object by id', async () => {
        await store.add(testObject);
        const updatedObject = await store.update('1', { name: 'Updated Object' });
        expect(updatedObject).toEqual({ ...testObject, name: 'Updated Object' });
    });

    test('should delete an object by id', async () => {
        await store.add(testObject);
        const deleted = await store.delete('1');
        expect(deleted).toBe(true);
        const object = await store.getById('1');
        expect(object).toBeNull();
    });
});
