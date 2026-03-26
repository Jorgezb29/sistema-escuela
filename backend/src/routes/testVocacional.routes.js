import { Router } from "express";
import {
  resolverTestVocacional,
  obtenerHistorialVocacional,
  obtenerTodosLosResultados,
} from "../controllers/testVocacional.controller.js";
import { authStudent } from "../middlewares/authStudent.js";

const router = Router();

// Estudiante: resolver test y guardar resultado
router.post("/resolver", authStudent, resolverTestVocacional);

// Estudiante: ver su propio historial
router.get("/historial", authStudent, obtenerHistorialVocacional);

// Admin/Docente: ver todos los resultados (agrega tu middleware de auth según tu sistema)
router.get("/todos", obtenerTodosLosResultados);

export default router;