import CryptoJS from 'crypto-js';
import {
    Uuid,
    User as IUser,
    Profile as IProfile
} from '@tribelike/types';
import { IStore, GenericObject, Model } from '../lib';

export class User extends GenericObject implements IUser {
    id!: Uuid;
    email!: string;
    emailVerified: boolean = false;
    profiles?: IProfile[] = [];
    settings?: any[] = [];
    image?: string;

    constructor(user: IUser) {
        super(user.id);
        Object.assign(this, user);
    }
}

export class UserModel extends Model<User> {
    constructor(store: IStore<User>) {
        super(store, { 
            getAll: true,
            create: true,
            getById: true,
            update: true,
            delete: true
        });
        store.index('email');
    }

    async create(item: Partial<User>): Promise<User | null> {
        if (!item.email) return null;
        const existingUser = await this.getByEmail(item.email);
        if (existingUser) return null;

        const email = item.email.toLowerCase();
        const hash = CryptoJS.SHA256(email).toString(CryptoJS.enc.Hex);
        // TODO: Validate Gravatar Image exists
        // TODO: image only in Profile
        item.image = `https://gravatar.com/avatar/${hash}`;
    
        return await super.create(item);
    }

    async getByEmail(email: string): Promise<User | null> {
        return await this.store.getBy('email', email);
    }
}

