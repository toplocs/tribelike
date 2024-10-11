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
exports.findLocations = findLocations;
exports.createLocation = createLocation;
exports.updateLocation = updateLocation;
exports.getLocationById = getLocationById;
exports.addLocation = addLocation;
exports.removeLocation = removeLocation;
const prisma_1 = __importDefault(require("../lib/prisma"));
function findLocations(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const locations = yield prisma_1.default.location.findMany({
                where: {
                    title: {
                        contains: query.title,
                        mode: 'insensitive'
                    }
                },
                take: 20,
            });
            return { success: locations };
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
function createLocation(formData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const location = yield prisma_1.default.location.create({
                data: Object.assign({ title: formData.title, yCoordinate: formData.yCoordinate, xCoordinate: formData.xCoordinate, zoom: Number(formData.zoom) }, (formData.parentId && { parentId: formData.parentId })),
            });
            return { success: location };
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
function updateLocation(formData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const location = yield prisma_1.default.location.update({
                where: {
                    id: formData === null || formData === void 0 ? void 0 : formData.locationId,
                },
                data: Object.assign({ title: formData.title, yCoordinate: formData.yCoordinate, xCoordinate: formData.xCoordinate, zoom: Number(formData.zoom) }, (formData.parentId && { parentId: formData.parentId })),
            });
            return { success: location };
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
function getLocationById(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const location = yield prisma_1.default.location.findUnique({
                where: {
                    id: params === null || params === void 0 ? void 0 : params.id,
                },
                include: {
                    parent: true,
                    profiles: true,
                }
            });
            return { success: location };
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
function addLocation(_a) {
    return __awaiter(this, arguments, void 0, function* ({ profileId, locationId, }) {
        try {
            const profile = yield prisma_1.default.profile.update({
                where: {
                    id: profileId,
                },
                data: {
                    locations: { connect: { id: locationId } },
                }
            });
            return { success: profile };
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
function removeLocation(_a) {
    return __awaiter(this, arguments, void 0, function* ({ profileId, locationId, }) {
        try {
            const profile = yield prisma_1.default.profile.update({
                where: {
                    id: profileId,
                },
                data: {
                    locations: { disconnect: { id: locationId } },
                }
            });
            return { success: profile };
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
