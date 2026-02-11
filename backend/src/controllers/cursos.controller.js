import { prisma } from "../server.js";

/* =========================================================
   📌 OBTENER CURSOS
   ========================================================= */
export const getCursos = async (req, res) => {
  try {
    const cursos = await prisma.curso.findMany();

    res.json(cursos);
  } catch (err) {
    console.error("❌ Error obteniendo cursos:", err);
    res.status(500).json({ message: "Error obteniendo cursos" });
  }
};


/* =========================================================
   📌 CREAR CURSO
   ========================================================= */
export const createCurso = async (req, res) => {
  const { nombre } = req.body;

  try {
    if (!nombre || nombre.trim() === "") {
      return res.status(400).json({
        message: "El nombre del curso es obligatorio"
      });
    }

    const existe = await prisma.curso.findUnique({
      where: { nombre }
    });

    if (existe) {
      return res.status(400).json({
        message: "El curso ya existe"
      });
    }

    const curso = await prisma.curso.create({
      data: { nombre }
    });

    res.status(201).json({
      message: "Curso creado correctamente",
      curso
    });
  } catch (err) {
    console.error("❌ Error creando curso:", err);
    res.status(500).json({ message: "Error creando curso" });
  }
};
