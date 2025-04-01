import { v4 as uuidv4 } from 'uuid';
import { 
    Uuid,
    Profile as IProfile, 
    ProfileSettings as IProfileSettings,
    Activity as IActivity
} from '@tribelike/types';
import { IStore, GenericObject, Model} from '../lib';

export class Profile extends GenericObject implements IProfile {
    id: Uuid;
    userId: Uuid;
    username: string;
    email: string;
    type: string;
    activities?: IActivity[];
    settings?: IProfileSettings[];
    
    constructor(id: Uuid, email: string, type: string, userId: Uuid, username?: string) {
        super(id);
        this.id = id;
        this.userId = userId;
        this.username = username || this.random_username(10);
        this.email = email;
        this.type = type;
    }

    private random_username(length: number): string {
        const characters = 'abcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        const charactersLength = characters.length;
        for (let i = 0; i < length; i++) {
            result += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        return  "user_" + result;
    }

    setRandomUsername() {
        this.username = this.random_username(10);
    }
}

export class ProfileModel extends Model<Profile> {
    constructor(store: IStore<Profile>) {
        super(store, { 
            getAll: true,
            create: true,
            getById: true,
            update: true,
            delete: true
        });
        store.index('userId');
    }

    async getAllByUserId(userId: Uuid): Promise<Profile[]> {
        const allProfiles = await this.store.getAll({userId: userId});
        return allProfiles;
    }

    async createDefaultProfiles(userId: Uuid, username: string, email: string): Promise<Profile[]> { 
        const defaultProfiles = [
            new Profile(uuidv4(), email, 'family', userId),
            new Profile(uuidv4(), email, 'friends', userId),
            new Profile(uuidv4(), email, 'work', userId)
        ];

        await Promise.all(defaultProfiles.map(profile => {
            return this.store.create(profile);
        }));
        return defaultProfiles;
    }
}

