import { Router } from "express";
import {
  getNotas,
  createNota,
  deleteNota,
  getNotasByCursoMateriaProfesor
} from "../controllers/notas.controller.js";
import { authTeacher } from "../middlewares/authTeacher.js";

const router = Router();

// 📌 Rutas generales
router.get("/", getNotas);
router.post("/", createNota);
router.delete("/:id", deleteNota);

// 📌 Notas por curso y materia (DOCENTE)
router.get(
  "/curso/:cursoId/materia/:materiaId",
  authTeacher,
  getNotasByCursoMateriaProfesor
);

export default router;
