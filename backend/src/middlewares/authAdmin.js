// backend/src/middlewares/authAdmin.js
import jwt from "jsonwebtoken";

export const authAdmin = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({ message: "Token no encontrado" });
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const roles = decoded.roles || [];

    if (!roles.includes("ADMIN")) {
      return res.status(403).json({ message: "No autorizado (ADMIN)" });
    }

    req.userId = decoded.id;
    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
