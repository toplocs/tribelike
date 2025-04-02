import CryptoJS from 'crypto-js';
import {
    Uuid,
    MagicLink as IMagicLink
} from '@tribelike/types';
import { v4 as uuidv4 } from 'uuid';
import { IStore, GenericObject, Model } from '../../lib';

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
    }

    async create(item: Partial<MagicLink>): Promise<MagicLink | null> {
        if (!item.userId) return null;
        const hash = CryptoJS.SHA256(item.userId).toString(CryptoJS.enc.Hex);
        const magiclink: IMagicLink = {
            id: '',
            token: hash,
            userId: item.userId,
            expires: new Date(Date.now()+10*60*1000)
        };
        return super.create(magiclink);
    }

    async getByToken(token: string): Promise<MagicLink | null> {
        return await this.store.getBy('token', token);
    }

    async consumeToken(token: string): Promise<Uuid | null> {
        const magicLink = await this.getByToken(token);
        if (!magicLink) return null;
        await this.delete(magicLink.id);

        const now = new Date();
        if (now < magicLink.expires) {
            return magicLink.userId;
        }
        return null;
    }
    
    async cleanExpiredLinks(): Promise<number> {
        const now = new Date();
        const allLinks = await this.getAll();
        const expiredLinks = allLinks.filter(link => link.expires < now);
        for (const link of expiredLinks) {
            await this.delete(link.id);
        }
        
        return expiredLinks.length;
    }
}
