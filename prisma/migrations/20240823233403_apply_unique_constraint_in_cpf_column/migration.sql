/*
  Warnings:

  - A unique constraint covering the columns `[cpf]` on the table `pacients` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "pacients_cpf_key" ON "pacients"("cpf");
