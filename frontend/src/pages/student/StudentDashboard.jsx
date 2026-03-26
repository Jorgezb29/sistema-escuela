import client from "../../api/client";
import { useEffect, useState } from "react";
import { Card, Row, Col, Form, Badge, ProgressBar } from "react-bootstrap";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .sd-wrapper {
    font-family: 'Nunito', sans-serif;
  }

  .sd-wrapper h4 {
    font-size: 1.5rem;
    font-weight: 800;
    color: #1a0a0a;
  }

  .sd-note {
    font-size: 0.78rem;
    font-weight: 600;
    color: #8b1a1a;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 5px;
  }

  .sd-card {
    border: none !important;
    border-radius: 15px !important;
    box-shadow: 0 2px 18px rgba(139,26,26,0.08) !important;
    font-family: 'Nunito', sans-serif;
  }

  .sd-card .card-body {
    padding: 30px 32px !important;
  }

  .sd-section-label {
    font-size: 0.65rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.1em;
    color: #8b1a1a;
    display: flex;
    align-items: center;
    gap: 8px;
    margin-bottom: 14px;
    margin-top: 6px;
  }

  .sd-section-label::before {
    content: '';
    display: block;
    width: 4px;
    height: 14px;
    background: #8b1a1a;
    border-radius: 3px;
    flex-shrink: 0;
  }

  .sd-divider {
    border: none;
    border-top: 1px solid #f5edec;
    margin: 18px 0 20px;
  }

  .sd-wrapper .form-label {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.06em;
    color: #a08080;
    margin-bottom: 5px;
  }

  .sd-wrapper .form-control {
    font-family: 'Nunito', sans-serif;
    font-size: 0.92rem;
    font-weight: 600;
    color: #2d1f1f;
    background: #fdf9f9;
    border: 1.5px solid #ede5e5;
    border-radius: 8px;
    padding: 9px 13px;
    transition: border-color .2s;
  }

  .sd-wrapper .form-control:focus {
    border-color: #8b1a1a;
    background: #fff;
    box-shadow: 0 0 0 3px rgba(139,26,26,0.08);
  }

  .sd-wrapper .form-control[readonly] {
    background: #fdf9f9;
    cursor: default;
  }

  .sd-loading {
    display: flex;
    align-items: center;
    gap: 10px;
    color: #8b1a1a;
    font-weight: 700;
    font-family: 'Nunito', sans-serif;
    padding: 40px 0;
  }

  .sd-spinner {
    width: 18px; height: 18px;
    border: 3px solid #f0dede;
    border-top-color: #8b1a1a;
    border-radius: 50%;
    animation: sdSpin .8s linear infinite;
    flex-shrink: 0;
  }

  @keyframes sdSpin { to { transform: rotate(360deg); } }

  .sd-card-anim {
    animation: sdFadeUp .35s ease both;
  }

  @keyframes sdFadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* ── Historial Vocacional ── */
  .voc-item {
    border: 1.5px solid #f0e5e5;
    border-radius: 12px;
    padding: 20px 22px;
    background: #fdf9f9;
    transition: box-shadow .2s;
  }

  .voc-item:hover {
    box-shadow: 0 4px 16px rgba(139,26,26,0.10);
  }

  .voc-fecha {
    font-size: 0.7rem;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.08em;
    color: #a08080;
  }

  .voc-badge-principal {
    background: #8b1a1a !important;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 5px 11px;
    border-radius: 20px;
  }

  .voc-badge-segunda {
    background: #c97b7b !important;
    font-size: 0.72rem;
    font-weight: 700;
    padding: 5px 11px;
    border-radius: 20px;
  }

  .voc-area-label {
    font-size: 0.68rem;
    font-weight: 800;
    text-transform: uppercase;
    letter-spacing: 0.07em;
    color: #8b1a1a;
    margin-bottom: 3px;
  }

  .voc-pct {
    font-size: 0.82rem;
    font-weight: 700;
    color: #2d1f1f;
  }

  .voc-bar .progress {
    height: 8px;
    border-radius: 10px;
    background: #f0e5e5;
  }

  .voc-bar .progress-bar {
    background: #8b1a1a !important;
    border-radius: 10px;
  }

  .voc-bar-segunda .progress-bar {
    background: #c97b7b !important;
  }

  .voc-bar-tercera .progress-bar {
    background: #e8c5c5 !important;
  }

  .voc-interpretacion {
    font-size: 0.84rem;
    font-weight: 500;
    color: #5a3a3a;
    line-height: 1.65;
    white-space: pre-line;
    background: #fff;
    border: 1.5px solid #f0e5e5;
    border-radius: 10px;
    padding: 14px 16px;
    max-height: 180px;
    overflow-y: auto;
  }

  .voc-empty {
    text-align: center;
    padding: 32px 0;
    color: #c97b7b;
    font-size: 0.88rem;
    font-weight: 600;
  }

  .voc-toggle {
    font-size: 0.75rem;
    font-weight: 700;
    color: #8b1a1a;
    background: none;
    border: none;
    padding: 0;
    cursor: pointer;
    text-decoration: underline;
    text-underline-offset: 3px;
  }

  .voc-toggle:hover { color: #5a1010; }
`;

const areaLabel = {
  exactas:     " Exactas",
  humanidades: " Humanidades",
  salud:       " Salud",
};

const barClasses = ["", "voc-bar-segunda", "voc-bar-tercera"];

function VocacionalItem({ item }) {
  const [expandido, setExpandido] = useState(false);

  const areas = [
    { key: "exactas",     pct: item.porcentajeExactas },
    { key: "humanidades", pct: item.porcentajeHumanidades },
    { key: "salud",       pct: item.porcentajeSalud },
  ].sort((a, b) => b.pct - a.pct);

  const fecha = new Date(item.fechaRealizado).toLocaleDateString("es-PE", {
    day: "2-digit", month: "long", year: "numeric",
  });

  return (
    <div className="voc-item mb-3">
      {/* Cabecera */}
      <div className="d-flex justify-content-between align-items-start mb-3 flex-wrap gap-2">
        <div>
          <div className="voc-fecha mb-2"> {fecha}</div>
          <div className="d-flex gap-2 flex-wrap">
            <Badge className="voc-badge-principal">
               {areaLabel[item.areaPrincipal]}
            </Badge>
            <Badge className="voc-badge-segunda">
              2ª {areaLabel[item.areaSegunda]}
            </Badge>
          </div>
        </div>
      </div>

      {/* Barras de porcentaje */}
      <div className="mb-3">
        {areas.map((a, idx) => (
          <div key={a.key} className={`voc-bar ${barClasses[idx]} mb-2`}>
            <div className="d-flex justify-content-between align-items-center">
              <span className="voc-area-label">{areaLabel[a.key]}</span>
              <span className="voc-pct">{a.pct}%</span>
            </div>
            <ProgressBar now={a.pct} />
          </div>
        ))}
      </div>

      {/* Interpretación colapsable */}
      <div>
        <button className="voc-toggle mb-2" onClick={() => setExpandido(!expandido)}>
          {expandido ? "▲ Ocultar análisis" : "▼ Ver análisis completo"}
        </button>
        {expandido && (
          <div className="voc-interpretacion">{item.interpretacion}</div>
        )}
      </div>
    </div>
  );
}

export default function StudentDashboard() {
  const [datos, setDatos] = useState(null);
  const [historial, setHistorial] = useState([]);

  useEffect(() => {
    client.get("/student/perfil").then((res) => setDatos(res.data)).catch(() => {});
    client.get("/test-vocacional/historial").then((res) => setHistorial(res.data)).catch(() => {});
  }, []);

  if (!datos) {
    return (
      <>
        <style>{styles}</style>
        <div className="sd-loading">
          <div className="sd-spinner" />
          Cargando datos personales...
        </div>
      </>
    );
  }

  return (
    <>
      <style>{styles}</style>

      <div className="sd-wrapper">
        <h4 className="fw-bold mb-1">Datos del Estudiante</h4>
        <p className="sd-note">
          ● Los campos marcados con * son informativos y no pueden modificarse.
        </p>

        {/* ── Datos personales ── */}
        <Card className="sd-card sd-card-anim mb-4">
          <Card.Body>
            <Form>

              <div className="sd-section-label">Identificación</div>
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

              <hr className="sd-divider" />

              <div className="sd-section-label">Nombre Completo</div>
              <Row className="mb-3">
                <Col md={4}>
                  <Form.Label>Nombres *</Form.Label>
                  <Form.Control value={datos.nombre || ""} readOnly />
                </Col>
                <Col md={4}>
                  <Form.Label>Apellido Paterno *</Form.Label>
                  <Form.Control value={datos.apellidoP || ""} readOnly />
                </Col>
                <Col md={4}>
                  <Form.Label>Apellido Materno *</Form.Label>
                  <Form.Control value={datos.apellidoM || ""} readOnly />
                </Col>
              </Row>

              <hr className="sd-divider" />

              <div className="sd-section-label">Datos Personales</div>
              <Row className="mb-3">
                
                <Col md={4}>
                  <Form.Label>Curso *</Form.Label>
                  <Form.Control value={datos.curso || ""} readOnly />
                </Col>
              </Row>

              <hr className="sd-divider" />

              <div className="sd-section-label">Contacto</div>
              <Row className="mb-3">
                <Col md={6}>
                  <Form.Label>Correo institucional *</Form.Label>
                  <Form.Control value={datos.email || ""} readOnly />
                </Col>
                
              </Row>

              <hr className="sd-divider" />

              <div className="sd-section-label">Ubicación</div>
              <Row className="mb-1">
                <Col md={6}>
                  <Form.Label>Dirección *</Form.Label>
                  <Form.Control value={datos.direccion || ""} readOnly />
                </Col>
              </Row>

            </Form>
          </Card.Body>
        </Card>

        {/* ── Historial Vocacional ── */}
        <h4 className="fw-bold mb-1">Historial Vocacional</h4>
        <p className="sd-note">
          ● Registro de todos los tests vocacionales realizados.
        </p>

        <Card className="sd-card sd-card-anim">
          <Card.Body>
            <div className="sd-section-label">Resultados de Tests</div>

            {historial.length === 0 ? (
              <div className="voc-empty">
                 Aún no has realizado ningún test vocacional.
              </div>
            ) : (
              historial.map((item) => (
                <VocacionalItem key={item.id} item={item} />
              ))
            )}
          </Card.Body>
        </Card>

      </div>
    </>
  );
}