"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const magicLinkController_1 = __importDefault(require("../../controllers/auth/magicLinkController"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
router.get('/auth/magicLink/:token', magicLinkController_1.default.handleMagicLinkLogin);
router.post('/auth/magicLink', upload.none(), magicLinkController_1.default.sendMagicLink);
router.post('/auth/magicLink/resend', magicLinkController_1.default.resendMagicLink);
exports.default = router;
