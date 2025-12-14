import { prisma } from "../server.js";
import bcrypt from "bcrypt";

/* ============================================================
   📌 LISTAR DOCENTES
   ============================================================ */
export const getDocentes = async (req, res) => {
  try {
    const docentes = await prisma.docente.findMany({
      include: { user: true }
    });
    res.json(docentes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error obteniendo docentes" });
  }
};


/* ============================================================
   📌 CREAR DOCENTE  (CORREGIDO)
   ============================================================ */
export const createDocente = async (req, res) => {
  try {
    const { nombre, apellido, email, titulo, telefono } = req.body;

    // 1️⃣ Validar email único
    const existe = await prisma.user.findUnique({ where: { email } });
    if (existe)
      return res.status(400).json({ message: "El correo ya está registrado" });

    // 2️⃣ Obtener ID del rol DOCENTE
    const rolDocente = await prisma.role.findUnique({
      where: { nombre: "DOCENTE" }
    });

    if (!rolDocente) {
      return res.status(500).json({
        message: "El rol DOCENTE no existe — créalo en la tabla Role"
      });
    }

    // 3️⃣ Hashear password default
    const hashed = await bcrypt.hash("123456", 10);

    // 4️⃣ Crear usuario
    const user = await prisma.user.create({
      data: {
        nombre,
        apellido,
        email,
        password: hashed,
        roles: {
          create: { roleId: rolDocente.id }   // ← CORRECCIÓN IMPORTANTE
        }
      }
    });

    // 5️⃣ Crear docente vinculado
    const docente = await prisma.docente.create({
      data: {
        userId: user.id,
        titulo,
        telefono
      },
      include: { user: true }
    });

    return res.json({
      message: "Docente creado correctamente",
      docente
    });

  } catch (error) {
    console.error("❌ Error creando docente:", error);
    res.status(500).json({ message: "Error creando docente" });
  }
};


/* ============================================================
   📌 ACTUALIZAR DOCENTE
   ============================================================ */
export const updateDocente = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, titulo, telefono } = req.body;

    const doc = await prisma.docente.findUnique({
      where: { id: Number(id) }
    });

    if (!doc) return res.status(404).json({ message: "Docente no encontrado" });

    // Actualizar datos del docente
    await prisma.docente.update({
      where: { id: Number(id) },
      data: { titulo, telefono }
    });

    // Actualizar datos del usuario asociado
    await prisma.user.update({
      where: { id: doc.userId },
      data: { nombre, apellido }
    });

    return res.json({ message: "Docente actualizado correctamente" });

  } catch (error) {
    console.error("❌ Error actualizando docente:", error);
    res.status(500).json({ message: "Error actualizando docente" });
  }
};


/* ============================================================
   📌 ELIMINAR DOCENTE
   ============================================================ */
export const deleteDocente = async (req, res) => {
  try {
    const { id } = req.params;

    const doc = await prisma.docente.findUnique({
      where: { id: Number(id) }
    });

    if (!doc) return res.status(404).json({ message: "Docente no encontrado" });

    await prisma.docente.delete({ where: { id: Number(id) } });
    await prisma.user.delete({ where: { id: doc.userId } });

    return res.json({ message: "Docente eliminado correctamente" });

  } catch (error) {
    console.error("❌ Error eliminando docente:", error);
    res.status(500).json({ message: "Error al eliminar docente" });
  }
};
