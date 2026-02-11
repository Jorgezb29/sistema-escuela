import { useEffect, useState } from "react";
import client from "../api/client";
import {
  Table,
  Card,
  Button,
  Row,
  Col,
  Form,
  InputGroup
} from "react-bootstrap";

export default function MateriasPage() {
  const [materias, setMaterias] = useState([]);
  const [cursoId, setCursoId] = useState("");
  const [nombre, setNombre] = useState("");
  const [search, setSearch] = useState("");
  const [cursos, setCursos] = useState([]);

  /* ===============================
        NORMALIZAR TEXTO
  =============================== */
  const normalizar = (texto = "") =>
    texto
      .toLowerCase()
      .trim()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  /* ===============================
        CARGAR MATERIAS
  =============================== */
  const cargarMaterias = async () => {
    try {
      const { data } = await client.get("/materias");
      setMaterias(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("❌ Error cargando materias:", error);
      setMaterias([]);
    }
  };

  useEffect(() => {
    client
      .get("/cursos")
      .then((res) => setCursos(res.data))
      .catch((err) => console.log(err));

    cargarMaterias(); 
  }, []);
  /* ===============================
        CREAR MATERIA
  =============================== */
  const crear = async (e) => {
    e.preventDefault();

    if (!cursoId) {
      alert("Debe seleccionar un curso");
      return;
    }

    try {
      await client.post("/materias", {
        nombre,
        cursoId: Number(cursoId) // 👈 ESTO FALTABA
      });

      setNombre("");
      setCursoId("");
      cargarMaterias();
    } catch (error) {
      alert(error.response?.data?.message || "Error creando materia");
    }
  };

  /* ===============================
        BUSCADOR
  =============================== */
  const materiasFiltradas = materias.filter((m) =>
    normalizar(m.nombre).includes(normalizar(search))
  );

  return (
    <div>
      <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <i className="bi bi-book-half text-primary fs-3"></i>
        Gestión de Materias
      </h2>

      <Row>
        {/* FORMULARIO */}
        <Col md={4}>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold mb-3">Registrar Materia</h5>

              <Form onSubmit={crear}>
                <Form.Group className="mb-2">
                  <Form.Label>Nombre de la materia</Form.Label>
                  <Form.Control
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label>Curso</Form.Label>
                  <Form.Select
                    value={cursoId}
                    onChange={(e) => setCursoId(e.target.value)}
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

                <Button type="submit" className="w-100">
                  Crear Materia
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
                  placeholder="Buscar materia..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </InputGroup>

              <Table hover responsive className="align-middle">
                <thead className="table-light">
                  <tr>
                    <th>ID</th>
                    <th>Materia</th>
                  </tr>
                </thead>

                <tbody>
                  {materiasFiltradas.length > 0 ? (
                    materiasFiltradas.map((m) => (
                      <tr key={m.id}>
                        <td>{m.id}</td>
                        <td className="fw-semibold text-capitalize">
                          {m.nombre}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="text-center text-muted py-4">
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
