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

export default function IncidenciasPage() {
  const [incidencias, setIncidencias] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);

  const [form, setForm] = useState({
    estudianteId: "",
    descripcion: "",
    fecha: "",
  });

  useEffect(() => {
    cargarIncidencias();
    cargarEstudiantes();
  }, []);

  const cargarIncidencias = async () => {
    const res = await api.get("/incidencias");
    setIncidencias(res.data);
  };

  const cargarEstudiantes = async () => {
    const res = await api.get("/estudiantes");
    setEstudiantes(res.data);
  };

  const crearIncidencia = async (e) => {
    e.preventDefault();
    await api.post("/incidencias", form);
    setForm({ estudianteId: "", descripcion: "", fecha: "" });
    cargarIncidencias();
  };

  return (
    <div>
      {/* TÍTULO */}
      <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <i className="bi bi-exclamation-triangle-fill text-warning fs-3"></i>
        Gestión de Incidencias
      </h2>

      <Row>
        {/* FORMULARIO */}
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-plus-circle-fill text-warning"></i>
                Registrar Incidencia
              </h5>

              <Form onSubmit={crearIncidencia}>
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
                  <Form.Label>Descripción</Form.Label>
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-chat-left-text"></i>
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="Ej: Falta de respeto en clase"
                      value={form.descripcion}
                      onChange={(e) =>
                        setForm({ ...form, descripcion: e.target.value })
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

                <Button type="submit" variant="warning" className="w-100">
                  <i className="bi bi-save me-2"></i>
                  Registrar Incidencia
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
                    <th>Descripción</th>
                    <th>Fecha</th>
                  </tr>
                </thead>

                <tbody>
                  {incidencias.length > 0 ? (
                    incidencias.map((i) => (
                      <tr key={i.id}>
                        <td className="fw-semibold">
                          <i className="bi bi-person-circle me-1"></i>
                          {i.estudiante.user.nombre}{" "}
                          {i.estudiante.user.apellido}
                        </td>
                        <td>
                          <Badge bg="warning" text="dark">
                            <i className="bi bi-exclamation-circle me-1"></i>
                            {i.descripcion}
                          </Badge>
                        </td>
                        <td>
                          <i className="bi bi-calendar-event me-1"></i>
                          {i.fecha.slice(0, 10)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center text-muted py-4">
                        No hay incidencias registradas
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
