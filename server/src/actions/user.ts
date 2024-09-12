import prisma from '../lib/prisma';
import { auth, login, logout } from '../lib/auth';

export async function createUser(formData: {
  username: string,
  email: string,
  password: string,
  type: string,
  image: string,
}) {
  try {
    const user = await prisma.user.create({
      data: {
        username: formData.username,
        email: formData.email,
        password: formData.password
      }
    });

    return { success: user };
  } catch(e: any) {
    console.error(e);
    if (e.meta.target.includes('username')) return { error: 'Your username is already taken' };
    return { error: e.message };
  }
}

export async function getUserById(params: {
  id?: string
}) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: params?.id,
      },
      include: {
        locations: true,
      }
    });

    return { success: user };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}