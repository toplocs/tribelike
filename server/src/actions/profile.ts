import prisma from '../lib/prisma';
import { auth } from '../lib/auth';

export async function findProfiles(query: {
  userId?: string,
}) {
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: query.userId,
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

export async function createProfile(formData: {
  authHeader: string,
  type: string,
  image: string,
  email: string,
}) {
  try {
    const session = await auth(formData.authHeader);
    const user = session?.user;
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        type: formData.type,
        image: formData.image || '/images/yannik.jpeg',
        email: formData.email,
      }
    });

    return { success: profile };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function changeProfile(formData: {
  authHeader: string,
  type: string,
  image: string,
  email: string,
}) {
  try {
    const session = await auth(formData.authHeader);
    const user = session?.user;
    const profile = await prisma.profile.create({
      data: {
        userId: user.id,
        type: formData.type,
        image: formData.image || '/images/yannik.jpeg',
        email: formData.email,
      }
    });

    return { success: profile };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}