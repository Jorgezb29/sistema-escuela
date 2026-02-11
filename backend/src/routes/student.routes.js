import { Router } from "express";
import { authStudent } from "../middlewares/authStudent.js";

import {
  getMisMaterias,
  getMisNotas,
  getMisAsistencias,
  getMisIncidencias,
  getMiPerfil
} from "../controllers/student.controller.js";

const router = Router();

// Todas requieren token del estudiante
router.get("/materias", authStudent, getMisMaterias);
router.get("/notas", authStudent, getMisNotas);
router.get("/asistencias", authStudent, getMisAsistencias);
router.get("/incidencias", authStudent, getMisIncidencias);
router.get("/perfil", authStudent, getMiPerfil);

export default router;
