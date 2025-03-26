/*
  Warnings:

  - Made the column `userId` on table `Profile` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Profile" ALTER COLUMN "image" DROP NOT NULL,
ALTER COLUMN "userId" SET NOT NULL;
