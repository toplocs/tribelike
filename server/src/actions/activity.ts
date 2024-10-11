import prisma from '../lib/prisma';

export async function findActivities(query: {
  profileId?: string,
  interestId?: string,
  locationId?: string,
}) {
  try {
    const activities = await prisma.activity.findMany({
      where: {
        ...(query.profileId && { profileId: query.profileId }),
        ...(query.interestId && { interestId: query.interestId }),
        ...(query.locationId && { locationId: query.locationId }),
      },
      include: {
        profile: true,
        location: true,
        interests: true,
      },
      take: 20,
    });

    return { success: activities };
  } catch (e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function createActivity(props: {
  profileId: string,
  text: string,
  href?: string,
  status?: any,
  type?: any,
  locationId?: string,
  interests?: string[],
}) {
  try {
    const activity = await prisma.activity.create({
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
        }: undefined,
      },
    });

    return activity;
  } catch (e: any) {
    console.error(e);
    return { error: e.message };
  }
}
