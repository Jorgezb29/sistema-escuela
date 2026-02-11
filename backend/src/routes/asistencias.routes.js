import { Router } from "express";
import {
  getAsistencias,
  createAsistencia,
  updateAsistencia,
  deleteAsistencia,
  getAsistenciasByCursoMateriaProfesor
} from "../controllers/asistencias.controller.js";
import { authTeacher } from "../middlewares/authTeacher.js";

const router = Router();

router.get("/", getAsistencias);
router.post("/", createAsistencia);
router.put("/:id", updateAsistencia);
router.delete("/:id", deleteAsistencia);

// 📌 Asistencias por curso y materia (DOCENTE)
router.get(
  "/curso/:cursoId/materia/:materiaId",
  authTeacher,
  getAsistenciasByCursoMateriaProfesor
);

export default router;
