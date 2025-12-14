// src/controllers/teacher.controller.js

import { prisma } from "../server.js";

/* =======================================================
   📘 Obtener materias dictadas por el docente logueado
======================================================== */
export const getMateriasDocente = async (req, res) => {
  try {
    const userId = req.userId;

    // Buscar docente por userId
    const docente = await prisma.docente.findUnique({
      where: { userId },
    });

    if (!docente) {
      return res.status(404).json({ message: "No eres profesor" });
    }

    // Buscar materias asignadas
    const materias = await prisma.materiaDocente.findMany({
      where: { docenteId: docente.id },
      include: { materia: true },
    });

    res.json(materias.map((m) => m.materia));

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo materias del docente" });
  }
};
