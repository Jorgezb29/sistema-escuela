import { Router } from "express";
import { getCursos, createCurso } from "../controllers/cursos.controller.js";

const router = Router();

router.get("/", getCursos);
router.post("/", createCurso);

export default router;
