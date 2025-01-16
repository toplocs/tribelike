/*
  Warnings:

  - The primary key for the `InterestInterest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `InterestLocation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `LocationLocation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProfileInterest` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProfileLocation` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `ProfileProfile` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "InterestInterest" DROP CONSTRAINT "InterestInterest_pkey",
ADD CONSTRAINT "InterestInterest_pkey" PRIMARY KEY ("key", "createdAt");

-- AlterTable
ALTER TABLE "InterestLocation" DROP CONSTRAINT "InterestLocation_pkey",
ADD CONSTRAINT "InterestLocation_pkey" PRIMARY KEY ("key", "createdAt");

-- AlterTable
ALTER TABLE "LocationLocation" DROP CONSTRAINT "LocationLocation_pkey",
ADD CONSTRAINT "LocationLocation_pkey" PRIMARY KEY ("key", "createdAt");

-- AlterTable
ALTER TABLE "ProfileInterest" DROP CONSTRAINT "ProfileInterest_pkey",
ADD CONSTRAINT "ProfileInterest_pkey" PRIMARY KEY ("key", "createdAt");

-- AlterTable
ALTER TABLE "ProfileLocation" DROP CONSTRAINT "ProfileLocation_pkey",
ADD CONSTRAINT "ProfileLocation_pkey" PRIMARY KEY ("key", "createdAt");

-- AlterTable
ALTER TABLE "ProfileProfile" DROP CONSTRAINT "ProfileProfile_pkey",
ADD CONSTRAINT "ProfileProfile_pkey" PRIMARY KEY ("key", "createdAt");
