"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findDiscussions = findDiscussions;
exports.createDiscussion = createDiscussion;
exports.voteYes = voteYes;
exports.voteNo = voteNo;
exports.resolveDiscussion = resolveDiscussion;
const prisma_1 = __importDefault(require("../lib/prisma"));
async function findDiscussions(params) {
    try {
        const discussions = await prisma_1.default.discussion.findMany({
            where: {
                OR: [
                    { interestId: params.id },
                    { locationId: params.id },
                ]
            },
            take: 20,
        });
        return { success: discussions };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function createDiscussion(data) {
    try {
        const discussion = await prisma_1.default.discussion.create({
            data: data
        });
        return { success: discussion };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function voteYes({ profileId, discussionId, }) {
    try {
        const discussion = await prisma_1.default.discussion.findUnique({
            where: { id: discussionId },
        });
        if (discussion) {
            const votes = discussion.votes;
            await prisma_1.default.discussion.update({
                where: { id: discussionId },
                data: {
                    voters: { push: profileId },
                    votes: {
                        ...votes,
                        yes: (votes.yes || 0) + 1,
                    }
                }
            });
            if (discussion.voters?.length + 1 >= discussion.limit) {
                await resolveDiscussion(discussion, (votes.yes >= votes.no));
            }
        }
        return { success: discussion };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function voteNo({ profileId, discussionId, }) {
    try {
        const discussion = await prisma_1.default.discussion.findUnique({
            where: { id: discussionId },
        });
        if (discussion) {
            const votes = discussion.votes;
            await prisma_1.default.discussion.update({
                where: { id: discussionId },
                data: {
                    voters: { push: profileId },
                    votes: {
                        ...votes,
                        no: (votes.no || 0) + 1,
                    }
                }
            });
            if (discussion.voters?.length + 1 >= discussion.limit) {
                await resolveDiscussion(discussion, (votes.yes >= votes.no));
            }
        }
        return { success: discussion };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function resolveDiscussion(discussion, result) {
    if (discussion.type == 'askAccess'
        && discussion.interestId
        && result == true) {
        const profile = discussion.attachment;
        const interest = await prisma_1.default.interest.findUnique({
            where: { id: discussion.interestId },
        });
        await prisma_1.default.interest.update({
            where: { id: discussion.interestId },
            data: {
                profiles: { connect: profile },
                ask: interest?.ask.filter((x) => x != profile.id)
            }
        });
    }
    if (discussion.type == 'askAccess'
        && discussion.locationId
        && result == true) {
        const profile = discussion.attachment;
        const location = await prisma_1.default.location.findUnique({
            where: { id: discussion.locationId },
        });
        await prisma_1.default.location.update({
            where: { id: discussion.locationId },
            data: {
                profiles: { connect: profile },
                ask: location?.ask.filter((x) => x != profile.id)
            }
        });
    }
    await prisma_1.default.discussion.delete({
        where: { id: discussion.id },
    });
    console.log('Discussion resolved');
}
