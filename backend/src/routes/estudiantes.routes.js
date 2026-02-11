import { Router } from "express";
import {
  getEstudiantes,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
  getEstudiantesByCursoProfesor
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

export default router;
