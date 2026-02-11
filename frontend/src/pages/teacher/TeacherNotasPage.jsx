import client from "../../api/client";
import { useEffect, useState } from "react";

export default function TeacherNotasPage({ materiaId }) {
  const [notas, setNotas] = useState([]);

  useEffect(() => {
    client.get(`/teacher/notas/${materiaId}`)
      .then(res => setNotas(res.data));
  }, [materiaId]);

  return (
    <div>
      <h3>Notas</h3>
      <table className="table">
        <thead>
          <tr>
            <th>Estudiante</th>
            <th>Nota</th>
          </tr>
        </thead>
        <tbody>
          {notas.map(n => (
            <tr key={n.id}>
              <td>{n.estudiante.user.nombre}</td>
              <td>{n.nota}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
