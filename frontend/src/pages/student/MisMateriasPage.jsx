import { useEffect, useState } from "react";
import client from "../../api/client";
import { Card, Table, Alert, Spinner } from "react-bootstrap";

export default function MisMateriasPage() {
  const [materias, setMaterias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const cargarMaterias = async () => {
      try {
        const res = await client.get("/student/materias");

        if (Array.isArray(res.data)) {
          setMaterias(res.data);
        } else {
          setMaterias([]);
        }
      } catch (err) {
        console.error(err);
        setError(
          err.response?.status === 401
            ? "No estás autorizado para ver tus materias"
            : "Error al cargar las materias"
        );
      } finally {
        setLoading(false);
      }
    };

    cargarMaterias();
  }, []);

  /* ===============================
        ESTADOS DE UI
  =============================== */

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p className="mt-2">Cargando materias...</p>
      </div>
    );
  }

  if (error) {
    return <Alert variant="danger">{error}</Alert>;
  }

  return (
    <Card className="shadow-sm">
      <Card.Body>
        <h4 className="fw-bold mb-3"> Mis Materias</h4>

        {materias.length === 0 ? (
          <Alert variant="secondary">
            No tienes materias asignadas actualmente.
          </Alert>
        ) : (
          <Table bordered hover responsive>
            <thead className="table-light">
              <tr>
                <th>#</th>
                <th>Materia</th>
              </tr>
            </thead>
            <tbody>
              {materias.map((m, index) => (
                <tr key={m.id}>
                  <td>{index + 1}</td>
                  <td>{m.nombre}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Card.Body>
    </Card>
  );
}
