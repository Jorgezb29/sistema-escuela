import { useEffect, useState } from "react";
import api from "../api/client";
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

export default function AsistenciasPage() {
  const [asistencias, setAsistencias] = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [materias, setMaterias] = useState([]);

  const [form, setForm] = useState({
    estudianteId: "",
    materiaId: "",
    estado: "",
    fecha: "",
  });

  /* ============================
     CARGA INICIAL
  ============================ */
  useEffect(() => {
    cargarAsistencias();
    cargarEstudiantes();
    cargarMaterias();
  }, []);

  const cargarAsistencias = async () => {
    const res = await api.get("/asistencias");
    setAsistencias(res.data);
  };

  const cargarEstudiantes = async () => {
    const res = await api.get("/estudiantes");
    setEstudiantes(res.data);
  };

  const cargarMaterias = async () => {
    const res = await api.get("/materias");
    setMaterias(res.data);
  };

  /* ============================
     CREAR ASISTENCIA
  ============================ */
  const crearAsistencia = async (e) => {
    e.preventDefault();

    if (!form.estudianteId || !form.materiaId || !form.fecha || !form.estado) {
      alert("Todos los campos son obligatorios");
      return;
    }

    await api.post("/asistencias", {
      estudianteId: Number(form.estudianteId),
      materiaId: Number(form.materiaId),
      fecha: form.fecha,
      estado: form.estado,
    });

    setForm({
      estudianteId: "",
      materiaId: "",
      estado: "",
      fecha: "",
    });

    cargarAsistencias();
  };

  return (
    <div>
      {/* TÍTULO */}
      <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <i className="bi bi-calendar-check-fill text-primary fs-3"></i>
        Gestión de Asistencias
      </h2>

      <Row>
        {/* FORMULARIO */}
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-plus-circle-fill text-primary"></i>
                Registrar Asistencia
              </h5>

              <Form onSubmit={crearAsistencia}>
                <Form.Group className="mb-3">
                  <Form.Label>Estudiante</Form.Label>
                  <Form.Select
                    value={form.estudianteId}
                    onChange={(e) =>
                      setForm({ ...form, estudianteId: e.target.value })
                    }
                  >
                    <option value="">Seleccione estudiante</option>
                    {estudiantes.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.user?.nombre} {e.user?.apellido}
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
                  <Form.Label>Fecha</Form.Label>
                  <Form.Control
                    type="date"
                    value={form.fecha}
                    onChange={(e) =>
                      setForm({ ...form, fecha: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Estado</Form.Label>
                  <Form.Select
                    value={form.estado}
                    onChange={(e) =>
                      setForm({ ...form, estado: e.target.value })
                    }
                  >
                    <option value="">Seleccione estado</option>
                    <option value="PRESENTE">Presente</option>
                    <option value="AUSENTE">Ausente</option>
                  </Form.Select>
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">
                  <i className="bi bi-save me-2"></i>
                  Registrar Asistencia
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
                    <th>Fecha</th>
                    <th>Estado</th>
                  </tr>
                </thead>

                <tbody>
                  {asistencias.length > 0 ? (
                    asistencias.map((a) => (
                      <tr key={a.id}>
                        <td className="fw-semibold">
                          <i className="bi bi-person-circle me-1"></i>
                          {a.estudiante?.user?.nombre}{" "}
                          {a.estudiante?.user?.apellido}
                        </td>
                        <td>
                          <i className="bi bi-book me-1"></i>
                          {a.materia?.nombre}
                        </td>
                        <td>
                          <i className="bi bi-calendar-event me-1"></i>
                          {a.fecha?.slice(0, 10)}
                        </td>
                        <td>
                          {a.estado === "PRESENTE" ? (
                            <Badge bg="success">
                              <i className="bi bi-check-circle me-1"></i>
                              Presente
                            </Badge>
                          ) : (
                            <Badge bg="danger">
                              <i className="bi bi-x-circle me-1"></i>
                              Ausente
                            </Badge>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        No hay asistencias registradas
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
