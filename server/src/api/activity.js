"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const activity_1 = require("../actions/activity");
const router = express_1.default.Router();
router.route('/').get(async (req, res) => {
    const { success, error } = await (0, activity_1.findActivities)(req.query);
    if (success) {
        res.status(200).json(success);
    }
    else {
        res.status(400).json(error);
    }
});
exports.default = router;
