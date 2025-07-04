"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userSettings = exports.profiles = exports.users = exports.magicLinks = exports.passkeys = exports.sessions = exports.userSettingStore = exports.magicLinkStore = exports.profileStore = exports.userStore = exports.credentialStore = void 0;
const lib_1 = require("../lib");
const Session_1 = require("./auth/Session");
const Passkey_1 = require("./auth/Passkey");
const User_1 = require("./User");
const MagicLink_1 = require("./auth/MagicLink");
const UserSetting_1 = require("./UserSetting");
const Profile_1 = require("./Profile");
const config_1 = require("../config");
// Create stores for all models
const store = lib_1.Store.getInstance();
store.setStoreType(config_1.storeType);
const credentialStore = store.getStore('Credential');
exports.credentialStore = credentialStore;
const userStore = store.getStore('User');
exports.userStore = userStore;
const magicLinkStore = store.getStore('MagicLink');
exports.magicLinkStore = magicLinkStore;
const userSettingStore = store.getStore('UserSetting');
exports.userSettingStore = userSettingStore;
const profileStore = store.getStore('Profile');
exports.profileStore = profileStore;
userStore.setRelatedStore('profiles', profileStore);
userStore.setRelatedStore('settings', userSettingStore);
// Create models
const sessions = new Session_1.Session();
exports.sessions = sessions;
const passkeys = new Passkey_1.PasskeyModel(credentialStore);
exports.passkeys = passkeys;
const users = new User_1.UserModel(userStore);
exports.users = users;
const profiles = new Profile_1.ProfileModel(profileStore);
exports.profiles = profiles;
const magicLinks = new MagicLink_1.MagicLinkModel(magicLinkStore);
exports.magicLinks = magicLinks;
const userSettings = new UserSetting_1.UserSettingModel(userSettingStore);
exports.userSettings = userSettings;
__exportStar(require("./auth/Session"), exports);
__exportStar(require("./auth/Passkey"), exports);
__exportStar(require("./auth/MagicLink"), exports);
__exportStar(require("./User"), exports);
__exportStar(require("./Profile"), exports);
__exportStar(require("./UserSetting"), exports);
