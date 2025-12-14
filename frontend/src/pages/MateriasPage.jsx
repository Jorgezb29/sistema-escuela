import { useEffect, useState } from "react";
import client from "../api/client";
import {
  Table,
  Card,
  Button,
  Row,
  Col,
  Form,
  Badge,
  InputGroup,
} from "react-bootstrap";

export default function MateriasPage() {
  const [materias, setMaterias] = useState([]);
  const [docentes, setDocentes] = useState([]);
  const [nombre, setNombre] = useState("");
  const [docentesSeleccionados, setDocentesSeleccionados] = useState([]);

  const cargarDatos = async () => {
    const m = await client.get("/materias");
    const d = await client.get("/docentes");

    setMaterias(m.data);
    setDocentes(d.data);
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  const crear = async (e) => {
    e.preventDefault();

    const res = await client.post("/materias", { nombre });
    const nuevaMateriaId = res.data.id;

    if (docentesSeleccionados.length > 0) {
      await client.post(`/materias/${nuevaMateriaId}/docentes`, {
        docentes: docentesSeleccionados,
      });
    }

    setNombre("");
    setDocentesSeleccionados([]);
    cargarDatos();
  };

  const asignarDocentes = async (materiaId) => {
    await client.post(`/materias/${materiaId}/docentes`, {
      docentes: docentesSeleccionados,
    });

    setDocentesSeleccionados([]);
    cargarDatos();
  };

  return (
    <div>
      {/* TÍTULO */}
      <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <i className="bi bi-book-half text-primary fs-3"></i>
        Gestión de Materias
      </h2>

      <Row>
        {/* FORMULARIO */}
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-plus-circle-fill text-success"></i>
                Registrar Materia
              </h5>

              <Form onSubmit={crear}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre de la Materia</Form.Label>
                  <Form.Control
                    placeholder="Ej: Matemáticas"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">
                  <i className="bi bi-save me-2"></i>
                  Guardar Materia
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
                <Form.Control placeholder="Buscar materia..." disabled />
              </InputGroup>

              <Table hover responsive className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Materia</th>
                    <th>Docentes a cargo</th>
                    <th className="text-center">Asignar docentes</th>
                  </tr>
                </thead>

                <tbody>
                  {materias.length > 0 ? (
                    materias.map((m) => (
                      <tr key={m.id}>
                        <td>{m.id}</td>
                        <td className="fw-semibold">{m.nombre}</td>

                        <td>
                          {m.docentes.length === 0 ? (
                            <span className="text-muted">
                              <i className="bi bi-person-x me-1"></i>
                              Sin docentes
                            </span>
                          ) : (
                            m.docentes.map((d) => (
                              <Badge
                                bg="primary"
                                key={d.docente.id}
                                className="me-1 mb-1"
                              >
                                <i className="bi bi-person-badge me-1"></i>
                                {d.docente.user.nombre}{" "}
                                {d.docente.user.apellido}
                              </Badge>
                            ))
                          )}
                        </td>

                        <td style={{ minWidth: "220px" }}>
                          <Form.Select
                            multiple
                            size={3}
                            onChange={(e) =>
                              setDocentesSeleccionados(
                                [...e.target.selectedOptions].map((o) =>
                                  Number(o.value)
                                )
                              )
                            }
                          >
                            {docentes.map((d) => (
                              <option key={d.id} value={d.id}>
                                {d.user.nombre} {d.user.apellido}
                              </option>
                            ))}
                          </Form.Select>

                          <Button
                            size="sm"
                            variant="success"
                            className="mt-2 w-100"
                            onClick={() => asignarDocentes(m.id)}
                          >
                            <i className="bi bi-person-check-fill me-2"></i>
                            Asignar
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        No hay materias registradas
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
