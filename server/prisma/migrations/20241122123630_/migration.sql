/*
  Warnings:

  - Added the required column `pluginId` to the `PluginSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PluginSettings" ADD COLUMN     "pluginId" TEXT NOT NULL;
