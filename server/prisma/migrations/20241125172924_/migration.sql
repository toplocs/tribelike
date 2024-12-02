/*
  Warnings:

  - The `allowsVotingTo` column on the `Interest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `childOf` column on the `Interest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `isA` column on the `Interest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `parentOf` column on the `Interest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `showsContentOf` column on the `Interest` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `allowsVotingTo` column on the `Location` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `childOf` column on the `Location` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `isA` column on the `Location` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `parentOf` column on the `Location` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `showsContentOf` column on the `Location` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Interest" DROP COLUMN "allowsVotingTo",
ADD COLUMN     "allowsVotingTo" JSONB[],
DROP COLUMN "childOf",
ADD COLUMN     "childOf" JSONB[],
DROP COLUMN "isA",
ADD COLUMN     "isA" JSONB[],
DROP COLUMN "parentOf",
ADD COLUMN     "parentOf" JSONB[],
DROP COLUMN "showsContentOf",
ADD COLUMN     "showsContentOf" JSONB[];

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "allowsVotingTo",
ADD COLUMN     "allowsVotingTo" JSONB[],
DROP COLUMN "childOf",
ADD COLUMN     "childOf" JSONB[],
DROP COLUMN "isA",
ADD COLUMN     "isA" JSONB[],
DROP COLUMN "parentOf",
ADD COLUMN     "parentOf" JSONB[],
DROP COLUMN "showsContentOf",
ADD COLUMN     "showsContentOf" JSONB[];

-- CreateTable
CREATE TABLE "Relation" (
    "id" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "locationId" TEXT,

    CONSTRAINT "Relation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
