"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const location_1 = require("../../actions/location");
const location_relations_1 = require("../../actions/location-relations");
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.route('/byCoords').get(async (req, res) => {
    let { lat, lng } = req.query;
    const { success, error } = await (0, location_1.getLocationByCoords)({ lat, lng });
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
router.route('/byBounds').get(async (req, res) => {
    let { northeast, southwest } = req.query;
    const { success, error } = await (0, location_1.getLocationByBounds)({ northeast, southwest });
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
router.route('/updateCurrent').post(upload.none(), async (req, res) => {
    const { success, error } = await (0, location_1.updateCurrentLocation)(req.body);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
//--- Relations--- //
router.route('/:id/profiles').get(async (req, res) => {
    const { success, error } = await (0, location_1.getProfileLocations)(req.params);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
}).post(async (req, res) => {
    const { success, error } = await (0, location_relations_1.createProfileRelation)(req.params.id, req.body);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
router.route('/interests/:id').get(async (req, res) => {
    const { id } = req.params;
    const { success, error } = await (0, location_relations_1.findInterestRelations)(id);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
}).post(async (req, res) => {
    const { id } = req.params;
    const { success, error } = await (0, location_relations_1.createInterestRelation)(id, req.body);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
}).delete(async (req, res) => {
    const { id } = req.params;
    const { success, error } = await (0, location_relations_1.removeInterestRelation)(id);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
router.route('/locations/:id').get(async (req, res) => {
    const { id } = req.params;
    const { success, error } = await (0, location_relations_1.findLocationRelations)(id);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
}).post(async (req, res) => {
    const { id } = req.params;
    const data = req.body;
    const { success, error } = await (0, location_relations_1.createLocationRelation)(id, data);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
}).delete(async (req, res) => {
    const { id } = req.params;
    const { success, error } = await (0, location_relations_1.removeLocationRelation)(id);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
exports.default = router;
