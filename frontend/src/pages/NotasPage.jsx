import { useEffect, useState } from "react";
import api from "../api";
import {
  Card,
  Row,
  Col,
  Form,
  Button,
  Table,
  InputGroup,
  Badge,
} from "react-bootstrap";

export default function NotasPage() {
  const [notas, setNotas] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [materias, setMaterias] = useState([]);

  const [form, setForm] = useState({
    estudianteId: "",
    materiaId: "",
    nota: "",
    fecha: "",
  });

  useEffect(() => {
    cargarNotas();
    cargarEstudiantes();
    cargarMaterias();
  }, []);

  const cargarNotas = async () => {
    const res = await api.get("/notas");
    setNotas(res.data);
  };

  const cargarEstudiantes = async () => {
    const res = await api.get("/estudiantes");
    setEstudiantes(res.data);
  };

  const cargarMaterias = async () => {
    const res = await api.get("/materias");
    setMaterias(res.data);
  };

  const crearNota = async (e) => {
    e.preventDefault();
    await api.post("/notas", form);
    setForm({ estudianteId: "", materiaId: "", nota: "", fecha: "" });
    cargarNotas();
  };

  return (
    <div>
      {/* TÍTULO */}
      <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <i className="bi bi-journal-check text-success fs-3"></i>
        Gestión de Notas
      </h2>

      <Row>
        {/* FORMULARIO */}
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-plus-circle-fill text-primary"></i>
                Registrar Nota
              </h5>

              <Form onSubmit={crearNota}>
                <Form.Group className="mb-3">
                  <Form.Label>Estudiante</Form.Label>
                  <Form.Select
                    value={form.estudianteId}
                    onChange={(e) =>
                      setForm({ ...form, estudianteId: e.target.value })
                    }
                    required
                  >
                    <option value="">Seleccione estudiante</option>
                    {estudiantes.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.user.nombre} {e.user.apellido}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Materia</Form.Label>
                  <Form.Select
                    value={form.materiaId}
                    onChange={(e) =>
                      setForm({ ...form, materiaId: e.target.value })
                    }
                    required
                  >
                    <option value="">Seleccione materia</option>
                    {materias.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Nota</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-123"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="number"
                      placeholder="Ej: 85"
                      value={form.nota}
                      onChange={(e) =>
                        setForm({ ...form, nota: e.target.value })
                      }
                      required
                    />
                  </InputGroup>
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    value={form.fecha}
                    onChange={(e) =>
                      setForm({ ...form, fecha: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Button type="submit" variant="success" className="w-100">
                  <i className="bi bi-save me-2"></i>
                  Registrar Nota
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* TABLA */}
        <Col md={8}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <Table hover responsive className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Estudiante</th>
                    <th>Materia</th>
                    <th>Nota</th>
                    <th>Fecha</th>
                  </tr>
                </thead>

                <tbody>
                  {notas.length > 0 ? (
                    notas.map((n) => (
                      <tr key={n.id}>
                        <td className="fw-semibold">
                          <i className="bi bi-person-circle me-1"></i>
                          {n.estudiante.user.nombre}{" "}
                          {n.estudiante.user.apellido}
                        </td>
                        <td>
                          <Badge bg="primary">
                            <i className="bi bi-book me-1"></i>
                            {n.materia.nombre}
                          </Badge>
                        </td>
                        <td>
                          <Badge
                            bg={n.nota >= 51 ? "success" : "danger"}
                          >
                            {n.nota}
                          </Badge>
                        </td>
                        <td>
                          <i className="bi bi-calendar-event me-1"></i>
                          {n.fecha.slice(0, 10)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        No hay notas registradas
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
