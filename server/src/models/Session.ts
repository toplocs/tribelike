import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import { Uuid } from '@tribelike/types';
import { jwtSecret } from "../config"
import { TextEncoder } from 'util';

// In-memory token store?
// const tokenMap: Record<Uuid, AuthToken> = {};

const key = new TextEncoder().encode(jwtSecret);

export interface AuthSessionData {
  userId: Uuid;
}

export interface PasskeySessionData {
  currentChallengeOptions: PublicKeyCredentialCreationOptionsJSON | PublicKeyCredentialRequestOptionsJSON;
  loggedInUser: {id: Uuid, email: string};
}

export type SessionData = AuthSessionData | PasskeySessionData;

export type TokenPayload = {
  data: SessionData;
  expires: Date;
}

export interface ISession {
  data: SessionData;
  expires: Date;
  token: string;
}

export class Session {
  // Generate a JWToken, valid default 7 days
  async createToken(data: SessionData, valid: number = 7 * 24 * 60): Promise<ISession> {
    const expires = new Date(Date.now() + valid * 60 * 1000);
    const session: TokenPayload = { data, expires };
    const token = await this.encrypt(session);
    return { data, token, expires };
  }

  // Validate the token from the Authorization header
  async validateHeader(authHeader?: string): Promise<ISession | null> {
    if (!authHeader) return null;
    const token = JSON.parse(authHeader)?.token;
    if (!token) return null;
    
    return await this.validateToken(token);
  }
  
  // Validate the token 
  async validateToken(token: string): Promise<ISession | null> {
    const payload = await this.decrypt(token);
    if (!payload) return null;
    // Check if token is expired
    if (new Date() > new Date(payload.expires)) {
      return null;
    }
    return { data: payload.data, expires: payload.expires, token };
  }

  // Encrypt data into a JWT
  private async encrypt(payload: TokenPayload): Promise<string> {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d') // 7 days expiration
      .sign(key);
  }

  // Function to decrypt and verify a JWT
  private async decrypt(token: string): Promise<TokenPayload | null> {
    try {
      const { payload } = await jwtVerify(token, key, {
        algorithms: ['HS256'],
      });
      return payload as TokenPayload;
    } catch (e) {
      console.error('Error verifying token:', e);
      return null;
    }
  }
}
