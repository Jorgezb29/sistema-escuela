import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/client";

export default function AsistenciasHijoPage() {
  const { id } = useParams();
  const [asistencias, setAsistencias] = useState([]);

  useEffect(() => {
    api.get(`/apoderado/asistencias/${id}`).then(res => setAsistencias(res.data));
  }, [id]);

  return (
    <div>
      <h4> Asistencias</h4>
      <ul className="list-group">
        {asistencias.map(a => (
          <li key={a.id} className="list-group-item">
            {a.materia.nombre} — {a.estado} — {a.fecha.slice(0,10)}
          </li>
        ))}
      </ul>
    </div>
  );
}
