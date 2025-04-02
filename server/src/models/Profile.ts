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
    type: string;
    email?: string;
    image?: string;
    about?: string;
    activities?: IActivity[];
    settings?: IProfileSettings[];
    
    constructor(profile: IProfile) {
        super(profile.id);
        this.id = profile.id;
        this.userId = profile.userId;
        this.username = profile.username;
        this.type = profile.type;
        this.email = profile.email || '';
        this.image = profile.image || '';
        this.about = profile.about || '';
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
            new Profile({id: uuidv4(), userId: userId, username: username, email: email, type: 'family'}),
            new Profile({id: uuidv4(), userId: userId, username: username, email: email, type: 'friends'}),
            new Profile({id: uuidv4(), userId: userId, username: username, email: email, type: 'work'})
        ];

        await Promise.all(defaultProfiles.map(profile => {
            return this.store.create(profile);
        }));
        return defaultProfiles;
    }
}

