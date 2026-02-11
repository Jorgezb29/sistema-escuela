// src/routes/teacher.routes.js
import { Router } from "express";
import { authTeacher } from "../middlewares/authTeacher.js";

import {
  getMateriasDocente,
  getEstudiantesPorMateria,
  getNotasMateria,
  crearNota,
  getAsistenciasMateria,
  crearAsistencia,
  getIncidenciasMateria,
  crearIncidencia,
} from "../controllers/teacher.controller.js";

const router = Router();

/* =======================================================
   📘 Materias y cursos del docente
======================================================= */
router.get("/materias", authTeacher, getMateriasDocente);

/* =======================================================
   👨‍🎓 Estudiantes por materia
======================================================= */
router.get(
  "/materia/:materiaId/estudiantes",
  authTeacher,
  getEstudiantesPorMateria
);

/* =======================================================
   📝 Notas
======================================================= */
router.get(
  "/notas/:materiaId",
  authTeacher,
  getNotasMateria
);

router.post(
  "/notas",
  authTeacher,
  crearNota
);

/* =======================================================
   📅 Asistencias
======================================================= */
router.get(
  "/asistencias/:materiaId",
  authTeacher,
  getAsistenciasMateria
);

router.post(
  "/asistencias",
  authTeacher,
  crearAsistencia
);

/* =======================================================
   ⚠ Incidencias
======================================================= */
router.get(
  "/incidencias/:materiaId",
  authTeacher,
  getIncidenciasMateria
);

router.post(
  "/incidencias",
  authTeacher,
  crearIncidencia
);

export default router;
