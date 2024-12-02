import prisma from '../lib/prisma';
import { auth } from '../lib/auth';

export async function findLocations(query: {
  title?: string
}) {
  try {
    const locations = await prisma.location.findMany({
      where: {
        title: {
          contains: query.title,
          mode: 'insensitive'
        }
      },
      take: 20,
    });

    return { success: locations };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function createLocation(formData: {
  title: string,
  xCoordinate: string,
  yCoordinate: string,
  zoom: string,
  access: string,
  relations: string,
}) {
  try {
    const relations = JSON.parse(formData.relations);
    const location = await prisma.location.create({
      data: {
        title: formData.title,
        yCoordinate: formData.yCoordinate,
        xCoordinate: formData.xCoordinate,
        zoom: JSON.parse(formData.zoom),
        access: JSON.parse(formData.access),
        relations: {
          create: relations,
        }
      },
    });

    return { success: location };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function updateLocation(formData: {
  locationId: string,
  title: string,
  xCoordinate: string,
  yCoordinate: string,
  zoom: string,
  access: string,
  relations: string,
}) {
  try {
    const relations = JSON.parse(formData.relations);
    const check = await prisma.location.findUnique({
      where: {
        id: formData.locationId,
      },
      include: {
        relations: true,
      }
    });
    const existingRelationIds = check?.relations.map((rel: any) => rel.id);
    const newRelationIds = relations.map((rel: any) => rel.id);
    const relationsToDelete = existingRelationIds?.filter((id) => !newRelationIds.includes(id));
    await prisma.relation.deleteMany({
      where: {
        id: { in: relationsToDelete },
      },
    });
    const location = await prisma.location.update({
      where: {
        id: formData.locationId,
      },
      data: {
        title: formData.title,
        yCoordinate: formData.yCoordinate,
        xCoordinate: formData.xCoordinate,
        zoom: JSON.parse(formData.zoom),
        access: JSON.parse(formData.access),
        relations: {
          create: relations.filter((x: any) => !x.id),
        }
      },
    });

    return { success: location };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function getLocationById(params: {
  id?: string
}) {
  try {
    const location = await prisma.location.findUnique({
      where: {
        id: params?.id,
      },
      include: {
        profiles: true,
        relations: true,
      }
    });

    return { success: location };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function addLocation({
  profileId,
  locationId,
}: {
  profileId: string,
  locationId: string,
}) {
  try {
    const profile = await prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        locations: { connect: { id: locationId } },
      }
    });

    return { success: profile };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function removeLocation({
  profileId,
  locationId,
}: {
  profileId: string,
  locationId: string,
}) {
  try {
    const profile = await prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        locations: { disconnect: { id: locationId } },
      }
    });

    return { success: profile };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}