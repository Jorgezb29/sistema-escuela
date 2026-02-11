  
import client from "../../api/client";
import { useEffect, useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";

export default function ApoderadoDashboard() {
  const [estudiante, setEstudiante] = useState(null);

  useEffect(() => {
    client.get("/apoderado/hijos")
      .then(res => setEstudiante(res.data))
      .catch(() => {});
  }, []);

  if (!estudiante) {
    return <p>Cargando información del estudiante...</p>;
  }

  return (
    <div>
      <div className="page-title">
        Información del Estudiante
      </div>

      <Card className="card-theme p-4">
        <Row>
          <Col md={6}>
            <p><strong>Nombre:</strong> {estudiante.nombre}</p>
            <p><strong>DNI:</strong> {estudiante.dni}</p>
            <p><strong>Curso:</strong> {estudiante.curso?.nombre}</p>
          </Col>

          <Col md={6}>
            <p><strong>Dirección:</strong> {estudiante.direccion || "No registrada"}</p>
            <p><strong>Fecha Nacimiento:</strong> {estudiante.fechaNacimiento?.slice(0,10)}</p>
          </Col>
        </Row>

        <hr />

        <Row className="g-2">
          <Col>
            <Button className="btn-theme w-100">Ver Notas</Button>
          </Col>
          <Col>
            <Button className="btn-theme w-100">Ver Asistencia</Button>
          </Col>
          <Col>
            <Button className="btn-theme w-100">Ver Incidencias</Button>
          </Col>
        </Row>
      </Card>
    </div>
  );
}
