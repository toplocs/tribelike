"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findActivities = findActivities;
exports.createActivity = createActivity;
const prisma_1 = __importDefault(require("../lib/prisma"));
async function findActivities(query) {
    try {
        const activities = await prisma_1.default.activity.findMany({
            where: {
                ...(query.profileId && { profileId: query.profileId }),
                ...(query.interestId && { interestId: query.interestId }),
                ...(query.locationId && { locationId: query.locationId }),
            },
            include: {
                profile: true,
                location: true,
                interest: true,
            },
            take: 20,
            orderBy: { date: 'desc' },
        });
        return { success: activities };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function createActivity(props) {
    try {
        const activity = await prisma_1.default.activity.create({
            data: {
                profileId: props.profileId,
                text: props.text,
                href: props.href,
                status: props.status || 'IMPORTANT',
                type: props.type || 'NORMAL',
                date: new Date(),
                locationId: props.locationId,
                interestId: props.interestId,
            },
        });
        return { success: activity };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
