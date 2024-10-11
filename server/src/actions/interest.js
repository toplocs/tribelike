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
exports.findInterests = findInterests;
exports.createInterest = createInterest;
exports.updateInterest = updateInterest;
exports.getInterestById = getInterestById;
exports.addInterest = addInterest;
exports.removeInterest = removeInterest;
const prisma_1 = __importDefault(require("../lib/prisma"));
function findInterests(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const interests = yield prisma_1.default.interest.findMany({
                where: {
                    title: {
                        contains: query.title,
                        mode: 'insensitive'
                    }
                },
                include: {
                    parent: true,
                },
                take: 20,
            });
            return { success: interests };
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
function createInterest(formData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const interest = yield prisma_1.default.interest.create({
                data: Object.assign({ title: formData.title }, (formData.parentId && { parentId: formData.parentId })),
            });
            return { success: interest };
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
function updateInterest(formData) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const interest = yield prisma_1.default.interest.update({
                where: {
                    id: formData === null || formData === void 0 ? void 0 : formData.interestId,
                },
                data: Object.assign({ title: formData.title }, (formData.parentId && { parentId: formData.parentId })),
            });
            return { success: interest };
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
function getInterestById(params) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const interest = yield prisma_1.default.interest.findUnique({
                where: {
                    id: params === null || params === void 0 ? void 0 : params.id,
                },
                include: {
                    parent: true,
                    profiles: true,
                }
            });
            return { success: interest };
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
function addInterest(_a) {
    return __awaiter(this, arguments, void 0, function* ({ profileId, interestId, }) {
        try {
            const profile = yield prisma_1.default.profile.update({
                where: {
                    id: profileId,
                },
                data: {
                    interests: { connect: { id: interestId } },
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
function removeInterest(_a) {
    return __awaiter(this, arguments, void 0, function* ({ profileId, interestId, }) {
        try {
            const profile = yield prisma_1.default.profile.update({
                where: {
                    id: profileId,
                },
                data: {
                    interests: { disconnect: { id: interestId } },
                },
            });
            return { success: profile };
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
