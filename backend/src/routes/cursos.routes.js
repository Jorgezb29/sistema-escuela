import { Router } from "express";
import { getCursos, createCurso, getMateriasByCursoConDocentes } from "../controllers/cursos.controller.js";
import { asignarDocenteACursoMateria } from "../controllers/cursoMateria.controller.js"; // 👈 NUEVO

const router = Router();

router.get("/", getCursos);
router.post("/", createCurso);
router.get("/:id/docentes", getMateriasByCursoConDocentes); // 👈 NUEVA
router.put("/:cursoId/materias/:materiaId/docente", asignarDocenteACursoMateria); // 👈 NUEVO

export default router;