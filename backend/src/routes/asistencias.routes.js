import { Router } from "express";
import {
  getAsistencias,
  createAsistencia,
  updateAsistencia,
  deleteAsistencia
} from "../controllers/asistencias.controller.js";

const router = Router();

router.get("/", getAsistencias);
router.post("/", createAsistencia);
router.put("/:id", updateAsistencia);
router.delete("/:id", deleteAsistencia);

export default router;
