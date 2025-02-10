import prisma from '../lib/prisma';

export async function findProfileLocations(
  id: string,
) {
  try {
    const relations = await prisma.profileLocation.findMany({
      where: { profileId: id },
      select: {
        id: true,
        key: true,
        Location: true,
      },
      take: 20,
      orderBy: { createdAt: 'desc' }
    });

    return { success: relations };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function createLocationRelation(
  id: string,
  body: {
    key: string,
    locationId: string,
  }
) {
  try {
    const relation = await prisma.profileLocation.create({
      data: {
        key: body.key,
        profileId: id,
        locationId: body.locationId,
      },
      select: {
        key: true,
        Location: true,
      },
    });

    return { success: relation };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}
