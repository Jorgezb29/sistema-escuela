import { prisma } from "../server.js";

/* =====================================================
   📌 OBTENER TODAS LAS MATERIAS CON DOCENTES Y CURSOS
   ===================================================== */
export const getMaterias = async (req, res) => {
  try {
    const materias = await prisma.materia.findMany();
    res.json(materias);
  } catch (error) {
    console.error("❌ Error obteniendo materias:", error);
    res.status(500).json({ message: "Error obteniendo materias" });
  }
};

/* =====================================================
   📌 CREAR MATERIA
   ===================================================== */
export const createMateria = async (req, res) => {
  try {
    const { nombre, cursoId } = req.body;

    if (!nombre || !cursoId) {
      return res.status(400).json({ message: "Curso requerido" });
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1️⃣ Crear materia
      const materia = await tx.materia.create({
        data: {
          nombre: nombre.toLowerCase().trim()
        }
      });

      // 2️⃣ Asociar a curso
      await tx.cursoMateria.create({
        data: {
          curso: {
            connect: { id: Number(cursoId) }
          },
          materia: {
            connect: { id: materia.id }
          }
        }
      });

      return materia;
    });

    res.status(201).json(result);
  } catch (error) {
    console.error("❌ ERROR REAL PRISMA:", {
      code: error.code,
      meta: error.meta,
      message: error.message
    });

    if (error.code === "P2002") {
      return res.status(400).json({
        message: "Materia duplicada (restricción única)"
      });
    }

    if (error.code === "P2003") {
      return res.status(400).json({
        message: "Curso no existe (FK inválida)"
      });
    }

    res.status(500).json({ message: "Error creando materia" });
  }
};

/* =====================================================
   📌 ASIGNAR DOCENTES A UNA MATERIA (máx. 2)
   ===================================================== */
export const assignDocentesToMateria = async (req, res) => {
  try {
    const materiaId = Number(req.params.id);
    const { docentes } = req.body;

    if (!Array.isArray(docentes)) {
      return res.status(400).json({
        message: "El campo docentes debe ser un arreglo de IDs"
      });
    }

    if (docentes.length > 2) {
      return res.status(400).json({
        message: "Una materia puede tener máximo 2 docentes"
      });
    }

    await prisma.materiaDocente.deleteMany({
      where: { materiaId }
    });

    if (docentes.length > 0) {
      await prisma.materiaDocente.createMany({
        data: docentes.map((docenteId) => ({
          docenteId,
          materiaId
        }))
      });
    }

    res.json({ message: "Docentes asignados correctamente" });
  } catch (error) {
    console.error("❌ Error asignando docentes:", error);
    res.status(500).json({ message: "Error asignando docentes" });
  }
};
