/*
  Warnings:

  - You are about to drop the `InterestProfile` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "InterestProfile";

-- CreateTable
CREATE TABLE "ProfileProfile" (
    "key" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "otherProfileId" TEXT NOT NULL,

    CONSTRAINT "ProfileProfile_pkey" PRIMARY KEY ("key","profileId","otherProfileId")
);

-- CreateTable
CREATE TABLE "InterestInterest" (
    "key" TEXT NOT NULL,
    "interestId" TEXT NOT NULL,
    "otherInterestId" TEXT NOT NULL,

    CONSTRAINT "InterestInterest_pkey" PRIMARY KEY ("key","interestId","otherInterestId")
);

-- CreateTable
CREATE TABLE "LocationLocation" (
    "key" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "otherLocationId" TEXT NOT NULL,

    CONSTRAINT "LocationLocation_pkey" PRIMARY KEY ("key","locationId","otherLocationId")
);

-- AddForeignKey
ALTER TABLE "ProfileLocation" ADD CONSTRAINT "ProfileLocation_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileLocation" ADD CONSTRAINT "ProfileLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileInterest" ADD CONSTRAINT "ProfileInterest_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileInterest" ADD CONSTRAINT "ProfileInterest_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileProfile" ADD CONSTRAINT "ProfileProfile_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileProfile" ADD CONSTRAINT "ProfileProfile_otherProfileId_fkey" FOREIGN KEY ("otherProfileId") REFERENCES "Profile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterestLocation" ADD CONSTRAINT "InterestLocation_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterestLocation" ADD CONSTRAINT "InterestLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterestInterest" ADD CONSTRAINT "InterestInterest_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InterestInterest" ADD CONSTRAINT "InterestInterest_otherInterestId_fkey" FOREIGN KEY ("otherInterestId") REFERENCES "Interest"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationLocation" ADD CONSTRAINT "LocationLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LocationLocation" ADD CONSTRAINT "LocationLocation_otherLocationId_fkey" FOREIGN KEY ("otherLocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
