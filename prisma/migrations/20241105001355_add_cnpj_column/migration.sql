/*
  Warnings:

  - A unique constraint covering the columns `[cnpj]` on the table `clinics` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `cnpj` to the `clinics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clinics" ADD COLUMN     "cnpj" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "clinics_cnpj_key" ON "clinics"("cnpj");
