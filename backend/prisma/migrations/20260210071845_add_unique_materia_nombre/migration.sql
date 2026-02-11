/*
  Warnings:

  - A unique constraint covering the columns `[nombre]` on the table `Materia` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Materia_nombre_key" ON "Materia"("nombre");
