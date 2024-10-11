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
exports.findActivities = findActivities;
exports.createActivity = createActivity;
const prisma_1 = __importDefault(require("../lib/prisma"));
function findActivities(query) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const activities = yield prisma_1.default.activity.findMany({
                where: Object.assign(Object.assign(Object.assign({}, (query.profileId && { profileId: query.profileId })), (query.interestId && { interestId: query.interestId })), (query.locationId && { locationId: query.locationId })),
                include: {
                    profile: true,
                    location: true,
                    interests: true,
                },
                take: 20,
            });
            return { success: activities };
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
function createActivity(props) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const activity = yield prisma_1.default.activity.create({
                data: {
                    profileId: props.profileId,
                    text: props.text,
                    href: props.href,
                    status: props.status || 'IMPORTANT',
                    type: props.type || 'NORMAL',
                    date: new Date(),
                    locationId: props.locationId,
                    interests: props.interests ? {
                        connect: props.interests.map((id) => ({ id })),
                    } : undefined,
                },
            });
            return activity;
        }
        catch (e) {
            console.error(e);
            return { error: e.message };
        }
    });
}
