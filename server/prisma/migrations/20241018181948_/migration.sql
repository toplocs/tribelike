/*
  Warnings:

  - The primary key for the `Wiki` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- DropForeignKey
ALTER TABLE "_WikiInterests" DROP CONSTRAINT "_WikiInterests_B_fkey";

-- DropForeignKey
ALTER TABLE "_WikiLocations" DROP CONSTRAINT "_WikiLocations_B_fkey";

-- AlterTable
ALTER TABLE "Wiki" DROP CONSTRAINT "Wiki_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Wiki_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Wiki_id_seq";

-- AlterTable
ALTER TABLE "_WikiInterests" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AlterTable
ALTER TABLE "_WikiLocations" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "_WikiInterests" ADD CONSTRAINT "_WikiInterests_B_fkey" FOREIGN KEY ("B") REFERENCES "Wiki"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WikiLocations" ADD CONSTRAINT "_WikiLocations_B_fkey" FOREIGN KEY ("B") REFERENCES "Wiki"("id") ON DELETE CASCADE ON UPDATE CASCADE;
