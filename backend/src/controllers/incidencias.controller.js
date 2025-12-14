import prisma from "../config/prisma.js";

export const getIncidencias = async (req, res) => {
  const data = await prisma.incidencia.findMany({
    include: {
      estudiante: { include: { user: true } },
    },
  });
  res.json(data);
};

export const createIncidencia = async (req, res) => {
  const { estudianteId, descripcion, fecha } = req.body;

  const data = await prisma.incidencia.create({
    data: {
      estudianteId: Number(estudianteId),
      descripcion,
      fecha: new Date(fecha),
    },
  });

  res.json(data);
};

export const deleteIncidencia = async (req, res) => {
  const { id } = req.params;

  await prisma.incidencia.delete({
    where: { id: Number(id) },
  });

  res.json({ message: "Incidencia eliminada" });
};
