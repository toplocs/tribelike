import { Profile as IProfile, ProfileSettings} from '@tribelike/types/Profile';
import { Activity } from '@tribelike/types/Activity';
import Model from '../lib/Model';
import { Uuid } from '@tribelike/types/Uuid';
import { v4 as uuidv4 } from 'uuid';

export class Profile implements IProfile {
    id: Uuid;
    userId: Uuid;
    username: string;
    email: string;
    type: string;
    activities?: Activity[];
    settings?: ProfileSettings[];
    
    constructor(id: Uuid, username: string, email: string, type: string, userId: Uuid) {
        this.id = id;
        this.userId = userId;
        this.username = username;
        this.email = email;
        this.type = type;
    }
}

export default class ProfileModel extends Model<Profile> {
    constructor(name: string) {
        super(name, { 
            getAll: true,
            create: true,
            getById: true,
            update: true,
            delete: true
        });
    }

    async getAllByUserId(userId: Uuid): Promise<Profile[]> {
        const allProfiles = await this.store.getAll({userId: userId});
        return allProfiles;
    }

    async createDefaultProfiles(userId: Uuid, username: string, email: string): Promise<Profile[]> {
        const defaultProfiles = [
            new Profile(uuidv4(), username, email, 'family', userId),
            new Profile(uuidv4(), username, email, 'friends', userId),
            new Profile(uuidv4(), username, email, 'work', userId)
        ];

        await Promise.all(defaultProfiles.map(profile => this.store.create(profile)));
        return defaultProfiles;
    }
}

