import api from "../../api";
import { useEffect, useState } from "react";

export default function MisAsistenciasPage() {
  const [asistencias, setAsistencias] = useState([]);

  useEffect(() => {
    api.get("/student/asistencias").then((res) => setAsistencias(res.data));
  }, []);

  return (
    <div>
      <h3 className="fw-bold mb-3">📅 Mis Asistencias</h3>

      <table className="table">
        <thead>
          <tr>
            <th>Materia</th>
            <th>Fecha</th>
            <th>Estado</th>
          </tr>
        </thead>

        <tbody>
          {asistencias.map((a) => (
            <tr key={a.id}>
              <td>{a.materia.nombre}</td>
              <td>{a.fecha.slice(0, 10)}</td>
              <td>{a.estado}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
