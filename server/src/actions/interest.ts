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
      include: {
        parent: true,
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
  parentId: string,
}) {
  try {
    const interest = await prisma.interest.create({
      data: {
        title: formData.title,
        ...(formData.parentId && { parentId: formData.parentId }),
      },
    });

    return { success: interest };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function updateInterest(formData: {
  interestId: string,
  title: string,
  parentId: string,
}) {
  try {
    const interest = await prisma.interest.update({
      where: {
        id: formData?.interestId,
      },
      data: {
        title: formData.title,
        ...(formData.parentId && { parentId: formData.parentId }),
      },
    });

    return { success: interest };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function getInterestById(params: {
  id?: string
}) {
  try {
    const interest = await prisma.interest.findUnique({
      where: {
        id: params?.id,
      },
      include: {
        parent: true,
        profiles: true,
        //plugins
        wikis: true,
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
  profileId: string,
  interestId: string,
}) {
  try {
    const profile = await prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        interests: { connect: { id: interestId } },
      },
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
  profileId: string,
  interestId: string,
}) {
  try {
    const profile = await prisma.profile.update({
      where: {
        id: profileId,
      },
      data: {
        interests: { disconnect: { id: interestId } },
      },
    });

    return { success: profile };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}