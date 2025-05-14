"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProfileModel = exports.Profile = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const uuid_1 = require("uuid");
const lib_1 = require("../lib");
class Profile extends lib_1.GenericObject {
    constructor(profile) {
        super(profile.id);
        this.id = profile.id;
        this.userId = profile.userId;
        this.username = profile.username;
        this.type = profile.type;
        this.email = profile.email || '';
        this.image = profile.image || '';
        this.about = profile.about || '';
    }
}
exports.Profile = Profile;
class ProfileModel extends lib_1.Model {
    constructor(store) {
        super(store, {
            getAll: true,
            create: true,
            getById: true,
            update: true,
            delete: true
        });
        store.index('userId');
    }
    async create(item) {
        if (!item.email)
            return null;
        const email = item.email.toLowerCase();
        const hash = crypto_js_1.default.SHA256(email).toString(crypto_js_1.default.enc.Hex);
        item.image = `https://gravatar.com/avatar/${hash}`;
        return await super.create(item);
    }
    async getAllByUserId(userId) {
        const allProfiles = await this.store.getAll({ userId: userId });
        return allProfiles;
    }
    async createDefaultProfiles(userId, username, email) {
        const defaultProfiles = [
            new Profile({ id: (0, uuid_1.v4)(), userId: userId, username: username, email: email, type: 'family' }),
            new Profile({ id: (0, uuid_1.v4)(), userId: userId, username: username, email: email, type: 'friends' }),
            new Profile({ id: (0, uuid_1.v4)(), userId: userId, username: username, email: email, type: 'work' })
        ];
        await Promise.all(defaultProfiles.map(profile => {
            return this.store.create(profile);
        }));
        return defaultProfiles;
    }
}
exports.ProfileModel = ProfileModel;
