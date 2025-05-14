"use strict";
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
exports.askAccess = askAccess;
exports.inviteFriends = inviteFriends;
exports.addLink = addLink;
const prisma_1 = __importDefault(require("../lib/prisma"));
async function findInterests(query) {
    try {
        const interests = await prisma_1.default.interest.findMany({
            where: {
                title: {
                    contains: query.title,
                    mode: 'insensitive'
                }
            },
            take: 20,
        });
        return { success: interests };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function createInterest(formData) {
    try {
        const relations = JSON.parse(formData.relations);
        const interest = await prisma_1.default.interest.create({
            data: {
                title: formData.title,
                access: JSON.parse(formData.access),
                relations: {
                    create: relations,
                }
            },
        });
        return { success: interest };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function updateInterest(formData) {
    try {
        const relations = JSON.parse(formData.relations);
        const check = await prisma_1.default.interest.findUnique({
            where: {
                id: formData.interestId,
            },
            include: {
                relations: true,
            }
        });
        const existingRelationIds = check?.relations.map((rel) => rel.id);
        const newRelationIds = relations.map((rel) => rel.id);
        const relationsToDelete = existingRelationIds?.filter((id) => !newRelationIds.includes(id));
        await prisma_1.default.relation.deleteMany({
            where: {
                id: { in: relationsToDelete },
            },
        });
        const interest = await prisma_1.default.interest.update({
            where: {
                id: formData.interestId,
            },
            data: {
                title: formData.title,
                access: JSON.parse(formData.access),
                relations: {
                    create: relations.filter((x) => !x.id),
                }
            },
        });
        return { success: interest };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function getInterestById(params) {
    try {
        const interest = await prisma_1.default.interest.findUnique({
            where: {
                id: params?.id,
            },
            include: {
                profiles: true,
                relations: true,
                discussions: true,
            }
        });
        return { success: interest };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function addInterest({ profileId, interestId, }) {
    try {
        const profile = await prisma_1.default.profile.update({
            where: {
                id: profileId,
            },
            data: {
                interests: { connect: { id: interestId } },
            },
        });
        return { success: profile };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function removeInterest({ profileId, interestId, }) {
    try {
        const profile = await prisma_1.default.profile.update({
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
}
async function askAccess({ profileId, interestId, }) {
    try {
        const interest = await prisma_1.default.interest.update({
            where: {
                id: interestId,
            },
            data: {
                ask: { push: profileId },
            },
            include: {
                profiles: true,
            }
        });
        return {
            title: interest.title,
            limit: interest.profiles.length,
        };
    }
    catch (e) {
        console.error(e);
    }
}
async function inviteFriends({ invites, interestId, }) {
    try {
        const interest = await prisma_1.default.interest.findUnique({
            where: { id: interestId },
            select: { invites: true },
        });
        const newInvites = invites.filter(x => !interest?.invites.includes(x));
        await prisma_1.default.interest.update({
            where: { id: interestId },
            data: {
                invites: { push: newInvites }
            },
            include: {
                profiles: true,
            }
        });
        return {
            invites: newInvites,
        };
    }
    catch (e) {
        console.error(e);
    }
}
async function addLink(formData) {
    try {
        if (formData.link.length < 3)
            throw new Error('Your link is too short');
        const interest = await prisma_1.default.interest.update({
            where: {
                id: formData?.id,
            },
            data: {
                links: { push: formData.link }
            }
        });
        return { success: interest };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
