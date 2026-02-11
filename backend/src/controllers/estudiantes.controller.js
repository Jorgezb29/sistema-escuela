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
          select: {
            id: true,
            email: true,
            nombre: true,
            apellido: true
          }
        },
        curso: {
          select: {
            id: true,
            nombre: true
          }
        },
        tutor: {
          select: {
            id: true,
            nombre: true,
            dni: true,
            email: true,
            telefono: true
          }
        }
      }
    });

    res.json(estudiantes);
  } catch (error) {
  // ⚠️ Email duplicado (User.email)
  if (error.code === "P2002") {
    return res.status(400).json({
      message: "Ya existe un usuario con ese DNI (correo duplicado)"
    });
  }

  console.error("❌ Error creando estudiante:", error);
  res.status(500).json({ message: "Error creando estudiante" });
}
};

/* =========================================================
   📌 CREAR ESTUDIANTE + USUARIO + TUTOR (AUTOMÁTICO)
   ========================================================= */
export const createEstudiante = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      dni,
      cursoId,
      fechaNacimiento,
      direccion,
      tutorNombre,
      tutorEmail,
      tutorTelefono,
      tutorDni
    } = req.body;

    if (!dni || !cursoId || !tutorNombre || !tutorEmail || !tutorDni) {
      return res.status(400).json({ message: "Faltan datos obligatorios" });
    }

    // 1️⃣ Verificar estudiante duplicado
    const existe = await prisma.estudiante.findUnique({ where: { dni } });
    if (existe) {
      return res.status(400).json({ message: "El estudiante ya existe" });
    }

    // 2️⃣ Roles
    const rolEstudiante = await prisma.role.findUnique({
      where: { nombre: "ESTUDIANTE" }
    });
    const rolApoderado = await prisma.role.findUnique({
      where: { nombre: "APODERADO" }
    });

    if (!rolEstudiante || !rolApoderado) {
      return res.status(500).json({ message: "Roles no configurados" });
    }

    // 3️⃣ Crear o reutilizar TUTOR
    let tutor = await prisma.tutor.findUnique({
      where: { dni: tutorDni }
    });

    if (!tutor) {
      tutor = await prisma.tutor.create({
        data: {
          nombre: tutorNombre,
          dni: tutorDni,
          email: tutorEmail,
          telefono: tutorTelefono
        }
      });
    }

    // 4️⃣ Crear o reutilizar USER APODERADO
    let userApoderado = await prisma.user.findUnique({
      where: { email: tutorEmail }
    });

    if (!userApoderado) {
      userApoderado = await prisma.user.create({
        data: {
          nombre: tutorNombre,
          apellido: "Apoderado",
          email: tutorEmail,
          password: await bcrypt.hash(tutorDni, 10),
          activo: true,
          roles: {
            create: [{ roleId: rolApoderado.id }]
          }
        }
      });
    }

    // 5️⃣ Crear APODERADO (CLAVE 🔥)
    let apoderado = await prisma.apoderado.findUnique({
      where: { tutorId: tutor.id }
    });

    if (!apoderado) {
      apoderado = await prisma.apoderado.create({
        data: {
          userId: userApoderado.id,
          tutorId: tutor.id,
          parentesco: "Tutor"
        }
      });
    }

    // 6️⃣ Crear USER ESTUDIANTE
    const userEstudiante = await prisma.user.create({
      data: {
        nombre,
        apellido,
        email: `${dni}@sdblasvillas.du.bo`,
        password: await bcrypt.hash(dni, 10),
        activo: true,
        roles: {
          create: [{ roleId: rolEstudiante.id }]
        }
      }
    });

    // 7️⃣ Crear ESTUDIANTE
    const estudiante = await prisma.estudiante.create({
      data: {
        dni,
        userId: userEstudiante.id,
        cursoId: Number(cursoId),
        tutorId: tutor.id,
        fechaNacimiento: fechaNacimiento ? new Date(fechaNacimiento) : null,
        direccion
      }
    });

    res.status(201).json({
      message: "Estudiante creado correctamente",
      estudiante
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
    const { direccion, cursoId } = req.body;

    const estudiante = await prisma.estudiante.findUnique({
      where: { id: Number(id) }
    });

    if (!estudiante) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    await prisma.estudiante.update({
      where: { id: Number(id) },
      data: {
        direccion,
        cursoId: cursoId ? Number(cursoId) : undefined
      }
    });

    res.json({ message: "Estudiante actualizado correctamente" });
  } catch (error) {
    console.error("❌ Error al actualizar estudiante:", error);
    res.status(500).json({ message: "Error al actualizar" });
  }
};

/* =========================================================
   📌 ELIMINAR ESTUDIANTE + USUARIO
   ========================================================= */
export const deleteEstudiante = async (req, res) => {
  try {
    const { id } = req.params;

    const estudiante = await prisma.estudiante.findUnique({
      where: { id: Number(id) },
    });

    if (!estudiante) {
      return res.status(404).json({ message: "Estudiante no encontrado" });
    }

    // 1️⃣ Eliminar dependencias del estudiante
    await prisma.asistencia.deleteMany({
      where: { estudianteId: estudiante.id },
    });

    await prisma.nota.deleteMany({
      where: { estudianteId: estudiante.id },
    });

    await prisma.incidencia.deleteMany({
      where: { estudianteId: estudiante.id },
    });

    // 2️⃣ Eliminar estudiante
    await prisma.estudiante.delete({
      where: { id: estudiante.id },
    });

    // 3️⃣ Eliminar roles del usuario (CLAVE 🔥)
    await prisma.userRole.deleteMany({
      where: { userId: estudiante.userId },
    });

    // 4️⃣ Eliminar usuario
    await prisma.user.delete({
      where: { id: estudiante.userId },
    });

    res.json({ message: "Estudiante eliminado correctamente" });

  } catch (error) {
    console.error("❌ Error al eliminar estudiante:", error);
    res.status(500).json({ message: "Error al eliminar" });
  }
};

/* =========================================================
   📌 OBTENER ESTUDIANTES POR CURSO (PROFESOR)
   ========================================================= */
export const getEstudiantesByCursoProfesor = async (req, res) => {
  try {
    const { cursoId } = req.params;

    const estudiantes = await prisma.estudiante.findMany({
      where: {
        cursoId: Number(cursoId)
      },
      include: {
        user: {
          select: {
            id: true,
            nombre: true,
            apellido: true,
            email: true
          }
        }
      }
    });

    res.json(estudiantes);
  } catch (error) {
    console.error("❌ Error obteniendo estudiantes por curso:", error);
    res.status(500).json({
      message: "Error al obtener estudiantes del curso"
    });
  }
};

