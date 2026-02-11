import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

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
  const { user, loading } = useAuth();
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursos, setCursos] = useState([]);
  const [search, setSearch] = useState("");
  const [showEdit, setShowEdit] = useState(false);

  const [form, setForm] = useState({
    nombre: "",
    apellido: "",
    dni: "",
    cursoId: "",
    fechaNacimiento: "",
    direccion: "",
    tutorNombre: "",
    tutorDni: "",
    tutorEmail: "",
    tutorTelefono: ""
  });

  const [editData, setEditData] = useState({
    id: "",
    direccion: ""
  });

  /* ===============================
        CARGAR DATOS
  =============================== */

  const cargar = async () => {
    try {
      // ✅ cursos SIEMPRE
      const cur = await client.get("/cursos");
      setCursos(Array.isArray(cur.data) ? cur.data : []);
    } catch (error) {
      console.error("Error cargando cursos", error);
      setCursos([]);
    }

    // ⚠️ estudiantes puede fallar si no hay token
    try {
      const est = await client.get("/estudiantes");
      setEstudiantes(Array.isArray(est.data) ? est.data : []);
    } catch (error) {
      console.warn("Estudiantes no cargados (401)", error.response?.status);
      setEstudiantes([]);
    }
  };

  useEffect(() => {
    if (loading) return; // ⏳ espera AuthContext
    if (!user) return; // 🚫 no autenticado

    cargar();
  }, [loading, user]);

  /* ===============================
        CREAR ESTUDIANTE
  =============================== */
  const crear = async (e) => {
    e.preventDefault();

    try {
      await client.post("/estudiantes", {
        ...form,
        cursoId: Number(form.cursoId)
      });

      alert(
        `Estudiante creado correctamente\nCorreo: ${form.dni}@alumno.colegio.cl\nContraseña: ${form.dni}`
      );

      setForm({
        nombre: "",
        apellido: "",
        dni: "",
        cursoId: "",
        fechaNacimiento: "",
        direccion: "",
        tutorNombre: "",
        tutorDni: "",
        tutorEmail: "",
        tutorTelefono: ""
      });

      cargar();
    } catch (err) {
      alert(err.response?.data?.message || "Error al registrar estudiante");
    }
  };

  /* ===============================
        EDITAR
  =============================== */
  const abrirEditar = (e) => {
    setEditData({
      id: e.id,
      direccion: e.direccion ?? ""
    });
    setShowEdit(true);
  };

  const guardarEdicion = async () => {
    await client.put(`/estudiantes/${editData.id}`, {
      direccion: editData.direccion
    });
    setShowEdit(false);
    cargar();
  };

  /* ===============================
        ELIMINAR
  =============================== */
  const eliminar = async (id) => {
    if (confirm("¿Eliminar estudiante permanentemente?")) {
      await client.delete(`/estudiantes/${id}`);
      cargar();
    }
  };

  /* ===============================
        BUSCADOR
  =============================== */
  const estudiantesFiltrados = estudiantes.filter((e) =>
    e.dni?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div>
      <h2 className="fw-bold mb-4">Gestión de Estudiantes</h2>

      <Row>
        {/* FORMULARIO */}
        <Col md={4}>
          <Card className="shadow-sm">
            <Card.Body>
              <h5 className="mb-3">Registrar Estudiante</h5>

              <Form.Group>
                <Form.Label>Nombre del estudiante</Form.Label>
                <Form.Control
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group>
                <Form.Label>Apellido del estudiante</Form.Label>
                <Form.Control
                  value={form.apellido}
                  onChange={(e) =>
                    setForm({ ...form, apellido: e.target.value })
                  }
                  required
                />
              </Form.Group>

              <Form onSubmit={crear}>
                <Form.Group className="mb-2">
                  <Form.Label>DNI Estudiante</Form.Label>
                  <Form.Control
                    value={form.dni}
                    onChange={(e) => setForm({ ...form, dni: e.target.value })}
                    required
                  />
                </Form.Group>

                {/* SELECT CURSOS */}
                <Form.Group className="mb-2">
                  <Form.Label>Curso</Form.Label>
                  <Form.Select
                    value={form.cursoId}
                    onChange={(e) =>
                      setForm({ ...form, cursoId: e.target.value })
                    }
                    required
                  >
                    <option value="">Seleccione un curso</option>
                    {cursos.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.nombre}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Dirección</Form.Label>
                  <Form.Control
                    value={form.direccion}
                    onChange={(e) =>
                      setForm({ ...form, direccion: e.target.value })
                    }
                  />
                </Form.Group>

                <hr />

                <Form.Group className="mb-2">
                  <Form.Label>Nombre Tutor</Form.Label>
                  <Form.Control
                    value={form.tutorNombre}
                    onChange={(e) =>
                      setForm({ ...form, tutorNombre: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>DNI Tutor</Form.Label>
                  <Form.Control
                    value={form.tutorDni}
                    onChange={(e) =>
                      setForm({ ...form, tutorDni: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-2">
                  <Form.Label>Correo Tutor</Form.Label>
                  <Form.Control
                    type="email"
                    value={form.tutorEmail}
                    onChange={(e) =>
                      setForm({ ...form, tutorEmail: e.target.value })
                    }
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Teléfono Tutor</Form.Label>
                  <Form.Control
                    value={form.tutorTelefono}
                    onChange={(e) =>
                      setForm({ ...form, tutorTelefono: e.target.value })
                    }
                  />
                </Form.Group>

                <Button type="submit" className="w-100">
                  Guardar Estudiante
                </Button>
              </Form>
            </Card.Body>
          </Card>
        </Col>

        {/* TABLA */}
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body>
              <InputGroup className="mb-3">
                <Form.Control
                  placeholder="Buscar por DNI..."
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>

              <Table hover responsive>
                <thead>
                  <tr>
                    <th>DNI</th>
                    <th>Email</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantesFiltrados.length > 0 ? (
                    estudiantesFiltrados.map((e) => (
                      <tr key={e.id}>
                        <td>{e.dni}</td>
                        <td>{e.user?.email}</td>
                        <td>
                          <Button
                            size="sm"
                            variant="warning"
                            className="me-2"
                            onClick={() => abrirEditar(e)}
                          >
                            ✏️
                          </Button>
                          <Button
                            size="sm"
                            variant="danger"
                            onClick={() => eliminar(e.id)}
                          >
                            🗑️
                          </Button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3" className="text-center text-muted">
                        No hay estudiantes
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
          <Modal.Title>Editar Estudiante</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group>
              <Form.Label>Dirección</Form.Label>
              <Form.Control
                value={editData.direccion}
                onChange={(e) =>
                  setEditData({ ...editData, direccion: e.target.value })
                }
              />
            </Form.Group>
            <Button className="w-100 mt-3" onClick={guardarEdicion}>
              Guardar Cambios
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
}
