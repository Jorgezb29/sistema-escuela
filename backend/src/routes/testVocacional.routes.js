import { Router } from "express";
import { resolverTestVocacional } from "../controllers/testVocacional.controller.js";
import { authStudent } from "../middlewares/authStudent.js";

const router = Router();

router.post("/resolver", authStudent, resolverTestVocacional);

export default router;
