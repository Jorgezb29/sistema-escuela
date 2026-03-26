import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import client from "../../api/client";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .ti-wrap { font-family: 'Nunito', sans-serif; }

  /* ── Back ── */
  .ti-back {
    display: inline-flex; align-items: center; gap: 6px;
    background: none; border: none; cursor: pointer;
    font-size: 0.82rem; font-weight: 700; color: #a08080;
    font-family: 'Nunito', sans-serif; margin-bottom: 14px; padding: 0;
    transition: color .15s;
  }
  .ti-back:hover { color: #8b1a1a; }

  /* ── Header row ── */
  .ti-header-row { display: flex; align-items: center; justify-content: space-between; gap: 16px; margin-bottom: 22px; flex-wrap: wrap; }
  .ti-header { display: flex; align-items: center; gap: 12px; }
  .ti-header-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; box-shadow: 0 4px 14px rgba(139,26,26,0.28);
  }
  .ti-header h2 { font-size: 1.45rem; font-weight: 800; color: #1a0a0a; margin: 0; line-height: 1.2; }
  .ti-header p  { font-size: 0.75rem; color: #a08080; font-weight: 500; margin: 0; }

  /* ── Botón nueva incidencia ── */
  .ti-btn-nueva {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: 9px; border: none;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    color: #fff; font-size: 0.83rem; font-weight: 700;
    cursor: pointer; font-family: 'Nunito', sans-serif;
    transition: opacity .2s; box-shadow: 0 3px 10px rgba(139,26,26,0.25);
    white-space: nowrap;
  }
  .ti-btn-nueva:hover { opacity: .88; }
  .ti-btn-cancel {
    display: inline-flex; align-items: center; gap: 7px;
    padding: 9px 18px; border-radius: 9px;
    border: 1.5px solid #ede5e5; background: #fff;
    color: #a08080; font-size: 0.83rem; font-weight: 700;
    cursor: pointer; font-family: 'Nunito', sans-serif;
    transition: border-color .15s, color .15s;
  }
  .ti-btn-cancel:hover { border-color: #8b1a1a; color: #8b1a1a; }

  /* ── Selector ── */
  .ti-selector {
    display: flex; align-items: center; gap: 14px;
    background: #fff; border-radius: 13px;
    box-shadow: 0 2px 14px rgba(139,26,26,0.07);
    padding: 16px 20px; margin-bottom: 18px; flex-wrap: wrap;
  }
  .ti-selector label { font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #8b1a1a; white-space: nowrap; }
  .ti-selector select {
    flex: 1; min-width: 200px; padding: 9px 13px;
    border: 1.5px solid #ede5e5; border-radius: 8px;
    font-size: 0.9rem; font-weight: 600; color: #2d1f1f;
    background: #fdf9f9; outline: none;
    font-family: 'Nunito', sans-serif;
    transition: border-color .2s; appearance: none;
  }
  .ti-selector select:focus { border-color: #8b1a1a; background: #fff; box-shadow: 0 0 0 3px rgba(139,26,26,0.08); }

  /* ── Mensaje ── */
  .ti-msg { display: flex; align-items: center; gap: 8px; padding: 11px 16px; border-radius: 10px; font-size: 0.84rem; font-weight: 700; margin-bottom: 16px; }
  .ti-msg-success { background: #edfaf3; border: 1.5px solid #a8e6c4; color: #1a7a45; }
  .ti-msg-danger  { background: #fff3f3; border: 1.5px solid #f5c6c6; color: #8b1a1a; }
  .ti-msg-warning { background: #fff8e0; border: 1.5px solid #f5d87a; color: #b58a00; }

  /* ── Formulario nueva incidencia ── */
  .ti-form-card {
    background: #fff; border-radius: 15px;
    box-shadow: 0 2px 16px rgba(139,26,26,0.07);
    border-left: 4px solid #8b1a1a;
    overflow: hidden; margin-bottom: 20px;
    animation: tiFadeDown .25s ease both;
  }
  @keyframes tiFadeDown { from { opacity:0; transform:translateY(-8px); } to { opacity:1; transform:translateY(0); } }

  .ti-form-header { display: flex; align-items: center; gap: 9px; padding: 15px 20px 12px; border-bottom: 1px solid #f5edec; }
  .ti-form-bar    { width: 4px; height: 15px; border-radius: 3px; background: #8b1a1a; flex-shrink: 0; }
  .ti-form-title  { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.09em; color: #8b1a1a; }
  .ti-form-body   { padding: 18px 20px 20px; }

  .ti-field { margin-bottom: 14px; }
  .ti-field label { display: block; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #a08080; margin-bottom: 5px; }
  .ti-field select,
  .ti-field textarea {
    width: 100%; padding: 9px 12px;
    border: 1.5px solid #ede5e5; border-radius: 8px;
    font-size: 0.89rem; font-weight: 600; color: #2d1f1f;
    background: #fdf9f9; outline: none;
    font-family: 'Nunito', sans-serif;
    transition: border-color .2s; appearance: none;
  }
  .ti-field select:focus,
  .ti-field textarea:focus { border-color: #8b1a1a; background: #fff; box-shadow: 0 0 0 3px rgba(139,26,26,0.08); }
  .ti-field textarea { resize: vertical; min-height: 90px; }

  .ti-btn-registrar {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 11px; border: none; border-radius: 9px;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    color: #fff; font-size: 0.88rem; font-weight: 700;
    cursor: pointer; font-family: 'Nunito', sans-serif;
    transition: opacity .2s; box-shadow: 0 4px 12px rgba(139,26,26,0.28);
  }
  .ti-btn-registrar:hover { opacity: .9; }
  .ti-btn-registrar:disabled { opacity: .55; cursor: not-allowed; }

  /* ── Card tabla ── */
  .ti-card { background: #fff; border-radius: 15px; box-shadow: 0 2px 16px rgba(139,26,26,0.07); overflow: hidden; }
  .ti-card-header { display: flex; align-items: center; gap: 9px; padding: 16px 20px 13px; border-bottom: 1px solid #f5edec; }
  .ti-card-bar   { width: 4px; height: 15px; border-radius: 3px; background: #8b1a1a; flex-shrink: 0; }
  .ti-card-title { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.09em; color: #8b1a1a; }
  .ti-count { display: inline-flex; align-items: center; justify-content: center; background: #8b1a1a; color: #fff; font-size: 0.63rem; font-weight: 800; border-radius: 20px; padding: 1px 7px; margin-left: 7px; }

  /* ── Tabla ── */
  .ti-table-wrap { overflow-x: auto; }
  .ti-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
  .ti-table thead tr { border-bottom: 2px solid #f5edec; }
  .ti-table thead th { padding: 10px 14px; font-size: 0.63rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #a08080; white-space: nowrap; }
  .ti-table tbody tr { border-bottom: 1px solid #faf5f5; transition: background .15s; }
  .ti-table tbody tr:hover { background: #fdf8f8; }
  .ti-table tbody td { padding: 12px 14px; color: #2d1f1f; font-weight: 600; vertical-align: middle; }

  .ti-num { color: #c8a8a8; font-size: 0.8rem; font-weight: 700; }

  /* ── Student cell ── */
  .ti-student { display: flex; align-items: center; gap: 9px; }
  .ti-avatar { width: 32px; height: 32px; border-radius: 50%; background: linear-gradient(135deg,#8b1a1a,#c0392b); display: flex; align-items: center; justify-content: center; font-size: 0.72rem; font-weight: 800; color: #fff; flex-shrink: 0; }
  .ti-student-name { font-size: 0.88rem; font-weight: 700; color: #2d1f1f; }

  /* ── Chips ── */
  .ti-chip-desc {
    display: inline-flex; align-items: center; gap: 5px;
    background: #fff3f3; border: 1.5px solid #f5c6c6;
    color: #8b1a1a; font-size: 0.78rem; font-weight: 700;
    padding: 3px 10px; border-radius: 20px;
    max-width: 260px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .ti-chip-date {
    display: inline-flex; align-items: center;
    background: #f5f0ff; border: 1.5px solid #ddd0f5;
    color: #5a3d9a; font-size: 0.78rem; font-weight: 700;
    padding: 3px 10px; border-radius: 20px;
  }

  /* ── Botón eliminar ── */
  .ti-btn-del {
    display: inline-flex; align-items: center; gap: 5px;
    padding: 5px 12px; border-radius: 7px;
    background: #fff3f3; border: 1.5px solid #f5c6c6;
    color: #8b1a1a; font-size: 0.75rem; font-weight: 700;
    cursor: pointer; font-family: 'Nunito', sans-serif;
    transition: background .15s;
  }
  .ti-btn-del:hover { background: #ffe0e0; }

  /* ── Empty / Info ── */
  .ti-empty { text-align: center; padding: 48px 20px; color: #c8a8a8; }
  .ti-empty-icon { font-size: 2.2rem; margin-bottom: 8px; }
  .ti-empty p { font-size: 0.88rem; font-weight: 600; margin: 0; }
  .ti-info { background: #fdf5f5; border: 1.5px solid #f0dede; border-radius: 11px; padding: 14px 18px; font-size: 0.85rem; font-weight: 600; color: #8b1a1a; margin-bottom: 16px; }

  /* ── Loading ── */
  .ti-loading { display: flex; align-items: center; gap: 10px; color: #8b1a1a; font-weight: 700; padding: 40px 0; font-family: 'Nunito', sans-serif; }
  .ti-spinner { width: 18px; height: 18px; border: 3px solid #f0dede; border-top-color: #8b1a1a; border-radius: 50%; animation: tiSpin .8s linear infinite; flex-shrink: 0; }
  @keyframes tiSpin { to { transform: rotate(360deg); } }
`;

const IconAlert = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
    <line x1="12" y1="9" x2="12" y2="13"/>
    <line x1="12" y1="17" x2="12.01" y2="17"/>
  </svg>
);

const IconBack = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/>
  </svg>
);

const IconPlus = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
);

const IconSave = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17,21 17,13 7,13 7,21"/><polyline points="7,3 7,8 15,8"/>
  </svg>
);

export default function TeacherIncidenciasPage() {
  const navigate = useNavigate();
  const [cursoMaterias, setCursoMaterias]         = useState([]);
  const [cursoSeleccionado, setCursoSeleccionado] = useState(null);
  const [incidencias, setIncidencias]             = useState([]);
  const [estudiantes, setEstudiantes]             = useState([]);
  const [loading, setLoading]                     = useState(true);
  const [guardando, setGuardando]                 = useState(false);
  const [mensaje, setMensaje]                     = useState(null);
  const [mostrarForm, setMostrarForm]             = useState(false);
  const [form, setForm] = useState({ estudianteId: "", descripcion: "" });

  useEffect(() => {
    client.get("/teacher/materias").then((res) => {
      const materias = Array.isArray(res.data) ? res.data : [];
      setCursoMaterias(materias);
      if (materias.length > 0) { setCursoSeleccionado(materias[0].id); cargarDatos(materias[0].id); }
      else setLoading(false);
    }).catch(() => { alert("Error cargando materias"); setLoading(false); });
  }, []);

  const cargarDatos = (cursoMateriaId) => {
    setLoading(true);
    Promise.all([
      client.get(`/teacher/incidencias/${cursoMateriaId}`),
      client.get(`/teacher/estudiantes/${cursoMateriaId}`),
    ]).then(([incRes, estRes]) => {
      setIncidencias(incRes.data.incidencias || []);
      setEstudiantes(estRes.data.estudiantes || []);
    }).catch(() => alert("Error cargando datos"))
      .finally(() => setLoading(false));
  };

  const handleCambioMateria = (e) => {
    const id = Number(e.target.value);
    setCursoSeleccionado(id); cargarDatos(id);
  };

  const mostrarMensaje = (tipo, texto) => {
    setMensaje({ tipo, texto });
    setTimeout(() => setMensaje(null), 3000);
  };

  const handleCrear = async () => {
    if (!form.estudianteId || !form.descripcion.trim()) { mostrarMensaje("warning", "Completa todos los campos"); return; }
    setGuardando(true);
    try {
      await client.post("/teacher/incidencias", {
        estudianteId: Number(form.estudianteId),
        cursoMateriaId: Number(cursoSeleccionado),
        descripcion: form.descripcion,
      });
      mostrarMensaje("success", "Incidencia registrada");
      setForm({ estudianteId: "", descripcion: "" });
      setMostrarForm(false);
      cargarDatos(cursoSeleccionado);
    } catch { mostrarMensaje("danger", "Error al registrar incidencia"); }
    finally { setGuardando(false); }
  };

  const handleEliminar = async (id) => {
    if (!confirm("¿Eliminar esta incidencia?")) return;
    try {
      await client.delete(`/teacher/incidencias/${id}`);
      mostrarMensaje("success", "Incidencia eliminada");
      cargarDatos(cursoSeleccionado);
    } catch { mostrarMensaje("danger", "Error al eliminar incidencia"); }
  };

  const getInicial = (nombre, apellido) => `${nombre?.[0] || ""}${apellido?.[0] || ""}`.toUpperCase() || "E";

  if (loading) return (
    <>
      <style>{styles}</style>
      <div className="ti-loading"><div className="ti-spinner" /> Cargando incidencias...</div>
    </>
  );

  return (
    <>
      <style>{styles}</style>
      <div className="ti-wrap">

        <button className="ti-back" onClick={() => navigate("/teacher")}>
          <IconBack /> Volver al panel
        </button>

        {/* ── Header + botón ── */}
        <div className="ti-header-row">
          <div className="ti-header">
            <div className="ti-header-icon"><IconAlert /></div>
            <div>
              <h2>Incidencias</h2>
              <p>Registro de incidencias disciplinarias por materia</p>
            </div>
          </div>
          {mostrarForm ? (
            <button className="ti-btn-cancel" onClick={() => setMostrarForm(false)}>✕ Cancelar</button>
          ) : (
            <button className="ti-btn-nueva" onClick={() => setMostrarForm(true)}>
              <IconPlus /> Nueva incidencia
            </button>
          )}
        </div>

        {cursoMaterias.length === 0 ? (
          <div className="ti-info">No tienes materias asignadas actualmente.</div>
        ) : (
          <>
            {/* ── Selector ── */}
            <div className="ti-selector">
              <label>Materia</label>
              <select value={cursoSeleccionado || ""} onChange={handleCambioMateria}>
                {cursoMaterias.map((cm) => (
                  <option key={cm.id} value={cm.id}>{cm.curso.nombre} — {cm.materia.nombre}</option>
                ))}
              </select>
            </div>

            {/* ── Mensaje ── */}
            {mensaje && (
              <div className={`ti-msg ti-msg-${mensaje.tipo}`}>
                {mensaje.tipo === "success" ? "✓" : mensaje.tipo === "warning" ? "!" : "✕"} {mensaje.texto}
              </div>
            )}

            {/* ── Formulario ── */}
            {mostrarForm && (
              <div className="ti-form-card">
                <div className="ti-form-header">
                  <span className="ti-form-bar" />
                  <span className="ti-form-title">Nueva Incidencia</span>
                </div>
                <div className="ti-form-body">
                  <div className="ti-field">
                    <label>Estudiante</label>
                    <select value={form.estudianteId}
                      onChange={(e) => setForm((f) => ({ ...f, estudianteId: e.target.value }))}>
                      <option value="">Seleccionar estudiante</option>
                      {estudiantes.map((est) => (
                        <option key={est.id} value={est.id}>{est.user.nombre} {est.user.apellido}</option>
                      ))}
                    </select>
                  </div>
                  <div className="ti-field">
                    <label>Descripción</label>
                    <textarea placeholder="Describe la incidencia..."
                      value={form.descripcion}
                      onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))} />
                  </div>
                  <button className="ti-btn-registrar" onClick={handleCrear} disabled={guardando}>
                    <IconSave />
                    {guardando ? "Registrando..." : "Registrar Incidencia"}
                  </button>
                </div>
              </div>
            )}

            {/* ── Tabla ── */}
            {incidencias.length === 0 ? (
              <div className="ti-card">
                <div className="ti-empty">
                  <div className="ti-empty-icon"></div>
                  <p>No hay incidencias registradas en esta materia</p>
                </div>
              </div>
            ) : (
              <div className="ti-card">
                <div className="ti-card-header">
                  <span className="ti-card-bar" />
                  <span className="ti-card-title">
                    Incidencias registradas
                    <span className="ti-count">{incidencias.length}</span>
                  </span>
                </div>
                <div className="ti-table-wrap">
                  <table className="ti-table">
                    <thead>
                      <tr>
                        <th>#</th>
                        <th>Estudiante</th>
                        <th>Descripción</th>
                        <th>Fecha</th>
                        <th style={{ textAlign: "center" }}>Acciones</th>
                      </tr>
                    </thead>
                    <tbody>
                      {incidencias.map((inc, i) => (
                        <tr key={inc.id}>
                          <td><span className="ti-num">{i + 1}</span></td>
                          <td>
                            <div className="ti-student">
                              <div className="ti-avatar">
                                {getInicial(inc.estudiante.user.nombre, inc.estudiante.user.apellido)}
                              </div>
                              <span className="ti-student-name">
                                {inc.estudiante.user.nombre} {inc.estudiante.user.apellido}
                              </span>
                            </div>
                          </td>
                          <td>
                            <span className="ti-chip-desc">{inc.descripcion}</span>
                          </td>
                          <td>
                            <span className="ti-chip-date">
                              {new Date(inc.fecha).toLocaleDateString()}
                            </span>
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <button className="ti-btn-del" onClick={() => handleEliminar(inc.id)}>
                               Eliminar
                            </button>
                          </td>
                        </tr>
                      ))}
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