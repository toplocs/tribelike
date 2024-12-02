/*
  Warnings:

  - You are about to drop the column `allowsVotingTo` on the `Interest` table. All the data in the column will be lost.
  - You are about to drop the column `childOf` on the `Interest` table. All the data in the column will be lost.
  - You are about to drop the column `isA` on the `Interest` table. All the data in the column will be lost.
  - You are about to drop the column `parentOf` on the `Interest` table. All the data in the column will be lost.
  - You are about to drop the column `showsContentOf` on the `Interest` table. All the data in the column will be lost.
  - You are about to drop the column `allowsVotingTo` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `childOf` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `isA` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `parentOf` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `showsContentOf` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the column `profileId` on the `Relation` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Relation" DROP CONSTRAINT "Relation_profileId_fkey";

-- AlterTable
ALTER TABLE "Interest" DROP COLUMN "allowsVotingTo",
DROP COLUMN "childOf",
DROP COLUMN "isA",
DROP COLUMN "parentOf",
DROP COLUMN "showsContentOf";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "allowsVotingTo",
DROP COLUMN "childOf",
DROP COLUMN "isA",
DROP COLUMN "parentOf",
DROP COLUMN "showsContentOf";

-- AlterTable
ALTER TABLE "Relation" DROP COLUMN "profileId";
