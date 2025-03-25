import { JWTPayload, SignJWT, jwtVerify } from 'jose';
import { Uuid } from '@tribelike/types/Uuid';
import { jwtSecret } from "../config"
import { TextEncoder } from 'util';

// In-memory token store?
// const tokenMap: Record<Uuid, AuthToken> = {};

const key = new TextEncoder().encode(jwtSecret);

export interface SessionData {
    userId: Uuid, 
    token: string
}

export interface AuthToken {
    token: string;
    expires: Date;
}

export interface TokenPayload extends JWTPayload{
    userId: Uuid;
    expires: Date;
}

export default class Session {
  // Login: Generate a JWToken
  async createToken(userId: Uuid): Promise<AuthToken> {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week expiration
    const token = await this.encrypt({ userId, expires });
    return { token, expires };
  }

  // Authenticate: Validate the token from the Authorization header
  async validateHeader(authHeader?: string): Promise<SessionData | null> {
    if (!authHeader) return null;
    const token = JSON.parse(authHeader)?.token;
    if (!token) return null;
    const userId = await this.validateToken(token);
    if (!userId) return null;
    return { userId: userId, token: token };
  }
  
  // Authenticate: Validate the token 
  async validateToken(token: string): Promise<Uuid | null> {
    const decryptedToken = await this.decrypt(token);
    if (!decryptedToken) return null;
    const { userId } = decryptedToken;
    return userId;
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
