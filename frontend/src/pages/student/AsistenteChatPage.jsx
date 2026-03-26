import { useState, useEffect, useRef } from "react";
import api from "../../api/client";
import { Card, Button, Form, Spinner, Badge, ProgressBar } from "react-bootstrap";

const coloresArea = {
  exactas: { bg: "primary", label: " Exactas" },
  humanidades: { bg: "warning", label: " Humanidades" },
  salud: { bg: "success", label: " Salud" },
};

export default function AsistenteChatPage() {
  const [mensaje, setMensaje] = useState("");
  const [respuestas, setRespuestas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);

  const resultado = JSON.parse(localStorage.getItem("resultadoVocacional"));

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [respuestas, loading]);

  const enviar = async (pregunta = null) => {
    const texto = pregunta || mensaje;
    if (!texto.trim()) return;

    setError("");
    setLoading(true);
    setMensaje("");

    setRespuestas((prev) => [...prev, { rol: "user", texto }]);

    try {
      const res = await api.post("/asistente/chat", {
        mensaje: texto,
        resultado,
      });

      setRespuestas((prev) => [
        ...prev,
        { rol: "assistant", texto: res.data.respuesta },
      ]);
    } catch (err) {
      setError("No se pudo obtener respuesta del orientador.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <h4 className="fw-bold mb-2">Orientador Vocacional</h4>
      <p className="text-muted small mb-3">
        Basado en tu test vocacional (Kuder · Holland · CHASIDE)
      </p>

      {/* RESULTADOS DEL TEST */}
      {resultado && (
        <div className="mb-4 p-3 rounded border bg-light">
          <div className="d-flex gap-2 flex-wrap mb-3">
            {/* Área principal */}
            <div className="flex-fill p-2 rounded border border-primary text-center">
              <div className="small text-muted">Área Principal</div>
              <Badge bg={coloresArea[resultado.area]?.bg ?? "primary"} className="mt-1 px-3 py-2 fs-6">
                {coloresArea[resultado.area]?.label ?? resultado.area.toUpperCase()}
              </Badge>
            </div>

            {/* Segunda opción */}
            {resultado.areaSegunda && (
              <div className="flex-fill p-2 rounded border border-secondary text-center">
                <div className="small text-muted">Segunda Opción</div>
                <Badge bg={coloresArea[resultado.areaSegunda]?.bg ?? "secondary"} className="mt-1 px-3 py-2 fs-6">
                  {coloresArea[resultado.areaSegunda]?.label ?? resultado.areaSegunda.toUpperCase()}
                </Badge>
              </div>
            )}
          </div>

          {/* Porcentajes */}
          {resultado.porcentajes && (
            <div>
              <p className="small fw-semibold text-muted mb-2">Porcentaje por área:</p>
              {Object.entries(resultado.porcentajes).map(([area, pct]) => (
                <div key={area} className="mb-2">
                  <div className="d-flex justify-content-between small mb-1">
                    <span>{coloresArea[area]?.label ?? area}</span>
                    <span className="fw-bold">{pct}%</span>
                  </div>
                  <ProgressBar
                    now={pct}
                    variant={coloresArea[area]?.bg ?? "primary"}
                    style={{ height: "8px" }}
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* PREGUNTAS RÁPIDAS */}
      <div className="mb-3">
        <Button size="sm" variant="outline-primary" className="me-2 mb-2"
          onClick={() => enviar("¿Por qué me tocó esta área?")}>
          ¿Por qué me tocó esta área?
        </Button>
        <Button size="sm" variant="outline-primary" className="me-2 mb-2"
          onClick={() => enviar("¿Qué carreras puedo estudiar?")}>
          ¿Qué carreras puedo estudiar?
        </Button>
        <Button size="sm" variant="outline-primary" className="me-2 mb-2"
          onClick={() => enviar("¿En qué soy bueno?")}>
          ¿En qué soy bueno?
        </Button>
        <Button size="sm" variant="outline-primary" className="me-2 mb-2"
          onClick={() => enviar("¿Qué puedo hacer con mi segunda opción?")}>
          ¿Qué puedo hacer con mi segunda opción?
        </Button>
        <Button size="sm" variant="outline-primary" className="mb-2"
          onClick={() => enviar("¿Puedo cambiar de área?")}>
          ¿Puedo cambiar de área?
        </Button>
      </div>

      {/* CHAT */}
      <div
        className="border rounded p-3 mb-3"
        style={{ height: "320px", overflowY: "auto", background: "#f8f9fa" }}
      >
        {respuestas.length === 0 && (
          <p className="text-muted text-center mt-4">
            Puedes preguntar:<br />
            ¿Por qué me tocó esta área?<br />
            ¿Qué carreras puedo estudiar?<br />
            ¿Qué puedo hacer con mi segunda opción?
          </p>
        )}

        {respuestas.map((r, i) => (
          <div
            key={i}
            className={`mb-3 d-flex ${r.rol === "user" ? "justify-content-end" : "justify-content-start"}`}
          >
            <div
              className={`p-3 rounded ${r.rol === "user" ? "bg-primary text-white" : "bg-white border"}`}
              style={{ maxWidth: "75%" }}
            >
              {r.texto}
            </div>
          </div>
        ))}

        {loading && (
          <div className="d-flex align-items-center text-muted">
            <Spinner size="sm" className="me-2" />
            El orientador está analizando tu pregunta…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {error && <div className="alert alert-danger py-2">{error}</div>}

      <Form.Control
        placeholder="Escribe tu pregunta aquí..."
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && enviar()}
        disabled={loading}
      />

      <Button className="mt-3 w-100" onClick={() => enviar()} disabled={loading}>
        {loading ? "Consultando..." : "Preguntar"}
      </Button>
    </Card>
  );
}