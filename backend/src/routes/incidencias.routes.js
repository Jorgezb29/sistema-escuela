import { Router } from "express";
import {
  getIncidencias,
  createIncidencia,
  deleteIncidencia
} from "../controllers/incidencias.controller.js";

const router = Router();

router.get("/", getIncidencias);
router.post("/", createIncidencia);
router.delete("/:id", deleteIncidencia);

export default router;
