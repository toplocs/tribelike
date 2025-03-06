import UserModel from '../../src/models/User';
import { Store } from '../../src/lib/Store';

interface User {
    id: string;
    name: string;
    email: string;
}

const testUser: User = { id: '1', name: 'Test User', email: 'test@example.com' };

beforeAll(() => {
    process.env.STORE_TYPE = 'file';
});

describe('UserModel', () => {
    let userModel: UserModel;

    beforeEach(() => {
        userModel = new UserModel();
    });

    test('should create a new user', async () => {
        const createdUser = await userModel.create(testUser);
        expect(createdUser).toEqual(testUser);
    });

    test('should get all users', async () => {
        await userModel.create(testUser);
        const users = await userModel.getAll();
        expect(users).toContainEqual(testUser);
    });

    test('should get a user by id', async () => {
        await userModel.create(testUser);
        const user = await userModel.getById('1');
        expect(user).toEqual(testUser);
    });

    test('should update a user by id', async () => {
        await userModel.create(testUser);
        const updatedUser = await userModel.update('1', { name: 'Updated User' });
        expect(updatedUser).toEqual({ ...testUser, name: 'Updated User' });
    });

    test('should delete a user by id', async () => {
        await userModel.create(testUser);
        const deleted = await userModel.delete('1');
        expect(deleted).toBe(true);
        const user = await userModel.getById('1');
        expect(user).toBeNull();
    });
});
