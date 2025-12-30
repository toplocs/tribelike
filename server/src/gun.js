"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.initGun = initGun;
exports.getGun = getGun;
const gun_1 = __importDefault(require("gun"));
let gun;
function initGun(server) {
    gun = (0, gun_1.default)({ peers: [], file: 'ra-data' });
    return gun;
}
function getGun() {
    if (!gun) {
        throw new Error('Gun has not been initialized. Call initGun(server) first.');
    }
    return gun;
}
