import { prisma } from "../server.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔹 Validación básica
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Email y contraseña requeridos" });
    }

    // 🔹 Buscar usuario con roles
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        roles: {
          include: { role: true },
        },
      },
    });

    if (!user) {
      return res
        .status(400)
        .json({ message: "Credenciales incorrectas" });
    }

    if (!user.activo) {
      return res
        .status(403)
        .json({ message: "Usuario desactivado" });
    }

    // 🔹 Verificar contraseña
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res
        .status(400)
        .json({ message: "Credenciales incorrectas" });
    }

    // 🔹 Roles normalizados
    const roles = user.roles.map((r) =>
      r.role.nombre.toUpperCase()
    );

    // ✅ TOKEN CORRECTO (SIN FALLBACK)
    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        roles,
      },
      process.env.JWT_SECRET, // 🔥 CLAVE ÚNICA
      { expiresIn: "8h" }
    );

    // 🔹 Respuesta final
    return res.json({
      message: "Inicio de sesión exitoso",
      token,
      user: {
        id: user.id,
        nombre: user.nombre,
        apellido: user.apellido,
        email: user.email,
        roles,
        activo: user.activo,
      },
    });

  } catch (err) {
    console.error("❌ Error en login:", err);
    return res
      .status(500)
      .json({ message: "Error en el servidor" });
  }
};
