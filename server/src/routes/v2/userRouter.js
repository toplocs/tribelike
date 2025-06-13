"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const userController_1 = __importDefault(require("../../controllers/userController"));
const authenticate_1 = require("../../middleware/authenticate");
// TODO: put that in UserController
const magicLinkController_1 = __importDefault(require("../../controllers/auth/magicLinkController"));
const router = (0, express_1.Router)();
const upload = (0, multer_1.default)();
router.get('/users', authenticate_1.authenticate, userController_1.default.GetUsers);
router.get('/user', authenticate_1.authenticate, userController_1.default.GetUser);
router.post('/user', upload.none(), magicLinkController_1.default.handleAccountCreate);
router.put('/user', authenticate_1.authenticate, userController_1.default.UpdateUser);
router.delete('/user', authenticate_1.authenticate, userController_1.default.DeleteUser);
// TODO: Implement routes for user activities, discussions, and profiles
// router.get('/user/:id/activities', UserController.getActivitiesByUserId);
// router.get('/user/:id/discussions', UserController.getDiscussionsByUserId);
// router.get('/user/:id/profiles', UserController.getProfilesByUserId);
exports.default = router;
