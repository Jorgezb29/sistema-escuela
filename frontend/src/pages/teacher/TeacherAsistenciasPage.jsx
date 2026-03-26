import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";

const ESTADOS = ["PRESENTE", "AUSENTE", "TARDANZA", "JUSTIFICADO"];

const ESTADO_STYLE = {
  PRESENTE:    { bg: "#edfaf3", border: "#a8e6c4", color: "#1a7a45" },
  AUSENTE:     { bg: "#fff3f3", border: "#f5c6c6", color: "#8b1a1a" },
  TARDANZA:    { bg: "#fff8e0", border: "#f5d87a", color: "#b58a00" },
  JUSTIFICADO: { bg: "#f0f4ff", border: "#ccd6f5", color: "#2d4db3" },
};

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .ta-wrap { font-family: 'Nunito', sans-serif; }

  /* ── Back ── */
  .ta-back {
    display: inline-flex; align-items: center; gap: 6px;
    background: none; border: none; cursor: pointer;
    font-size: 0.82rem; font-weight: 700; color: #a08080;
    font-family: 'Nunito', sans-serif; margin-bottom: 14px; padding: 0;
    transition: color .15s;
  }
  .ta-back:hover { color: #8b1a1a; }

  /* ── Header ── */
  .ta-header { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; }
  .ta-header-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; box-shadow: 0 4px 14px rgba(139,26,26,0.28);
  }
  .ta-header h2 { font-size: 1.45rem; font-weight: 800; color: #1a0a0a; margin: 0; line-height: 1.2; }
  .ta-header p  { font-size: 0.75rem; color: #a08080; font-weight: 500; margin: 0; }

  /* ── Filtros ── */
  .ta-filters {
    display: flex; align-items: center; gap: 14px; flex-wrap: wrap;
    background: #fff; border-radius: 13px;
    box-shadow: 0 2px 14px rgba(139,26,26,0.07);
    padding: 16px 20px; margin-bottom: 16px;
  }
  .ta-filter-group { display: flex; align-items: center; gap: 10px; }
  .ta-filter-group label { font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #8b1a1a; white-space: nowrap; }
  .ta-filter-group select,
  .ta-filter-group input[type="date"] {
    padding: 9px 13px; border: 1.5px solid #ede5e5; border-radius: 8px;
    font-size: 0.88rem; font-weight: 600; color: #2d1f1f;
    background: #fdf9f9; outline: none;
    font-family: 'Nunito', sans-serif;
    transition: border-color .2s; appearance: none; min-width: 180px;
  }
  .ta-filter-group select:focus,
  .ta-filter-group input[type="date"]:focus { border-color: #8b1a1a; background: #fff; box-shadow: 0 0 0 3px rgba(139,26,26,0.08); }

  /* ── Resumen ── */
  .ta-resumen { display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 18px; }
  .ta-resumen-chip {
    display: inline-flex; align-items: center; gap: 6px;
    padding: 6px 14px; border-radius: 20px;
    font-size: 0.78rem; font-weight: 800; border: 1.5px solid;
  }
  .ta-resumen-num { font-size: 1rem; font-weight: 900; }

  /* ── Mensaje ── */
  .ta-msg { display: flex; align-items: center; gap: 8px; padding: 11px 16px; border-radius: 10px; font-size: 0.84rem; font-weight: 700; margin-bottom: 16px; }
  .ta-msg-success { background: #edfaf3; border: 1.5px solid #a8e6c4; color: #1a7a45; }
  .ta-msg-danger  { background: #fff3f3; border: 1.5px solid #f5c6c6; color: #8b1a1a; }

  /* ── Card ── */
  .ta-card { background: #fff; border-radius: 15px; box-shadow: 0 2px 16px rgba(139,26,26,0.07); overflow: hidden; }
  .ta-card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px 13px; border-bottom: 1px solid #f5edec; }
  .ta-card-title-wrap { display: flex; align-items: center; gap: 9px; }
  .ta-card-bar   { width: 4px; height: 15px; border-radius: 3px; background: #8b1a1a; flex-shrink: 0; }
  .ta-card-title { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.09em; color: #8b1a1a; }
  .ta-count { display: inline-flex; align-items: center; justify-content: center; background: #8b1a1a; color: #fff; font-size: 0.63rem; font-weight: 800; border-radius: 20px; padding: 1px 7px; margin-left: 7px; }

  /* ── Botón guardar ── */
  .ta-save {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 8px 18px; border-radius: 9px; border: none;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    color: #fff; font-size: 0.82rem; font-weight: 700;
    cursor: pointer; font-family: 'Nunito', sans-serif;
    transition: opacity .2s; box-shadow: 0 3px 10px rgba(139,26,26,0.25);
  }
  .ta-save:hover { opacity: .88; }
  .ta-save:disabled { opacity: .55; cursor: not-allowed; }

  /* ── Tabla ── */
  .ta-table-wrap { overflow-x: auto; }
  .ta-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
  .ta-table thead tr { border-bottom: 2px solid #f5edec; }
  .ta-table thead th { padding: 10px 14px; font-size: 0.63rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #a08080; white-space: nowrap; }
  .ta-table tbody tr { border-bottom: 1px solid #faf5f5; transition: background .15s; }
  .ta-table tbody tr:hover { background: #fdf8f8; }
  .ta-table tbody td { padding: 11px 14px; color: #2d1f1f; font-weight: 600; vertical-align: middle; }

  .ta-num { color: #c8a8a8; font-size: 0.8rem; font-weight: 700; }

  /* ── Student cell ── */
  .ta-student { display: flex; align-items: center; gap: 9px; }
  .ta-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg,#8b1a1a,#c0392b); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 800; color: #fff; flex-shrink: 0; }
  .ta-student-name { font-size: 0.88rem; font-weight: 700; color: #2d1f1f; }
  .ta-student-sub  { font-size: 0.71rem; color: #a08080; font-weight: 500; }

  /* ── Select de estado ── */
  .ta-estado-select {
    padding: 7px 11px; border-radius: 8px; border: 1.5px solid;
    font-size: 0.82rem; font-weight: 700; outline: none;
    font-family: 'Nunito', sans-serif; cursor: pointer;
    transition: box-shadow .2s; appearance: none; min-width: 150px;
  }
  .ta-estado-select:focus { box-shadow: 0 0 0 3px rgba(139,26,26,0.08); }

  /* ── Empty / Info ── */
  .ta-empty { text-align: center; padding: 48px 20px; color: #c8a8a8; }
  .ta-empty-icon { font-size: 2.2rem; margin-bottom: 8px; }
  .ta-empty p { font-size: 0.88rem; font-weight: 600; margin: 0; }
  .ta-info { background: #fdf5f5; border: 1.5px solid #f0dede; border-radius: 11px; padding: 14px 18px; font-size: 0.85rem; font-weight: 600; color: #8b1a1a; margin-bottom: 16px; }

  /* ── Loading ── */
  .ta-loading { display: flex; align-items: center; gap: 10px; color: #8b1a1a; font-weight: 700; padding: 40px 0; font-family: 'Nunito', sans-serif; }
  .ta-spinner { width: 18px; height: 18px; border: 3px solid #f0dede; border-top-color: #8b1a1a; border-radius: 50%; animation: taSpin .8s linear infinite; flex-shrink: 0; }
  @keyframes taSpin { to { transform: rotate(360deg); } }
`;

const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <polyline points="9,16 11,18 15,14"/>
  </svg>
);

const IconBack = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/>
  </svg>
);

const IconSave = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/>
  </svg>
);

const ESTADO_LABEL = {
  PRESENTE:    "Presente",
  AUSENTE:     "Ausente",
  TARDANZA:    "Tardanza",
  JUSTIFICADO: "Justificado",
};

export default function TeacherAsistenciasPage() {
  const navigate = useNavigate();
  const [cursoMaterias, setCursoMaterias]         = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [estudiantes, setEstudiantes]             = useState([]);
  const [estados, setEstados]                     = useState({});
  const [fecha, setFecha]                         = useState(new Date().toISOString().split("T")[0]);
  const [loading, setLoading]                     = useState(true);
  const [guardando, setGuardando]                 = useState(false);
  const [mensaje, setMensaje]                     = useState(null);

  useEffect(() => {
    client.get("/teacher/materias").then((res) => {
      const materias = Array.isArray(res.data) ? res.data : [];
      setCursoMaterias(materias);
      if (materias.length > 0) { setCursoSeleccionado(materias[0].id); cargarAsistencias(materias[0].id, fecha); }
      else setLoading(false);
    }).catch(() => { alert("Error cargando materias"); setLoading(false); });
  }, []);

  const cargarAsistencias = (cursoMateriaId, f) => {
    setLoading(true);
    client.get(`/teacher/asistencias/${cursoMateriaId}?fecha=${f}`)
      .then((res) => {
        setEstudiantes(res.data.estudiantes || []);
        const initial = {};
        (res.data.estudiantes || []).forEach((est) => { initial[est.id] = est.asistencias[0]?.estado || "PRESENTE"; });
        setEstados(initial);
      })
      .catch(() => alert("Error cargando asistencias"))
      .finally(() => setLoading(false));
  };

  const handleCambioMateria = (e) => { const id = Number(e.target.value); setCursoSeleccionado(id); cargarAsistencias(id, fecha); };
  const handleFechaChange   = (e) => { setFecha(e.target.value); if (cursoSeleccionado) cargarAsistencias(cursoSeleccionado, e.target.value); };

  const handleGuardar = async () => {
    setGuardando(true);
    try {
      await client.post("/teacher/asistencias", {
        cursoMateriaId: Number(cursoSeleccionado),
        fecha,
        asistencias: estudiantes.map((est) => ({ estudianteId: est.id, estado: estados[est.id] || "PRESENTE" })),
      });
      setMensaje({ tipo: "success", texto: "Asistencias guardadas correctamente" });
    } catch {
      setMensaje({ tipo: "danger", texto: "Error al guardar asistencias" });
    } finally {
      setGuardando(false);
      setTimeout(() => setMensaje(null), 3000);
    }
  };

  const resumen = ESTADOS.reduce((acc, e) => { acc[e] = Object.values(estados).filter((v) => v === e).length; return acc; }, {});
  const getInicial = (nombre, apellido) => `${nombre?.[0] || ""}${apellido?.[0] || ""}`.toUpperCase() || "E";

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="ta-loading"><div className="ta-spinner" /> Cargando asistencias...</div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="ta-wrap">

        <button className="ta-back" onClick={() => navigate("/teacher")}>
          <IconBack /> Volver al panel
        </button>

        <div className="ta-header">
          <div className="ta-header-icon"><IconCalendar /></div>
          <div>
            <h2>Asistencias</h2>
            <p>Registro de asistencia por materia y fecha</p>
          </div>
        </div>

        {cursoMaterias.length === 0 ? (
          <div className="ta-info">No tienes materias asignadas actualmente.</div>
        ) : (
          <>
            {/* ── Filtros ── */}
            <div className="ta-filters">
              <div className="ta-filter-group">
                <label>Materia</label>
                <select value={cursoSeleccionado || ""} onChange={handleCambioMateria}>
                  {cursoMaterias.map((cm) => (
                    <option key={cm.id} value={cm.id}>{cm.curso.nombre} — {cm.materia.nombre}</option>
                  ))}
                </select>
              </div>
              <div className="ta-filter-group">
                <label>Fecha</label>
                <input type="date" value={fecha} onChange={handleFechaChange} />
              </div>
            </div>

            {/* ── Resumen ── */}
            <div className="ta-resumen">
              {ESTADOS.map((e) => {
                const s = ESTADO_STYLE[e];
                return (
                  <span key={e} className="ta-resumen-chip"
                    style={{ background: s.bg, borderColor: s.border, color: s.color }}>
                    <span className="ta-resumen-num">{resumen[e]}</span>
                    {ESTADO_LABEL[e]}
                  </span>
                );
              })}
            </div>

            {mensaje && (
              <div className={`ta-msg ta-msg-${mensaje.tipo}`}>
                {mensaje.tipo === "success" ? "✓" : "✕"} {mensaje.texto}
              </div>
            )}

            {estudiantes.length === 0 ? (
              <div className="ta-card">
                <div className="ta-empty">
                  <div className="ta-empty-icon">📅</div>
                  <p>No hay estudiantes en este curso</p>
                </div>
              </div>
            ) : (
              <div className="ta-card">
                <div className="ta-card-header">
                  <div className="ta-card-title-wrap">
                    <span className="ta-card-bar" />
                    <span className="ta-card-title">
                      Estudiantes
                      <span className="ta-count">{estudiantes.length}</span>
                    </span>
                  </div>
                  <button className="ta-save" onClick={handleGuardar} disabled={guardando}>
                    <IconSave />
                    {guardando ? "Guardando..." : "Guardar asistencia"}
                  </button>
                </div>

                <div className="ta-table-wrap">
                  <table className="ta-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Estudiante</th>
                        <th>Apellido</th>
                        <th style={{ textAlign: "center" }}>Estado</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estudiantes.map((est, i) => {
                        const estadoActual = estados[est.id] || "PRESENTE";
                        const s = ESTADO_STYLE[estadoActual];
                        return (
                          <tr key={est.id}>
                            <td><span className="ta-num">{i + 1}</span></td>
                            <td>
                              <div className="ta-student">
                                <div className="ta-avatar">{getInicial(est.user.nombre, est.user.apellido)}</div>
                                <div>
                                  <div className="ta-student-name">{est.user.nombre}</div>
                                  <div className="ta-student-sub">{est.user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>{est.user.apellido}</td>
                            <td style={{ textAlign: "center" }}>
                              <select
                                className="ta-estado-select"
                                value={estadoActual}
                                style={{ background: s.bg, borderColor: s.border, color: s.color }}
                                onChange={(e) => setEstados((prev) => ({ ...prev, [est.id]: e.target.value }))}
                              >
                                {ESTADOS.map((op) => (
                                  <option key={op} value={op}>{ESTADO_LABEL[op]}</option>
                                ))}
                              </select>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </>
  );
}