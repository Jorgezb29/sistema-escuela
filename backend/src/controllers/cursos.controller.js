import { prisma } from "../server.js";

export const getCursos = async (req, res) => {
  try {
    const cursos = await prisma.curso.findMany({
      include: { materias: true, estudiantes: true }
    });
    res.json(cursos);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error obteniendo cursos" });
  }
};

export const createCurso = async (req, res) => {
  const { nombre } = req.body;

  try {
    const curso = await prisma.curso.create({
      data: { nombre }
    });

    res.json({ message: "Curso creado", curso });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error creando curso" });
  }
};
