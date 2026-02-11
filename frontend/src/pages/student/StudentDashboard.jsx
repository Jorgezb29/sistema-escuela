import client from "../../api/client";
import { useEffect, useState } from "react";
import { Card, Row, Col, Form } from "react-bootstrap";

export default function StudentDashboard() {
  const [datos, setDatos] = useState(null);

  useEffect(() => {
    client
      .get("/student/perfil")
      .then((res) => setDatos(res.data))
      .catch(() => {});
  }, []);

  if (!datos) {
    return <p className="text-muted">Cargando datos personales...</p>;
  }

  return (
    <div>
      <h4 className="fw-bold mb-3">Datos del Estudiante</h4>
      <p className="text-danger small">
        Los campos marcados con * son informativos y no pueden modificarse.
      </p>

      <Card className="shadow-sm border-0">
        <Card.Body>
          <Form>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Código Estudiante *</Form.Label>
                <Form.Control value={datos.codigo || ""} readOnly />
              </Col>

              <Col md={6}>
                <Form.Label>DNI *</Form.Label>
                <Form.Control value={datos.dni || ""} readOnly />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Apellido Paterno *</Form.Label>
                <Form.Control value={datos.apellidoP || ""} readOnly />
              </Col>

              <Col md={6}>
                <Form.Label>Apellido Materno *</Form.Label>
                <Form.Control value={datos.apellidoM || ""} readOnly />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Nombres *</Form.Label>
                <Form.Control value={datos.nombre || ""} readOnly />
              </Col>

              <Col md={6}>
                <Form.Label>Correo institucional *</Form.Label>
                <Form.Control value={datos.email || ""} readOnly />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Label>Fecha de nacimiento *</Form.Label>
                <Form.Control value={datos.fechaNacimiento || ""} readOnly />
              </Col>

              <Col md={4}>
                <Form.Label>Sexo *</Form.Label>
                <Form.Control value={datos.sexo || ""} readOnly />
              </Col>

              <Col md={4}>
                <Form.Label>Curso *</Form.Label>
                <Form.Control value={datos.curso || ""} readOnly />
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Label>Dirección *</Form.Label>
                <Form.Control value={datos.direccion || ""} readOnly />
              </Col>

              <Col md={6}>
                <Form.Label>Teléfono *</Form.Label>
                <Form.Control value={datos.telefono || ""} readOnly />
              </Col>
            </Row>
          </Form>
        </Card.Body>
      </Card>
    </div>
  );
}
