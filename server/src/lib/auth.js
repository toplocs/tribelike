"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = auth;
exports.regenerate = regenerate;
exports.login = login;
exports.logout = logout;
exports.encrypt = encrypt;
exports.decrypt = decrypt;
const jose_1 = require("jose");
const prisma_1 = __importDefault(require("../lib/prisma"));
const config_1 = require("../config");
const secretKey = config_1.jwtSecret;
const key = new TextEncoder().encode(secretKey);
// Function to authenticate the token from the Authorization header
async function auth(authHeader) {
    if (!authHeader)
        return null;
    const token = authHeader;
    if (!token)
        return null;
    const sessionData = await decrypt(token);
    console.log('Session Data: ', sessionData);
    return sessionData;
}
// Function to regenerate a token
async function regenerate(userId) {
    const user = await prisma_1.default.user.findUnique({
        where: {
            id: userId
        },
    });
    if (!user)
        return;
    return await login(user);
}
// Function to generate a token upon login
async function login(user) {
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week expiration
    const token = await encrypt({ user, expires });
    return {
        token,
        expires,
    };
}
// Function to invalidate a token (optional, based on your implementation)
async function logout() {
    // For stateless JWT, there's no need to manually invalidate it unless you store tokens server-side
    return { message: 'Logged out' };
}
// Function to encrypt data into a JWT
async function encrypt(payload) {
    return await new jose_1.SignJWT(payload)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d') // 7 days expiration
        .sign(key);
}
// Function to decrypt and verify a JWT
async function decrypt(token) {
    try {
        const { payload } = await (0, jose_1.jwtVerify)(token, key, {
            algorithms: ['HS256'],
        });
        return payload;
    }
    catch (e) {
        console.error('TEST: ' + e);
        return null;
    }
}
