"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const ProfileController_1 = __importDefault(require("../../controllers/ProfileController"));
const authenticate_1 = require("../../middleware/authenticate");
const upload = (0, multer_1.default)();
const router = (0, express_1.Router)();
router.use(authenticate_1.authenticate);
router.get('/user/profiles', authenticate_1.authenticate, ProfileController_1.default.GetAllProfilesForUser);
router.get('/profiles', ProfileController_1.default.GetAllProfiles);
router.post('/profiles', authenticate_1.authenticate, upload.none(), ProfileController_1.default.CreateProfile);
router.get('/profile/:id', authenticate_1.authenticate, ProfileController_1.default.GetProfileById);
router.put('/profile/:id', authenticate_1.authenticate, upload.none(), ProfileController_1.default.UpdateProfile);
router.delete('/profile/:id', authenticate_1.authenticate, ProfileController_1.default.DeleteProfile);
exports.default = router;
