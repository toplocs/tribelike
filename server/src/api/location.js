"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const location_1 = require("../actions/location");
const activity_1 = require("../actions/activity");
const router = express_1.default.Router();
const upload = (0, multer_1.default)();
router.route('/').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, error } = yield (0, location_1.findLocations)(req.query);
    if (success)
        return res.status(200).json(success);
    else
        return res.status(400).json(error);
})).post(upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const { success, error } = yield (0, location_1.createLocation)(req.body);
    console.log((_a = req.body) === null || _a === void 0 ? void 0 : _a.profileId);
    if (success) {
        yield (0, activity_1.createActivity)({
            profileId: (_b = req.body) === null || _b === void 0 ? void 0 : _b.profileId,
            text: `The location ${success.title} was created!`,
        });
    }
    if (success)
        return res.status(200).json(success);
    else
        return res.status(400).json(error);
})).put(upload.none(), (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, error } = yield (0, location_1.updateLocation)(req.body);
    if (success)
        return res.status(200).json(success);
    else
        return res.status(400).json(error);
}));
router.route('/byId/:id').get((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, error } = yield (0, location_1.getLocationById)(req.params);
    if (success)
        return res.status(200).json(success);
    else
        return res.status(400).json(error);
}));
router.route('/add').put((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, error } = yield (0, location_1.addLocation)(req.body);
    if (success)
        return res.status(200).json(success);
    else
        return res.status(400).json(error);
}));
router.route('/remove').put((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { success, error } = yield (0, location_1.removeLocation)(req.body);
    if (success)
        return res.status(200).json(success);
    else
        return res.status(400).json(error);
}));
exports.default = router;
