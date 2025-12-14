import { Card, Row, Col } from "react-bootstrap";

export default function DashboardPage() {
  return (
    <div>
      {/* TÍTULO */}
      <h2 className="fw-bold mb-4 d-flex align-items-center gap-2">
        <i className="bi bi-speedometer2 text-primary fs-3"></i>
        Panel Principal
      </h2>

      <Row className="gy-4">
        {/* ESTUDIANTES */}
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center">
              <i className="bi bi-mortarboard-fill text-primary fs-1 mb-2"></i>
              <h6 className="text-muted">Estudiantes Registrados</h6>
              <h2 className="fw-bold text-primary">450</h2>
            </Card.Body>
          </Card>
        </Col>

        {/* DOCENTES */}
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center">
              <i className="bi bi-person-badge-fill text-success fs-1 mb-2"></i>
              <h6 className="text-muted">Docentes Activos</h6>
              <h2 className="fw-bold text-success">32</h2>
            </Card.Body>
          </Card>
        </Col>

        {/* PROMEDIO */}
        <Col md={4}>
          <Card className="shadow-sm border-0 h-100">
            <Card.Body className="text-center">
              <i className="bi bi-graph-up-arrow text-warning fs-1 mb-2"></i>
              <h6 className="text-muted">Promedio General</h6>
              <h2 className="fw-bold text-warning">5.3</h2>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* SECCIÓN EXTRA */}
      <Row className="mt-4">
        <Col>
          <Card className="shadow-sm border-0">
            <Card.Body>
              <h5 className="fw-bold mb-2 d-flex align-items-center gap-2">
                <i className="bi bi-info-circle-fill text-secondary"></i>
                Resumen del Sistema
              </h5>

              <p className="text-muted mb-0">
                Desde este panel el administrador puede gestionar estudiantes,
                docentes, cursos, materias, asistencias, notas e incidencias.
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
