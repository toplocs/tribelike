import prisma from '../lib/prisma';
import { auth, login, logout } from '../lib/auth';

export async function findProfiles(query: {
  userId?: string,
}) {
  try {
    const profiles = await prisma.profile.findMany({
      where: {
        userId: query.userId,
      },
      include: {
        interests: true,
      }
    });

    return { success: profiles };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function createProfile(userId: string, formData: {
  image: string,
  type: string,
}) {
  try {
    const profile = await prisma.profile.create({
      data: {
        userId: userId,
        type: formData.type,
        image: formData.image || '/images/yannik.jpeg',
      }
    });

    return { success: profile };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}