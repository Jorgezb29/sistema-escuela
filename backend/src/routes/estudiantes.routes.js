import { Router } from "express";
import {
  getEstudiantes,
  createEstudiante,
  updateEstudiante,
  deleteEstudiante,
} from "../controllers/estudiantes.controller.js";

const router = Router();

// 📌 Obtener todos
router.get("/", getEstudiantes);

// 📌 Crear estudiante
router.post("/", createEstudiante);

// 📌 Actualizar estudiante
router.put("/:id", updateEstudiante);

// 📌 Eliminar estudiante + usuario asociado
router.delete("/:id", deleteEstudiante);

export default router;
