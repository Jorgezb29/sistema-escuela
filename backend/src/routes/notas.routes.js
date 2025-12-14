import { Router } from "express";
import {
  getNotas,
  createNota,
  deleteNota
} from "../controllers/notas.controller.js";

const router = Router();

router.get("/", getNotas);
router.post("/", createNota);
router.delete("/:id", deleteNota);

export default router;
