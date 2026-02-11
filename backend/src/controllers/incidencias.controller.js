import prisma from "../config/prisma.js";
import { notificarApoderado } from "../utils/notificarApoderado.js";


export const getIncidencias = async (req, res) => {
  const data = await prisma.incidencia.findMany({
    include: {
      estudiante: { include: { user: true } },
    },
  });
  res.json(data);
};

export const createIncidencia = async (req, res) => {
  try {
    const { estudianteId, descripcion, fecha } = req.body;

    if (!estudianteId || !descripcion || !fecha) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    const incidencia = await prisma.incidencia.create({
      data: {
        estudianteId: Number(estudianteId),
        descripcion,
        fecha: new Date(fecha),
      },
    });

    // ✅ NOTIFICAR APODERADO (AHORA SÍ)
    await notificarApoderado(
      Number(estudianteId),
      "Nueva incidencia registrada",
      `Se registró una incidencia: <b>${descripcion}</b> el día ${fecha}.`
    );

    res.status(201).json(incidencia);

  } catch (error) {
    console.error("❌ Error creando incidencia:", error);
    res.status(500).json({ message: "Error creando incidencia" });
  }
};


export const deleteIncidencia = async (req, res) => {
  const { id } = req.params;

  await prisma.incidencia.delete({
    where: { id: Number(id) },
  });

  res.json({ message: "Incidencia eliminada" });
};

/* =========================================================
   📌 OBTENER INCIDENCIAS POR CURSO (PROFESOR)
   ========================================================= */
export const getIncidenciasByCursoProfesor = async (req, res) => {
  try {
    const { cursoId } = req.params;
    const docenteId = req.user.id;

    const incidencias = await prisma.incidencia.findMany({
      where: {
        estudiante: {
          cursoId: Number(cursoId),
        },
        estudiante: {
          curso: {
            cursoMaterias: {
              some: {
                cursoId: Number(cursoId),
                docenteId: docenteId,
              },
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
      },
      orderBy: { fecha: "desc" },
    });

    res.json(incidencias);
  } catch (error) {
    console.error("❌ Error obteniendo incidencias del profesor:", error);
    res.status(500).json({
      message: "Error al obtener incidencias",
    });
  }
};
