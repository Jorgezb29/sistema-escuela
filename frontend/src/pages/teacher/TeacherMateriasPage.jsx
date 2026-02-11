import client from "../../api/client";
import { useEffect, useState } from "react";

export default function TeacherMateriasPage() {
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    client.get("/teacher/materias").then(res => setMaterias(res.data));
  }, []);

  return (
    <div>
      <h3>Mis Materias</h3>
      <ul className="list-group">
        {materias.map(m => (
          <li key={m.id} className="list-group-item">
            <strong>{m.nombre}</strong>
            <div className="text-muted">
              Cursos: {m.cursos.map(c => c.nombre).join(", ")}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
