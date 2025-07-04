"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserSettingModel = exports.UserSetting = void 0;
const lib_1 = require("../lib");
class UserSetting extends lib_1.GenericObject {
    constructor(userSetting) {
        super(userSetting.id);
        Object.assign(this, userSetting);
    }
}
exports.UserSetting = UserSetting;
class UserSettingModel extends lib_1.Model {
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
    async getByUserId(userId) {
        return await this.store.getAll({ 'userId': userId });
    }
}
exports.UserSettingModel = UserSettingModel;
