import { Router } from "express";

import {
  getDocentes,
  createDocente,
  updateDocente,
  deleteDocente
} from "../controllers/docentes.controller.js";

const router = Router();

/* ===========================================
   📌 RUTAS DEL MÓDULO DOCENTES
   =========================================== */

// Obtener todos los docentes
router.get("/", getDocentes);

// Crear nuevo docente
router.post("/", createDocente);

// Actualizar docente
router.put("/:id", updateDocente);

// Eliminar docente
router.delete("/:id", deleteDocente);

export default router;
