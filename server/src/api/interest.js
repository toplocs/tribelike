"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const prisma_1 = __importDefault(require("../lib/prisma"));
const interest_1 = require("../actions/interest");
const activity_1 = require("../actions/activity");
const discussion_1 = require("../actions/discussion");
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.route('/').get(async (req, res) => {
    const { success, error } = await (0, interest_1.findInterests)(req.query);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
}).post(upload.none(), async (req, res) => {
    const { success, error } = await (0, interest_1.createInterest)(req.body);
    if (success) {
        await (0, activity_1.createActivity)({
            profileId: req.body?.profileId,
            text: `The interest ${success.title} was created!`,
            interestId: success.id,
        });
    }
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
}).put(upload.none(), async (req, res) => {
    const { success, error } = await (0, interest_1.updateInterest)(req.body);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
router.route('/byId/:id').get(async (req, res) => {
    const { success, error } = await (0, interest_1.getInterestById)(req.params);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
router.route('/add').put(async (req, res) => {
    const { success, error } = await (0, interest_1.addInterest)(req.body);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
router.route('/remove').put(async (req, res) => {
    const { success, error } = await (0, interest_1.removeInterest)(req.body);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
router.route('/ask').put(async (req, res) => {
    const result = await (0, interest_1.askAccess)(req.body);
    if (result) {
        const profile = await prisma_1.default.profile.findUnique({
            where: { id: req.body.profileId },
        });
        await (0, discussion_1.createDiscussion)({
            type: 'askAccess',
            text: `${profile?.username} asks to join the ${result.title} community`,
            limit: result.limit,
            votes: { yes: 0, no: 0 },
            attachment: profile,
            interestId: req.body.interestId,
        });
    }
    res.status(200).json(true);
});
router.route('/invite').put(async (req, res) => {
    const result = await (0, interest_1.inviteFriends)(req.body);
    if (result) {
        for (let id of result.invites) {
            await prisma_1.default.invite.create({
                data: {
                    profileId: id,
                    interestId: req.body.interestId,
                }
            });
        }
    }
    res.status(200).json(true);
});
router.route('/link').post(upload.none(), async (req, res) => {
    const { success, error } = await (0, interest_1.addLink)(req.body);
    if (success)
        res.status(200).json(success);
    else
        res.status(400).json(error);
});
exports.default = router;
