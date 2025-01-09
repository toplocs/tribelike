-- CreateTable
CREATE TABLE "ProfileLocation" (
    "key" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "ProfileLocation_pkey" PRIMARY KEY ("key","profileId","locationId")
);
