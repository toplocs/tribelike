// import CryptoJS from 'crypto-js';
// import prisma from '../lib/prisma';
// import { auth } from '../lib/auth';
// import profiles from '../lib/profiles';

// export async function getUsers(query: {
//   username?: string
// }) {
//   try {
//     const users = await prisma.user.findMany({
//       where: {
//         username: query?.username,
//       },
//       take: 20,
//     });

//     return { success: users };
//   } catch(e: any) {
//     console.error(e);
//     return { error: e.message };
//   }
// }

// export async function createUser(formData: {
//   username: string,
//   email: string,
// }) {
//   try {
//     if (formData.username.length < 3) throw new Error('Your username is too short');
//     if (formData.email.length < 3) throw new Error('Your email is too short');
//     const email = formData.email.trim().toLowerCase();
//     const hash = CryptoJS.SHA256(email).toString(CryptoJS.enc.Hex);
//     const image = `https://gravatar.com/avatar/${hash}`;
//     const user = await prisma.user.create({
//       data: {
//         username: formData.username,
//         email: formData.email,
//       }
//     });
//     for (let profile of profiles) {
//       await prisma.profile.create({
//         data: {
//           userId: user.id,
//           username: formData.username,
//           email: formData.email,
//           image: image,
//           ...profile,
//         }
//       });
//     }

//     return { success: user };
//   } catch(e: any) {
//     console.error(e);
//     if (e.meta?.target.includes('username')) return { error: 'Your username is already taken' };
//     if (e.meta?.target.includes('username')) return { error: 'Your email is already taken' };
//     return { error: e.message };
//   }
// }

// export async function updateUser(
//   formData: {
//     image: string,
//     username: string,
//     email: string,
//     password: string,
//     password2: string,
//   },
//   authHeader?: string,
// ) {
//   try {
//     const session = await auth(authHeader);
//     const user = session?.user;
//     const result = await prisma.user.update({
//       where: {
//         id: user?.id,
//       },
//       data: {
//         image: formData.image || '/images/default.jpeg',
//         username: formData.username,
//         email: formData.email,
//       },
//     });

//     return { success: result };
//   } catch(e: any) {
//     console.error(e);
//     return { error: e.message };
//   }
// }

//     return { success: user };
//   } catch(e: any) {
//     console.error(e);
//     return { error: e.message };
//   }
// }