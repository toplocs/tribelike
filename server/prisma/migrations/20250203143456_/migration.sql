/*
  Warnings:

  - The primary key for the `InterestInterest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `InterestLocation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LocationLocation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProfileInterest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProfileLocation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProfileProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `InterestInterest` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `InterestLocation` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `LocationLocation` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `ProfileInterest` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `ProfileLocation` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.
  - The required column `id` was added to the `ProfileProfile` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "InterestInterest" DROP CONSTRAINT "InterestInterest_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "InterestInterest_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "InterestLocation" DROP CONSTRAINT "InterestLocation_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "InterestLocation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "LocationLocation" DROP CONSTRAINT "LocationLocation_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "LocationLocation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProfileInterest" DROP CONSTRAINT "ProfileInterest_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "ProfileInterest_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProfileLocation" DROP CONSTRAINT "ProfileLocation_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "ProfileLocation_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProfileProfile" DROP CONSTRAINT "ProfileProfile_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ADD CONSTRAINT "ProfileProfile_pkey" PRIMARY KEY ("id");
