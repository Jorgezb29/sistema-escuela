-- CreateTable
CREATE TABLE "ResultadoVocacional" (
    "id" SERIAL NOT NULL,
    "estudianteId" INTEGER NOT NULL,
    "puntajeExactas" INTEGER NOT NULL,
    "puntajeHumanidades" INTEGER NOT NULL,
    "puntajeSalud" INTEGER NOT NULL,
    "porcentajeExactas" INTEGER NOT NULL,
    "porcentajeHumanidades" INTEGER NOT NULL,
    "porcentajeSalud" INTEGER NOT NULL,
    "areaPrincipal" TEXT NOT NULL,
    "areaSegunda" TEXT NOT NULL,
    "interpretacion" TEXT NOT NULL,
    "fechaRealizado" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ResultadoVocacional_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ResultadoVocacional" ADD CONSTRAINT "ResultadoVocacional_estudianteId_fkey" FOREIGN KEY ("estudianteId") REFERENCES "Estudiante"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
