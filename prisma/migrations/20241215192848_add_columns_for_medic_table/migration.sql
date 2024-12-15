/*
  Warnings:

  - You are about to drop the column `crm` on the `medics` table. All the data in the column will be lost.
  - You are about to drop the column `specialty` on the `medics` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[cpf]` on the table `medics` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `medics` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `city` to the `medics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf` to the `medics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `email` to the `medics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `medics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `medics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `medics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "medics" DROP COLUMN "crm",
DROP COLUMN "specialty",
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "MedicSpecialty" (
    "id" SERIAL NOT NULL,
    "specialty" TEXT NOT NULL,
    "medicId" INTEGER NOT NULL,

    CONSTRAINT "MedicSpecialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MedicCrm" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "medicId" INTEGER NOT NULL,

    CONSTRAINT "MedicCrm_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "medics_cpf_key" ON "medics"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "medics_email_key" ON "medics"("email");

-- AddForeignKey
ALTER TABLE "MedicSpecialty" ADD CONSTRAINT "MedicSpecialty_medicId_fkey" FOREIGN KEY ("medicId") REFERENCES "medics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicCrm" ADD CONSTRAINT "MedicCrm_medicId_fkey" FOREIGN KEY ("medicId") REFERENCES "medics"("id") ON DELETE CASCADE ON UPDATE CASCADE;
