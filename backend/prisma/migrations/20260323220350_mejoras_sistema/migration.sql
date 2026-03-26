/*
  Warnings:

  - A unique constraint covering the columns `[estudianteId,materiaId,fecha]` on the table `Asistencia` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[estudianteId,materiaId]` on the table `Nota` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Incidencia" ADD COLUMN     "materiaId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Asistencia_estudianteId_materiaId_fecha_key" ON "Asistencia"("estudianteId", "materiaId", "fecha");

-- CreateIndex
CREATE UNIQUE INDEX "Nota_estudianteId_materiaId_key" ON "Nota"("estudianteId", "materiaId");

-- AddForeignKey
ALTER TABLE "Incidencia" ADD CONSTRAINT "Incidencia_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia"("id") ON DELETE SET NULL ON UPDATE CASCADE;
