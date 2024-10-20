/*
  Warnings:

  - The primary key for the `Wiki` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Wiki` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `B` on the `_WikiInterests` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `B` on the `_WikiLocations` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "_WikiInterests" DROP CONSTRAINT "_WikiInterests_B_fkey";

-- DropForeignKey
ALTER TABLE "_WikiLocations" DROP CONSTRAINT "_WikiLocations_B_fkey";

-- AlterTable
ALTER TABLE "Wiki" DROP CONSTRAINT "Wiki_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Wiki_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "_WikiInterests" DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "_WikiLocations" DROP COLUMN "B",
ADD COLUMN     "B" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "_WikiInterests_AB_unique" ON "_WikiInterests"("A", "B");

-- CreateIndex
CREATE INDEX "_WikiInterests_B_index" ON "_WikiInterests"("B");

-- CreateIndex
CREATE UNIQUE INDEX "_WikiLocations_AB_unique" ON "_WikiLocations"("A", "B");

-- CreateIndex
CREATE INDEX "_WikiLocations_B_index" ON "_WikiLocations"("B");

-- AddForeignKey
ALTER TABLE "_WikiInterests" ADD CONSTRAINT "_WikiInterests_B_fkey" FOREIGN KEY ("B") REFERENCES "Wiki"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WikiLocations" ADD CONSTRAINT "_WikiLocations_B_fkey" FOREIGN KEY ("B") REFERENCES "Wiki"("id") ON DELETE CASCADE ON UPDATE CASCADE;
