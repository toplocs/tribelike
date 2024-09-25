-- CreateEnum
CREATE TYPE "LocationStatus" AS ENUM ('FAVOURITE', 'CURRENTLY_AT', 'GOING_NEXT');

-- CreateTable
CREATE TABLE "ProfileLocation" (
    "id" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,
    "status" "LocationStatus" NOT NULL,

    CONSTRAINT "ProfileLocation_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProfileLocation_profileId_locationId_key" ON "ProfileLocation"("profileId", "locationId");

-- AddForeignKey
ALTER TABLE "ProfileLocation" ADD CONSTRAINT "ProfileLocation_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProfileLocation" ADD CONSTRAINT "ProfileLocation_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
