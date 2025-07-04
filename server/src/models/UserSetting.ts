import {
    Uuid,
    UserSetting as IUserSetting
} from '@tribelike/types';
import { IStore, GenericObject, Model } from '../lib';

export class UserSetting extends GenericObject implements IUserSetting {
    id!: Uuid;
    userId!: Uuid;
    settings!: Record<string, any>;

    constructor(userSetting: IUserSetting) {
        super(userSetting.id);
        Object.assign(this, userSetting);
    }
}

export class UserSettingModel extends Model<UserSetting> {
    constructor(store: IStore<UserSetting>) {
        super(store, { 
            getAll: true,
            create: true,
            getById: true,
            update: true,
            delete: true
        });
        store.index('userId');
    }

    async getByUserId(userId: Uuid): Promise<UserSetting[]> {
        return await this.store.getAll({'userId': userId});
    }
}
