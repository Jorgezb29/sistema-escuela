import { prisma } from "../server.js";

/* =====================================================
   📌 ASIGNAR MATERIAS A UN CURSO
   ===================================================== */
export const assignMateriasToCurso = async (req, res) => {
  try {
    const cursoId = Number(req.params.id);
    const { materias } = req.body; // Ej: [1, 2, 3]

    if (!Array.isArray(materias)) {
      return res.status(400).json({
        message: "El campo materias debe ser un arreglo de IDs"
      });
    }

    // Eliminar asignaciones previas
    await prisma.cursoMateria.deleteMany({
      where: { cursoId }
    });

    // Crear nuevas asignaciones
    if (materias.length > 0) {
      await prisma.cursoMateria.createMany({
        data: materias.map((materiaId) => ({
          cursoId,
          materiaId
        }))
      });
    }

    res.json({
      message: "Materias asignadas correctamente al curso"
    });

  } catch (error) {
    console.error("❌ Error asignando materias al curso:", error);
    res.status(500).json({
      message: "Error asignando materias al curso"
    });
  }
};

/* =====================================================
   📌 OBTENER MATERIAS DE UN CURSO  ✅ (ESTA FALTABA)
   ===================================================== */
export const getMateriasByCurso = async (req, res) => {
  try {
    const cursoId = Number(req.params.id);

    const materias = await prisma.cursoMateria.findMany({
      where: { cursoId },
      include: {
        materia: true
      }
    });

    res.json(materias);

  } catch (error) {
    console.error("❌ Error obteniendo materias del curso:", error);
    res.status(500).json({
      message: "Error obteniendo materias del curso"
    });
  }
};

/* =====================================================
   📌 CURSOS Y MATERIAS DEL PROFESOR
   ===================================================== */
export const getCursosMateriasByProfesor = async (req, res) => {
  try {
    const docenteId = req.userId; // ✅ CORRECTO CON authTeacher

    const cursosMaterias = await prisma.cursoMateria.findMany({
      where: { docenteId },
      include: {
        curso: true,
        materia: true
      }
    });

    res.json(cursosMaterias);

  } catch (error) {
    console.error("❌ Error obteniendo cursos del profesor:", error);
    res.status(500).json({
      message: "Error obteniendo cursos del profesor"
    });
  }
};
