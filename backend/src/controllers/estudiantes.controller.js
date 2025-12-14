import { prisma } from "../server.js";
import bcrypt from "bcrypt";

/* =========================================================
   📌 OBTENER TODOS LOS ESTUDIANTES
   ========================================================= */
export const getEstudiantes = async (req, res) => {
  try {
    const estudiantes = await prisma.estudiante.findMany({
      include: {
        user: {
          include: {
            roles: {
              include: { role: true }
            }
          }
        }
      }
    });

    res.json(estudiantes);
  } catch (error) {
    console.error("❌ Error al obtener estudiantes:", error);
    res.status(500).json({ message: "Error al obtener estudiantes" });
  }
};

/* =========================================================
   📌 CREAR ESTUDIANTE + USUARIO ASOCIADO
   ========================================================= */
export const createEstudiante = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      email,
      fechaNacimiento,
      direccion,
    } = req.body;

    // 1️⃣ Validar datos obligatorios
    if (!nombre || !apellido || !email) {
      return res.status(400).json({
        message: "Nombre, apellido y email son obligatorios"
      });
    }

    // 2️⃣ Validar email único
    const emailExist = await prisma.user.findUnique({ where: { email } });
    if (emailExist)
      return res.status(400).json({ message: "El correo ya está registrado" });

    // 3️⃣ Generar código de alumno
    const total = await prisma.estudiante.count();
    const codigoAlumno = `ALU-${new Date().getFullYear()}-${String(
      total + 1
    ).padStart(4, "0")}`;

    // 4️⃣ Password por defecto
    const hashed = await bcrypt.hash("123456", 10);

    // 5️⃣ Obtener rol ESTUDIANTE
    const rolEstudiante = await prisma.role.findUnique({
      where: { nombre: "ESTUDIANTE" },
    });

    if (!rolEstudiante) {
      return res.status(500).json({
        message: "El rol ESTUDIANTE no existe en la base de datos",
      });
    }

    // 6️⃣ Crear usuario
    const user = await prisma.user.create({
      data: {
        nombre,
        apellido,
        email,
        password: hashed,
        roles: {
          create: { roleId: rolEstudiante.id },
        },
      },
      include: {
        roles: { include: { role: true } }
      }
    });

    // 7️⃣ Crear estudiante
    const estudiante = await prisma.estudiante.create({
      data: {
        userId: user.id,
        codigoAlumno,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
        direccion,
      },
      include: { user: true },
    });

    return res.json({
      message: "Estudiante creado con éxito",
      estudiante,
    });

  } catch (error) {
    console.error("❌ Error creando estudiante:", error);
    res.status(500).json({ message: "Error creando estudiante" });
  }
};

/* =========================================================
   📌 ACTUALIZAR ESTUDIANTE
   ========================================================= */
export const updateEstudiante = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, apellido, direccion } = req.body;

    const est = await prisma.estudiante.findUnique({
      where: { id: Number(id) },
    });

    if (!est) return res.status(404).json({ message: "No encontrado" });

    // Actualizar estudiante
    await prisma.estudiante.update({
      where: { id: Number(id) },
      data: { direccion },
    });

    // Actualizar datos del usuario
    await prisma.user.update({
      where: { id: est.userId },
      data: { nombre, apellido },
    });

    res.json({ message: "Estudiante actualizado correctamente" });

  } catch (error) {
    console.error("❌ Error al actualizar estudiante:", error);
    res.status(500).json({ message: "Error al actualizar" });
  }
};

/* =========================================================
   📌 ELIMINAR ESTUDIANTE + USUARIO ASOCIADO
   ========================================================= */
export const deleteEstudiante = async (req, res) => {
  try {
    const { id } = req.params;

    const est = await prisma.estudiante.findUnique({
      where: { id: Number(id) },
    });

    if (!est) return res.status(404).json({ message: "No encontrado" });

    // Borrar estudiante
    await prisma.estudiante.delete({
      where: { id: Number(id) },
    });

    // Borrar usuario asociado
    await prisma.user.delete({
      where: { id: est.userId },
    });

    res.json({ message: "Estudiante eliminado correctamente" });

  } catch (error) {
    console.error("❌ Error al eliminar estudiante:", error);
    res.status(500).json({ message: "Error al eliminar" });
  }
};
