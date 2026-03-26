import client from "../../api/client";
import { useEffect, useState } from "react";
import { Card, Table, Badge } from "react-bootstrap";

export default function MisIncidenciasPage() {
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get("/student/incidencias")
      .then((res) => setIncidencias(res.data))
      .catch((error) => console.error("Error al cargar incidencias:", error))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="incidencias-page">
      {/* Título con tu estilo del theme.css */}
      <h3 className="page-title">Faltas de Disciplina</h3>

      <Card className="card-theme border-0">
        <Card.Body className="p-0">
          {loading ? (
            <div className="p-5 text-center">
              <p className="text-muted mb-0">Cargando incidencias...</p>
            </div>
          ) : incidencias.length === 0 ? (
            <div className="p-5 text-center">
              <p className="text-muted mb-0">
                No registras incidencias disciplinarias.
              </p>
            </div>
          ) : (
            <Table hover responsive className="incidencias-table mb-0">
              <thead>
                <tr>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th className="text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {incidencias.map((i) => (
                  <tr key={i.id}>
                    <td className="py-3">{i.fecha?.slice(0, 10)}</td>
                    <td className="py-3">{i.descripcion}</td>
                    <td className="text-center py-3">
                      <Badge bg="danger" className="px-3 py-2 fw-semibold">
                        Registrada
                      </Badge>
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
        .incidencias-page {
          padding: 1.5rem;
        }

        /* Forzar visibilidad de encabezados */
        .incidencias-table thead th {
          background-color: #f8f9fa !important;
          color: #212529 !important;
          font-weight: 700 !important;
          font-size: 0.95rem !important;
          padding: 1.25rem 1.25rem !important;
          border-bottom: 3px solid #dee2e6 !important;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .incidencias-table td {
          padding: 1.15rem 1.25rem !important;
          color: #212529;
          vertical-align: middle;
        }

        .incidencias-table tr:hover {
          background-color: #f8f9fa !important;
        }

        /* Badge más profesional */
        .badge {
          font-size: 0.97rem !important;
          padding: 0.65rem 1.4rem !important;
          border-radius: 50px !important;
          font-weight: 600 !important;
        }

        /* Responsive */
        @media (max-width: 768px) {
          .incidencias-page {
            padding: 1rem;
          }
        }
      `}</style>
    </div>
  );
}