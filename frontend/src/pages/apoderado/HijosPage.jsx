import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/client";

export default function HijosPage() {
  const [hijos, setHijos] = useState([]);

  useEffect(() => {
    api.get("/apoderado/hijos").then(res => setHijos(res.data));
  }, []);

  return (
    <div>
      <h4> Mis hijos</h4>

      <ul className="list-group">
        {hijos.map(h => (
          <li key={h.id} className="list-group-item">
            <strong>{h.user.nombre} {h.user.apellido}</strong>

            <div className="mt-2 d-flex gap-2">
              <Link
                to={`/apoderado/notas/${h.id}`}
                className="btn btn-sm btn-primary"
              >
                 Notas
              </Link>

              <Link
                to={`/apoderado/asistencias/${h.id}`}
                className="btn btn-sm btn-success"
              >
                 Asistencias
              </Link>

              <Link
                to={`/apoderado/incidencias/${h.id}`}
                className="btn btn-sm btn-warning"
              >
                 Incidencias
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
