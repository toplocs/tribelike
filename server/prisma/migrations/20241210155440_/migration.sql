/*
  Warnings:

  - Made the column `profileId` on table `Invite` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Invite" ALTER COLUMN "profileId" SET NOT NULL;
