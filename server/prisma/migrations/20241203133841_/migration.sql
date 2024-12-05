/*
  Warnings:

  - You are about to drop the `_ActivityInterests` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_ActivityInterests" DROP CONSTRAINT "_ActivityInterests_A_fkey";

-- DropForeignKey
ALTER TABLE "_ActivityInterests" DROP CONSTRAINT "_ActivityInterests_B_fkey";

-- AlterTable
ALTER TABLE "Activity" ADD COLUMN     "interestId" TEXT;

-- DropTable
DROP TABLE "_ActivityInterests";

-- AddForeignKey
ALTER TABLE "Activity" ADD CONSTRAINT "Activity_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
