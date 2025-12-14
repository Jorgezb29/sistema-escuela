import jwt from "jsonwebtoken";

export const authStudent = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ message: "Token no encontrado" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // El token puede venir en dos formatos:
    // 1) { id, email, roles }
    // 2) { user: { id, email, roles } }

    const userId = decoded.id || decoded.user?.id;
    const roles = decoded.roles || decoded.user?.roles || [];

    if (!userId) {
      return res.status(401).json({ message: "Token sin ID válido" });
    }

    if (!roles.includes("ESTUDIANTE")) {
      return res.status(403).json({ message: "No autorizado (no es estudiante)" });
    }

    req.userId = userId;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
