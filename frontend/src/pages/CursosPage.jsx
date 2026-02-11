import { useEffect, useState } from "react";
import client from "../api/client";
import {
  Table,
  Button,
  Form,
  Card,
  Row,
  Col,
  InputGroup
} from "react-bootstrap";

export default function CursosPage() {
  const [cursos, setCursos] = useState([]);
  const [nombre, setNombre] = useState("");

  const cargar = async () => {
  try {
    const { data } = await client.get("/cursos");

    // Aseguramos que siempre sea un array
    setCursos(Array.isArray(data) ? data : []);
  } catch (error) {
    console.error("❌ Error cargando cursos:", error);

    // Mostrar alerta solo si el backend respondió con error real
    if (error.response) {
      alert(error.response.data?.message || "Error al cargar cursos");
    }
  }
};


  const crear = async (e) => {
    e.preventDefault();

    try {
      await client.post("/cursos", { nombre });
      setNombre("");
      cargar();
    } catch (error) {
      const msg =
        error.response?.data?.message || "Error al crear curso";
      alert(msg);
    }
  };

  useEffect(() => {
  client.get("/cursos")
    .then(res => setCursos(res.data))
    .catch(err => console.log(err));
}, []);

  return (
    <div>
      <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <i className="bi bi-journal-bookmark-fill text-primary fs-3"></i>
        Gestión de Cursos
      </h2>

      <Row>
        {/* FORMULARIO */}
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-plus-circle-fill text-success"></i>
                Registrar Curso
              </h5>

              <Form onSubmit={crear}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre del Curso</Form.Label>
                  <Form.Control
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    placeholder="Ej: 3°B"
                    required
                  />
                </Form.Group>

                <Button type="submit" className="w-100">
                  Guardar Curso
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* TABLA */}
        <Col md={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <InputGroup className="mb-3">
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Buscar curso..."
                  disabled
                />
              </InputGroup>

              <Table hover responsive className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Curso</th>
                    <th className="text-center">Materias</th>
                  </tr>
                </thead>

                <tbody>
                  {cursos.length > 0 ? (
                    cursos.map((c) => (
                      <tr key={c.id}>
                        <td>{c.id}</td>
                        <td className="fw-semibold">{c.nombre}</td>
                        <td className="text-center">
                          <span className="badge bg-primary">
                            {c.materias?.length || 0}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center text-muted py-4">
                        No hay cursos registrados
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
