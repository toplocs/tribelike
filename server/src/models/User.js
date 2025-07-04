"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = exports.User = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const lib_1 = require("../lib");
class User extends lib_1.GenericObject {
    constructor(user) {
        super(user.id);
        this.emailVerified = false;
        this.profiles = [];
        this.settings = [];
        Object.assign(this, user);
    }
}
exports.User = User;
class UserModel extends lib_1.Model {
    constructor(store) {
        super(store, {
            getAll: true,
            create: true,
            getById: true,
            update: true,
            delete: true
        });
        store.index('email');
    }
    async create(item) {
        if (!item.email)
            return null;
        const existingUser = await this.getByEmail(item.email);
        if (existingUser)
            return null;
        const email = item.email.toLowerCase();
        const hash = crypto_js_1.default.SHA256(email).toString(crypto_js_1.default.enc.Hex);
        // TODO: Validate Gravatar Image exists
        // TODO: image only in Profile
        item.image = `https://gravatar.com/avatar/${hash}`;
        return await super.create(item);
    }
    async getByEmail(email) {
        return await this.store.getBy('email', email);
    }
}
exports.UserModel = UserModel;
