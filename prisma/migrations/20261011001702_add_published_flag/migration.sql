-- AlterTable
ALTER TABLE "phenomena" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true;

-- AlterTable
ALTER TABLE "words" ADD COLUMN     "published" BOOLEAN NOT NULL DEFAULT true;
