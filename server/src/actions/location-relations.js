"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findInterestRelations = findInterestRelations;
exports.findLocationRelations = findLocationRelations;
exports.createProfileRelation = createProfileRelation;
exports.createInterestRelation = createInterestRelation;
exports.createLocationRelation = createLocationRelation;
exports.removeInterestRelation = removeInterestRelation;
exports.removeLocationRelation = removeLocationRelation;
const prisma_1 = __importDefault(require("../lib/prisma"));
async function findInterestRelations(id) {
    try {
        const relations = await prisma_1.default.interestLocation.findMany({
            where: { locationId: id },
            select: {
                id: true,
                key: true,
                Interest: true,
            },
            take: 50,
        });
        return { success: relations };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function findLocationRelations(id) {
    try {
        const relations = await prisma_1.default.locationLocation.findMany({
            where: { locationId: id },
            select: {
                id: true,
                key: true,
                OtherLocation: true,
            },
            take: 50,
        });
        return { success: relations };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function createProfileRelation(id, body) {
    try {
        const relation = await prisma_1.default.profileLocation.create({
            data: {
                key: body.key,
                locationId: id,
                profileId: body.profileId,
            },
            select: {
                key: true,
                Profile: true,
                Location: true,
            },
        });
        return { success: relation };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function createInterestRelation(id, body) {
    try {
        const relation = await prisma_1.default.interestLocation.create({
            data: {
                key: body.key,
                locationId: id,
                interestId: body.interestId,
            },
            select: {
                key: true,
                Interest: true,
            },
        });
        return { success: relation };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function createLocationRelation(id, body) {
    try {
        const relation = await prisma_1.default.locationLocation.create({
            data: {
                key: body.key,
                locationId: id,
                otherLocationId: body.otherLocationId,
            },
            select: {
                key: true,
                OtherLocation: true,
            },
        });
        return { success: relation };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function removeInterestRelation(id) {
    try {
        await prisma_1.default.interestLocation.delete({
            where: { id: id }
        });
        return { success: true };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function removeLocationRelation(id) {
    try {
        await prisma_1.default.locationLocation.delete({
            where: { id: id }
        });
        return { success: true };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
