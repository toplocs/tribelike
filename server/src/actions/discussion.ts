import prisma from '../lib/prisma';

export async function findDiscussions(params: {
  id?: string,
}) {
  try {
    const discussions = await prisma.discussion.findMany({
      where: {
        OR: [
          { interestId: params.id },
          { locationId: params.id },
        ]
      },
      take: 20,
    });

    return { success: discussions };
  } catch (e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function createDiscussion(data: {
  type: string,
  text: string,
  limit: number,
  votes: any,
  attachment: any,
  interestId?: string,
  locationId?: string,
}) {
  try {
    const discussion = await prisma.discussion.create({
      data: data
    });

    return { success: discussion };
  } catch (e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function voteYes({
  profileId,
  discussionId,
}: {
  profileId: string,
  discussionId: string,
}) {
  try {
    const discussion = await prisma.discussion.findUnique({
      where: { id: discussionId },
    });
    if (discussion) {
      const votes = discussion.votes as { yes: number; no: number };
      await prisma.discussion.update({
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
  } catch (e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function voteNo({
  profileId,
  discussionId,
}: {
  profileId: string,
  discussionId: string,
}) {
  try {
    const discussion = await prisma.discussion.findUnique({
      where: { id: discussionId },
    });
    if (discussion) {
      const votes = discussion.votes as { yes: number; no: number };
      await prisma.discussion.update({
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
  } catch (e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function resolveDiscussion(
  discussion: any,
  result: Boolean
) {
  if (
    discussion.type == 'askAccess'
    && discussion.interestId
    && result == true
  ) {
    const profile = discussion.attachment;
    const interest = await prisma.interest.findUnique({
      where: { id: discussion.interestId },
    });
    await prisma.interest.update({
      where: { id: discussion.interestId },
      data: {
        profiles: { connect: profile },
        ask: interest?.ask.filter((x: string) => x != profile.id)
      }
    });
  }
  if (
    discussion.type == 'askAccess'
    && discussion.locationId
    && result == true
  ) {
    const profile = discussion.attachment;
    const location = await prisma.location.findUnique({
      where: { id: discussion.locationId },
    });
    await prisma.location.update({
      where: { id: discussion.locationId },
      data: {
        profiles: { connect: profile },
        ask: location?.ask.filter((x: string) => x != profile.id)
      }
    });
  }
  await prisma.discussion.delete({
    where: { id: discussion.id },
  });
  console.log('Discussion resolved');
}