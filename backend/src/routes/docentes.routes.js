import { Router } from "express";
import {
  getDocentes,
  createDocente,
  updateDocente,
  deleteDocente
} from "../controllers/docentes.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

/* ===========================================
   📌 RUTAS DEL MÓDULO DOCENTES
   =========================================== */

// Listar docentes (ADMIN / DOCENTE)
router.get("/", authMiddleware, getDocentes);

// Crear docente (ADMIN)
router.post("/", authMiddleware, createDocente);

// Actualizar docente (ADMIN)
router.put("/:id", authMiddleware, updateDocente);

// Eliminar docente (ADMIN)
router.delete("/:id", authMiddleware, deleteDocente);

export default router;
