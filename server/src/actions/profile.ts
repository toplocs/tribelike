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
        interests: {
          include: {
            parent: true,
          }
        }
      }
    });

    return { success: profiles };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function createProfile(
  formData: {
    authHeader: string,
    type: string,
    image: string,
    email: string,
  },
  authHeader?: string
) {
  try {
    const session = await auth(formData.authHeader);
    const user = session?.user;
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        type: formData.type,
        image: formData.image || '/images/default.jpeg',
        email: formData.email,
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
    email: string,
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
        email: formData.email,
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
      }
    });

    return { success: profile };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}