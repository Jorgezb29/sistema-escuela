import { Router } from "express";
import { chatAsistente } from "../controllers/asistente.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

const router = Router();

router.post("/chat", authMiddleware, chatAsistente);

export default router;
