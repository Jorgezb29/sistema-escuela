import client from "../../api/client";
import { useEffect, useState } from "react";

export default function TeacherIncidenciasPage({ materiaId }) {
  const [incidencias, setIncidencias] = useState([]);

  useEffect(() => {
    client.get(`/teacher/incidencias/${materiaId}`)
      .then(res => setIncidencias(res.data));
  }, [materiaId]);

  return (
    <div>
      <h3>Incidencias</h3>
      <ul className="list-group">
        {incidencias.map(i => (
          <li key={i.id} className="list-group-item">
            {i.estudiante.user.nombre}: {i.descripcion}
          </li>
        ))}
      </ul>
    </div>
  );
}
