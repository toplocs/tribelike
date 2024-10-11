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
const profile_1 = require("../actions/profile");
const activity_1 = require("../actions/activity");
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.route('/').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.get('Authorization');
    const { success, error } = yield (0, profile_1.getProfiles)(authHeader);
    if (success)
        return res.status(200).json(success);
    else
        return res.status(400).json(error);
}))
    .post(upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.get('Authorization');
    const { success, error } = yield (0, profile_1.createProfile)(req.body, authHeader);
    if (success) {
        yield (0, activity_1.createActivity)({
            profileId: success.id,
            text: `The profile ${success.username} was created!`,
        });
    }
    if (success)
        return res.status(200).json(success);
    else
        return res.status(400).json(error);
}))
    .put(upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.get('Authorization');
    const { success, error } = yield (0, profile_1.updateProfile)(req.body, authHeader);
    if (success)
        return res.status(200).json(success);
    else
        return res.status(400).json(error);
}))
    .delete((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = req.get('Authorization');
    const { success, error } = yield (0, profile_1.deleteProfile)(req.query, authHeader);
    if (success)
        return res.status(200).json(success);
    else
        return res.status(400).json(error);
}));
router.route('/all').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, error } = yield (0, profile_1.getAllProfiles)();
    if (success)
        return res.status(200).json(success);
    else
        return res.status(400).json(error);
}));
router.route('/byId/:id').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, error } = yield (0, profile_1.getProfileById)(req.params);
    if (success)
        return res.status(200).json(success);
    else
        return res.status(400).json(error);
}));
exports.default = router;
