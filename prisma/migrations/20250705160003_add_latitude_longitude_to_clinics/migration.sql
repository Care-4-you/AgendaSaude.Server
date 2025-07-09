-- CreateTable
CREATE TABLE "ClinicSpecialty" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "clinicId" INTEGER NOT NULL,

    CONSTRAINT "ClinicSpecialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ClinicHealthInsurance" (
    "id" SERIAL NOT NULL,
    "value" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "clinicId" INTEGER NOT NULL,

    CONSTRAINT "ClinicHealthInsurance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "clinics" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "cellPhone" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "hasNumber" BOOLEAN NOT NULL DEFAULT true,
    "houseNumber" TEXT NOT NULL,
    "acceptTerm" BOOLEAN NOT NULL,
    "email" TEXT NOT NULL,
    "cnpj" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "isAuthenticated" BOOLEAN NOT NULL DEFAULT false,
    "address" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "complement" TEXT,
    "latitude" DOUBLE PRECISION,
    "longitude" DOUBLE PRECISION,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "clinics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pacients" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "cellPhone" TEXT NOT NULL,
    "whatsapp" TEXT NOT NULL,
    "isWhatsapp" BOOLEAN NOT NULL DEFAULT false,
    "hasNumber" BOOLEAN NOT NULL DEFAULT true,
    "houseNumber" TEXT NOT NULL,
    "acceptTerm" BOOLEAN NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "password_hash" TEXT NOT NULL,
    "isAuthenticated" BOOLEAN NOT NULL DEFAULT false,
    "address" TEXT NOT NULL,
    "cep" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "neighborhood" TEXT NOT NULL,
    "complement" TEXT,
    "birth_date" TIMESTAMP(3) NOT NULL,
    "gender" JSONB NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "pacients_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "medics" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "state" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "clinicId" INTEGER NOT NULL,

    CONSTRAINT "medics_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "consultations" (
    "id" SERIAL NOT NULL,
    "consult_time" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pacientId" INTEGER NOT NULL,
    "medicId" INTEGER NOT NULL,
    "clinicId" INTEGER NOT NULL,

    CONSTRAINT "consultations_pkey" PRIMARY KEY ("id")
);

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

-- CreateTable
CREATE TABLE "password_reset_tokens" (
    "id" SERIAL NOT NULL,
    "token" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "userType" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "password_reset_tokens_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "clinics_email_key" ON "clinics"("email");

-- CreateIndex
CREATE UNIQUE INDEX "clinics_cnpj_key" ON "clinics"("cnpj");

-- CreateIndex
CREATE UNIQUE INDEX "pacients_email_key" ON "pacients"("email");

-- CreateIndex
CREATE UNIQUE INDEX "pacients_cpf_key" ON "pacients"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "medics_cpf_key" ON "medics"("cpf");

-- CreateIndex
CREATE UNIQUE INDEX "medics_email_key" ON "medics"("email");

-- CreateIndex
CREATE UNIQUE INDEX "MedicCrm_number_key" ON "MedicCrm"("number");

-- CreateIndex
CREATE UNIQUE INDEX "password_reset_tokens_token_key" ON "password_reset_tokens"("token");

-- AddForeignKey
ALTER TABLE "ClinicSpecialty" ADD CONSTRAINT "ClinicSpecialty_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ClinicHealthInsurance" ADD CONSTRAINT "ClinicHealthInsurance_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "medics" ADD CONSTRAINT "medics_clinicId_fkey" FOREIGN KEY ("clinicId") REFERENCES "clinics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicSpecialty" ADD CONSTRAINT "MedicSpecialty_medicId_fkey" FOREIGN KEY ("medicId") REFERENCES "medics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MedicCrm" ADD CONSTRAINT "MedicCrm_medicId_fkey" FOREIGN KEY ("medicId") REFERENCES "medics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
