import client from "../../api/client";
import { useEffect, useState } from "react";

export default function TeacherAsistenciasPage({ materiaId }) {
  const [asistencias, setAsistencias] = useState([]);

  useEffect(() => {
    client.get(`/teacher/asistencias/${materiaId}`)
      .then(res => setAsistencias(res.data));
  }, [materiaId]);

  return (
    <div>
      <h3>Asistencias</h3>
      <ul className="list-group">
        {asistencias.map(a => (
          <li key={a.id} className="list-group-item">
            {a.estudiante.user.nombre} - {a.estado}
          </li>
        ))}
      </ul>
    </div>
  );
}
