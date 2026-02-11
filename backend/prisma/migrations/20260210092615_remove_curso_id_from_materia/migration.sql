/*
  Warnings:

  - You are about to drop the column `cursoId` on the `Materia` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "Materia" DROP CONSTRAINT "Materia_cursoId_fkey";

-- AlterTable
ALTER TABLE "Materia" DROP COLUMN "cursoId";

-- CreateTable
CREATE TABLE "CursoMateria" (
    "id" SERIAL NOT NULL,
    "cursoId" INTEGER NOT NULL,
    "materiaId" INTEGER NOT NULL,

    CONSTRAINT "CursoMateria_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "CursoMateria_cursoId_materiaId_key" ON "CursoMateria"("cursoId", "materiaId");

-- AddForeignKey
ALTER TABLE "CursoMateria" ADD CONSTRAINT "CursoMateria_cursoId_fkey" FOREIGN KEY ("cursoId") REFERENCES "Curso"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CursoMateria" ADD CONSTRAINT "CursoMateria_materiaId_fkey" FOREIGN KEY ("materiaId") REFERENCES "Materia"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
