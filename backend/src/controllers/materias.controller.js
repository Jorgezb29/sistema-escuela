import { prisma } from "../server.js";

/* =====================================================
   📌 OBTENER TODAS LAS MATERIAS CON SUS DOCENTES
   ===================================================== */
export const getMaterias = async (req, res) => {
  try {
    const materias = await prisma.materia.findMany({
      include: {
        docentes: {                 // MateriaDocente[]
          include: {
            docente: {              // Docente
              include: {
                user: true          // User del docente
              }
            }
          }
        },
        cursos: {
          include: {
            curso: true             // Si tienes cursos asociados
          }
        }
      }
    });

    res.json(materias);
  } catch (error) {
    console.error("❌ Error al obtener materias:", error);
    res.status(500).json({ message: "Error al obtener materias" });
  }
};

/* =====================================================
   📌 CREAR MATERIA
   ===================================================== */
export const createMateria = async (req, res) => {
  try {
    const { nombre } = req.body;

    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({ message: "El nombre es obligatorio" });
    }

    const materia = await prisma.materia.create({
      data: { nombre: nombre.trim() }
    });

    res.json(materia);

  } catch (error) {
    console.error("❌ Error creando materia:", error);
    res.status(500).json({ message: "Error creando materia" });
  }
};

/* =====================================================
   📌 ASIGNAR DOCENTES A UNA MATERIA (máximo 2)
   ===================================================== */
export const assignDocentesToMateria = async (req, res) => {
  try {
    const materiaId = Number(req.params.id);
    const { docentes } = req.body; // Ej: [1, 2]

    if (!Array.isArray(docentes)) {
      return res.status(400).json({ message: "Formato inválido: docentes debe ser un array" });
    }

    if (docentes.length > 2) {
      return res.status(400).json({ message: "Máximo 2 docentes por materia" });
    }

    // Eliminar asignaciones previas
    await prisma.materiaDocente.deleteMany({
      where: { materiaId }
    });

    // Crear nuevas asignaciones
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
