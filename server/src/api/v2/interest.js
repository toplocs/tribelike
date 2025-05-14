"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const interest_relations_1 = require("../../actions/interest-relations");
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
//--- Relations--- //
router.route('/:id/relations').get(async (req, res) => {
    const { id } = req.params;
    const [interestRelations, locationRelations] = await Promise.all([
        (0, interest_relations_1.findInterestRelations)(id),
        (0, interest_relations_1.findLocationRelations)(id)
    ]);
    if (interestRelations.success && locationRelations.success) {
        res.status(200).json({
            children: [],
            members: [],
            interests: interestRelations.success,
            locations: locationRelations.success
        });
    }
    else {
        res.status(400).json({
            error: interestRelations.error || locationRelations.error
        });
    }
});
// router.route('/:id/profiles').get(async (req: Request, res: Response) => {
//   const { success, error } = await getProfileInterests(req.params);
//   if (success) return res.status(200).json(success);
//   else return res.status(400).json(error);
// });
router.route('/interests/:id').get(async (req, res) => {
    const { id } = req.params;
    const { success, error } = await (0, interest_relations_1.findInterestRelations)(id);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
}).post(async (req, res) => {
    const { id } = req.params;
    const { success, error } = await (0, interest_relations_1.createInterestRelation)(id, req.body);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
}).delete(async (req, res) => {
    const { id } = req.params;
    const { success, error } = await (0, interest_relations_1.removeInterestRelation)(id);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
router.route('/locations/:id').get(async (req, res) => {
    const { id } = req.params;
    const { success, error } = await (0, interest_relations_1.findLocationRelations)(id);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
}).post(async (req, res) => {
    const { id } = req.params;
    const { success, error } = await (0, interest_relations_1.createLocationRelation)(id, req.body);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
}).delete(async (req, res) => {
    const { id } = req.params;
    const { success, error } = await (0, interest_relations_1.removeLocationRelation)(id);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
exports.default = router;
