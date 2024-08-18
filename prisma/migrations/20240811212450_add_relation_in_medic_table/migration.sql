/*
  Warnings:

  - Added the required column `clinicId` to the `medics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medics" ADD COLUMN     "clinicId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "medics" ADD CONSTRAINT "medics_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
