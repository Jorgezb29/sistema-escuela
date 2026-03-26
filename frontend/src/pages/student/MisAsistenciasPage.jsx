import client from "../../api/client";
import { useEffect, useState } from "react";
import { Card, Table, Badge } from "react-bootstrap";

export default function MisAsistenciasPage() {
  const [asistencias, setAsistencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get("/student/asistencias")
      .then((res) => setAsistencias(res.data))
      .catch((error) => console.error("Error al cargar asistencias:", error))
      .finally(() => setLoading(false));
  }, []);

  const estadoBadge = (estado) => {
    switch (estado?.toLowerCase()) {
      case "presente":
        return <Badge bg="success" className="px-3 py-2 fw-semibold">Presente</Badge>;
      case "ausente":
        return <Badge bg="danger" className="px-3 py-2 fw-semibold">Ausente</Badge>;
      case "atraso":
        return <Badge bg="warning" text="dark" className="px-3 py-2 fw-semibold">Atraso</Badge>;
      default:
        return <Badge bg="secondary" className="px-3 py-2 fw-semibold">{estado}</Badge>;
    }
  };

  return (
    <div className="asistencias-page">
      {/* Título usando tu clase del theme */}
      <h3 className="page-title">Registro de Asistencia</h3>

      <Card className="card-theme border-0">
        <Card.Body className="p-0">
          {loading ? (
            <div className="p-5 text-center">
              <p className="text-muted mb-0">Cargando asistencias...</p>
            </div>
          ) : asistencias.length === 0 ? (
            <div className="p-5 text-center">
              <p className="text-muted mb-0">No hay registros de asistencia aún.</p>
            </div>
          ) : (
            <Table hover responsive className="asistencias-table mb-0">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Materia</th>
                  <th className="text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {asistencias.map((a) => (
                  <tr key={a.id}>
                    <td className="py-3">{a.fecha?.slice(0, 10)}</td>
                    <td className="py-3">{a.materia?.nombre || "—"}</td>
                    <td className="text-center py-3">
                      {estadoBadge(a.estado)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>

      {/* Estilos locales fuertes - CORREGIDO */}
      <style jsx="true">{`
        .asistencias-page {
          padding: 1.5rem;
        }

        /* Forzar visibilidad de los encabezados de la tabla */
        .asistencias-table thead th {
          background-color: #f8f9fa !important;
          color: #212529 !important;
          font-weight: 700 !important;
          font-size: 0.95rem !important;
          padding: 1.25rem 1.25rem !important;
          border-bottom: 3px solid #dee2e6 !important;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .asistencias-table td {
          padding: 1.15rem 1.25rem !important;
          color: #212529;
        }

        .asistencias-table tr:hover {
          background-color: #f8f9fa !important;
        }

        /* Mejorar badges */
        .badge {
          font-size: 0.97rem !important;
          padding: 0.65rem 1.35rem !important;
          border-radius: 50px !important;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .asistencias-page {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}