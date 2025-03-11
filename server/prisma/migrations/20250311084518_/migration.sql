/*
  Warnings:

  - The primary key for the `Session` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `data` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `expiresAt` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Session` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Session` table. All the data in the column will be lost.
  - Added the required column `expire` to the `Session` table without a default value. This is not possible if the table is not empty.
  - Added the required column `sess` to the `Session` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "Session_sid_key";

-- AlterTable
ALTER TABLE "Session" DROP CONSTRAINT "Session_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "data",
DROP COLUMN "expiresAt",
DROP COLUMN "id",
DROP COLUMN "updatedAt",
ADD COLUMN     "expire" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "sess" JSON NOT NULL,
ADD CONSTRAINT "Session_pkey" PRIMARY KEY ("sid");
