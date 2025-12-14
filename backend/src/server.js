import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";

import authRoutes from "./routes/auth.routes.js";
import estudiantesRoutes from "./routes/estudiantes.routes.js";
import docentesRoutes from "./routes/docentes.routes.js";
import cursosRoutes from "./routes/cursos.routes.js";
import materiasRoutes from "./routes/materias.routes.js";
import asistenciasRoutes from "./routes/asistencias.routes.js";
import incidenciasRoutes from "./routes/incidencias.routes.js";
import teacherRoutes from "./routes/teacher.routes.js";



// ADMIN notas
import notasRoutes from "./routes/notas.routes.js";

// STUDENT (rutas personales)
import studentRoutes from "./routes/student.routes.js";

dotenv.config();

export const prisma = new PrismaClient();
const app = express();

/* ====================================================
   ⚙️ MIDDLEWARES
   ==================================================== */

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

/* ====================================================
   📌 RUTAS DEL SISTEMA (ADMIN)
   ==================================================== */

app.use("/api/auth", authRoutes);
app.use("/api/estudiantes", estudiantesRoutes);
app.use("/api/docentes", docentesRoutes);
app.use("/api/cursos", cursosRoutes);
app.use("/api/materias", materiasRoutes);
app.use("/api/asistencias", asistenciasRoutes);
app.use("/api/incidencias", incidenciasRoutes);

// CRUD notas (ADMIN)
app.use("/api/notas", notasRoutes);

/* ====================================================
   📌 RUTAS DEL ESTUDIANTE (solo su propia información)
   ==================================================== */

app.use("/api/student", studentRoutes);

app.use("/api/teacher", teacherRoutes);


/* ====================================================
   SERVIDOR
   ==================================================== */

app.get("/", (req, res) => {
  res.send("Servidor funcionando 🔥");
});

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log("Servidor corriendo en http://localhost:" + PORT);
});
