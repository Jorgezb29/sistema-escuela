import { prisma } from "../server.js";

export const getNotasByStudent = async (req, res) => {
  try {
    const userId = req.userId; // viene del middleware authStudent

    const estudiante = await prisma.estudiante.findUnique({
      where: { userId },
    });

    if (!estudiante) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    const notas = await prisma.nota.findMany({
      where: { estudianteId: estudiante.id },
      include: { materia: true },
    });

    res.json(notas);

  } catch (error) {
    console.error("❌ Error obteniendo notas:", error);
    res.status(500).json({ message: "Error en el servidor" });
  }
};

