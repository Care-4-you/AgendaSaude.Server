-- DropForeignKey
ALTER TABLE "consultations" DROP CONSTRAINT "consultations_clinicId_fkey";

-- DropForeignKey
ALTER TABLE "consultations" DROP CONSTRAINT "consultations_medicId_fkey";

-- DropForeignKey
ALTER TABLE "consultations" DROP CONSTRAINT "consultations_pacientId_fkey";

-- DropForeignKey
ALTER TABLE "medics" DROP CONSTRAINT "medics_clinicId_fkey";

-- DropForeignKey
ALTER TABLE "treatments" DROP CONSTRAINT "treatments_consulationId_fkey";

-- DropForeignKey
ALTER TABLE "treatments" DROP CONSTRAINT "treatments_medicId_fkey";

-- DropForeignKey
ALTER TABLE "treatments" DROP CONSTRAINT "treatments_pacientId_fkey";

-- AddForeignKey
ALTER TABLE "medics" ADD CONSTRAINT "medics_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_pacientId_fkey" FOREIGN KEY ("pacientId") REFERENCES "pacients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_medicId_fkey" FOREIGN KEY ("medicId") REFERENCES "medics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatments" ADD CONSTRAINT "treatments_pacientId_fkey" FOREIGN KEY ("pacientId") REFERENCES "pacients"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatments" ADD CONSTRAINT "treatments_medicId_fkey" FOREIGN KEY ("medicId") REFERENCES "medics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatments" ADD CONSTRAINT "treatments_consulationId_fkey" FOREIGN KEY ("consulationId") REFERENCES "consultations"("id") ON DELETE CASCADE ON UPDATE CASCADE;
