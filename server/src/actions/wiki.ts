import prisma from '../lib/prisma';
import { auth } from '../lib/auth';

export async function findWikis(query: {
  title?: string,
}) {
  try {
    const wikis = await prisma.wiki.findMany({
      where: {
        title: {
          contains: query.title,
          mode: 'insensitive'
        }
      },
      take: 20,
    });

    return { success: wikis };
  } catch (e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function createWiki(
  formData: {
    title: string,
    content: string,
    locations: any,
    interests: any,
  },
  authHeader?:string,
) {
  try {
    const session = await auth(authHeader);
    const user = session?.user;
    const wiki = await prisma.wiki.create({
      data: {
        title: formData.title,
        content: formData.content,
        locations: {
          connect: JSON.parse(formData.locations),
        },
        interests: {
          connect: JSON.parse(formData.interests),
        }
      },
    });

    return { success: wiki };
  } catch (e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function updateWiki(
  formData: {
    wikiId: string,
    content: string,
  },
  authHeader?: string,
) {
  try {
    const session = await auth(authHeader);
    const user = session?.user;
    const wiki = await prisma.wiki.update({
      where: {
        id: formData.wikiId,
      },
      data: {
        content: formData.content,
      },
    });

    return { success: wiki };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function getWikiById(params: {
  id?: string
}) {
  try {
    const wiki = await prisma.wiki.findUnique({
      where: {
        id: params?.id,
      },
      include: {
        interests: true,
        locations: true,
      }
    });

    return { success: wiki };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}