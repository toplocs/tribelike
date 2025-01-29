import { Location } from '@prisma/client';

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
    const location = await prisma.location.create({
      data: {
        title: formData.title,
        yCoordinate: formData.yCoordinate,
        xCoordinate: formData.xCoordinate,
        latitude: parseFloat(formData.xCoordinate),
        longitude: parseFloat(formData.yCoordinate),
        zoom: JSON.parse(formData.zoom),
        access: JSON.parse(formData.access),
      },
    });
    if (formData.relations) {
      //create relation
    }

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
        discussions: true,
      }
    });

    return { success: location };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function getLocationByCoords(query: {
  lat: string,
  lng: string,
}) {
  const { lat, lng } = query;
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);
  const radiusInKm = 50;
  const radiusInDegrees = radiusInKm/111.32;

  if (isNaN(latitude) || isNaN(longitude)) {
    return { error: 'Invalid latitude or longitude' };
  }
  try {
    const locations = await prisma.location.findMany({
      where: {
        latitude: {
          gte: latitude - radiusInDegrees,
          lte: latitude + radiusInDegrees,
        },
        longitude: {
          gte: longitude - radiusInDegrees,
          lte: longitude + radiusInDegrees,
        },
      },
    });

    return { success: locations };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function getLocationByBounds(query: {
  northeast: string,
  southwest: string,
}) {
  try {
    const northeast = JSON.parse(query.northeast);
    const southwest = JSON.parse(query.southwest);
    const locations = await prisma.location.findMany({
      where: {
        latitude: {
          gte: southwest.lat,
          lte: northeast.lat,
        },
        longitude: {
          gte: southwest.lng,
          lte: northeast.lng,
        },
      },
      take: 20,
    });

    return { success: locations };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function updateCurrentLocation({
  profileId,
  lat,
  lng
}: {
  profileId: string,
  lat: number,
  lng: number
}) {
  try {
    const locations = await prisma.$queryRaw<Location[]>`
      SELECT 
        id, 
        title, 
        latitude, 
        longitude,
        ( 6371 * acos(
          cos(radians(${lat})) * cos(radians(latitude)) * cos(radians(longitude) - radians(${lng})) 
          + sin(radians(${lat})) * sin(radians(latitude))
        )) AS distance
      FROM "Location"
      ORDER BY distance ASC
      LIMIT 1;
    `;
    if (locations[0]) {
      await prisma.profileLocation.updateMany({
        where: {
          key: 'current',
          profileId: profileId,
        },
        data: { key: 'past' }
      });
      const current = await prisma.profileLocation.create({
        data: {
          key: 'current',
          profileId: profileId,
          locationId: locations[0].id,
        }
      });
    }

    return { success: locations[0] };
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

export async function askAccess({
  profileId,
  locationId,
}: {
  profileId: string,
  locationId: string,
}) {
  const location = await prisma.location.update({
    where: {
      id: locationId,
    },
    data: {
      ask: { push: profileId },
    },
    include: {
      profiles: true,
    }
  });

  return {
    title: location.title,
    limit: location.profiles.length,
  };
}

export async function addLink(formData: {
  id: string,
  link: string,
}) {
  try {
    if (formData.link.length < 3) throw new Error('Your link is too short');
    const location = await prisma.location.update({
      where: {
        id: formData?.id,
      },
      data: {
        links: { push: formData.link }
      }
    });

    return { success: location };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function getProfileLocations(params: {
  id?: string
}) {
  try {
    const locationProfiles = await prisma.profileLocation.findMany({
      where: {
        locationId: params?.id,
      },
      include: {
        Profile: true,
      },
      take: 20,
      orderBy: { createdAt: 'desc' },
    });

    return { success: locationProfiles };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}