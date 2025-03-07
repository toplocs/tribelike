import { Uuid } from './Uuid';
import type {
    AuthenticatorTransportFuture,
    CredentialDeviceType,
    Base64URLString,
  } from '@simplewebauthn/server';


export type Passkey = {
    id: Base64URLString;
    publicKey: Base64URLString;
    userId: Uuid;
    webauthnUserID: Base64URLString;
    counter: number;
    // Ex: 'singleDevice' | 'multiDevice'
    deviceType: CredentialDeviceType;
    backedUp: boolean;
    // Ex: ['ble' | 'cable' | 'hybrid' | 'internal' | 'nfc' | 'smart-card' | 'usb']
    transports?: AuthenticatorTransportFuture[];
  };
