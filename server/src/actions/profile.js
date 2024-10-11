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
exports.getProfiles = getProfiles;
exports.createProfile = createProfile;
exports.updateProfile = updateProfile;
exports.deleteProfile = deleteProfile;
exports.getAllProfiles = getAllProfiles;
exports.getProfileById = getProfileById;
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../lib/auth");
function getProfiles(authHeader) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const session = yield (0, auth_1.auth)(authHeader);
            const user = session === null || session === void 0 ? void 0 : session.user;
            const profiles = yield prisma_1.default.profile.findMany({
                where: {
                    userId: user.id,
                },
                include: {
                    interests: true,
                    locations: true,
                },
            });
            return { success: profiles };
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
function createProfile(formData, authHeader) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const session = yield (0, auth_1.auth)(authHeader);
            const user = session === null || session === void 0 ? void 0 : session.user;
            const profile = yield prisma_1.default.profile.create({
                data: {
                    userId: user === null || user === void 0 ? void 0 : user.id,
                    type: formData.type,
                    image: formData.image || '/images/default.jpeg',
                    username: formData.username,
                    email: formData.email,
                    about: formData.about,
                }
            });
            return { success: profile };
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
function updateProfile(formData, authHeader) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const session = yield (0, auth_1.auth)(authHeader);
            const user = session === null || session === void 0 ? void 0 : session.user;
            const profile = yield prisma_1.default.profile.update({
                where: {
                    id: formData.profileId,
                },
                data: {
                    type: formData.type,
                    image: formData.image || '/images/default.jpeg',
                    username: formData.username,
                    email: formData.email,
                    about: formData.about,
                },
                include: {
                    interests: true,
                }
            });
            return { success: profile };
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
function deleteProfile(query, authHeader) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const session = yield (0, auth_1.auth)(authHeader);
            const user = session === null || session === void 0 ? void 0 : session.user;
            yield prisma_1.default.profile.delete({
                where: {
                    id: query.profileId,
                }
            });
            return { success: 'Successfully deleted' };
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
function getAllProfiles() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const profiles = yield prisma_1.default.profile.findMany({
                take: 20,
            });
            return { success: profiles };
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
function getProfileById(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const profile = yield prisma_1.default.profile.findUnique({
                where: {
                    id: params === null || params === void 0 ? void 0 : params.id,
                },
                include: {
                    interests: true,
                    locations: true,
                }
            });
            return { success: profile };
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
