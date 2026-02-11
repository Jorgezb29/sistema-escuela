import jwt from "jsonwebtoken";

export const authStudent = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader)
      return res.status(401).json({ message: "No autenticado" });

    const token = authHeader.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Token inválido" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Normalizamos el usuario
    const user = decoded.user ?? decoded;

    if (!user.id) {
      return res.status(401).json({ message: "Token sin ID válido" });
    }

    if (!user.roles || !user.roles.includes("ESTUDIANTE")) {
      return res.status(403).json({ message: "Acceso solo para estudiantes" });
    }

    // 🔥 CLAVE
    req.user = user;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
