/*
  Warnings:

  - Added the required column `acceptTerm` to the `pacients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `cellPhone` to the `pacients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `houseNumber` to the `pacients` table without a default value. This is not possible if the table is not empty.
  - Added the required column `whatsapp` to the `pacients` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `gender` on the `pacients` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "pacients" ADD COLUMN     "acceptTerm" BOOLEAN NOT NULL,
ADD COLUMN     "cellPhone" TEXT NOT NULL,
ADD COLUMN     "hasNumber" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "houseNumber" TEXT NOT NULL,
ADD COLUMN     "isWhatsapp" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "whatsapp" TEXT NOT NULL,
DROP COLUMN "gender",
ADD COLUMN     "gender" JSONB NOT NULL;
