import prisma from '../lib/prisma';

export async function findInterestRelations(
  id: string,
) {
  try {
    const relations = await prisma.interestInterest.findMany({
      where: { interestId: id },
      select: {
        key: true,
        OtherInterest: true,
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
    const relations = await prisma.interestLocation.findMany({
      where: { interestId: id },
      select: {
        key: true,
        Location: true,
      },
      take: 50,
    });

    return { success: relations };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}


export async function createInterestRelation(
  id: string,
  body: {
    key: string,
    otherInterestId: string,
  }
) {
  try {
    const relation = await prisma.interestInterest.create({
      data: {
        key: body.key,
        interestId: id,
        otherInterestId: body.otherInterestId,
      },
      select: {
        key: true,
        OtherInterest: true,
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
    locationId: string,
  }
) {
  try {
    const relation = await prisma.interestLocation.create({
      data: {
        key: body.key,
        interestId: id,
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