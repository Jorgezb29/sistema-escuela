import { useState } from "react";
import { Card, Button, ProgressBar, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const preguntas = [
  { t: "Disfruto resolver problemas matemáticos complejos.", a: "exactas" },
  { t: "Me interesa saber cómo funcionan las cosas desde un punto de vista lógico.", a: "exactas" },
  { t: "Me siento cómodo trabajando con números y fórmulas.", a: "exactas" },
  { t: "Analizo cuidadosamente un problema antes de actuar.", a: "exactas" },
  { t: "Me gustan los retos que requieren pensamiento lógico.", a: "exactas" },
  { t: "Me interesa la tecnología y la computación.", a: "exactas" },
  { t: "Prefiero materias como matemáticas, física o química.", a: "exactas" },
  { t: "Disfruto armar, programar o diseñar cosas.", a: "exactas" },
  { t: "Me gusta buscar soluciones prácticas y eficientes.", a: "exactas" },
  { t: "Me siento atraído por la ingeniería o las ciencias exactas.", a: "exactas" },
  { t: "Me resulta fácil interpretar gráficos y tablas.", a: "exactas" },
  { t: "Prefiero actividades con reglas claras y resultados precisos.", a: "exactas" },
  { t: "Me gusta trabajar de manera estructurada y ordenada.", a: "exactas" },
  { t: "Disfruto resolver acertijos lógicos.", a: "exactas" },
  { t: "Me siento motivado al obtener resultados exactos.", a: "exactas" },

  { t: "Me gusta expresar mis ideas de forma oral o escrita.", a: "humanidades" },
  { t: "Disfruto leer libros, artículos o ensayos.", a: "humanidades" },
  { t: "Me interesa comprender el comportamiento humano.", a: "humanidades" },
  { t: "Me gusta debatir ideas y opiniones.", a: "humanidades" },
  { t: "Prefiero trabajos donde pueda comunicarme con otras personas.", a: "humanidades" },
  { t: "Me interesa la historia, la filosofía o la literatura.", a: "humanidades" },
  { t: "Disfruto escribir textos, cuentos o reflexiones.", a: "humanidades" },
  { t: "Me gusta analizar problemas sociales.", a: "humanidades" },
  { t: "Me considero una persona creativa.", a: "humanidades" },
  { t: "Me gusta trabajar en grupo y compartir ideas.", a: "humanidades" },
  { t: "Me interesa enseñar o explicar temas a otros.", a: "humanidades" },
  { t: "Me atraen actividades relacionadas con la cultura y el arte.", a: "humanidades" },
  { t: "Me resulta fácil argumentar mis ideas.", a: "humanidades" },
  { t: "Me gusta observar y comprender la realidad social.", a: "humanidades" },
  { t: "Prefiero trabajos donde pueda orientar a otras personas.", a: "humanidades" },

  { t: "Me interesa aprender sobre el cuerpo humano.", a: "salud" },
  { t: "Me preocupa el bienestar físico y emocional de las personas.", a: "salud" },
  { t: "Me atraen materias como biología y química.", a: "salud" },
  { t: "Me gusta ayudar a personas con problemas de salud.", a: "salud" },
  { t: "Me interesa cómo prevenir enfermedades.", a: "salud" },
  { t: "Me siento cómodo trabajando con personas que necesitan apoyo.", a: "salud" },
  { t: "Me interesa la investigación médica o científica.", a: "salud" },
  { t: "Me considero una persona empática.", a: "salud" },
  { t: "Me gusta observar síntomas y buscar explicaciones.", a: "salud" },
  { t: "Me interesa el cuidado y la atención a otros.", a: "salud" },
  { t: "Me gustaría trabajar en hospitales o centros de salud.", a: "salud" },
  { t: "Me gusta aprender sobre hábitos saludables.", a: "salud" },
  { t: "Me interesa cómo funciona el cerebro humano.", a: "salud" },
  { t: "Me considero responsable y comprometido con los demás.", a: "salud" },
  { t: "Me siento motivado al ayudar a mejorar la calidad de vida.", a: "salud" },
];

// Escala Likert
const opciones = [
  { valor: 1, texto: "Nunca", variant: "outline-secondary" },
  { valor: 2, texto: "Rara vez", variant: "outline-danger" },
  { valor: 3, texto: "A veces", variant: "outline-warning" },
  { valor: 4, texto: "Casi siempre", variant: "outline-info" },
  { valor: 5, texto: "Siempre", variant: "outline-success" },
];

export default function AsistenteVocacionalPage() {
  const [i, setI] = useState(0);
  const [puntaje, setPuntaje] = useState({
    exactas: 0,
    humanidades: 0,
    salud: 0,
  });
  const [fin, setFin] = useState(false);
  const navigate = useNavigate();

  const responder = (valor) => {
    const area = preguntas[i].a;
    setPuntaje((p) => ({ ...p, [area]: p[area] + valor }));

    if (i + 1 < preguntas.length) setI(i + 1);
    else setFin(true);
  };

  const areaFinal = Object.keys(puntaje).reduce((a, b) =>
    puntaje[a] > puntaje[b] ? a : b
  );

  const irAlChat = () => {
    localStorage.setItem(
      "resultadoVocacional",
      JSON.stringify({ area: areaFinal, puntaje })
    );
    navigate("/student/asistente-chat");
  };

  return (
    <Card className="p-4 shadow-sm">
      <h4 className="fw-bold mb-3">🤖 Asistente Vocacional</h4>

      {!fin ? (
        <>
          <div className="d-flex justify-content-between align-items-center mb-2">
            <Badge bg="primary">
              Pregunta {i + 1} de {preguntas.length}
            </Badge>
            <span className="text-muted small">
              Responde con sinceridad
            </span>
          </div>

          <ProgressBar
            now={((i + 1) / preguntas.length) * 100}
            className="mb-4"
          />

          <p className="fs-5 fw-semibold text-center mb-4">
            {preguntas[i].t}
          </p>

          {opciones.map((op) => (
            <Button
              key={op.valor}
              variant={op.variant}
              className="w-100 mb-2"
              onClick={() => responder(op.valor)}
            >
              {op.valor} – {op.texto}
            </Button>
          ))}
        </>
      ) : (
        <>
          <h5 className="fw-bold text-center">
             Área recomendada: {areaFinal.toUpperCase()}
          </h5>

          <p className="text-center text-muted mt-2">
            Ahora puedes conversar con el orientador virtual
          </p>

          <Button
            className="mt-3 w-100"
            variant="success"
            onClick={irAlChat}
          >
            Hablar con el orientador 🤖
          </Button>
        </>
      )}
    </Card>
  );
}
