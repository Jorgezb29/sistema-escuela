import { prisma } from "../server.js"; // ✔ Import correcto
import { notificarApoderado } from "../utils/notificarApoderado.js";

/* ================================
   📌 OBTENER TODAS LAS ASISTENCIAS
================================ */
export const getAsistencias = async (req, res) => {
  try {
    const data = await prisma.asistencia.findMany({
      include: {
        estudiante: { include: { user: true } },
        materia: true,
      },
      orderBy: { fecha: "desc" }
    });

    res.json(data);
  } catch (error) {
    console.error("❌ Error obteniendo asistencias:", error);
    res.status(500).json({ message: "Error obteniendo asistencias" });
  }
};

/* ================================
   📌 CREAR ASISTENCIA
================================ */
export const createAsistencia = async (req, res) => {
  try {
    const { estudianteId, materiaId, fecha, estado } = req.body;

    if (!estudianteId || !materiaId || !fecha || !estado) {
      return res.status(400).json({
        message: "Todos los campos son obligatorios",
      });
    }

    // 1️⃣ Crear asistencia
    const asistencia = await prisma.asistencia.create({
      data: {
        estudianteId: Number(estudianteId),
        materiaId: Number(materiaId),
        fecha: new Date(fecha),
        estado,
      },
    });

    // 2️⃣ Notificar apoderado (AHORA SÍ CORRECTO)
    await notificarApoderado(
      Number(estudianteId),
      "Registro de Asistencia",
      `Su hijo/a fue marcado como <b>${estado}</b> el día ${fecha}.`
    );

    // 3️⃣ Respuesta
    res.status(201).json(asistencia);

  } catch (error) {
    console.error("❌ Error creando asistencia:", error);
    res.status(500).json({
      message: "Error creando asistencia",
    });
  }
};



/* ================================
   📌 ACTUALIZAR ESTADO DE ASISTENCIA
================================ */
export const updateAsistencia = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;

    if (!estado) {
      return res.status(400).json({ message: "Estado es obligatorio" });
    }

    const updated = await prisma.asistencia.update({
      where: { id: Number(id) },
      data: { estado },
    });

    res.json(updated);

  } catch (error) {
    console.error("❌ Error actualizando asistencia:", error);
    res.status(500).json({ message: "Error actualizando asistencia" });
  }
};

/* ================================
   📌 ELIMINAR ASISTENCIA
================================ */
export const deleteAsistencia = async (req, res) => {
  try {
    const { id } = req.params;

    await prisma.asistencia.delete({
      where: { id: Number(id) },
    });

    res.json({ message: "Asistencia eliminada" });

  } catch (error) {
    console.error("❌ Error eliminando asistencia:", error);
    res.status(500).json({ message: "Error eliminando asistencia" });
  }
};

/* =========================================================
   📌 OBTENER ASISTENCIAS POR CURSO Y MATERIA (PROFESOR)
   ========================================================= */
export const getAsistenciasByCursoMateriaProfesor = async (req, res) => {
  try {
    const { cursoId, materiaId } = req.params;
    const docenteId = req.user.id;

    const asistencias = await prisma.asistencia.findMany({
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
      orderBy: { fecha: "desc" },
    });

    res.json(asistencias);
  } catch (error) {
    console.error("❌ Error obteniendo asistencias del profesor:", error);
    res.status(500).json({
      message: "Error al obtener asistencias",
    });
  }
};
