// src/middlewares/authTeacher.js
import jwt from "jsonwebtoken";

export const authTeacher = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token)
      return res.status(401).json({ message: "Token no encontrado" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    if (!decoded.roles.includes("DOCENTE")) {
      return res.status(403).json({ message: "No autorizado" });
    }

    req.userId = decoded.id;

    next();
  } catch (error) {
    return res.status(401).json({ message: "Token inválido" });
  }
};
