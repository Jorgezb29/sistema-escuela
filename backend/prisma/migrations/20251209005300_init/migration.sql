/*
  Warnings:

  - You are about to drop the column `cursoId` on the `Materia` table. All the data in the column will be lost.
  - You are about to drop the column `docenteId` on the `Materia` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[nombre]` on the table `Materia` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Materia" DROP CONSTRAINT "Materia_cursoId_fkey";

-- DropForeignKey
ALTER TABLE "Materia" DROP CONSTRAINT "Materia_docenteId_fkey";

-- AlterTable
ALTER TABLE "Materia" DROP COLUMN "cursoId",
DROP COLUMN "docenteId";

-- CreateTable
CREATE TABLE "CursoMateria" (
    "id" SERIAL NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "materiaId" INTEGER NOT NULL,

    CONSTRAINT "CursoMateria_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MateriaDocente" (
    "id" SERIAL NOT NULL,
    "materiaId" INTEGER NOT NULL,
    "docenteId" INTEGER NOT NULL,

    CONSTRAINT "MateriaDocente_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CursoMateria_cursoId_materiaId_key" ON "CursoMateria"("cursoId", "materiaId");

-- CreateIndex
CREATE UNIQUE INDEX "MateriaDocente_materiaId_docenteId_key" ON "MateriaDocente"("materiaId", "docenteId");

-- CreateIndex
CREATE UNIQUE INDEX "Materia_nombre_key" ON "Materia"("nombre");

-- AddForeignKey
ALTER TABLE "CursoMateria" ADD CONSTRAINT "CursoMateria_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoMateria" ADD CONSTRAINT "CursoMateria_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriaDocente" ADD CONSTRAINT "MateriaDocente_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MateriaDocente" ADD CONSTRAINT "MateriaDocente_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
