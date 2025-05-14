"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const passkeyController_1 = __importDefault(require("../../controllers/auth/passkeyController"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
router.post('/auth/passkey/registerStart', upload.none(), passkeyController_1.default.handleRegisterStart);
router.post('/auth/passkey/registerFinish', upload.none(), passkeyController_1.default.handleRegisterFinish);
router.post('/auth/passkey/loginStart', upload.none(), passkeyController_1.default.handleLoginStart);
router.post('/auth/passkey/loginFinish', upload.none(), passkeyController_1.default.handleLoginFinish);
exports.default = router;
