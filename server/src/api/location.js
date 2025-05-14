"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const location_1 = require("../actions/location");
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.route('/').get(async (req, res) => {
    const { success, error } = await (0, location_1.findLocations)(req.query);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
}).post(upload.none(), async (req, res) => {
    console.log(req.body);
    const { success, error } = await (0, location_1.createLocation)(req.body);
    /*if (success) { //als eigener endpoint
      await createActivity({
        profileId: req.body?.profileId,
        text: `The location ${success.title} was created!`,
        locationId: success.id,
      });
    }*/
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
}).put(upload.none(), async (req, res) => {
    const { success, error } = await (0, location_1.updateLocation)(req.body);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
router.route('/byId/:id').get(async (req, res) => {
    const { success, error } = await (0, location_1.getLocationById)(req.params);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
router.route('/add').put(async (req, res) => {
    const { success, error } = await (0, location_1.addLocation)(req.body);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
router.route('/remove').put(async (req, res) => {
    const { success, error } = await (0, location_1.removeLocation)(req.body);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
router.route('/ask').put(async (req, res) => {
    const { title, limit } = await (0, location_1.askAccess)(req.body);
    const profile = await prisma_1.default.profile.findUnique({
        where: { id: req.body.profileId },
    });
    /*await createDiscussion({ //als eigener endpoint
      type: 'askAccess',
      text: `${profile?.username} asks to join the ${title} community`,
      limit: limit,
      votes: { yes: 0, no: 0 },
      attachment: profile,
      locationId: req.body.locationId,
    });*/
    res.status(200).json(true);
});
router.route('/link').post(upload.none(), async (req, res) => {
    const { success, error } = await (0, location_1.addLink)(req.body);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
exports.default = router;
