import { prisma } from "../server.js";

/* =============================================
   📘 Mis Materias (materias del curso del estudiante)
============================================= */
export const getMisMaterias = async (req, res) => {
  try {
    const usuarioId = req.userId;

    const estudiante = await prisma.estudiante.findUnique({
      where: { userId: usuarioId },
    });

    if (!estudiante) return res.status(404).json({ message: "No eres estudiante" });

    const materias = await prisma.cursoMateria.findMany({
      where: { cursoId: estudiante.cursoId },
      include: {
        materia: true,
      },
    });

    res.json(materias.map((m) => m.materia));
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo materias" });
  }
};


/* =============================================
   📝 Mis Notas
============================================= */
export const getMisNotas = async (req, res) => {
  try {
    const usuarioId = req.userId;

    const estudiante = await prisma.estudiante.findUnique({
      where: { userId: usuarioId },
    });

    const notas = await prisma.nota.findMany({
      where: { estudianteId: estudiante.id },
      include: { materia: true },
    });

    res.json(notas);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo notas" });
  }
};


/* =============================================
   📅 Mis Asistencias
============================================= */
export const getMisAsistencias = async (req, res) => {
  try {
    const usuarioId = req.userId;

    const estudiante = await prisma.estudiante.findUnique({
      where: { userId: usuarioId },
    });

    const asistencias = await prisma.asistencia.findMany({
      where: { estudianteId: estudiante.id },
      include: { materia: true },
    });

    res.json(asistencias);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo asistencias" });
  }
};


/* =============================================
   ⚠ Mis Incidencias
============================================= */
export const getMisIncidencias = async (req, res) => {
  try {
    const usuarioId = req.userId;

    const estudiante = await prisma.estudiante.findUnique({
      where: { userId: usuarioId },
    });

    const incidencias = await prisma.incidencia.findMany({
      where: { estudianteId: estudiante.id }
    });

    res.json(incidencias);
  } catch (error) {
    res.status(500).json({ message: "Error obteniendo incidencias" });
  }
};
