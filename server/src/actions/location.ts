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
  parentId: string,
}) {
  try {
    const location = await prisma.location.create({
      data: {
        title: formData.title,
        yCoordinate: formData.yCoordinate,
        xCoordinate: formData.xCoordinate,
        ...(formData.parentId && { parentId: formData.parentId }),
      },
    });
    console.log(location);

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
      }
    });

    return { success: location };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function addLocation(
  body: {
    locationId: string,
  },
  authHeader?: string,
) {
  try {
    const session = await auth(authHeader);
    const user = session?.user;
    const result = await prisma.user.update({
      where: {
        id: user?.id,
      },
      data: {
        locations: { connect: { id: body.locationId } },
      }
    });

    return { success: result };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}