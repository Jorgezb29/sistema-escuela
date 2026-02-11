-- DropForeignKey
ALTER TABLE "CursoMateria" DROP CONSTRAINT "CursoMateria_docenteId_fkey";

-- AlterTable
ALTER TABLE "CursoMateria" ALTER COLUMN "docenteId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "CursoMateria" ADD CONSTRAINT "CursoMateria_docenteId_fkey" FOREIGN KEY ("docenteId") REFERENCES "Docente"("id") ON DELETE SET NULL ON UPDATE CASCADE;
