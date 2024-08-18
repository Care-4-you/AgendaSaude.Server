/*
  Warnings:

  - Added the required column `clinicId` to the `consultations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `consult_time` to the `consultations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `medicId` to the `consultations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `pacientId` to the `consultations` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "consultations" ADD COLUMN     "clinicId" INTEGER NOT NULL,
ADD COLUMN     "consult_time" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "medicId" INTEGER NOT NULL,
ADD COLUMN     "pacientId" INTEGER NOT NULL,
ADD COLUMN     "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
