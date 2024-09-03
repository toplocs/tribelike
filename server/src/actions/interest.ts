import prisma from '../lib/prisma';

export async function findInterests(query: {
  title?: string
}) {
  try {
    const interests = await prisma.interest.findMany({
      where: {
        title: {
          contains: query.title,
          mode: 'insensitive'
        }
      },
      take: 20,
    });

    return { success: interests };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function createInterest(formData: {
  title: string,
}) {
  try {
    const interest = await prisma.interest.create({
      data: {
        title: formData.title
      }
    });

    return { success: interest };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function addInterest({
  profileId,
  interestId,
}: {
  profileId: number,
  interestId: number,
}) {
  try {
    const profile = await prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        interests: { connect: { id: interestId } },
      }
    });

    return { success: profile };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function removeInterest({
  profileId,
  interestId,
}: {
  profileId: number,
  interestId: number,
}) {
  try {
    const profile = await prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        interests: { disconnect: { id: interestId } },
      }
    });

    return { success: profile };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}