// src/routes/teacher.routes.js

import { Router } from "express";
import { authTeacher } from "../middlewares/authTeacher.js";
import { getMateriasDocente } from "../controllers/teacher.controller.js";

const router = Router();

router.get("/materias", authTeacher, getMateriasDocente);

export default router;
