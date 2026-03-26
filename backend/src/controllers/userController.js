import { prisma } from "../server.js";
import bcrypt from "bcryptjs";

/* ==============================
    OBTENER TODOS LOS USUARIOS
================================ */
export const getUsuarios = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        roles: { include: { role: true } },
        estudiante: true,
        docente: true,
        apoderado: true
      },
      orderBy: { createdAt: "desc" }
    });
    res.json(users);
  } catch (error) {
    console.error(" Error obteniendo usuarios:", error);
    res.status(500).json({ message: "Error obteniendo usuarios" });
  }
};

/* ==============================
    OBTENER TODOS LOS ROLES
================================ */
export const getRoles = async (req, res) => {
  try {
    const roles = await prisma.role.findMany();
    res.json(roles);
  } catch (error) {
    console.error(" Error obteniendo roles:", error);
    res.status(500).json({ message: "Error obteniendo roles" });
  }
};

/* ==============================
    CREAR USUARIO
================================ */
export const createUsuario = async (req, res) => {
  try {
    const { nombre, apellido, apellidoP, apellidoM, email, password, activo, roleIds } = req.body;

    if (!nombre || !apellido || !email || !password) {
      return res.status(400).json({ message: "Faltan campos obligatorios" });
    }

    const existe = await prisma.user.findUnique({ where: { email } });
    if (existe) return res.status(400).json({ message: "El email ya está registrado" });

    const hashed = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        nombre,
        apellido,
        apellidoP: apellidoP || null,
        apellidoM: apellidoM || null,
        email,
        password: hashed,
        activo: activo ?? true,
        roles: {
          create: (roleIds || []).map(roleId => ({ roleId: Number(roleId) }))
        }
      },
      include: {
        roles: { include: { role: true } }
      }
    });

    res.status(201).json(user);
  } catch (error) {
    console.error(" Error creando usuario:", error);
    res.status(500).json({ message: "Error creando usuario" });
  }
};

/* ==============================
   ACTUALIZAR USUARIO
================================ */
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, apellidoP, apellidoM, email, password, activo, roleIds } = req.body;

    const data = {
      nombre,
      apellido,
      apellidoP: apellidoP || null,
      apellidoM: apellidoM || null,
      email,
      activo
    };

    if (password && password.trim() !== "") {
      data.password = await bcrypt.hash(password, 10);
    }

    // Actualizar datos básicos
    await prisma.user.update({
      where: { id: Number(id) },
      data
    });

    // Actualizar roles: eliminar los actuales y agregar los nuevos
    if (roleIds !== undefined) {
      await prisma.userRole.deleteMany({ where: { userId: Number(id) } });
      if (roleIds.length > 0) {
        await prisma.userRole.createMany({
          data: roleIds.map(roleId => ({
            userId: Number(id),
            roleId: Number(roleId)
          }))
        });
      }
    }

    const updated = await prisma.user.findUnique({
      where: { id: Number(id) },
      include: { roles: { include: { role: true } } }
    });

    res.json(updated);
  } catch (error) {
    console.error(" Error actualizando usuario:", error);
    res.status(500).json({ message: "Error actualizando usuario" });
  }
};

/* ==============================
    ELIMINAR USUARIO (SEGURO)
================================ */
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const uid = Number(id);

    await prisma.userRole.deleteMany({ where: { userId: uid } });
    await prisma.user.delete({ where: { id: uid } });

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error eliminando usuario:", error);
    res.status(500).json({ message: "Error eliminando usuario" });
  }
};