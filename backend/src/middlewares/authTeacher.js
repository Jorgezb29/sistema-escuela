import jwt from "jsonwebtoken";

export const authTeacher = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token no encontrado" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id || decoded.user?.id;
    if (!userId) {
      return res.status(401).json({ message: "Token sin ID válido" });
    }

    let roles = decoded.roles || decoded.user?.roles || [];
    roles = roles.map(r => (typeof r === "string" ? r : r.nombre));

    if (!roles.includes("DOCENTE")) {
      return res.status(403).json({ message: "No autorizado (no es docente)" });
    }

    req.userId = userId;
    req.roles = roles;

    next();
  } catch (error) {
    console.error("❌ authTeacher error:", error.message);
    return res.status(401).json({ message: "Token inválido" });
  }
};
