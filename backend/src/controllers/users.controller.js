import { prisma } from "../server.js";

/* ==============================
    OBTENER TODOS LOS USUARIOS
================================ */
export const getUsuarios = async (req, res) => {
  try {
    const users = await prisma.user.findMany({
      include: {
        roles: {
          include: { role: true }
        },
        estudiante: true,
        docente: true,
        apoderado: true
      }
    });

    res.json(users);
  } catch (error) {
    console.error("❌ Error obteniendo usuarios:", error);
    res.status(500).json({ message: "Error obteniendo usuarios" });
  }
};

/* ==============================
   ACTUALIZAR USUARIO
================================ */
export const updateUsuario = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, email, activo } = req.body;

    await prisma.user.update({
      where: { id: Number(id) },
      data: { nombre, apellido, email, activo }
    });

    res.json({ message: "Usuario actualizado" });
  } catch (error) {
    console.error("❌ Error actualizando usuario:", error);
    res.status(500).json({ message: "Error actualizando usuario" });
  }
};

/* ==============================
    ELIMINAR USUARIO (SEGURO)
================================ */
export const deleteUsuario = async (req, res) => {
  try {
    const { id } = req.params;

    // 1️⃣ eliminar roles
    await prisma.userRole.deleteMany({
      where: { userId: Number(id) }
    });

    // 2️⃣ eliminar usuario
    await prisma.user.delete({
      where: { id: Number(id) }
    });

    res.json({ message: "Usuario eliminado correctamente" });
  } catch (error) {
    console.error("❌ Error eliminando usuario:", error);
    res.status(500).json({ message: "Error eliminando usuario" });
  }
};
