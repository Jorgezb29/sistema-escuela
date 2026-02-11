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
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const estadoBadge = (estado) => {
    switch (estado.toLowerCase()) {
      case "presente":
        return <Badge bg="success">Presente</Badge>;
      case "ausente":
        return <Badge bg="danger">Ausente</Badge>;
      case "atraso":
        return <Badge bg="warning" text="dark">Atraso</Badge>;
      default:
        return <Badge bg="secondary">{estado}</Badge>;
    }
  };

  return (
    <div>
      <h3 className="fw-bold mb-3"> Registro de Asistencia</h3>

      <Card className="shadow-sm border-0">
        <Card.Body>
          {loading ? (
            <p className="text-muted">Cargando asistencias...</p>
          ) : asistencias.length === 0 ? (
            <p className="text-muted text-center">
              No hay registros de asistencia.
            </p>
          ) : (
            <Table hover responsive className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Fecha</th>
                  <th>Materia</th>
                  <th className="text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {asistencias.map((a) => (
                  <tr key={a.id}>
                    <td>{a.fecha.slice(0, 10)}</td>
                    <td>{a.materia?.nombre}</td>
                    <td className="text-center">
                      {estadoBadge(a.estado)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
