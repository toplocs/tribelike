import { prisma } from '../lib/prisma';

export async function findPluginSettings(query: {
  key?: string,
  profileId?: string,
}) {
  try {
    const pluginSettings = await prisma.pluginSettings.findMany({
      where: {
        key: query.key,
        profileId: query.profileId,
      }
    });

    return { success: pluginSettings };
  } catch (e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function togglePluginActive(formData: {
  pluginSettingsId: string
  name: string,
  path: string,
  key: string,
  pluginId: string,
  profileId: string,
  active: string,
}) {
  try {
    const pluginSettings = await prisma.pluginSettings.upsert({
      where: {
        id: formData.pluginSettingsId || '',
      },
      update: {
        active: formData.active == 'true',
      },
      create: {
        name: formData.name,
        path: formData.path,
        key: formData.key,
        pluginId: formData.pluginId,
        profileId: formData.profileId,
        active: formData.active == 'true',
      }
    });

    return { success: pluginSettings };
  } catch (e: any) {
    console.error(e);
    return { error: e.message };
  }
}

export async function updatePluginSettings(formData: {
  pluginSettingsId: string,
  pluginId: string,
  profileId: string,
  settings: string,
}) {
  try {
    /*const pluginSettings = await prisma.pluginSettings.upsert({
      where: {
        id: formData.pluginSettingsId || '',
      },
      update: {
        settings: JSON.parse(formData.settings),
      },
      create: {
        pluginId: formData.pluginId,
        profileId: formData.profileId,
        settings: JSON.parse(formData.settings),
      }
    });

    return { success: pluginSettings };*/
  } catch (e: any) {
    console.error(e);
    return { error: e.message };
  }
}
