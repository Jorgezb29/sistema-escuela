import { Router } from "express";
import {
  assignMateriasToCurso,
  getMateriasByCurso,
  getCursosMateriasByProfesor
} from "../controllers/cursoMateria.controller.js";
import { authTeacher } from "../middlewares/authTeacher.js";

import { asignarDocenteACursoMateria } from "../controllers/cursoMateria.controller.js"; // agregar al import existente
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

router.put("/:cursoId/materias/:materiaId/docente", asignarDocenteACursoMateria); // 👈 NUEVA
export default router;
