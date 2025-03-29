import { Uuid, Passkey } from '@tribelike/types';
import { 
    AuthenticatorTransportFuture,
    CredentialDeviceType, 
    Base64URLString
} from '@simplewebauthn/server';
import { IStore, GenericObject, Model } from '../lib';


export class Credential extends GenericObject implements Passkey {
    id!: Base64URLString;
    publicKey!: Base64URLString;
    userId!: Uuid;
    webauthnUserID!: Base64URLString;
    counter!: number;
    deviceType!: CredentialDeviceType;
    backedUp!: boolean;
    transports?: AuthenticatorTransportFuture[];

    constructor(credential: Passkey) {
        super(credential.id);
        Object.assign(this, credential);
    }

    static uint8ArrayToBase64 = (uint8Array: Uint8Array): string =>
        Buffer.from(uint8Array).toString('base64');
    
    static base64ToUint8Array = (base64: string): Uint8Array =>
        new Uint8Array(Buffer.from(base64, 'base64'));
    
    publicKeyUint8(): Uint8Array {
        return Credential.base64ToUint8Array(this.publicKey);
    }
}


export class CredentialModel extends Model<Credential> {
    constructor(store: IStore<Credential>) {
        super(store, { 
            getAll: false,
            create: true,
            getById: true,
            update: false,
            delete: true
        });
        store.index('userId');
    }

    async getAllByUserId(userId: Uuid): Promise<Credential[]> {
        const credentials = await this.store.getAll();
        return credentials.filter(item => item.userId === userId);
    }

    async updateCounter(id: Uuid, counter: number): Promise<Credential | null> {
        return this.store.update(id, { counter: counter });
    }
}
