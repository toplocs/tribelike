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
  access: string,
  relations: string,
}) {
  try {
    const relations = JSON.parse(formData.relations);
    const interest = await prisma.interest.create({
      data: {
        title: formData.title,
        access: JSON.parse(formData.access),
        relations: {
          create: relations,
        }
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
  access: string,
  relations: string,
}) {
  try {
    const relations = JSON.parse(formData.relations);
    const check = await prisma.interest.findUnique({
      where: {
        id: formData.interestId,
      },
      include: {
        relations: true,
      }
    });
    const existingRelationIds = check?.relations.map((rel: any) => rel.id);
    const newRelationIds = relations.map((rel: any) => rel.id);
    const relationsToDelete = existingRelationIds?.filter((id) => !newRelationIds.includes(id));
    await prisma.relation.deleteMany({
      where: {
        id: { in: relationsToDelete },
      },
    });
    const interest = await prisma.interest.update({
      where: {
        id: formData.interestId,
      },
      data: {
        title: formData.title,
        access: JSON.parse(formData.access),
        relations: {
          create: relations.filter((x: any) => !x.id),
        }
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
        profiles: true,
        relations: true,
        discussions: true,
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

export async function askAccess({
  profileId,
  interestId,
}: {
  profileId: string,
  interestId: string,
}) {
  const interest = await prisma.interest.update({
    where: {
      id: interestId,
    },
    data: {
      ask: { push: profileId },
    },
    include: {
      profiles: true,
    }
  });

  return {
    title: interest.title,
    limit: interest.profiles.length,
  };
}

export async function addLink(formData: {
  id: string,
  link: string,
}) {
  try {
    if (formData.link.length < 3) throw new Error('Your link is too short');
    const interest = await prisma.interest.update({
      where: {
        id: formData?.id,
      },
      data: {
        links: { push: formData.link }
      }
    });

    return { success: interest };
  } catch(e: any) {
    console.error(e);
    return { error: e.message };
  }
}