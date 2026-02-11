import { prisma } from "../server.js";

/* ===============================
   👨‍👩‍👧 Hijos del apoderado
================================ */
export const getHijos = async (req, res) => {
  const apoderado = await prisma.apoderado.findUnique({
    where: { userId: req.userId },
    include: {
      tutor: {
        include: {
          estudiantes: {
            include: { user: true, curso: true }
          }
        }
      }
    }
  });

  if (!apoderado) {
    return res.status(404).json({ message: "No eres apoderado" });
  }

  res.json(apoderado.tutor.estudiantes);
};

/* ===============================
   📘 Notas del hijo
================================ */
export const getNotasHijo = async (req, res) => {
  try {
    const estudianteId = Number(req.params.id);

    if (!estudianteId) {
      return res.status(400).json({ message: "ID de estudiante inválido" });
    }

    const notas = await prisma.nota.findMany({
      where: { estudianteId },
      include: { materia: true },
    });

    res.json(notas);
  } catch (error) {
    console.error("❌ Error notas hijo:", error);
    res.status(500).json({ message: "Error obteniendo notas" });
  }
};


/* ===============================
   📅 Asistencias del hijo
================================ */
export const getAsistenciasHijo = async (req, res) => {
  try {
    const estudianteId = Number(req.params.id);

    if (!estudianteId) {
      return res.status(400).json({ message: "ID de estudiante inválido" });
    }

    const asistencias = await prisma.asistencia.findMany({
      where: { estudianteId },
      include: { materia: true },
      orderBy: { fecha: "desc" },
    });

    res.json(asistencias);
  } catch (error) {
    console.error("❌ Error asistencias hijo:", error);
    res.status(500).json({ message: "Error obteniendo asistencias" });
  }
};


/* ===============================
   ⚠ Incidencias del hijo
================================ */
export const getIncidenciasHijo = async (req, res) => {
  try {
    const estudianteId = Number(req.params.id);

    if (!estudianteId) {
      return res.status(400).json({ message: "ID de estudiante inválido" });
    }

    const incidencias = await prisma.incidencia.findMany({
      where: { estudianteId },
      orderBy: { fecha: "desc" },
    });

    res.json(incidencias);
  } catch (error) {
    console.error("❌ Error incidencias hijo:", error);
    res.status(500).json({ message: "Error obteniendo incidencias" });
  }
};
