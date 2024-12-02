/*
  Warnings:

  - You are about to drop the column `parentId` on the `Interest` table. All the data in the column will be lost.
  - You are about to drop the column `parentId` on the `Location` table. All the data in the column will be lost.
  - You are about to drop the `_SameInterests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Interest" DROP CONSTRAINT "Interest_parentId_fkey";

-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_parentId_fkey";

-- DropForeignKey
ALTER TABLE "_SameInterests" DROP CONSTRAINT "_SameInterests_A_fkey";

-- DropForeignKey
ALTER TABLE "_SameInterests" DROP CONSTRAINT "_SameInterests_B_fkey";

-- AlterTable
ALTER TABLE "Interest" DROP COLUMN "parentId",
ADD COLUMN     "allowsVotingTo" TEXT[],
ADD COLUMN     "childOf" TEXT[],
ADD COLUMN     "isA" TEXT[],
ADD COLUMN     "parentOf" TEXT[],
ADD COLUMN     "showsContentOf" TEXT[];

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "parentId",
ADD COLUMN     "allowsVotingTo" TEXT[],
ADD COLUMN     "childOf" TEXT[],
ADD COLUMN     "isA" TEXT[],
ADD COLUMN     "parentOf" TEXT[],
ADD COLUMN     "showsContentOf" TEXT[];

-- DropTable
DROP TABLE "_SameInterests";
