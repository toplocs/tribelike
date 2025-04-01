import { beforeEach, describe, expect, it } from '@jest/globals';
import { User, UserModel } from '../../src/models';
import { Store } from '../../src/lib/Store';

const testUser: User = {
    id: '1', 
    email: 'test@example.com',
    emailVerified: true,
    profiles: [], 
    settings: []
};

describe('UserModel', () => {
    Store.getInstance().setStoreType('memory');
    const userStore = Store.getInstance().getStore<User>('User');
    userStore.index('email');
    let userModel: UserModel = new UserModel(userStore);

    beforeEach(async () => {
        await userModel.clear();
    });

    it('should create a new user', async () => {
        const createdUser = await userModel.create(testUser);
        expect(createdUser).toEqual(testUser);
    });

    it('should create a new user using only an email', async () => {
        const createdUser = await userModel.create({ email: testUser.email });
        expect(createdUser!.email).toEqual(testUser.email);
    });

    it('should get all users', async () => {
        await userModel.create(testUser);
        const users = await userModel.getAll();
        expect(users).toContainEqual(testUser);
    });

    it('should get a user by id', async () => {
        await userModel.create(testUser);
        const user = await userModel.getById('1');
        expect(user).toEqual(testUser);
    });

    it('should update a user by id', async () => {
        await userModel.create(testUser);
        const updatedUser = await userModel.update('1', { email: 'new@example.com' });
        expect(updatedUser).toEqual({ ...testUser, email: 'new@example.com' });
    });

    it('should delete a user by id', async () => {
        await userModel.create(testUser);
        const deleted = await userModel.delete('1');
        expect(deleted).toBe(true);
        const user = await userModel.getById('1');
        expect(user).toBeNull();
    });
    
    it('should get a user by indexed email', async () => {
        await userModel.create(testUser);
        const user = await userModel.getByEmail('test@example.com');
        expect(user).toEqual(testUser);
    });

    it('should not find a user by non-existing email', async () => {
        const user = await userModel.getByEmail('nonexistent@example.com');
        expect(user).toBeNull();
    });
    
    it('should not create a user with an existing email', async () => {
        await userModel.create(testUser);
        const createdUser = await userModel.create(testUser);
        expect(createdUser).toBeNull();
    });
});
