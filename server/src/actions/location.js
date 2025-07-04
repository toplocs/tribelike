"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLocations = findLocations;
exports.createLocation = createLocation;
exports.updateLocation = updateLocation;
exports.getLocationById = getLocationById;
exports.getLocationByCoords = getLocationByCoords;
exports.getLocationByBounds = getLocationByBounds;
exports.updateCurrentLocation = updateCurrentLocation;
exports.addLocation = addLocation;
exports.removeLocation = removeLocation;
exports.askAccess = askAccess;
exports.addLink = addLink;
exports.getProfileLocations = getProfileLocations;
const prisma_1 = __importDefault(require("../lib/prisma"));
async function findLocations(query) {
    try {
        const locations = await prisma_1.default.location.findMany({
            where: {
                title: {
                    contains: query.title,
                    mode: 'insensitive'
                }
            },
            take: 20,
        });
        return { success: locations };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function createLocation(formData) {
    try {
        const location = await prisma_1.default.location.create({
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
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function updateLocation(formData) {
    try {
        const relations = JSON.parse(formData.relations);
        const check = await prisma_1.default.location.findUnique({
            where: {
                id: formData.locationId,
            },
            include: {
                relations: true,
            }
        });
        const existingRelationIds = check?.relations.map((rel) => rel.id);
        const newRelationIds = relations.map((rel) => rel.id);
        const relationsToDelete = existingRelationIds?.filter((id) => !newRelationIds.includes(id));
        await prisma_1.default.relation.deleteMany({
            where: {
                id: { in: relationsToDelete },
            },
        });
        const location = await prisma_1.default.location.update({
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
                    create: relations.filter((x) => !x.id),
                }
            },
        });
        return { success: location };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function getLocationById(params) {
    try {
        const location = await prisma_1.default.location.findUnique({
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
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function getLocationByCoords(query) {
    const { lat, lng } = query;
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lng);
    const radiusInKm = 50;
    const radiusInDegrees = radiusInKm / 111.32;
    if (isNaN(latitude) || isNaN(longitude)) {
        return { error: 'Invalid latitude or longitude' };
    }
    try {
        const locations = await prisma_1.default.location.findMany({
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
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function getLocationByBounds(query) {
    try {
        const northeast = JSON.parse(query.northeast);
        const southwest = JSON.parse(query.southwest);
        const locations = await prisma_1.default.location.findMany({
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
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function updateCurrentLocation({ profileId, lat, lng }) {
    try {
        const locations = await prisma_1.default.$queryRaw `
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
        const location = locations[0];
        if (location) {
            await prisma_1.default.profileLocation.updateMany({
                where: {
                    key: 'current',
                    profileId: profileId,
                },
                data: { key: 'past' }
            });
            const current = await prisma_1.default.profileLocation.create({
                data: {
                    key: 'current',
                    profileId: profileId,
                    locationId: location.id,
                }
            });
        }
        return { success: locations[0] };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function addLocation({ profileId, locationId, }) {
    try {
        const profile = await prisma_1.default.profile.update({
            where: {
                id: profileId,
            },
            data: {
                locations: { connect: { id: locationId } },
            }
        });
        return { success: profile };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function removeLocation({ profileId, locationId, }) {
    try {
        const profile = await prisma_1.default.profile.update({
            where: {
                id: profileId,
            },
            data: {
                locations: { disconnect: { id: locationId } },
            }
        });
        return { success: profile };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function askAccess({ profileId, locationId, }) {
    const location = await prisma_1.default.location.update({
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
async function addLink(formData) {
    try {
        if (formData.link.length < 3)
            throw new Error('Your link is too short');
        const location = await prisma_1.default.location.update({
            where: {
                id: formData?.id,
            },
            data: {
                links: { push: formData.link }
            }
        });
        return { success: location };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function getProfileLocations(params) {
    try {
        const locationProfiles = await prisma_1.default.profileLocation.findMany({
            where: {
                locationId: params?.id,
            },
            include: {
                Profile: true,
            },
            take: 20,
            orderBy: { createdAt: 'desc' },
        });
        console.log({ locationProfiles: locationProfiles.map((x) => x.Profile) });
        // TODO Merge better
        const userIds = locationProfiles.map((profileLocation) => {
            return profileLocation.Profile.userId;
        });
        const uniqueUserIds = Array.from(new Set(userIds));
        const mergedProfiles = uniqueUserIds.map((userId) => {
            return locationProfiles.find((profileLocation) => profileLocation.Profile.userId === userId);
        });
        const filteredProfiles = mergedProfiles.filter((profile) => profile !== undefined);
        console.log({ mergedProfiles });
        return { success: mergedProfiles };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
