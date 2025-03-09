import { User as IUser} from '@tribelike/types/User';
import Model from '../lib/Model';

export class User implements IUser {
    id!: string;
    username: string = 'EmptyUsername'
    email!: string;
    profiles?: any[] = [];
    settings?: any[] = [];
    image?: string;

    constructor(user: IUser) {
        Object.assign(this, user);
    }
}

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

