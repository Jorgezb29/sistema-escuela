import { Router } from "express";
import { authAdmin } from "../middlewares/authAdmin.js";
import {
  getUsuarios,
  updateUsuario,
  deleteUsuario
} from "../controllers/users.controller.js";

const router = Router();

router.get("/users", authAdmin, getUsuarios);
router.put("/users/:id", authAdmin, updateUsuario);
router.delete("/users/:id", authAdmin, deleteUsuario);

export default router;
