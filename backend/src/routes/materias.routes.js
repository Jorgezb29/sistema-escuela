import { Router } from "express";
import {
  getMaterias,
  createMateria,
  assignDocentesToMateria
} from "../controllers/materias.controller.js";

const router = Router();

router.get("/", getMaterias);
router.post("/", createMateria);
router.post("/:id/docentes", assignDocentesToMateria);

export default router;
