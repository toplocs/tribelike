import { beforeEach, describe, expect, it } from '@jest/globals';
import UserModel from '../../src/models/User';
import { Store } from '../../src/lib/Store';
import { User } from '@tribelike/types/User';

const testUser: User = {
    id: '1', username: 'Test User', email: 'test@example.com',
    profiles: [], 
    settings: []
};

describe('UserModel', () => {
    Store.getInstance().setStoreType('memory');
    let userModel: UserModel = new UserModel("UserModel.test");

    beforeEach(async () => {
        await userModel.clear();
    });

    it('should create a new user', async () => {
        const createdUser = await userModel.create(testUser);
        expect(createdUser).toEqual(testUser);
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
        const updatedUser = await userModel.update('1', { username: 'Updated User' });
        expect(updatedUser).toEqual({ ...testUser, username: 'Updated User' });
    });

    it('should delete a user by id', async () => {
        await userModel.create(testUser);
        const deleted = await userModel.delete('1');
        expect(deleted).toBe(true);
        const user = await userModel.getById('1');
        expect(user).toBeNull();
    });
});
