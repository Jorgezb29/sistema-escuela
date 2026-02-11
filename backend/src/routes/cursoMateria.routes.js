import { Router } from "express";
import {
  assignMateriasToCurso,
  getMateriasByCurso,
  getCursosMateriasByProfesor
} from "../controllers/cursoMateria.controller.js";
import { authTeacher } from "../middlewares/authTeacher.js";

const router = Router();

// Asignar materias a un curso
router.post("/:id/materias", assignMateriasToCurso);

// Obtener materias de un curso
router.get("/:id/materias", getMateriasByCurso);

// Cursos y materias del profesor
router.get(
  "/profesor/mis-cursos",
  authTeacher,
  getCursosMateriasByProfesor
);

export default router;
