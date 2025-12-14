import { useEffect, useState } from "react";
import api from "../../api";

export default function TeacherMateriasPage() {
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    api.get("/teacher/materias")
      .then(res => setMaterias(res.data))
      .catch(() => alert("Error cargando materias"));
  }, []);

  return (
    <div>
      <h3 className="fw-bold mb-3">📘 Materias que dicto</h3>

      <ul className="list-group">
        {materias.map(m => (
          <li key={m.id} className="list-group-item">{m.nombre}</li>
        ))}
      </ul>
    </div>
  );
}
