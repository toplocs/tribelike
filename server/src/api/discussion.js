"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const discussion_1 = require("../actions/discussion");
const router = express_1.default.Router();
router.route('/:id').get(async (req, res) => {
    const { success, error } = await (0, discussion_1.findDiscussions)(req.params);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
router.route('/vote/yes').put(async (req, res) => {
    const { success, error } = await (0, discussion_1.voteYes)(req.body);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
router.route('/vote/no').put(async (req, res) => {
    const { success, error } = await (0, discussion_1.voteNo)(req.body);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
exports.default = router;
