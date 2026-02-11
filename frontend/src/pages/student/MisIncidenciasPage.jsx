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
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <div>
      <h3 className="fw-bold mb-3"> Faltas de Disciplina</h3>

      <Card className="shadow-sm border-0">
        <Card.Body>
          {loading ? (
            <p className="text-muted">Cargando incidencias...</p>
          ) : incidencias.length === 0 ? (
            <p className="text-muted text-center">
              No registras incidencias disciplinarias.
            </p>
          ) : (
            <Table hover responsive className="align-middle">
              <thead className="table-light">
                <tr>
                  <th>Fecha</th>
                  <th>Descripción</th>
                  <th className="text-center">Estado</th>
                </tr>
              </thead>
              <tbody>
                {incidencias.map((i) => (
                  <tr key={i.id}>
                    <td>{i.fecha.slice(0, 10)}</td>
                    <td>{i.descripcion}</td>
                    <td className="text-center">
                      <Badge bg="danger">Registrada</Badge>
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
