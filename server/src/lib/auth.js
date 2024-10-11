"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
const secretKey = 'secret12345';
const key = new TextEncoder().encode(secretKey);
// Function to authenticate the token from the Authorization header
function auth(authHeader) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a;
        if (!authHeader)
            return null;
        const token = (_a = JSON.parse(authHeader)) === null || _a === void 0 ? void 0 : _a.token;
        if (!token)
            return null;
        return yield decrypt(token);
    });
}
// Function to regenerate a token
function regenerate(userId) {
    return __awaiter(this, void 0, void 0, function* () {
        const user = yield prisma_1.default.user.findUnique({
            where: {
                id: userId
            },
        });
        if (!user)
            return;
        return yield login(user);
    });
}
// Function to generate a token upon login
function login(user) {
    return __awaiter(this, void 0, void 0, function* () {
        const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 1 week expiration
        const token = yield encrypt({ user, expires });
        return {
            token,
            expires,
        };
    });
}
// Function to invalidate a token (optional, based on your implementation)
function logout() {
    return __awaiter(this, void 0, void 0, function* () {
        // For stateless JWT, there's no need to manually invalidate it unless you store tokens server-side
        return { message: 'Logged out' };
    });
}
// Function to encrypt data into a JWT
function encrypt(payload) {
    return __awaiter(this, void 0, void 0, function* () {
        return yield new jose_1.SignJWT(payload)
            .setProtectedHeader({ alg: 'HS256' })
            .setIssuedAt()
            .setExpirationTime('7d') // 7 days expiration
            .sign(key);
    });
}
// Function to decrypt and verify a JWT
function decrypt(token) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { payload } = yield (0, jose_1.jwtVerify)(token, key, {
                algorithms: ['HS256'],
            });
            return payload;
        }
        catch (e) {
            console.error(e);
            return null;
        }
    });
}
