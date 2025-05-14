"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findRelations = findRelations;
exports.addRelation = addRelation;
exports.removeRelation = removeRelation;
const prisma_1 = __importDefault(require("../lib/prisma"));
async function findRelations(query) {
    try {
        const relations = await prisma_1.default.relation.findMany({
            where: {
                ...(query.interestId && { interestId: query.interestId }),
                ...(query.locationId && { locationId: query.locationId }),
            },
            take: 20,
        });
        return { success: relations.map(x => x.data) };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function addRelation(data) {
    try {
        const relation = await prisma_1.default.relation.create({
            data: data
        });
        return { success: relation };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function removeRelation(data) {
    try {
        const relations = await prisma_1.default.relation.deleteMany({
            where: data
        });
        return { success: relations };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
