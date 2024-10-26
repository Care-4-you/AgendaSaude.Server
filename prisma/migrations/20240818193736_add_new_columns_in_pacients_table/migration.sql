/*
  Warnings:

  - Added the required column `birth_date` to the `pacients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cep` to the `pacients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `city` to the `pacients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cpf` to the `pacients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `gender` to the `pacients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `neighborhood` to the `pacients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `state` to the `pacients` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "pacients" ADD COLUMN     "birth_date" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "cep" TEXT NOT NULL,
ADD COLUMN     "city" TEXT NOT NULL,
ADD COLUMN     "complement" TEXT,
ADD COLUMN     "cpf" TEXT NOT NULL,
ADD COLUMN     "gender" TEXT NOT NULL,
ADD COLUMN     "neighborhood" TEXT NOT NULL,
ADD COLUMN     "state" TEXT NOT NULL;
