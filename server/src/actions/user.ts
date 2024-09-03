import prisma from '../lib/prisma';
import { auth, login, logout } from '../lib/auth';
import { createProfile } from './profile';

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
    await createProfile(user?.id, formData);

    return { success: user };
  } catch(e: any) {
    console.error(e);
    if (e.meta.target.includes('username')) return { error: 'Your username is already taken' };
    return { error: e.message };
  }
}