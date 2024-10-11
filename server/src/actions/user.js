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
exports.getUsers = getUsers;
exports.createUser = createUser;
exports.updateUser = updateUser;
exports.getUserById = getUserById;
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../lib/auth");
function getUsers(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const users = yield prisma_1.default.user.findMany({
                where: {
                    username: query === null || query === void 0 ? void 0 : query.username,
                },
                take: 20,
            });
            return { success: users };
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
function createUser(formData) {
    return __awaiter(this, void 0, void 0, function* () {
        var _a, _b;
        try {
            if (formData.username.length < 3)
                throw new Error('Your username is too short');
            if (formData.email.length < 3)
                throw new Error('Your email is too short');
            if (formData.password != formData.password2)
                throw new Error('The password confirmation failed');
            const user = yield prisma_1.default.user.create({
                data: {
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }
            });
            return { success: user };
        }
        catch (e) {
            console.error(e);
            if ((_a = e.meta) === null || _a === void 0 ? void 0 : _a.target.includes('username'))
                return { error: 'Your username is already taken' };
            if ((_b = e.meta) === null || _b === void 0 ? void 0 : _b.target.includes('username'))
                return { error: 'Your email is already taken' };
            return { error: e.message };
        }
    });
}
function updateUser(formData, authHeader) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const session = yield (0, auth_1.auth)(authHeader);
            const user = session === null || session === void 0 ? void 0 : session.user;
            const result = yield prisma_1.default.user.update({
                where: {
                    id: user === null || user === void 0 ? void 0 : user.id,
                },
                data: {
                    image: formData.image || '/images/default.jpeg',
                    username: formData.username,
                    email: formData.email,
                },
            });
            return { success: result };
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
function getUserById(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const user = yield prisma_1.default.user.findUnique({
                where: {
                    id: params === null || params === void 0 ? void 0 : params.id,
                },
            });
            return { success: user };
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
