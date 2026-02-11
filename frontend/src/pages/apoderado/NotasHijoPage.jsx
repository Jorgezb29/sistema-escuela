import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/client";

export default function NotasHijoPage() {
  const { id } = useParams();
  const [notas, setNotas] = useState([]);

  useEffect(() => {
    api.get(`/apoderado/notas/${id}`).then(res => setNotas(res.data));
  }, [id]);

  return (
    <div>
      <h4>📘 Notas</h4>
      <ul className="list-group">
        {notas.map(n => (
          <li key={n.id} className="list-group-item">
            {n.materia.nombre} — <strong>{n.nota}</strong>
          </li>
        ))}
      </ul>
    </div>
  );
}
