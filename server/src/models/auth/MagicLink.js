"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MagicLinkModel = exports.MagicLink = void 0;
const crypto_js_1 = __importDefault(require("crypto-js"));
const lib_1 = require("../../lib");
class MagicLink extends lib_1.GenericObject {
    constructor(magicLink) {
        super(magicLink.id);
        Object.assign(this, magicLink);
    }
}
exports.MagicLink = MagicLink;
class MagicLinkModel extends lib_1.Model {
    constructor(store) {
        super(store, {
            getAll: true,
            create: true,
            getById: true,
            update: true,
            delete: true
        });
        store.index('token');
    }
    async create(item) {
        if (!item.userId)
            return null;
        const hash = crypto_js_1.default.SHA256(item.userId).toString(crypto_js_1.default.enc.Hex);
        const magiclink = {
            id: '',
            token: hash,
            userId: item.userId,
            expires: new Date(Date.now() + 10 * 60 * 1000)
        };
        return super.create(magiclink);
    }
    async getByToken(token) {
        return await this.store.getBy('token', token);
    }
    async consumeToken(token) {
        const magicLink = await this.getByToken(token);
        if (!magicLink)
            return null;
        await this.delete(magicLink.id);
        const now = new Date();
        if (now < magicLink.expires) {
            return magicLink.userId;
        }
        return null;
    }
    async cleanExpiredLinks() {
        const now = new Date();
        const allLinks = await this.getAll();
        const expiredLinks = allLinks.filter(link => link.expires < now);
        for (const link of expiredLinks) {
            await this.delete(link.id);
        }
        return expiredLinks.length;
    }
}
exports.MagicLinkModel = MagicLinkModel;
