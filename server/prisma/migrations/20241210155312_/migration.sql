/*
  Warnings:

  - You are about to drop the column `userId` on the `Invite` table. All the data in the column will be lost.
  - You are about to drop the column `inviteId` on the `User` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_inviteId_fkey";

-- DropIndex
DROP INDEX "Invite_userId_key";

-- AlterTable
ALTER TABLE "Invite" DROP COLUMN "userId";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "inviteId";
