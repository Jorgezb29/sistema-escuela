import { useEffect, useState } from "react";
import client from "../api/client";
import {
  Table,
  Form,
  Button,
  Row,
  Col,
  Card,
  InputGroup,
  Modal
} from "react-bootstrap";

export default function EstudiantesPage() {
  const [estudiantes, setEstudiantes] = useState([]);
  const [search, setSearch] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  // FORM NUEVO ESTUDIANTE
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    fechaNacimiento: "",
    direccion: "",
  });

  // FORM EDITAR
  const [editData, setEditData] = useState({
    id: "",
    nombre: "",
    apellido: "",
    direccion: "",
  });

  const cargar = async () => {
    const { data } = await client.get("/estudiantes");
    setEstudiantes(data);
  };

  useEffect(() => {
    cargar();
  }, []);

  /* ==========================
      CREAR ESTUDIANTE
  ========================== */
  const crear = async (e) => {
    e.preventDefault();

    try {
      if (!form.nombre || !form.apellido || !form.email) {
        alert("Nombre, apellido y email son obligatorios");
        return;
      }

      const payload = {
        nombre: form.nombre,
        apellido: form.apellido,
        email: form.email,
        direccion: form.direccion || null,
      };

      if (form.fechaNacimiento.trim() !== "") {
        payload.fechaNacimiento = form.fechaNacimiento;
      }

      await client.post("/estudiantes", payload);

      setForm({
        nombre: "",
        apellido: "",
        email: "",
        fechaNacimiento: "",
        direccion: "",
      });

      cargar();
    } catch (err) {
      const msg = err.response?.data?.message || "Error al registrar estudiante";
      alert(msg);
    }
  };

  /* ==========================
      ABRIR MODAL
  ========================== */
  const abrirEditar = (e) => {
    setEditData({
      id: e.id,
      nombre: e.user.nombre,
      apellido: e.user.apellido,
      direccion: e.direccion ?? "",
    });
    setShowEdit(true);
  };

  const guardarEdicion = async () => {
    await client.put(`/estudiantes/${editData.id}`, editData);
    setShowEdit(false);
    cargar();
  };

  const eliminar = async (id) => {
    if (confirm("¿Eliminar estudiante permanentemente?")) {
      await client.delete(`/estudiantes/${id}`);
      cargar();
    }
  };

  const estudiantesFiltrados = estudiantes.filter((e) =>
    `${e.user.nombre} ${e.user.apellido}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      {/* TÍTULO */}
      <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <i className="bi bi-mortarboard-fill text-primary fs-3"></i>
        Gestión de Estudiantes
      </h2>

      <Row>
        {/* FORMULARIO */}
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-person-plus-fill text-success"></i>
                Registrar Estudiante
              </h5>

              <Form onSubmit={crear}>
                <Form.Group className="mb-3">
                  <Form.Label>Nombre</Form.Label>
                  <Form.Control
                    value={form.nombre}
                    onChange={(e) =>
                      setForm({ ...form, nombre: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Apellido</Form.Label>
                  <Form.Control
                    value={form.apellido}
                    onChange={(e) =>
                      setForm({ ...form, apellido: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Correo</Form.Label>
                  <Form.Control
                    type="email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Fecha de Nacimiento</Form.Label>
                  <Form.Control
                    type="date"
                    value={form.fechaNacimiento}
                    onChange={(e) =>
                      setForm({ ...form, fechaNacimiento: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    value={form.direccion}
                    onChange={(e) =>
                      setForm({ ...form, direccion: e.target.value })
                    }
                  />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">
                  <i className="bi bi-save me-2"></i>
                  Guardar Estudiante
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
                  placeholder="Buscar estudiante..."
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>

              <Table hover responsive className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Código</th>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {estudiantesFiltrados.length > 0 ? (
                    estudiantesFiltrados.map((e) => (
                      <tr key={e.id}>
                        <td>{e.codigoAlumno}</td>
                        <td>{e.user.nombre} {e.user.apellido}</td>
                        <td>{e.user.email}</td>
                        <td className="text-center">
                          <Button
                            variant="outline-warning"
                            size="sm"
                            className="me-2"
                            onClick={() => abrirEditar(e)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </Button>

                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => eliminar(e.id)}
                          >
                            <i className="bi bi-trash3"></i>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        No se encontraron estudiantes
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* MODAL */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil-square me-2"></i>
            Editar Estudiante
          </Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nombre</Form.Label>
              <Form.Control
                value={editData.nombre}
                onChange={(e) =>
                  setEditData({ ...editData, nombre: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Apellido</Form.Label>
              <Form.Control
                value={editData.apellido}
                onChange={(e) =>
                  setEditData({ ...editData, apellido: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                value={editData.direccion}
                onChange={(e) =>
                  setEditData({ ...editData, direccion: e.target.value })
                }
              />
            </Form.Group>

            <Button className="w-100">
              <i className="bi bi-check-circle me-2"></i>
              Guardar Cambios
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
