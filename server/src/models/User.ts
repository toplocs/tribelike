import { User as iUser} from '@tribelike/types/User';
import Model from '../lib/Model';

export default class UserModel extends Model<iUser> {
    constructor(name: string) {
        super(name);
    }

    async getByUsername(username: string): Promise<iUser | null> {
        const allUsers = await this.store.getAll();
        const user = allUsers.find(item => item.username === username);
        return user || null;
    }
}

