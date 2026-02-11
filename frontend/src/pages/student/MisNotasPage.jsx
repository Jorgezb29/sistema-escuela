import client from "../../api/client";
import { useEffect, useState } from "react";
import { Card, Table, Badge } from "react-bootstrap";

export default function MisNotasPage() {
  const [notas, setNotas] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    client
      .get("/student/notas")
      .then((res) => setNotas(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const estadoNota = (nota) => {
    if (nota >= 4) {
      return <Badge bg="success">Aprobado</Badge>;
    }
    return <Badge bg="danger">Reprobado</Badge>;
  };

  const promedio =
    notas.length > 0
      ? (
          notas.reduce((sum, n) => sum + n.nota, 0) / notas.length
        ).toFixed(2)
      : null;

  return (
    <div>
      <h3 className="fw-bold mb-3"> Historial de Notas</h3>

      <Card className="shadow-sm border-0">
        <Card.Body>
          {loading ? (
            <p className="text-muted">Cargando notas...</p>
          ) : notas.length === 0 ? (
            <p className="text-muted text-center">
              No existen notas registradas.
            </p>
          ) : (
            <>
              <Table hover responsive className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Materia</th>
                    <th className="text-center">Nota</th>
                    <th className="text-center">Estado</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {notas.map((n) => (
                    <tr key={n.id}>
                      <td>{n.materia?.nombre}</td>
                      <td className="text-center fw-bold">
                        {n.nota.toFixed(1)}
                      </td>
                      <td className="text-center">
                        {estadoNota(n.nota)}
                      </td>
                      <td>{n.fecha.slice(0, 10)}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>

              {promedio && (
                <div className="text-end fw-bold mt-3">
                  Promedio General:{" "}
                  <span className="text-primary">{promedio}</span>
                </div>
              )}
            </>
          )}
        </Card.Body>
      </Card>
    </div>
  );
}
