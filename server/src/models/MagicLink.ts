import {
    Uuid,
    MagicLink as IMagicLink
} from '@tribelike/types';
import { IStore, GenericObject, Model } from '../lib';

export class MagicLink extends GenericObject implements IMagicLink {
    id!: Uuid;
    token!: string;
    userId!: Uuid;
    expires!: Date;

    constructor(magicLink: IMagicLink) {
        super(magicLink.id);
        Object.assign(this, magicLink);
    }
}

export class MagicLinkModel extends Model<MagicLink> {
    constructor(store: IStore<MagicLink>) {
        super(store, { 
            getAll: true,
            create: true,
            getById: true,
            update: true,
            delete: true
        });
        store.index('token');
        store.index('userId');
    }

    async getByToken(token: string): Promise<MagicLink | null> {
        return await this.store.getBy('token', token);
    }

    async getByUserId(userId: Uuid): Promise<MagicLink[]> {
        return await this.store.getAll({'userId': userId});
    }

    async isValid(token: string): Promise<boolean> {
        const magicLink = await this.getByToken(token);
        if (!magicLink) return false;
        
        const now = new Date();
        return now < magicLink.expires;
    }
}
