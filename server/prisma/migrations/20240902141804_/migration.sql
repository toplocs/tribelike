/*
  Warnings:

  - You are about to drop the column `name` on the `Interest` table. All the data in the column will be lost.
  - Added the required column `title` to the `Interest` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Interest_name_key";

-- AlterTable
ALTER TABLE "Interest" DROP COLUMN "name",
ADD COLUMN     "title" TEXT NOT NULL;
