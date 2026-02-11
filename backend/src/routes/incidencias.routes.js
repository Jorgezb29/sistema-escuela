import { Router } from "express";
import {
  getIncidencias,
  createIncidencia,
  deleteIncidencia,
  getIncidenciasByCursoProfesor
} from "../controllers/incidencias.controller.js";
import { authTeacher } from "../middlewares/authTeacher.js";

const router = Router();

router.get("/", getIncidencias);
router.post("/", createIncidencia);
router.delete("/:id", deleteIncidencia);

// 📌 Incidencias por curso (DOCENTE)
router.get(
  "/curso/:cursoId",
  authTeacher,
  getIncidenciasByCursoProfesor
);

export default router;
