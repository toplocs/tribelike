import prisma from '../lib/prisma';

export async function findInterestRelations(
  id: string,
) {
  try {
    const relations = await prisma.interestLocation.findMany({
      where: { locationId: id },
      select: {
        id: true,
        key: true,
        Interest: true,
      },
      take: 50,
    });

    return { success: relations };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function findLocationRelations(
  id: string,
) {
  try {
    const relations = await prisma.locationLocation.findMany({
      where: { locationId: id },
      select: {
        id: true,
        key: true,
        OtherLocation: true,
      },
      take: 50,
    });

    return { success: relations };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function createProfileRelation(
  id: string,
  body: {
    key: string,
    profileId: string,
  }
) {
  try {
    const relation = await prisma.profileLocation.create({
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
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function createInterestRelation(
  id: string,
  body: {
    key: string,
    interestId: string,
  }
) {
  try {
    const relation = await prisma.interestLocation.create({
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
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function createLocationRelation(
  id: string,
  body: {
    key: string,
    otherLocationId: string,
  }
) {
  try {
    const relation = await prisma.locationLocation.create({
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
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function removeInterestRelation(id: string) {
  try {
    await prisma.interestLocation.delete({
      where: { id: id }
    });

    return { success: true };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function removeLocationRelation(id: string) {
  try {
    await prisma.locationLocation.delete({
      where: { id: id }
    });

    return { success: true };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}