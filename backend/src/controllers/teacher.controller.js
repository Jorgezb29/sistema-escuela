import { prisma } from "../server.js";

/* =======================================================
   📘 Materias dictadas por el docente
======================================================= */
export const getMateriasDocente = async (req, res) => {
  try {
    const userId = req.userId;

    const docente = await prisma.docente.findUnique({
      where: { userId },
    });

    if (!docente) {
      return res.status(404).json({ message: "No eres profesor" });
    }

    const materias = await prisma.materiaDocente.findMany({
      where: { docenteId: docente.id },
      include: {
        materia: {
          include: {
            cursos: {
              include: { curso: true },
            },
          },
        },
      },
    });

    const resultado = materias.map((m) => ({
      materiaId: m.materia.id,
      materia: m.materia.nombre,
      cursos: m.materia.cursos.map((c) => ({
        id: c.curso.id,
        nombre: c.curso.nombre,
      })),
    }));

    res.json(resultado);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo materias" });
  }
};

/* =======================================================
   👨‍🎓 Estudiantes por materia
======================================================= */
export const getEstudiantesPorMateria = async (req, res) => {
  try {
    const { materiaId } = req.params;

    const estudiantes = await prisma.estudiante.findMany({
      where: {
        curso: {
          materias: {
            some: {
              materiaId: Number(materiaId),
            },
          },
        },
      },
      include: {
        user: true,
      },
    });

    res.json(estudiantes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo estudiantes" });
  }
};

/* =======================================================
   📝 Notas
======================================================= */
export const getNotasMateria = async (req, res) => {
  try {
    const { materiaId } = req.params;

    const notas = await prisma.nota.findMany({
      where: { materiaId: Number(materiaId) },
      include: {
        estudiante: {
          include: { user: true },
        },
      },
    });

    res.json(notas);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo notas" });
  }
};

export const crearNota = async (req, res) => {
  try {
    const { estudianteId, materiaId, nota, fecha } = req.body;

    const nueva = await prisma.nota.create({
      data: {
        estudianteId,
        materiaId,
        nota,
        fecha: new Date(fecha),
      },
    });

    res.json(nueva);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando nota" });
  }
};

/* =======================================================
   📅 Asistencias
======================================================= */
export const getAsistenciasMateria = async (req, res) => {
  try {
    const { materiaId } = req.params;

    const asistencias = await prisma.asistencia.findMany({
      where: { materiaId: Number(materiaId) },
      include: {
        estudiante: {
          include: { user: true },
        },
      },
    });

    res.json(asistencias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo asistencias" });
  }
};

export const crearAsistencia = async (req, res) => {
  try {
    const { estudianteId, materiaId, fecha, estado } = req.body;

    const asistencia = await prisma.asistencia.create({
      data: {
        estudianteId,
        materiaId,
        fecha: new Date(fecha),
        estado,
      },
    });

    res.json(asistencia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error registrando asistencia" });
  }
};

/* =======================================================
   ⚠ Incidencias
======================================================= */
export const getIncidenciasMateria = async (req, res) => {
  try {
    const { materiaId } = req.params;

    const incidencias = await prisma.incidencia.findMany({
      where: { materiaId: Number(materiaId) },
      include: {
        estudiante: {
          include: { user: true },
        },
      },
    });

    res.json(incidencias);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo incidencias" });
  }
};

export const crearIncidencia = async (req, res) => {
  try {
    const { estudianteId, materiaId, descripcion, fecha } = req.body;

    const incidencia = await prisma.incidencia.create({
      data: {
        estudianteId,
        materiaId,
        descripcion,
        fecha: new Date(fecha),
      },
    });

    res.json(incidencia);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error creando incidencia" });
  }
};
