import prisma from '../lib/prisma';
import { auth, login, logout } from '../lib/auth';

export async function getUsers(query: {
  username?: string
}) {
  try {
    const users = await prisma.user.findMany({
      where: {
        username: query?.username,
      },
      take: 20,
    });

    return { success: users };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

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

export async function updateUser(
  formData: {
    image: string,
    username: string,
    email: string,
    password: string,
    password2: string,
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
        image: formData.image || '/images/default.jpeg',
        username: formData.username,
        email: formData.email,
      },
    });

    return { success: result };
  } catch(e: any) {
    console.error(e);
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
    });

    return { success: user };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}