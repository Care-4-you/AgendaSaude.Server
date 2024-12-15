/*
  Warnings:

  - A unique constraint covering the columns `[number]` on the table `MedicCrm` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "MedicCrm_number_key" ON "MedicCrm"("number");
