/*
  Warnings:

  - You are about to drop the column `profileId` on the `Settings` table. All the data in the column will be lost.
  - You are about to drop the `_LocationUsers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Settings" DROP CONSTRAINT "Settings_profileId_fkey";

-- DropForeignKey
ALTER TABLE "_LocationUsers" DROP CONSTRAINT "_LocationUsers_A_fkey";

-- DropForeignKey
ALTER TABLE "_LocationUsers" DROP CONSTRAINT "_LocationUsers_B_fkey";

-- AlterTable
ALTER TABLE "Settings" DROP COLUMN "profileId";

-- DropTable
DROP TABLE "_LocationUsers";

-- CreateTable
CREATE TABLE "_ProfileLocations" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ProfileLocations_AB_unique" ON "_ProfileLocations"("A", "B");

-- CreateIndex
CREATE INDEX "_ProfileLocations_B_index" ON "_ProfileLocations"("B");

-- AddForeignKey
ALTER TABLE "_ProfileLocations" ADD CONSTRAINT "_ProfileLocations_A_fkey" FOREIGN KEY ("A") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ProfileLocations" ADD CONSTRAINT "_ProfileLocations_B_fkey" FOREIGN KEY ("B") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;
