import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/client";

export default function IncidenciasHijoPage() {
  const { id } = useParams();
  const [incidencias, setIncidencias] = useState([]);

  useEffect(() => {
    api.get(`/apoderado/incidencias/${id}`).then(res => setIncidencias(res.data));
  }, [id]);

  return (
    <div>
      <h4>⚠ Incidencias</h4>
      <ul className="list-group">
        {incidencias.map(i => (
          <li key={i.id} className="list-group-item">
            {i.descripcion} — {i.fecha.slice(0,10)}
          </li>
        ))}
      </ul>
    </div>
  );
}
