import prisma from '../lib/prisma';
import { auth } from '../lib/auth';

export async function getProfiles(authHeader?: string) {
  try {
    const session = await auth(authHeader);
    const user = session?.user;
    const profiles = await prisma.profile.findMany({
      where: {
        userId: user.id,
      },
      include: {
        interests: true,
        locations: true,
      },
    });

    return { success: profiles };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function createProfile(
  formData: {
    type: string,
    image: string,
    username: string,
    email: string,
    about: string,
  },
  authHeader?: string
) {
  const session = await auth(authHeader);
  const user = session?.user;
  try {
    const profile = await prisma.profile.create({
      data: {
        userId: user?.id,
        type: formData.type,
        image: formData.image || '/images/default.jpeg',
        username: formData.username,
        email: formData.email,
        about: formData.about,
      }
    });

    return { success: profile };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function updateProfile(
  formData: {
    profileId: string,
    type: string,
    image: string,
    username: string,
    email: string,
    about: string,
  },
  authHeader?: string,
) {
  try {
    const session = await auth(authHeader);
    const user = session?.user;
    const profile = await prisma.profile.update({
      where: {
        id: formData.profileId,
      },
      data: {
        type: formData.type,
        image: formData.image || '/images/default.jpeg',
        username: formData.username,
        email: formData.email,
        about: formData.about,
      },
      include: {
        interests: true,
      }
    });

    return { success: profile };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function deleteProfile(
  query: { profileId?: string },
  authHeader?: string,
) {
  try {
    const session = await auth(authHeader);
    const user = session?.user;
    await prisma.profile.delete({
      where: {
        id: query.profileId,
      }
    });

    return { success: 'Successfully deleted' };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function getAllProfiles() {
  try {
    const profiles = await prisma.profile.findMany({
      take: 20,
    });

    return { success: profiles };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function getProfileById(params: {
  id?: string
}) {
  try {
    const profile = await prisma.profile.findUnique({
      where: {
        id: params?.id,
      },
      include: {
        interests: true,
        locations: true,
      }
    });

    return { success: profile };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}