-- CreateTable
CREATE TABLE "treatments" (
    "id" SERIAL NOT NULL,
    "description" TEXT NOT NULL,
    "attached" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pacientId" INTEGER NOT NULL,
    "medicId" INTEGER NOT NULL,
    "consulationId" INTEGER NOT NULL,

    CONSTRAINT "treatments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "treatments" ADD CONSTRAINT "treatments_pacientId_fkey" FOREIGN KEY ("pacientId") REFERENCES "pacients"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatments" ADD CONSTRAINT "treatments_medicId_fkey" FOREIGN KEY ("medicId") REFERENCES "medics"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "treatments" ADD CONSTRAINT "treatments_consulationId_fkey" FOREIGN KEY ("consulationId") REFERENCES "consultations"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
