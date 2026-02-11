import { useState, useEffect, useRef } from "react";
import api from "../../api/client";
import { Card, Button, Form, Spinner, Badge } from "react-bootstrap";

export default function AsistenteChatPage() {
  const [mensaje, setMensaje] = useState("");
  const [respuestas, setRespuestas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const bottomRef = useRef(null);

  const resultado = JSON.parse(
    localStorage.getItem("resultadoVocacional")
  );

  // Scroll automático
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [respuestas, loading]);

  const enviar = async () => {
    if (!mensaje.trim()) return;

    setError("");
    setLoading(true);

    const preguntaActual = mensaje;
    setMensaje("");

    // Mostrar mensaje del estudiante
    setRespuestas((prev) => [
      ...prev,
      { rol: "user", texto: preguntaActual },
    ]);

    try {
      const res = await api.post("/asistente/chat", {
        mensaje: preguntaActual,
        resultado,
      });

      setRespuestas((prev) => [
        ...prev,
        { rol: "assistant", texto: res.data.respuesta },
      ]);
    } catch (err) {
      setError("❌ No se pudo obtener respuesta del orientador.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-4 shadow-sm">
      <h4 className="fw-bold mb-2">🎓 Orientador Vocacional</h4>

      <p className="text-muted small">
        Basado en tu test vocacional (Kuder · Holland · CHASIDE)
      </p>

      {/* RESULTADO RESUMEN */}
      {resultado && (
        <div className="mb-3">
          <Badge bg="success">
            Área recomendada: {resultado.area.toUpperCase()}
          </Badge>
        </div>
      )}

      {/* CHAT */}
      <div
        className="border rounded p-3 mb-3"
        style={{ height: "320px", overflowY: "auto", background: "#f8f9fa" }}
      >
        {respuestas.length === 0 && (
          <p className="text-muted text-center mt-4">
             Puedes preguntar cosas como:
            <br />
            <em>
              “¿Por qué me tocó esta área?” <br />
              “¿Qué carreras me recomiendas?” <br />
              “¿En qué soy bueno según el test?”
            </em>
          </p>
        )}

        {respuestas.map((r, i) => (
          <div
            key={i}
            className={`mb-3 d-flex ${
              r.rol === "user" ? "justify-content-end" : "justify-content-start"
            }`}
          >
            <div
              className={`p-3 rounded ${
                r.rol === "user"
                  ? "bg-primary text-white"
                  : "bg-white border"
              }`}
              style={{ maxWidth: "75%" }}
            >
              {r.texto}
            </div>
          </div>
        ))}

        {loading && (
          <div className="d-flex align-items-center text-muted">
            <Spinner size="sm" className="me-2" />
            El orientador está pensando…
          </div>
        )}

        <div ref={bottomRef} />
      </div>

      {/* ERROR */}
      {error && <div className="alert alert-danger py-2">{error}</div>}

      {/* INPUT */}
      <Form.Control
        placeholder="Escribe tu pregunta aquí…"
        value={mensaje}
        onChange={(e) => setMensaje(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && enviar()}
        disabled={loading}
      />

      <Button
        className="mt-3 w-100"
        onClick={enviar}
        disabled={loading}
      >
        {loading ? "Consultando…" : "Preguntar"}
      </Button>
    </Card>
  );
}
