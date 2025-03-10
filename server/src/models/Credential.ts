import { Passkey } from '@tribelike/types/Credential';
import { Uuid } from '@tribelike/types/Uuid';
import { 
    AuthenticatorTransportFuture,
    CredentialDeviceType, 
    Base64URLString
} from '@simplewebauthn/server';
import Model from '../lib/Model';


export class Credential implements Passkey {
    id!: Base64URLString;
    publicKey!: Base64URLString;
    userId!: Uuid;
    webauthnUserID!: Base64URLString;
    counter!: number;
    deviceType!: CredentialDeviceType;
    backedUp!: boolean;
    transports?: AuthenticatorTransportFuture[];

    constructor(credential: Passkey) {
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


export default class CredentialModel extends Model<Credential> {
    constructor(name: string) {
        super(name, { getAll: false, update: false, create: true });
    }

    async getById(id: string): Promise<Credential | null> {
        const credentials = await this.store.getAll();
        return credentials.find(x => x.id === id) || null;
    }

    async getAllByUserId(userId: string): Promise<Credential[]> {
        const credentials = await this.store.getAll();
        return credentials.filter(item => item.userId === userId);
    }

    async updateCounter(id: string, counter: number): Promise<Credential | null> {
        return this.store.update(id, { counter: counter });
    }
}
