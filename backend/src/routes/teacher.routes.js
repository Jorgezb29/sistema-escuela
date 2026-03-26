import { Router } from "express";

import { authMiddleware } from "../middlewares/auth.middleware.js"; // ajusta la ruta según tu proyecto
import {
  getMisMaterias,
  getEstudiantesPorMateria,
  getNotas,
  upsertNota,
  getAsistencias,
  saveAsistencias,
  getIncidencias,
  createIncidencia,
  deleteIncidencia,
} from "../controllers/teacher.Controller.js";

const router = Router();

// Todas las rutas requieren token
router.use(authMiddleware);

/* ── Materias y cursos ── */
router.get("/materias", getMisMaterias);

/* ── Estudiantes ── */
router.get("/estudiantes/:cursoMateriaId", getEstudiantesPorMateria);

/* ── Notas ── */
router.get("/notas/:cursoMateriaId", getNotas);
router.post("/notas", upsertNota);

/* ── Asistencias ── */
router.get("/asistencias/:cursoMateriaId", getAsistencias);
router.post("/asistencias", saveAsistencias);

/* ── Incidencias ── */
router.get("/incidencias/:cursoMateriaId", getIncidencias);
router.post("/incidencias", createIncidencia);
router.delete("/incidencias/:id", deleteIncidencia);

export default router;