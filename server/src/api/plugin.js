"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const plugin_1 = require("../actions/plugin");
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.route('/').get(async (req, res) => {
    const { success, error } = await (0, plugin_1.findPluginSettings)(req.query);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
router.route('/active').post(upload.none(), async (req, res) => {
    const { success, error } = await (0, plugin_1.togglePluginActive)(req.body);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
router.route('/settings').post(upload.none(), async (req, res) => {
    const { success, error } = await (0, plugin_1.togglePluginActive)(req.body);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
exports.default = router;
