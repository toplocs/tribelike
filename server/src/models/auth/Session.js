"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Session = void 0;
const jose_1 = require("jose");
const config_1 = require("../../config");
const util_1 = require("util");
// In-memory token store?
// const tokenMap: Record<Uuid, AuthToken> = {};
const key = new util_1.TextEncoder().encode(config_1.jwtSecret);
class Session {
    // Generate a JWToken, valid default 7 days
    async createToken(data, valid = 7 * 24 * 60) {
        const expires = new Date(Date.now() + valid * 60 * 1000);
        const session = { data, expires };
        const token = await this.encrypt(session);
        return { data, token, expires };
    }
    // Validate the token from the Authorization header
    async validateHeader(authHeader) {
        if (!authHeader)
            return null;
        const token = JSON.parse(authHeader)?.token;
        if (!token)
            return null;
        return await this.validateToken(token);
    }
    // Validate the token 
    async validateToken(token) {
        const payload = await this.decrypt(token);
        if (!payload)
            return null;
        // Check if token is expired
        if (new Date() > new Date(payload.expires)) {
            return null;
        }
        return { data: payload.data, expires: payload.expires, token };
    }
    // Encrypt data into a JWT
    async encrypt(payload) {
        return await new jose_1.SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d') // 7 days expiration
            .sign(key);
    }
    // Function to decrypt and verify a JWT
    async decrypt(token) {
        try {
            const { payload } = await (0, jose_1.jwtVerify)(token, key, {
                algorithms: ['HS256'],
            });
            return payload;
        }
        catch (e) {
            console.error('Error verifying token:', e);
            return null;
        }
    }
}
exports.Session = Session;
