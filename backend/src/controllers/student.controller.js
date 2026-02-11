import { prisma } from "../server.js";

/* =============================================
   📘 Mis Materias
============================================= */
export const getMisMaterias = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const estudiante = await prisma.estudiante.findUnique({
      where: { userId: usuarioId },
    });

    if (!estudiante) {
      return res.status(404).json({ message: "No eres estudiante" });
    }

    const materias = await prisma.cursoMateria.findMany({
      where: { cursoId: estudiante.cursoId },
      include: { materia: true },
    });

    res.json(materias.map((m) => m.materia));
  } catch (error) {
    console.error("❌ Error obteniendo materias:", error);
    res.status(500).json({ message: "Error obteniendo materias" });
  }
};


/* =============================================
   📝 Mis Notas
============================================= */
export const getMisNotas = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const estudiante = await prisma.estudiante.findUnique({
      where: { userId: usuarioId },
    });

    if (!estudiante)
      return res.status(404).json({ message: "No eres estudiante" });

    const notas = await prisma.nota.findMany({
      where: { estudianteId: estudiante.id },
      include: { materia: true },
    });

    res.json(notas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo notas" });
  }
};


/* =============================================
   📅 Mis Asistencias
============================================= */
export const getMisAsistencias = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const estudiante = await prisma.estudiante.findUnique({
      where: { userId: usuarioId },
    });

    if (!estudiante)
      return res.status(404).json({ message: "No eres estudiante" });

    const asistencias = await prisma.asistencia.findMany({
      where: { estudianteId: estudiante.id },
      include: { materia: true },
    });

    res.json(asistencias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo asistencias" });
  }
};

export const getMiPerfil = async (req, res) => {
  try {
    const userId = req.user.id;

    const estudiante = await prisma.estudiante.findUnique({
      where: { userId },
      include: {
        user: true,
        curso: true
      }
    });

    if (!estudiante) {
      return res.status(404).json({ message: "No eres estudiante" });
    }

    res.json({
      codigo: `EST-${estudiante.id}`,
      dni: estudiante.dni,
      apellidoP: estudiante.user.apellido,
      apellidoM: estudiante.user.apellidoM || "",
      nombre: estudiante.user.nombre,
      email: estudiante.user.email,
      fechaNacimiento: estudiante.fechaNacimiento
        ? estudiante.fechaNacimiento.toISOString().split("T")[0]
        : "",
      sexo: "No definido", // si no lo tienes aún
      curso: estudiante.curso?.nombre || "",
      direccion: estudiante.direccion || "",
      telefono: ""
    });

  } catch (error) {
    console.error("❌ Error perfil estudiante:", error);
    res.status(500).json({ message: "Error cargando perfil" });
  }
};



/* =============================================
   ⚠ Mis Incidencias
============================================= */
export const getMisIncidencias = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const estudiante = await prisma.estudiante.findUnique({
      where: { userId: usuarioId },
    });

    if (!estudiante)
      return res.status(404).json({ message: "No eres estudiante" });

    const incidencias = await prisma.incidencia.findMany({
      where: { estudianteId: estudiante.id },
    });

    res.json(incidencias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo incidencias" });
  }
};
