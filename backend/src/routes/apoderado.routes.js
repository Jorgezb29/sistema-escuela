import { Router } from "express";
import { authApoderado } from "../middlewares/authApoderado.js";
import {
  getHijos,
  getNotasHijo,
  getAsistenciasHijo,
  getIncidenciasHijo
} from "../controllers/apoderado.controller.js";

const router = Router();

router.get("/hijos", authApoderado, getHijos);
router.get("/notas/:id", authApoderado, getNotasHijo);
router.get("/asistencias/:id", authApoderado, getAsistenciasHijo);
router.get("/incidencias/:id", authApoderado, getIncidenciasHijo);

export default router;
