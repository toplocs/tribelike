-- AlterTable
ALTER TABLE "Relation" ADD COLUMN     "interestId" TEXT,
ADD COLUMN     "profileId" TEXT;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profile"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Relation" ADD CONSTRAINT "Relation_interestId_fkey" FOREIGN KEY ("interestId") REFERENCES "Interest"("id") ON DELETE SET NULL ON UPDATE CASCADE;
