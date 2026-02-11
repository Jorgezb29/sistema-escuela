/*
  Warnings:

  - Added the required column `docenteId` to the `CursoMateria` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "CursoMateria" ADD COLUMN     "docenteId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "CursoMateria" ADD CONSTRAINT "CursoMateria_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
