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
const user_1 = require("../actions/user");
const auth_1 = require("../lib/auth");
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.route('/').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, error } = yield (0, user_1.getUsers)(req.query);
    if (success)
        return res.status(200).json(success);
    else
        return res.status(400).json(error);
}))
    .post(upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, error } = yield (0, user_1.createUser)(req.body);
    if (success) {
        const { token, expires } = yield (0, auth_1.login)(success);
        return res.status(200).json({ token, expires });
    }
    else
        return res.status(400).json(error);
}))
    .put(upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.get('Authorization');
    const { success, error } = yield (0, user_1.updateUser)(req.body, authHeader);
    if (success)
        return res.status(200).json(success);
    else
        return res.status(400).json(error);
}));
router.route('/byId/:id').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, error } = yield (0, user_1.getUserById)(req.params);
    if (success)
        return res.status(200).json(success);
    else
        return res.status(400).json(error);
}));
exports.default = router;
