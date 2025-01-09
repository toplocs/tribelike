-- CreateTable
CREATE TABLE "ProfileInterest" (
    "key" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,
    "interestId" TEXT NOT NULL,

    CONSTRAINT "ProfileInterest_pkey" PRIMARY KEY ("key","profileId","interestId")
);

-- CreateTable
CREATE TABLE "InterestProfile" (
    "key" TEXT NOT NULL,
    "interestId" TEXT NOT NULL,
    "profileId" TEXT NOT NULL,

    CONSTRAINT "InterestProfile_pkey" PRIMARY KEY ("key","interestId","profileId")
);

-- CreateTable
CREATE TABLE "InterestLocation" (
    "key" TEXT NOT NULL,
    "interestId" TEXT NOT NULL,
    "locationId" TEXT NOT NULL,

    CONSTRAINT "InterestLocation_pkey" PRIMARY KEY ("key","interestId","locationId")
);
