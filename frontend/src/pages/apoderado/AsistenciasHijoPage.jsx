import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import api from "../../api/client";

export default function AsistenciasHijoPage() {
  const { id } = useParams();
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAsistencias = async () => {
      try {
        const res = await api.get(`/apoderado/asistencias/${id}`);
        setAsistencias(res.data);
      } catch (error) {
        console.error("Error al cargar asistencias:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAsistencias();
  }, [id]);

  if (loading) {
    return (
      <div>
        <h4 className="mb-3">Asistencias</h4>
        <div className="text-muted">Cargando asistencias...</div>
      </div>
    );
  }

  return (
    <div>
      <h4 className="mb-3">Asistencias</h4>

      {asistencias.length === 0 ? (
        <div className="text-muted">No hay asistencias registradas.</div>
      ) : (
        <ul className="list-group">
          {asistencias.map((a) => (
            <li
              key={a.id}
              className="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <strong>{a.materia?.nombre}</strong>
                <div className="small text-muted">
                  {a.fecha?.slice(0, 10)}
                </div>
              </div>

              <span>{a.estado}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}