/*
  Warnings:

  - You are about to drop the `ProfileLocation` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "Status" AS ENUM ('FAVOURITE', 'CURRENTLY_AT', 'GOING_NEXT');

-- DropForeignKey
ALTER TABLE "ProfileLocation" DROP CONSTRAINT "ProfileLocation_locationId_fkey";

-- DropForeignKey
ALTER TABLE "ProfileLocation" DROP CONSTRAINT "ProfileLocation_profileId_fkey";

-- DropTable
DROP TABLE "ProfileLocation";

-- DropEnum
DROP TYPE "LocationStatus";

-- CreateTable
CREATE TABLE "ProfileFeed" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "status" "Status" NOT NULL,
    "interestId" TEXT,
    "locationId" TEXT,

    CONSTRAINT "ProfileFeed_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProfileFeed" ADD CONSTRAINT "ProfileFeed_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileFeed" ADD CONSTRAINT "ProfileFeed_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileFeed" ADD CONSTRAINT "ProfileFeed_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
