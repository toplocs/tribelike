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
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../lib/auth");
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.route('/').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const authHeader = req.get('Authorization');
        const session = yield (0, auth_1.auth)(authHeader);
        return res.status(200).json({ session });
    }
    catch (e) {
        console.error(e);
        return res.status(400).json(e.error);
    }
}));
router.route('/login').post(upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const formData = req.body;
        if (formData.username.length < 3)
            return res.status(401).json('This account does not exist');
        const user = yield prisma_1.default.user.findUnique({
            where: {
                username: formData.username,
            }
        });
        if (!user)
            return res.status(401).json('This account does not exist');
        if (formData.password != user.password)
            return res.status(401).json('The password is not correct');
        const { token, expires } = yield (0, auth_1.login)(user);
        return res.status(200).json({ token, expires });
    }
    catch (e) {
        console.error(e);
        return res.status(400).json(e.error);
    }
}));
router.route('/logout').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.get('Authorization');
    const session = yield (0, auth_1.auth)(authHeader);
    yield (0, auth_1.logout)();
    return res.status(200).json({ session });
}));
router.route('/refresh').post(upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    return res.status(400).json({ error: 'Failed to refresh token' });
}));
exports.default = router;
