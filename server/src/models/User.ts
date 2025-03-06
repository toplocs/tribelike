import { User } from '@tribelike/types/User';
import Model from '../lib/Model';

export default class UserModel extends Model<User> {
    constructor(name: string) {
        super(name);
    }

    async getByUsername(username: string): Promise<User | null> {
        const allUsers = await this.store.getAll();
        const user = allUsers.find(item => item.username === username);
        return user || null;
    }
}

export const users = new UserModel('users');
