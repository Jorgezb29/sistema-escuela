import api from "../../api";
import { useEffect, useState } from "react";

export default function MisNotasPage() {
  const [notas, setNotas] = useState([]);

  useEffect(() => {
    api.get("/student/notas").then((res) => setNotas(res.data));
  }, []);

  return (
    <div>
      <h3 className="fw-bold mb-3">📝 Mis Notas</h3>

      <table className="table table-bordered">
        <thead>
          <tr>
            <th>Materia</th>
            <th>Nota</th>
            <th>Fecha</th>
          </tr>
        </thead>
        <tbody>
          {notas.map((n) => (
            <tr key={n.id}>
              <td>{n.materia.nombre}</td>
              <td>{n.nota}</td>
              <td>{n.fecha.slice(0, 10)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
