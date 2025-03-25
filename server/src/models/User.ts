import { User as IUser} from '@tribelike/types/User';
import Model from '../lib/Model';
import { Profile } from '@tribelike/types/Profile';

export class User implements IUser {
    id!: string;
    username: string = 'EmptyUsername'
    email!: string;
    profiles?: Profile[] = [];
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
        const allUsers = await this.store.getAll({username: username});
        return allUsers.length > 0 ? allUsers[0] : null;
    }

    async getByEmail(email: string): Promise<User | null> {
        const allUsers = await this.store.getAll({email: email});
        return allUsers.length > 0 ? allUsers[0] : null;
    }
}

