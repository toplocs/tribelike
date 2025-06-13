"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findPluginSettings = findPluginSettings;
exports.togglePluginActive = togglePluginActive;
exports.updatePluginSettings = updatePluginSettings;
const prisma_1 = __importDefault(require("../lib/prisma"));
async function findPluginSettings(query) {
    try {
        const pluginSettings = await prisma_1.default.pluginSettings.findMany({
            where: {
                key: query.key,
                profileId: query.profileId,
            }
        });
        return { success: pluginSettings };
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function togglePluginActive(formData) {
    try {
        const pluginSettings = await prisma_1.default.pluginSettings.upsert({
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
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
async function updatePluginSettings(formData) {
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
    }
    catch (e) {
        console.error(e);
        return { error: e.message };
    }
}
