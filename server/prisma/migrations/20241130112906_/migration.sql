/*
  Warnings:

  - Added the required column `type` to the `Relation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Relation" ADD COLUMN     "type" TEXT NOT NULL;
