import jwt from "jsonwebtoken";

export const authApoderado = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
      return res.status(401).json({ message: "Token no encontrado" });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const userId = decoded.id || decoded.user?.id;
    const roles = decoded.roles || decoded.user?.roles || [];

    if (!userId) {
      return res.status(401).json({ message: "Token sin ID válido" });
    }

    if (!roles.includes("APODERADO")) {
      return res.status(403).json({ message: "No autorizado (no es apoderado)" });
    }

    req.userId = userId;
    next();

  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
