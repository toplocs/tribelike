import type { User } from '@prisma/client';
import { SignJWT, jwtVerify } from 'jose';
import { prisma } from '../lib/prisma';

const secretKey = 'secret12345';
const key = new TextEncoder().encode(secretKey);

// Function to authenticate the token from the Authorization header
export async function auth(authHeader?: string) {
  if (!authHeader) return null;
  const token = JSON.parse(authHeader)?.token;
  if (!token) return null;

  return await decrypt(token);
}

// Function to regenerate a token
export async function regenerate(userId: string) {
  const user = await prisma.user.findUnique({
    where: {
      id: userId
    },
  });
  if(!user) return;

  return await login(user);
}

// Function to generate a token upon login
export async function login(user: User) {
  const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week expiration
  const token = await encrypt({ user, expires });

  return {
    token,
    expires,
  };
}

// Function to invalidate a token (optional, based on your implementation)
export async function logout() {
  // For stateless JWT, there's no need to manually invalidate it unless you store tokens server-side
  return { message: 'Logged out' };
}

// Function to encrypt data into a JWT
export async function encrypt(payload: any) {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d') // 7 days expiration
    .sign(key);
}

// Function to decrypt and verify a JWT
export async function decrypt(token: string): Promise<any> {
  try {
    const { payload } = await jwtVerify(token, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (e) {
    console.error('TEST: '+e);
    return null;
  }
}