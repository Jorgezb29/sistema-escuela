import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .tn-wrap { font-family: 'Nunito', sans-serif; }

  /* ── Back ── */
  .tn-back {
    display: inline-flex; align-items: center; gap: 6px;
    background: none; border: none; cursor: pointer;
    font-size: 0.82rem; font-weight: 700; color: #a08080;
    font-family: 'Nunito', sans-serif; margin-bottom: 14px; padding: 0;
    transition: color .15s;
  }
  .tn-back:hover { color: #8b1a1a; }

  /* ── Header ── */
  .tn-header { display: flex; align-items: center; gap: 12px; margin-bottom: 22px; }
  .tn-header-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; box-shadow: 0 4px 14px rgba(139,26,26,0.28);
  }
  .tn-header h2 { font-size: 1.45rem; font-weight: 800; color: #1a0a0a; margin: 0; line-height: 1.2; }
  .tn-header p  { font-size: 0.75rem; color: #a08080; font-weight: 500; margin: 0; }

  /* ── Selector ── */
  .tn-selector {
    display: flex; align-items: center; gap: 14px;
    background: #fff; border-radius: 13px;
    box-shadow: 0 2px 14px rgba(139,26,26,0.07);
    padding: 16px 20px; margin-bottom: 20px; flex-wrap: wrap;
  }
  .tn-selector label { font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #8b1a1a; white-space: nowrap; }
  .tn-selector select {
    flex: 1; min-width: 200px; padding: 9px 13px;
    border: 1.5px solid #ede5e5; border-radius: 8px;
    font-size: 0.9rem; font-weight: 600; color: #2d1f1f;
    background: #fdf9f9; outline: none;
    font-family: 'Nunito', sans-serif;
    transition: border-color .2s; appearance: none;
  }
  .tn-selector select:focus { border-color: #8b1a1a; background: #fff; box-shadow: 0 0 0 3px rgba(139,26,26,0.08); }

  /* ── Mensaje ── */
  .tn-msg {
    display: flex; align-items: center; gap: 8px;
    padding: 11px 16px; border-radius: 10px;
    font-size: 0.84rem; font-weight: 700; margin-bottom: 16px;
  }
  .tn-msg-success { background: #edfaf3; border: 1.5px solid #a8e6c4; color: #1a7a45; }
  .tn-msg-danger  { background: #fff3f3; border: 1.5px solid #f5c6c6; color: #8b1a1a; }

  /* ── Card ── */
  .tn-card { background: #fff; border-radius: 15px; box-shadow: 0 2px 16px rgba(139,26,26,0.07); overflow: hidden; }
  .tn-card-header { display: flex; align-items: center; justify-content: space-between; padding: 16px 20px 13px; border-bottom: 1px solid #f5edec; }
  .tn-card-title-wrap { display: flex; align-items: center; gap: 9px; }
  .tn-card-bar   { width: 4px; height: 15px; border-radius: 3px; background: #8b1a1a; flex-shrink: 0; }
  .tn-card-title { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.09em; color: #8b1a1a; }
  .tn-count { display: inline-flex; align-items: center; justify-content: center; background: #8b1a1a; color: #fff; font-size: 0.63rem; font-weight: 800; border-radius: 20px; padding: 1px 7px; margin-left: 7px; }

  /* ── Botón guardar todos ── */
  .tn-save-all {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 8px 18px; border-radius: 9px; border: none;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    color: #fff; font-size: 0.82rem; font-weight: 700;
    cursor: pointer; font-family: 'Nunito', sans-serif;
    transition: opacity .2s; box-shadow: 0 3px 10px rgba(139,26,26,0.25);
  }
  .tn-save-all:hover { opacity: .88; }
  .tn-save-all:disabled { opacity: .55; cursor: not-allowed; }

  /* ── Tabla ── */
  .tn-table-wrap { overflow-x: auto; }
  .tn-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
  .tn-table thead tr { border-bottom: 2px solid #f5edec; }
  .tn-table thead th { padding: 10px 14px; font-size: 0.63rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #a08080; white-space: nowrap; }
  .tn-table tbody tr { border-bottom: 1px solid #faf5f5; transition: background .15s; }
  .tn-table tbody tr:hover { background: #fdf8f8; }
  .tn-table tbody td { padding: 11px 14px; color: #2d1f1f; font-weight: 600; vertical-align: middle; }

  .tn-num { color: #c8a8a8; font-size: 0.8rem; font-weight: 700; }

  /* ── Estudiante cell ── */
  .tn-student { display: flex; align-items: center; gap: 9px; }
  .tn-avatar {
    width: 32px; height: 32px; border-radius: 50%;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.72rem; font-weight: 800; color: #fff; flex-shrink: 0;
  }
  .tn-student-name  { font-size: 0.88rem; font-weight: 700; color: #2d1f1f; }
  .tn-student-sub   { font-size: 0.71rem; color: #a08080; font-weight: 500; }

  /* ── Input nota ── */
  .tn-nota-wrap { display: flex; align-items: center; gap: 8px; }
  .tn-nota-input {
    width: 80px; padding: 7px 10px;
    border: 1.5px solid #ede5e5; border-radius: 8px;
    font-size: 0.9rem; font-weight: 700; color: #2d1f1f;
    background: #fdf9f9; outline: none;
    font-family: 'Nunito', sans-serif;
    text-align: center; transition: border-color .2s;
  }
  .tn-nota-input:focus { border-color: #8b1a1a; background: #fff; box-shadow: 0 0 0 3px rgba(139,26,26,0.08); }

  /* Badge de nota */
  .tn-nota-badge {
    font-size: 0.7rem; font-weight: 800; padding: 2px 8px; border-radius: 20px;
  }
  .tn-nota-ok  { background: #edfaf3; border: 1.5px solid #a8e6c4; color: #1a7a45; }
  .tn-nota-bad { background: #fff3f3; border: 1.5px solid #f5c6c6; color: #8b1a1a; }

  /* ── Botón guardar individual ── */
  .tn-btn-save {
    display: inline-flex; align-items: center; justify-content: center;
    width: 30px; height: 30px; border-radius: 7px;
    background: #edfaf3; border: 1.5px solid #a8e6c4;
    color: #1a7a45; cursor: pointer; transition: background .15s;
    font-size: 0.8rem;
  }
  .tn-btn-save:hover { background: #d0f5e0; }
  .tn-btn-save:disabled { opacity: .5; cursor: not-allowed; }

  /* ── Empty / Info ── */
  .tn-empty { text-align: center; padding: 48px 20px; color: #c8a8a8; }
  .tn-empty-icon { font-size: 2.2rem; margin-bottom: 8px; }
  .tn-empty p { font-size: 0.88rem; font-weight: 600; margin: 0; }
  .tn-info { background: #fdf5f5; border: 1.5px solid #f0dede; border-radius: 11px; padding: 14px 18px; font-size: 0.85rem; font-weight: 600; color: #8b1a1a; margin-bottom: 16px; }

  /* ── Loading ── */
  .tn-loading { display: flex; align-items: center; gap: 10px; color: #8b1a1a; font-weight: 700; padding: 40px 0; font-family: 'Nunito', sans-serif; }
  .tn-spinner { width: 18px; height: 18px; border: 3px solid #f0dede; border-top-color: #8b1a1a; border-radius: 50%; animation: tnSpin .8s linear infinite; flex-shrink: 0; }
  @keyframes tnSpin { to { transform: rotate(360deg); } }
`;

const IconNota = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
  </svg>
);

const IconBack = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/>
    <polyline points="12,19 5,12 12,5"/>
  </svg>
);

const IconSave = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17,21 17,13 7,13 7,21"/>
    <polyline points="7,3 7,8 15,8"/>
  </svg>
);

export default function TeacherNotasPage() {
  const navigate = useNavigate();
  const [cursoMaterias, setCursoMaterias]         = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [estudiantes, setEstudiantes]             = useState([]);
  const [notas, setNotas]                         = useState({});
  const [loading, setLoading]                     = useState(true);
  const [guardando, setGuardando]                 = useState(false);
  const [mensaje, setMensaje]                     = useState(null);

  useEffect(() => {
    client.get("/teacher/materias").then((res) => {
      const materias = Array.isArray(res.data) ? res.data : [];
      setCursoMaterias(materias);
      if (materias.length > 0) { setCursoSeleccionado(materias[0].id); cargarNotas(materias[0].id); }
      else setLoading(false);
    }).catch(() => { alert("Error cargando materias"); setLoading(false); });
  }, []);

  const cargarNotas = (cursoMateriaId) => {
    setLoading(true);
    client.get(`/teacher/notas/${cursoMateriaId}`)
      .then((res) => {
        const ests = res.data.estudiantes || [];
        setEstudiantes(ests);
        const initial = {};
        ests.forEach((est) => { initial[est.id] = est.notas[0]?.nota ?? ""; });
        setNotas(initial);
      })
      .catch(() => alert("Error cargando notas"))
      .finally(() => setLoading(false));
  };

  const handleCambioMateria = (e) => {
    const id = Number(e.target.value);
    setCursoSeleccionado(id); cargarNotas(id);
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 3000);
  };

  const handleGuardar = async (estudianteId) => {
    const nota = notas[estudianteId];
    if (nota === "" || nota === undefined) return;
    if (Number(nota) < 0 || Number(nota) > 20) { mostrarMensaje("danger", "La nota debe estar entre 0 y 20"); return; }
    setGuardando(true);
    try {
      await client.post("/teacher/notas", { estudianteId, cursoMateriaId: Number(cursoSeleccionado), nota: Number(nota) });
      mostrarMensaje("success", "Nota guardada correctamente");
    } catch { mostrarMensaje("danger", "Error al guardar nota"); }
    finally { setGuardando(false); }
  };

  const handleGuardarTodos = async () => {
    setGuardando(true);
    try {
      for (const est of estudiantes) {
        const nota = notas[est.id];
        if (nota !== "" && nota !== undefined) {
          await client.post("/teacher/notas", { estudianteId: est.id, cursoMateriaId: Number(cursoSeleccionado), nota: Number(nota) });
        }
      }
      mostrarMensaje("success", "Todas las notas guardadas");
    } catch { mostrarMensaje("danger", "Error al guardar notas"); }
    finally { setGuardando(false); }
  };

  const getInicial = (nombre, apellido) => `${nombre?.[0] || ""}${apellido?.[0] || ""}`.toUpperCase() || "E";

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="tn-loading"><div className="tn-spinner" /> Cargando notas...</div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="tn-wrap">

        <button className="tn-back" onClick={() => navigate("/teacher")}>
          <IconBack /> Volver al panel
        </button>

        <div className="tn-header">
          <div className="tn-header-icon"><IconNota /></div>
          <div>
            <h2>Notas</h2>
            <p>Registro de calificaciones por materia</p>
          </div>
        </div>

        {cursoMaterias.length === 0 ? (
          <div className="tn-info">No tienes materias asignadas actualmente.</div>
        ) : (
          <>
            <div className="tn-selector">
              <label>Materia</label>
              <select value={cursoSeleccionado || ""} onChange={handleCambioMateria}>
                {cursoMaterias.map((cm) => (
                  <option key={cm.id} value={cm.id}>{cm.curso.nombre} — {cm.materia.nombre}</option>
                ))}
              </select>
            </div>

            {mensaje && (
              <div className={`tn-msg tn-msg-${mensaje.tipo}`}>
                {mensaje.tipo === "success" ? "✓" : "✕"} {mensaje.texto}
              </div>
            )}

            {estudiantes.length === 0 ? (
              <div className="tn-card">
                <div className="tn-empty">
                  <div className="tn-empty-icon">📝</div>
                  <p>No hay estudiantes en este curso</p>
                </div>
              </div>
            ) : (
              <div className="tn-card">
                <div className="tn-card-header">
                  <div className="tn-card-title-wrap">
                    <span className="tn-card-bar" />
                    <span className="tn-card-title">
                      Estudiantes
                      <span className="tn-count">{estudiantes.length}</span>
                    </span>
                  </div>
                  <button className="tn-save-all" onClick={handleGuardarTodos} disabled={guardando}>
                    <IconSave />
                    {guardando ? "Guardando..." : "Guardar todas"}
                  </button>
                </div>

                <div className="tn-table-wrap">
                  <table className="tn-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Estudiante</th>
                        <th>Apellido</th>
                        <th style={{ textAlign: "center" }}>Nota (0–20)</th>
                        <th style={{ textAlign: "center" }}>Guardar</th>
                      </tr>
                    </thead>
                    <tbody>
                      {estudiantes.map((est, i) => {
                        const notaVal = notas[est.id];
                        const notaNum = Number(notaVal);
                        const tieneNota = notaVal !== "" && notaVal !== undefined;

                        return (
                          <tr key={est.id}>
                            <td><span className="tn-num">{i + 1}</span></td>
                            <td>
                              <div className="tn-student">
                                <div className="tn-avatar">{getInicial(est.user.nombre, est.user.apellido)}</div>
                                <div>
                                  <div className="tn-student-name">{est.user.nombre}</div>
                                  <div className="tn-student-sub">{est.user.email}</div>
                                </div>
                              </div>
                            </td>
                            <td>{est.user.apellido}</td>
                            <td style={{ textAlign: "center" }}>
                              <div className="tn-nota-wrap" style={{ justifyContent: "center" }}>
                                <input
                                  className="tn-nota-input"
                                  type="number" min={0} max={20} step={0.5}
                                  value={notaVal ?? ""}
                                  onChange={(e) => setNotas((prev) => ({ ...prev, [est.id]: e.target.value }))}
                                />
                                {tieneNota && (
                                  <span className={`tn-nota-badge ${notaNum >= 11 ? "tn-nota-ok" : "tn-nota-bad"}`}>
                                    {notaNum >= 11 ? "✓" : "✕"}
                                  </span>
                                )}
                              </div>
                            </td>
                            <td style={{ textAlign: "center" }}>
                              <button className="tn-btn-save" onClick={() => handleGuardar(est.id)} disabled={guardando} title="Guardar nota">
                                <IconSave />
                              </button>
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