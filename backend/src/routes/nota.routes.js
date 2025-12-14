import { Router } from "express";
import { authStudent } from "../middlewares/authStudent.js";
import { getNotasByStudent } from "../controllers/nota.controller.js";

const router = Router();

// Ruta del estudiante
router.get("/mis-notas", authStudent, getNotasByStudent);

export default router;
