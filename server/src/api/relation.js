"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const relation_1 = require("../actions/relation");
const router = express_1.default.Router();
router.route('/').get(async (req, res) => {
    const { success, error } = await (0, relation_1.findRelations)(req.query);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
}).put(async (req, res) => {
    const { success, error } = await (0, relation_1.addRelation)(req.body);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
}).delete(async (req, res) => {
    const { success, error } = await (0, relation_1.removeRelation)(req.body);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
exports.default = router;
