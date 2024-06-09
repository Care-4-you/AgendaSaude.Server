/*
  Warnings:

  - You are about to drop the column `agreements` on the `clinics` table. All the data in the column will be lost.
  - You are about to drop the column `payment_methods` on the `clinics` table. All the data in the column will be lost.
  - Added the required column `cep` to the `clinics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `clinics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `clinics` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `clinics` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "clinics" DROP COLUMN "agreements",
DROP COLUMN "payment_methods",
ADD COLUMN     "cep" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
