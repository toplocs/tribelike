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
  parentId: string,
}) {
  try {
    const location = await prisma.location.create({
      data: {
        title: formData.title,
        yCoordinate: formData.yCoordinate,
        xCoordinate: formData.xCoordinate,
        zoom: Number(formData.zoom),
        ...(formData.parentId && { parentId: formData.parentId }),
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
  parentId: string,
}) {
  try {
    const location = await prisma.location.update({
      where: {
        id: formData?.locationId,
      },
      data: {
        title: formData.title,
        yCoordinate: formData.yCoordinate,
        xCoordinate: formData.xCoordinate,
        zoom: Number(formData.zoom),
        ...(formData.parentId && { parentId: formData.parentId }),
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
        parent: true,
        profiles: true,
        //plugins
        wikis: true,
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