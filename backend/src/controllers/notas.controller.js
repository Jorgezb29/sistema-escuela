import prisma from "../config/prisma.js";

export const getNotas = async (req, res) => {
  const data = await prisma.nota.findMany({
    include: {
      estudiante: { include: { user: true } },
      materia: true,
    },
  });
  res.json(data);
};

export const createNota = async (req, res) => {
  const { estudianteId, materiaId, nota, fecha } = req.body;

  const data = await prisma.nota.create({
    data: {
      estudianteId: Number(estudianteId),
      materiaId: Number(materiaId),
      nota: Number(nota),
      fecha: new Date(fecha),
    },
  });

  res.json(data);
};

export const deleteNota = async (req, res) => {
  const { id } = req.params;

  await prisma.nota.delete({
    where: { id: Number(id) },
  });

  res.json({ message: "Nota eliminada" });
};
