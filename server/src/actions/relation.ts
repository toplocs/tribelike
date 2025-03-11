import { prisma } from '../lib/prisma';

export async function findRelations(query: {
  interestId?: string,
  locationId?: string,
}) {
  try {
    const relations = await prisma.relation.findMany({
      where: {
        ...(query.interestId && { interestId: query.interestId }),
        ...(query.locationId && { locationId: query.locationId }),
      },
      take: 20,
    });

    return { success: relations.map(x => x.data) };
  } catch (e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function addRelation(data: {
  key: string,
  data: string,
  type: string,
  interestId: string,
  locationId: string,
}) {
  try {
    const relation = await prisma.relation.create({
      data: data
    });

    return { success: relation };
  } catch (e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function removeRelation(data: {
  key: string,
  type: string,
  interestId: string,
  locationId: string,
}) {
  try {
    const relations = await prisma.relation.deleteMany({
      where: data
    });

    return { success: relations };
  } catch (e: any) {
    console.error(e);
    return { error: e.message };
  }
}
