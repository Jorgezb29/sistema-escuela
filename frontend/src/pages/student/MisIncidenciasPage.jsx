import api from "../../api";
import { useEffect, useState } from "react";

export default function MisIncidenciasPage() {
  const [incidencias, setIncidencias] = useState([]);

  useEffect(() => {
    api.get("/student/incidencias").then((res) => setIncidencias(res.data));
  }, []);

  return (
    <div>
      <h3 className="fw-bold mb-3">⚠ Mis Incidencias</h3>

      <ul className="list-group">
        {incidencias.map((i) => (
          <li className="list-group-item" key={i.id}>
            <strong>{i.fecha.slice(0, 10)}</strong> — {i.descripcion}
          </li>
        ))}
      </ul>
    </div>
  );
}
