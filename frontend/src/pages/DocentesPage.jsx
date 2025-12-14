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

export default function DocentesPage() {
  const [docentes, setDocentes] = useState([]);
  const [search, setSearch] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  // FORM NUEVO DOCENTE
  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    email: "",
    titulo: "",
    telefono: "",
  });

  // FORM EDITAR DOCENTE
  const [editData, setEditData] = useState({
    id: "",
    nombre: "",
    apellido: "",
    titulo: "",
    telefono: "",
  });

  /* ===============================
        CARGAR DOCENTES
  =============================== */
  const cargar = async () => {
    const { data } = await client.get("/docentes");
    setDocentes(data);
  };

  useEffect(() => {
    cargar();
  }, []);

  /* ===============================
        CREAR DOCENTE
  =============================== */
  const crear = async (e) => {
    e.preventDefault();

    await client.post("/docentes", form);

    setForm({
      nombre: "",
      apellido: "",
      email: "",
      titulo: "",
      telefono: "",
    });

    cargar();
  };

  /* ===============================
        ABRIR MODAL EDITAR
  =============================== */
  const abrirEditar = (doc) => {
    setEditData({
      id: doc.id,
      nombre: doc.user.nombre,
      apellido: doc.user.apellido,
      titulo: doc.titulo || "",
      telefono: doc.telefono || "",
    });
    setShowEdit(true);
  };

  /* ===============================
        GUARDAR EDICIÓN
  =============================== */
  const guardarEdicion = async () => {
    await client.put(`/docentes/${editData.id}`, editData);
    setShowEdit(false);
    cargar();
  };

  /* ===============================
        ELIMINAR DOCENTE
  =============================== */
  const eliminar = async (id) => {
    if (confirm("¿Eliminar docente permanentemente?")) {
      await client.delete(`/docentes/${id}`);
      cargar();
    }
  };

  /* ===============================
        FILTRAR DOCENTES
  =============================== */
  const docentesFiltrados = docentes.filter((d) =>
    `${d.user.nombre} ${d.user.apellido}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div>
      {/* TÍTULO */}
      <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <i className="bi bi-person-badge-fill text-primary fs-3"></i>
        Gestión de Docentes
      </h2>

      <Row>
        {/* FORMULARIO */}
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <i className="bi bi-person-plus-fill text-success"></i>
                Registrar Docente
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
                  <Form.Label>Título profesional</Form.Label>
                  <Form.Control
                    value={form.titulo}
                    onChange={(e) =>
                      setForm({ ...form, titulo: e.target.value })
                    }
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Teléfono</Form.Label>
                  <Form.Control
                    value={form.telefono}
                    onChange={(e) =>
                      setForm({ ...form, telefono: e.target.value })
                    }
                  />
                </Form.Group>

                <Button type="submit" variant="primary" className="w-100">
                  <i className="bi bi-save me-2"></i>
                  Guardar Docente
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
                  placeholder="Buscar docente..."
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>

              <Table hover responsive className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>Nombre</th>
                    <th>Email</th>
                    <th>Título</th>
                    <th className="text-center">Acciones</th>
                  </tr>
                </thead>

                <tbody>
                  {docentesFiltrados.length > 0 ? (
                    docentesFiltrados.map((d) => (
                      <tr key={d.id}>
                        <td>{d.user.nombre} {d.user.apellido}</td>
                        <td>{d.user.email}</td>
                        <td>{d.titulo || "—"}</td>
                        <td className="text-center">
                          <Button
                            variant="outline-warning"
                            size="sm"
                            className="me-2"
                            onClick={() => abrirEditar(d)}
                          >
                            <i className="bi bi-pencil-square"></i>
                          </Button>
                          <Button
                            variant="outline-danger"
                            size="sm"
                            onClick={() => eliminar(d.id)}
                          >
                            <i className="bi bi-trash3"></i>
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center text-muted py-4">
                        No se encontraron docentes
                      </td>
                    </tr>
                  )}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* MODAL EDITAR */}
      <Modal show={showEdit} onHide={() => setShowEdit(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil-square me-2"></i>
            Editar Docente
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
              <Form.Label>Título profesional</Form.Label>
              <Form.Control
                value={editData.titulo}
                onChange={(e) =>
                  setEditData({ ...editData, titulo: e.target.value })
                }
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Teléfono</Form.Label>
              <Form.Control
                value={editData.telefono}
                onChange={(e) =>
                  setEditData({ ...editData, telefono: e.target.value })
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
