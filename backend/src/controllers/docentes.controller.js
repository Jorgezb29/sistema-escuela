import { prisma } from "../server.js";
import bcrypt from "bcrypt";

/* =========================================================
   📌 LISTAR DOCENTES
   ========================================================= */
export const getDocentes = async (req, res) => {
  try {
    const docentes = await prisma.docente.findMany({
      include: {
        user: true,
      },
    });

    res.json(docentes);
  } catch (error) {
    console.error("❌ Error obteniendo docentes:", error);
    res.status(500).json({ message: "Error obteniendo docentes" });
  }
};

/* =========================================================
   📌 CREAR DOCENTE (AUTOMÁTICO)
   ========================================================= */
export const createDocente = async (req, res) => {
  try {
    const { nombre, apellido, dni, titulo, telefono } = req.body;

    // 1️⃣ Validaciones
    if (!nombre || !apellido || !dni) {
      return res.status(400).json({
        message: "Nombre, apellido y DNI son obligatorios",
      });
    }

    // 2️⃣ Email automático
    const email = `${dni}@sdblasvillas.du.bo`;

    const emailExist = await prisma.user.findUnique({
      where: { email },
    });

    if (emailExist) {
      return res
        .status(400)
        .json({ message: "El docente ya existe" });
    }

    // 3️⃣ Rol DOCENTE
    const rolDocente = await prisma.role.findUnique({
      where: { nombre: "DOCENTE" },
    });

    if (!rolDocente) {
      return res.status(500).json({
        message: "El rol DOCENTE no existe en la base de datos",
      });
    }

    // 4️⃣ Password = DNI
    const passwordHash = await bcrypt.hash(dni, 10);

    // 5️⃣ Crear usuario
    const user = await prisma.user.create({
      data: {
        nombre,
        apellido,
        email,
        password: passwordHash,
        roles: {
          create: { roleId: rolDocente.id },
        },
      },
    });

    // 6️⃣ Crear docente
    const docente = await prisma.docente.create({
      data: {
        userId: user.id,
        titulo,
        telefono,
      },
      include: { user: true },
    });

    res.status(201).json({
      message: "Docente creado correctamente",
      acceso: {
        email,
        password: dni,
      },
      docente,
    });
  } catch (error) {
    console.error("❌ Error creando docente:", error);
    res.status(500).json({ message: "Error creando docente" });
  }
};

/* =========================================================
   📌 ACTUALIZAR DOCENTE
   ========================================================= */
export const updateDocente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, titulo, telefono } = req.body;

    const docente = await prisma.docente.findUnique({
      where: { id: Number(id) },
    });

    if (!docente) {
      return res.status(404).json({ message: "Docente no encontrado" });
    }

    await prisma.docente.update({
      where: { id: Number(id) },
      data: { titulo, telefono },
    });

    await prisma.user.update({
      where: { id: docente.userId },
      data: { nombre, apellido },
    });

    res.json({ message: "Docente actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error actualizando docente:", error);
    res.status(500).json({ message: "Error actualizando docente" });
  }
};

/* =========================================================
   📌 ELIMINAR DOCENTE
   ========================================================= */
export const deleteDocente = async (req, res) => {
  try {
    const { id } = req.params;

    const docente = await prisma.docente.findUnique({
      where: { id: Number(id) },
    });

    if (!docente) {
      return res.status(404).json({ message: "Docente no encontrado" });
    }

    await prisma.docente.delete({
      where: { id: Number(id) },
    });

    await prisma.user.delete({
      where: { id: docente.userId },
    });

    res.json({ message: "Docente eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error eliminando docente:", error);
    res.status(500).json({ message: "Error al eliminar docente" });
  }
};
