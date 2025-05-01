/*
  Warnings:

  - You are about to drop the column `created_at` on the `clinics` table. All the data in the column will be lost.
  - You are about to drop the column `specialty` on the `clinics` table. All the data in the column will be lost.
  - Added the required column `acceptTerm` to the `clinics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cellPhone` to the `clinics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `houseNumber` to the `clinics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whatsapp` to the `clinics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clinics" DROP COLUMN "created_at",
DROP COLUMN "specialty",
ADD COLUMN     "acceptTerm" BOOLEAN NOT NULL,
ADD COLUMN     "cellPhone" TEXT NOT NULL,
ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "hasNumber" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "houseNumber" TEXT NOT NULL,
ADD COLUMN     "whatsapp" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "ClinicSpecialty" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "clinicId" INTEGER NOT NULL,

    CONSTRAINT "ClinicSpecialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicHealthInsurance" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "clinicId" INTEGER NOT NULL,

    CONSTRAINT "ClinicHealthInsurance_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ClinicSpecialty" ADD CONSTRAINT "ClinicSpecialty_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicHealthInsurance" ADD CONSTRAINT "ClinicHealthInsurance_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
