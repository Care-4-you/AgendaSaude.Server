-- AddForeignKey
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_pacientId_fkey" FOREIGN KEY ("pacientId") REFERENCES "pacients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_medicId_fkey" FOREIGN KEY ("medicId") REFERENCES "medics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "consultations" ADD CONSTRAINT "consultations_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
