import prisma from "../config/prisma.js";

export const getNotas = async (req, res) => {
  const data = await prisma.nota.findMany({
    include: {
      estudiante: { include: { user: true } },
      materia: true,
    },
  });
  res.json(data);
};

export const createNota = async (req, res) => {
  const { estudianteId, materiaId, nota, fecha } = req.body;

  const data = await prisma.nota.create({
    data: {
      estudianteId: Number(estudianteId),
      materiaId: Number(materiaId),
      nota: Number(nota),
      fecha: new Date(fecha),
    },
  });

  res.json(data);
};

export const deleteNota = async (req, res) => {
  const { id } = req.params;

  await prisma.nota.delete({
    where: { id: Number(id) },
  });

  res.json({ message: "Nota eliminada" });
};


/* =========================================================
   📌 OBTENER NOTAS POR CURSO Y MATERIA (PROFESOR)
   ========================================================= */
export const getNotasByCursoMateriaProfesor = async (req, res) => {
  try {
    const { cursoId, materiaId } = req.params;
    const docenteId = req.user.id;

    const notas = await prisma.nota.findMany({
      where: {
        materiaId: Number(materiaId),
        estudiante: {
          cursoId: Number(cursoId),
        },
        materia: {
          cursoMaterias: {
            some: {
              cursoId: Number(cursoId),
              docenteId: docenteId,
            },
          },
        },
      },
      include: {
        estudiante: {
          include: {
            user: {
              select: {
                nombre: true,
                apellido: true,
              },
            },
          },
        },
        materia: true,
      },
    });

    res.json(notas);
  } catch (error) {
    console.error("❌ Error obteniendo notas del profesor:", error);
    res.status(500).json({
      message: "Error al obtener notas",
    });
  }
};
