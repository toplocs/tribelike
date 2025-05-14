"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PasskeyModel = exports.PasskeyCredential = void 0;
const lib_1 = require("../../lib");
class PasskeyCredential extends lib_1.GenericObject {
    constructor(credential) {
        super(credential.id);
        Object.assign(this, credential);
    }
    publicKeyUint8() {
        return PasskeyCredential.base64ToUint8Array(this.publicKey);
    }
}
exports.PasskeyCredential = PasskeyCredential;
PasskeyCredential.uint8ArrayToBase64 = (uint8Array) => Buffer.from(uint8Array).toString('base64');
PasskeyCredential.base64ToUint8Array = (base64) => new Uint8Array(Buffer.from(base64, 'base64'));
class PasskeyModel extends lib_1.Model {
    constructor(store) {
        super(store, {
            getAll: false,
            create: true,
            getById: true,
            update: false,
            delete: true
        });
        store.index('userId');
    }
    async getAllByUserId(userId) {
        const credentials = await this.store.getAll();
        return credentials.filter(item => item.userId === userId);
    }
    async updateCounter(id, counter) {
        return this.store.update(id, { counter: counter });
    }
}
exports.PasskeyModel = PasskeyModel;
