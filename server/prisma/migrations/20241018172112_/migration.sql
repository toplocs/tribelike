/*
  Warnings:

  - You are about to drop the column `locationId` on the `Wiki` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Wiki" DROP CONSTRAINT "Wiki_locationId_fkey";

-- AlterTable
ALTER TABLE "Wiki" DROP COLUMN "locationId";

-- CreateTable
CREATE TABLE "_WikiLocations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_WikiLocations_AB_unique" ON "_WikiLocations"("A", "B");

-- CreateIndex
CREATE INDEX "_WikiLocations_B_index" ON "_WikiLocations"("B");

-- AddForeignKey
ALTER TABLE "_WikiLocations" ADD CONSTRAINT "_WikiLocations_A_fkey" FOREIGN KEY ("A") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WikiLocations" ADD CONSTRAINT "_WikiLocations_B_fkey" FOREIGN KEY ("B") REFERENCES "Wiki"("id") ON DELETE CASCADE ON UPDATE CASCADE;
