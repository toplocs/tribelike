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

/**
 * Gun.js Credential Storage Format
 * Stored at: gun.get('credentials').get(email)
 *
 * Contains WebAuthn credential data and account recovery information
 */
export type GunCredential = {
    id: Base64URLString;
    credential: string; // JSON stringified WebAuthn credential
    accountNumber: number; // 6-digit account recovery number (100000-999999)
    hasRecovery: boolean; // Whether recovery is enabled for this account
    createdAt: number; // Timestamp when account was created
    recoveredAt?: number; // Timestamp if account was recovered via recovery number
  };
