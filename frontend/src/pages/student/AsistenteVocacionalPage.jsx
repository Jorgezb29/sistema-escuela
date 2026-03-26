import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../api/client";

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

const opciones = [
  { valor: 1, texto: "Nunca" },
  { valor: 2, texto: "Rara vez" },
  { valor: 3, texto: "A veces" },
  { valor: 4, texto: "Casi siempre" },
  { valor: 5, texto: "Siempre" },
];

const areaInfo = {
  exactas:     { label: "Exactas",     icon: "", color: "#8b1a1a", light: "#fff5f5" },
  humanidades: { label: "Humanidades", icon: "", color: "#7a4f1a", light: "#fdf7f0" },
  salud:       { label: "Salud",       icon: "", color: "#1a5c3a", light: "#f0faf4" },
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .voc-wrapper { font-family: 'Nunito', sans-serif; }
  .voc-wrapper h4 { font-size: 1.4rem; font-weight: 800; color: #1a0a0a; margin-bottom: 4px; }

  .voc-card {
    border: none;
    border-radius: 15px;
    box-shadow: 0 2px 18px rgba(139,26,26,0.08);
    background: #fff;
    padding: 32px;
    animation: vocFadeUp .35s ease both;
  }
  @keyframes vocFadeUp {
    from { opacity: 0; transform: translateY(10px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .voc-section-label {
    font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.1em; color: #8b1a1a;
    display: flex; align-items: center; gap: 8px;
    margin-bottom: 16px; margin-top: 4px;
  }
  .voc-section-label::before {
    content: ''; display: block; width: 4px; height: 14px;
    background: #8b1a1a; border-radius: 3px; flex-shrink: 0;
  }

  .voc-divider { border: none; border-top: 1px solid #f5edec; margin: 20px 0; }

  .voc-meta { display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px; }
  .voc-counter {
    font-size: 0.7rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.1em; color: #8b1a1a;
    display: flex; align-items: center; gap: 8px;
  }
  .voc-counter::before {
    content: ''; display: block; width: 4px; height: 14px;
    background: #8b1a1a; border-radius: 3px;
  }
  .voc-hint { font-size: 0.72rem; font-weight: 600; color: #a08080; }

  .voc-track {
    width: 100%; height: 6px; background: #f5edec;
    border-radius: 10px; margin-bottom: 28px; overflow: hidden;
  }
  .voc-fill {
    height: 100%; background: #8b1a1a;
    border-radius: 10px; transition: width .3s ease;
  }

  .voc-question {
    font-size: 1.05rem; font-weight: 700; color: #1a0a0a;
    text-align: center; line-height: 1.6; margin-bottom: 28px; padding: 0 4px;
  }

  .voc-options { display: flex; flex-direction: column; gap: 10px; }

  .voc-opt {
    display: flex; align-items: center; gap: 14px;
    padding: 13px 18px; border-radius: 10px;
    border: 1.5px solid #ede5e5; background: #fdf9f9;
    cursor: pointer; transition: all .18s ease;
    font-family: 'Nunito', sans-serif; text-align: left;
  }
  .voc-opt:hover { border-color: #8b1a1a; background: #fff5f5; transform: translateX(4px); }
  .voc-opt:active { transform: translateX(4px) scale(0.99); }

  .voc-opt-num {
    width: 32px; height: 32px; border-radius: 50%;
    background: #f5edec; display: flex; align-items: center; justify-content: center;
    font-size: 0.82rem; font-weight: 800; color: #8b1a1a;
    flex-shrink: 0; transition: background .18s, color .18s;
  }
  .voc-opt:hover .voc-opt-num { background: #8b1a1a; color: #fff; }
  .voc-opt-txt { font-size: 0.92rem; font-weight: 600; color: #2d1f1f; }

  /* Cargando */
  .voc-loading {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 48px 0; gap: 16px;
  }
  .voc-spinner {
    width: 40px; height: 40px;
    border: 4px solid #f0dede; border-top-color: #8b1a1a;
    border-radius: 50%; animation: vocSpin .8s linear infinite;
  }
  @keyframes vocSpin { to { transform: rotate(360deg); } }
  .voc-loading p { font-size: 0.88rem; font-weight: 700; color: #8b1a1a; margin: 0; }

  /* Área cards */
  .voc-area-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
  .voc-area-box {
    border-radius: 12px; padding: 18px 14px;
    text-align: center; border: 1.5px solid;
  }
  .voc-area-tag {
    font-size: 0.6rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.1em; margin-bottom: 8px;
  }
  .voc-area-icon { font-size: 1.5rem; margin-bottom: 4px; }
  .voc-area-name { font-size: 0.95rem; font-weight: 800; margin-bottom: 6px; }
  .voc-area-pct { font-size: 1.6rem; font-weight: 900; }

  /* Barras */
  .voc-bar-row { margin-bottom: 14px; }
  .voc-bar-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 5px; }
  .voc-bar-lbl {
    font-size: 0.78rem; font-weight: 700; color: #2d1f1f;
    display: flex; align-items: center; gap: 7px;
  }
  .voc-badge {
    font-size: 0.58rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.06em; padding: 2px 8px; border-radius: 20px;
  }
  .voc-bar-pct { font-size: 0.85rem; font-weight: 800; color: #2d1f1f; }
  .voc-bar-track {
    width: 100%; height: 10px; background: #f5edec;
    border-radius: 10px; overflow: hidden;
  }
  .voc-bar-fill { height: 100%; border-radius: 10px; transition: width 1s ease; }

  /* Interpretación */
  .voc-interp {
    background: #fdf9f9; border: 1.5px solid #f0e5e5;
    border-radius: 12px; padding: 18px 20px;
    font-size: 0.86rem; font-weight: 500; color: #3a2020;
    line-height: 1.7; white-space: pre-line;
    max-height: 220px; overflow-y: auto; margin-bottom: 20px;
  }
  .voc-interp::-webkit-scrollbar { width: 5px; }
  .voc-interp::-webkit-scrollbar-track { background: #f5edec; border-radius: 10px; }
  .voc-interp::-webkit-scrollbar-thumb { background: #c97b7b; border-radius: 10px; }

  /* Botón chat */
  .voc-btn {
    width: 100%; padding: 14px; border-radius: 10px; border: none;
    background: #8b1a1a; color: #fff;
    font-family: 'Nunito', sans-serif; font-size: 0.95rem; font-weight: 800;
    cursor: pointer; transition: background .18s, transform .18s;
    display: flex; align-items: center; justify-content: center; gap: 10px;
  }
  .voc-btn:hover { background: #6d1414; transform: translateY(-1px); }
  .voc-btn:active { transform: translateY(0); }

  /* Error */
  .voc-error {
    background: #fff5f5; border: 1.5px solid #f0c0c0;
    border-radius: 10px; padding: 12px 16px;
    font-size: 0.84rem; font-weight: 600; color: #8b1a1a; margin-top: 12px;
  }

  @media (max-width: 500px) {
    .voc-area-grid { grid-template-columns: 1fr; }
    .voc-card { padding: 22px 16px; }
  }
`;

export default function AsistenteVocacionalPage() {
  const [idx, setIdx] = useState(0);
  const [puntaje, setPuntaje] = useState({ exactas: 0, humanidades: 0, salud: 0 });
  const [fin, setFin] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const responder = (valor) => {
    const area = preguntas[idx].a;
    const nuevo = { ...puntaje, [area]: puntaje[area] + valor };
    setPuntaje(nuevo);
    if (idx + 1 < preguntas.length) {
      setIdx(idx + 1);
    } else {
      setFin(true);
      enviarResultado(nuevo);
    }
  };

  const enviarResultado = async (puntajeFinal) => {
    setCargando(true);
    setError("");
    const resp = {};
    let i = 1;
    for (const area of ["exactas", "humanidades", "salud"]) {
      const avg = Math.round(puntajeFinal[area] / 15);
      for (let j = 0; j < 15; j++) { resp[i] = avg; i++; }
    }
    try {
      const res = await api.post("/test-vocacional/resolver", { respuestas: resp });
      setResultado(res.data);
      localStorage.setItem("resultadoVocacional", JSON.stringify({
        area: res.data.areaPrincipal,
        areaSegunda: res.data.areaSegunda,
        puntaje: res.data.puntajes,
        porcentajes: res.data.porcentajes,
      }));
    } catch {
      setError("No se pudo obtener el análisis. Por favor, inténtalo de nuevo.");
    } finally {
      setCargando(false);
    }
  };

  const areasOrdenadas = resultado
    ? Object.entries(resultado.porcentajes).sort((a, b) => b[1] - a[1])
    : [];

  const barColors = ["#8b1a1a", "#c97b7b", "#e8c5c5"];

  return (
    <>
      <style>{styles}</style>
      <div className="voc-wrapper">
        <h4>Asistente Vocacional</h4>
        <p style={{ fontSize: "0.78rem", fontWeight: 600, color: "#8b1a1a", marginBottom: "20px" }}>
          ● Basado en los modelos Kuder · Holland · CHASIDE
        </p>

        <div className="voc-card">

          {/* TEST */}
          {!fin && (
            <>
              <div className="voc-meta">
                <div className="voc-counter">Pregunta {idx + 1} de {preguntas.length}</div>
                <span className="voc-hint">Responde con sinceridad</span>
              </div>
              <div className="voc-track">
                <div className="voc-fill" style={{ width: `${((idx + 1) / preguntas.length) * 100}%` }} />
              </div>
              <p className="voc-question">{preguntas[idx].t}</p>
              <div className="voc-options">
                {opciones.map((op) => (
                  <button key={op.valor} className="voc-opt" onClick={() => responder(op.valor)}>
                    <div className="voc-opt-num">{op.valor}</div>
                    <div className="voc-opt-txt">{op.texto}</div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* CARGANDO */}
          {fin && cargando && (
            <div className="voc-loading">
              <div className="voc-spinner" />
              <p>Analizando tu perfil vocacional...</p>
            </div>
          )}

          {/* ERROR */}
          {error && <div className="voc-error">⚠ {error}</div>}

          {/* RESULTADOS */}
          {fin && !cargando && resultado && (
            <>
              <div className="voc-section-label">Resumen de resultados</div>

              <div className="voc-area-grid">
                <div className="voc-area-box" style={{
                  background: areaInfo[resultado.areaPrincipal].light,
                  borderColor: areaInfo[resultado.areaPrincipal].color,
                }}>
                  <div className="voc-area-tag" style={{ color: areaInfo[resultado.areaPrincipal].color }}>
                     Área principal
                  </div>
                  <div className="voc-area-icon">{areaInfo[resultado.areaPrincipal].icon}</div>
                  <div className="voc-area-name" style={{ color: areaInfo[resultado.areaPrincipal].color }}>
                    {areaInfo[resultado.areaPrincipal].label}
                  </div>
                  <div className="voc-area-pct" style={{ color: areaInfo[resultado.areaPrincipal].color }}>
                    {resultado.porcentajes[resultado.areaPrincipal]}%
                  </div>
                </div>

                <div className="voc-area-box" style={{ background: "#fdf9f9", borderColor: "#c97b7b" }}>
                  <div className="voc-area-tag" style={{ color: "#8b1a1a" }}>2ª opción</div>
                  <div className="voc-area-icon">{areaInfo[resultado.areaSegunda].icon}</div>
                  <div className="voc-area-name" style={{ color: "#5a3a3a" }}>
                    {areaInfo[resultado.areaSegunda].label}
                  </div>
                  <div className="voc-area-pct" style={{ color: "#8b1a1a" }}>
                    {resultado.porcentajes[resultado.areaSegunda]}%
                  </div>
                </div>
              </div>

              <hr className="voc-divider" />
              <div className="voc-section-label">Porcentaje por área</div>

              {areasOrdenadas.map(([area, pct], i) => {
                const info = areaInfo[area];
                return (
                  <div key={area} className="voc-bar-row">
                    <div className="voc-bar-head">
                      <div className="voc-bar-lbl">
                        {info.icon} {info.label}
                        {area === resultado.areaPrincipal && (
                          <span className="voc-badge" style={{ background: info.light, color: info.color }}>
                            Principal
                          </span>
                        )}
                        {area === resultado.areaSegunda && (
                          <span className="voc-badge" style={{ background: "#fdf0f0", color: "#8b1a1a" }}>
                            2ª opción
                          </span>
                        )}
                      </div>
                      <span className="voc-bar-pct">{pct}%</span>
                    </div>
                    <div className="voc-bar-track">
                      <div className="voc-bar-fill" style={{ width: `${pct}%`, background: barColors[i] }} />
                    </div>
                  </div>
                );
              })}

              <hr className="voc-divider" />
              <div className="voc-section-label">Análisis vocacional</div>
              <div className="voc-interp">{resultado.interpretacion}</div>

              <button className="voc-btn" onClick={() => navigate("/student/asistente-chat")}>
                Hablar con el orientador <span style={{ fontSize: "1.1rem" }}>🤖</span>
              </button>
            </>
          )}

        </div>
      </div>
    </>
  );
}