/*
  Warnings:

  - You are about to drop the column `userId` on the `Location` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Location" DROP CONSTRAINT "Location_userId_fkey";

-- AlterTable
ALTER TABLE "Location" DROP COLUMN "userId";

-- CreateTable
CREATE TABLE "_LocationUsers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_LocationUsers_AB_unique" ON "_LocationUsers"("A", "B");

-- CreateIndex
CREATE INDEX "_LocationUsers_B_index" ON "_LocationUsers"("B");

-- AddForeignKey
ALTER TABLE "_LocationUsers" ADD CONSTRAINT "_LocationUsers_A_fkey" FOREIGN KEY ("A") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationUsers" ADD CONSTRAINT "_LocationUsers_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
