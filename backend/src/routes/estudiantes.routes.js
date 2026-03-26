import { Router } from "express";
import {
  getEstudiantes,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
  getEstudiantesByCursoProfesor,
  getMisMaterias,
  getMisNotas,
  getMisAsistencias
} from "../controllers/estudiantes.controller.js";

import { authMiddleware } from "../middlewares/auth.middleware.js";
import { authTeacher } from "../middlewares/authTeacher.js";

const router = Router();

// 📌 Obtener todos (ADMIN, DOCENTE)
router.get("/", authMiddleware, getEstudiantes);

// 📌 Crear estudiante (ADMIN)
router.post("/", authMiddleware, createEstudiante);

// 📌 Actualizar estudiante (ADMIN)
router.put("/:id", authMiddleware, updateEstudiante);

// 📌 Eliminar estudiante (ADMIN)
router.delete("/:id", authMiddleware, deleteEstudiante);

// 📌 Obtener estudiantes por curso (DOCENTE)
router.get(
  "/curso/:cursoId",
  authTeacher,
  getEstudiantesByCursoProfesor
);

// ========================================================
// 🎓 PANEL DEL ESTUDIANTE
// ========================================================

// 📚 Materias del estudiante
router.get(
  "/mis-materias",
  authMiddleware,
  getMisMaterias
);

// 📝 Notas del estudiante
router.get(
  "/mis-notas",
  authMiddleware,
  getMisNotas
);

// 📅 Asistencias del estudiante
router.get(
  "/mis-asistencias",
  authMiddleware,
  getMisAsistencias
);

export default router;