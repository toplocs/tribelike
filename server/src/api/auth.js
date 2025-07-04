"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const auth_1 = require("../lib/auth");
const models_1 = require("../models");
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.route('/').get(async (req, res) => {
    try {
        const authHeader = req.get('Authorization');
        const session = await (0, auth_1.auth)(authHeader);
        res.status(200).json({ session });
    }
    catch (e) {
        console.error(e);
        res.status(400).json(e.error);
    }
});
router.route('/login').post(upload.none(), async (req, res) => {
    try {
        const formData = req.body;
        if (formData.email.length < 3) {
            res.status(401).json('This account does not exist');
            return;
        }
        const user = await prisma_1.default.user.findUnique({
            where: {
                email: formData.email,
            }
        });
        if (!user) {
            res.status(401).json('This account does not exist');
            return;
        }
        // if (formData.password != user.password) return res.status(401).json('The password is not correct');
        const { token, expires } = await (0, auth_1.login)(user);
        console.log('Login successfull');
        res.status(200).json({ token, expires });
    }
    catch (e) {
        console.error(e);
        res.status(400).json(e.error);
    }
});
router.route('/logout').get(async (req, res) => {
    const authHeader = req.get('Authorization');
    const session = await (0, auth_1.auth)(authHeader);
    await (0, auth_1.logout)();
    res.status(200).json({ session });
});
router.route('/refresh').post(upload.none(), async (req, res) => {
    res.status(400).json({ error: 'Failed to refresh token' });
});
router.route('/session').get(async (req, res) => {
    try {
        const authHeader = req.get('Authorization');
        let authToken = authHeader;
        if (!authToken) {
            const { token } = await models_1.sessions.createToken({ userId: '' });
            authToken = token;
        }
        const userId = await models_1.sessions.validateToken(authToken);
        res.status(200).json({
            userId: userId,
            token: authToken,
        });
    }
    catch (e) {
        console.error(e);
        res.status(400).json(e.error);
    }
});
exports.default = router;
