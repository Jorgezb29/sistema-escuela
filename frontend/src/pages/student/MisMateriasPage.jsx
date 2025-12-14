import api from "../../api";

import { useEffect, useState } from "react";

export default function MisMateriasPage() {
  const [materias, setMaterias] = useState([]);

  useEffect(() => {
    api.get("/student/materias").then((res) => setMaterias(res.data));
  }, []);

  return (
    <div>
      <h3 className="fw-bold mb-3">📘 Mis Materias</h3>

      <ul className="list-group">
        {materias.map((m) => (
          <li key={m.id} className="list-group-item">
            {m.nombre}
          </li>
        ))}
      </ul>
    </div>
  );
}
