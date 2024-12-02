-- AlterTable
ALTER TABLE "Interest" ADD COLUMN     "access" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "invites" TEXT[],
ADD COLUMN     "links" TEXT[];

-- AlterTable
ALTER TABLE "Location" ADD COLUMN     "access" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "invites" TEXT[],
ADD COLUMN     "links" TEXT[];
