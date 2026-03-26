import { prisma } from "../server.js";

/* =========================================================
   🔧 HELPER: obtener docenteId desde req.user
   ========================================================= */
const getDocenteId = async (userId) => {
  const docente = await prisma.docente.findUnique({ where: { userId } });
  if (!docente) throw new Error("Docente no encontrado");
  return docente.id;
};

/* =========================================================
   📌 GET /teacher/materias
   Retorna los cursos y materias que dicta el docente
   ========================================================= */
export const getMisMaterias = async (req, res) => {
  try {
    const docenteId = await getDocenteId(req.user.id);

    const cursoMaterias = await prisma.cursoMateria.findMany({
      where: { docenteId },
      include: {
        curso: true,
        materia: true,
      },
    });

    res.json(cursoMaterias);
  } catch (error) {
    console.error("❌ Error obteniendo materias del docente:", error);
    res.status(500).json({ message: "Error obteniendo materias" });
  }
};

/* =========================================================
   📌 GET /teacher/estudiantes/:cursoMateriaId
   Lista de estudiantes de un curso, para una materia dada
   ========================================================= */
export const getEstudiantesPorMateria = async (req, res) => {
  try {
    const docenteId = await getDocenteId(req.user.id);
    const cursoMateriaId = Number(req.params.cursoMateriaId);

    // Verificar que la cursoMateria pertenece al docente
    const cursoMateria = await prisma.cursoMateria.findFirst({
      where: { id: cursoMateriaId, docenteId },
      include: { curso: true, materia: true },
    });

    if (!cursoMateria) {
      return res.status(403).json({ message: "No tienes acceso a esta materia" });
    }

    const estudiantes = await prisma.estudiante.findMany({
      where: { cursoId: cursoMateria.cursoId },
      include: { user: true },
    });

    res.json({ cursoMateria, estudiantes });
  } catch (error) {
    console.error("❌ Error obteniendo estudiantes:", error);
    res.status(500).json({ message: "Error obteniendo estudiantes" });
  }
};

/* =========================================================
   📌 GET /teacher/notas/:cursoMateriaId
   Notas de todos los estudiantes del curso en esa materia
   ========================================================= */
export const getNotas = async (req, res) => {
  try {
    const docenteId = await getDocenteId(req.user.id);
    const cursoMateriaId = Number(req.params.cursoMateriaId);

    const cursoMateria = await prisma.cursoMateria.findFirst({
      where: { id: cursoMateriaId, docenteId },
      include: { curso: true, materia: true },
    });

    if (!cursoMateria) {
      return res.status(403).json({ message: "No tienes acceso a esta materia" });
    }

    const estudiantes = await prisma.estudiante.findMany({
      where: { cursoId: cursoMateria.cursoId },
      include: {
        user: true,
        notas: { where: { materiaId: cursoMateria.materiaId } },
      },
    });

    res.json({ cursoMateria, estudiantes });
  } catch (error) {
    console.error("❌ Error obteniendo notas:", error);
    res.status(500).json({ message: "Error obteniendo notas" });
  }
};

/* =========================================================
   📌 POST /teacher/notas
   Crear o actualizar nota de un estudiante
   ========================================================= */
export const upsertNota = async (req, res) => {
  try {
    const docenteId = await getDocenteId(req.user.id);
    const { estudianteId, cursoMateriaId, nota } = req.body;

    if (!estudianteId || !cursoMateriaId || nota === undefined) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const cursoMateria = await prisma.cursoMateria.findFirst({
      where: { id: Number(cursoMateriaId), docenteId },
    });

    if (!cursoMateria) {
      return res.status(403).json({ message: "No tienes acceso a esta materia" });
    }

    const result = await prisma.nota.upsert({
      where: {
        estudianteId_materiaId: {
          estudianteId: Number(estudianteId),
          materiaId: cursoMateria.materiaId,
        },
      },
      update: { nota: Number(nota), fecha: new Date() },
      create: {
        estudianteId: Number(estudianteId),
        materiaId: cursoMateria.materiaId,
        nota: Number(nota),
        fecha: new Date(),
      },
    });

    res.json({ message: "Nota guardada correctamente", nota: result });
  } catch (error) {
    console.error("❌ Error guardando nota:", error);
    res.status(500).json({ message: "Error guardando nota" });
  }
};

/* =========================================================
   📌 GET /teacher/asistencias/:cursoMateriaId?fecha=YYYY-MM-DD
   Asistencias del día para esa materia
   ========================================================= */
export const getAsistencias = async (req, res) => {
  try {
    const docenteId = await getDocenteId(req.user.id);
    const cursoMateriaId = Number(req.params.cursoMateriaId);
    const fecha = req.query.fecha ? new Date(req.query.fecha) : new Date();

    const cursoMateria = await prisma.cursoMateria.findFirst({
      where: { id: cursoMateriaId, docenteId },
      include: { curso: true, materia: true },
    });

    if (!cursoMateria) {
      return res.status(403).json({ message: "No tienes acceso a esta materia" });
    }

    const inicioDia = new Date(fecha);
    inicioDia.setHours(0, 0, 0, 0);
    const finDia = new Date(fecha);
    finDia.setHours(23, 59, 59, 999);

    const estudiantes = await prisma.estudiante.findMany({
      where: { cursoId: cursoMateria.cursoId },
      include: {
        user: true,
        asistencias: {
          where: {
            materiaId: cursoMateria.materiaId,
            fecha: { gte: inicioDia, lte: finDia },
          },
        },
      },
    });

    res.json({ cursoMateria, estudiantes, fecha: inicioDia });
  } catch (error) {
    console.error("❌ Error obteniendo asistencias:", error);
    res.status(500).json({ message: "Error obteniendo asistencias" });
  }
};

/* =========================================================
   📌 POST /teacher/asistencias
   Guardar asistencias en lote
   Body: { cursoMateriaId, fecha, asistencias: [{ estudianteId, estado }] }
   ========================================================= */
export const saveAsistencias = async (req, res) => {
  try {
    const docenteId = await getDocenteId(req.user.id);
    const { cursoMateriaId, fecha, asistencias } = req.body;

    if (!cursoMateriaId || !fecha || !asistencias?.length) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const cursoMateria = await prisma.cursoMateria.findFirst({
      where: { id: Number(cursoMateriaId), docenteId },
    });

    if (!cursoMateria) {
      return res.status(403).json({ message: "No tienes acceso a esta materia" });
    }

    const fechaDate = new Date(fecha);

    const operaciones = asistencias.map(({ estudianteId, estado }) =>
      prisma.asistencia.upsert({
        where: {
          estudianteId_materiaId_fecha: {
            estudianteId: Number(estudianteId),
            materiaId: cursoMateria.materiaId,
            fecha: fechaDate,
          },
        },
        update: { estado },
        create: {
          estudianteId: Number(estudianteId),
          materiaId: cursoMateria.materiaId,
          fecha: fechaDate,
          estado,
        },
      })
    );

    await prisma.$transaction(operaciones);

    res.json({ message: "Asistencias guardadas correctamente" });
  } catch (error) {
    console.error("❌ Error guardando asistencias:", error);
    res.status(500).json({ message: "Error guardando asistencias" });
  }
};

/* =========================================================
   📌 GET /teacher/incidencias/:cursoMateriaId
   Incidencias de los estudiantes de esa materia
   ========================================================= */
export const getIncidencias = async (req, res) => {
  try {
    const docenteId = await getDocenteId(req.user.id);
    const cursoMateriaId = Number(req.params.cursoMateriaId);

    const cursoMateria = await prisma.cursoMateria.findFirst({
      where: { id: cursoMateriaId, docenteId },
      include: { curso: true, materia: true },
    });

    if (!cursoMateria) {
      return res.status(403).json({ message: "No tienes acceso a esta materia" });
    }

    const incidencias = await prisma.incidencia.findMany({
      where: {
        materiaId: cursoMateria.materiaId,
        estudiante: { cursoId: cursoMateria.cursoId },
      },
      include: { estudiante: { include: { user: true } } },
      orderBy: { fecha: "desc" },
    });

    res.json({ cursoMateria, incidencias });
  } catch (error) {
    console.error("❌ Error obteniendo incidencias:", error);
    res.status(500).json({ message: "Error obteniendo incidencias" });
  }
};

/* =========================================================
   📌 POST /teacher/incidencias
   Registrar incidencia
   ========================================================= */
export const createIncidencia = async (req, res) => {
  try {
    const docenteId = await getDocenteId(req.user.id);
    const { estudianteId, cursoMateriaId, descripcion } = req.body;

    if (!estudianteId || !cursoMateriaId || !descripcion) {
      return res.status(400).json({ message: "Datos incompletos" });
    }

    const cursoMateria = await prisma.cursoMateria.findFirst({
      where: { id: Number(cursoMateriaId), docenteId },
    });

    if (!cursoMateria) {
      return res.status(403).json({ message: "No tienes acceso a esta materia" });
    }

    const incidencia = await prisma.incidencia.create({
      data: {
        estudianteId: Number(estudianteId),
        materiaId: cursoMateria.materiaId,
        descripcion,
        fecha: new Date(),
      },
    });

    res.status(201).json({ message: "Incidencia registrada", incidencia });
  } catch (error) {
    console.error("❌ Error creando incidencia:", error);
    res.status(500).json({ message: "Error creando incidencia" });
  }
};

/* =========================================================
   📌 DELETE /teacher/incidencias/:id
   Eliminar incidencia
   ========================================================= */
export const deleteIncidencia = async (req, res) => {
  try {
    const docenteId = await getDocenteId(req.user.id);
    const id = Number(req.params.id);

    const incidencia = await prisma.incidencia.findUnique({
      where: { id },
      include: { materia: { include: { cursos: { where: { docenteId } } } } },
    });

    if (!incidencia || !incidencia.materia?.cursos?.length) {
      return res.status(403).json({ message: "No tienes permiso para eliminar esta incidencia" });
    }

    await prisma.incidencia.delete({ where: { id } });

    res.json({ message: "Incidencia eliminada" });
  } catch (error) {
    console.error("❌ Error eliminando incidencia:", error);
    res.status(500).json({ message: "Error eliminando incidencia" });
  }
};