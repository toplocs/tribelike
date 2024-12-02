/*
  Warnings:

  - Added the required column `key` to the `PluginSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `PluginSettings` table without a default value. This is not possible if the table is not empty.
  - Added the required column `path` to the `PluginSettings` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "PluginSettings" ADD COLUMN     "key" TEXT NOT NULL,
ADD COLUMN     "name" TEXT NOT NULL,
ADD COLUMN     "path" TEXT NOT NULL;
