import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .gac-wrap { font-family: 'Nunito', sans-serif; }

  /* ── Encabezado ── */
  .gac-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
  .gac-header-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; box-shadow: 0 4px 14px rgba(139,26,26,0.28);
  }
  .gac-header h2 { font-size: 1.45rem; font-weight: 800; color: #1a0a0a; margin: 0; line-height: 1.2; }
  .gac-header p  { font-size: 0.75rem; color: #a08080; font-weight: 500; margin: 0; }

  /* ── Tabs ── */
  .gac-tabs { display: flex; gap: 4px; margin-bottom: 22px; border-bottom: 2px solid #f5edec; padding-bottom: 0; }
  .gac-tab {
    padding: 10px 20px; border-radius: 9px 9px 0 0;
    font-size: 0.83rem; font-weight: 700; cursor: pointer;
    color: #a08080; border: none; background: transparent;
    font-family: 'Nunito', sans-serif;
    transition: color .15s, background .15s;
    position: relative; bottom: -2px;
  }
  .gac-tab:hover { color: #5a1a1a; background: #fdf5f5; }
  .gac-tab.active {
    color: #8b1a1a; background: #fff;
    border: 2px solid #f5edec; border-bottom-color: #fff;
  }

  /* ── Layout dos columnas ── */
  .gac-layout { display: grid; grid-template-columns: 320px 1fr; gap: 20px; align-items: start; }
  @media (max-width: 820px) { .gac-layout { grid-template-columns: 1fr; } }

  /* ── Card ── */
  .gac-card { background: #fff; border-radius: 15px; box-shadow: 0 2px 16px rgba(139,26,26,0.07); overflow: hidden; }
  .gac-card-header { display: flex; align-items: center; gap: 9px; padding: 16px 20px 13px; border-bottom: 1px solid #f5edec; }
  .gac-card-bar { width: 4px; height: 15px; border-radius: 3px; background: #8b1a1a; flex-shrink: 0; }
  .gac-card-title { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.09em; color: #8b1a1a; }
  .gac-card-body { padding: 18px 20px; }

  /* ── Formulario ── */
  .gac-field { margin-bottom: 14px; }
  .gac-field label { display: block; font-size: 0.67rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #a08080; margin-bottom: 5px; }
  .gac-field input,
  .gac-field select {
    width: 100%; padding: 9px 12px;
    border: 1.5px solid #ede5e5; border-radius: 8px;
    font-size: 0.89rem; font-weight: 600; color: #2d1f1f;
    background: #fdf9f9; outline: none;
    font-family: 'Nunito', sans-serif;
    transition: border-color .2s, box-shadow .2s; appearance: none;
  }
  .gac-field input:focus,
  .gac-field select:focus { border-color: #8b1a1a; background: #fff; box-shadow: 0 0 0 3px rgba(139,26,26,0.08); }

  .gac-submit {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 10px; border: none; border-radius: 9px;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    color: #fff; font-size: 0.86rem; font-weight: 700;
    cursor: pointer; font-family: 'Nunito', sans-serif;
    transition: opacity .2s, transform .15s;
    box-shadow: 0 4px 12px rgba(139,26,26,0.28); margin-top: 4px;
  }
  .gac-submit:hover { opacity: .9; transform: translateY(-1px); }
  .gac-submit:active { transform: translateY(0); }

  /* ── Tabla ── */
  .gac-table-wrap { overflow-x: auto; }
  .gac-table { width: 100%; border-collapse: collapse; font-size: 0.87rem; }
  .gac-table thead tr { border-bottom: 2px solid #f5edec; }
  .gac-table thead th { padding: 9px 14px; font-size: 0.63rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #a08080; white-space: nowrap; }
  .gac-table tbody tr { border-bottom: 1px solid #faf5f5; transition: background .15s; }
  .gac-table tbody tr:hover { background: #fdf8f8; }
  .gac-table tbody td { padding: 11px 14px; color: #2d1f1f; font-weight: 600; vertical-align: middle; }

  /* ── Chips / badges ── */
  .gac-chip-count {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 26px; height: 22px; padding: 0 8px;
    background: #f0f4ff; border: 1.5px solid #ccd6f5;
    color: #2d4db3; font-size: 0.75rem; font-weight: 800; border-radius: 20px;
  }
  .gac-chip-id {
    display: inline-flex; align-items: center;
    background: #f5f5f5; border: 1.5px solid #e5e5e5;
    color: #888; font-size: 0.72rem; font-weight: 700;
    padding: 2px 9px; border-radius: 20px;
  }
  .gac-badge-asignado {
    display: inline-flex; align-items: center; gap: 5px;
    background: #edfaf3; border: 1.5px solid #a8e6c4;
    color: #1a7a45; font-size: 0.76rem; font-weight: 700;
    padding: 3px 10px; border-radius: 20px;
  }
  .gac-badge-sin {
    display: inline-flex; align-items: center;
    background: #fff8e0; border: 1.5px solid #f5d87a;
    color: #b58a00; font-size: 0.76rem; font-weight: 700;
    padding: 3px 10px; border-radius: 20px;
  }

  /* ── Select de asignar ── */
  .gac-assign-select {
    padding: 7px 11px; max-width: 240px;
    border: 1.5px solid #ede5e5; border-radius: 8px;
    font-size: 0.83rem; font-weight: 600; color: #2d1f1f;
    background: #fdf9f9; outline: none;
    font-family: 'Nunito', sans-serif;
    transition: border-color .2s; appearance: none;
  }
  .gac-assign-select:focus { border-color: #8b1a1a; background: #fff; }

  /* ── Selector de curso (asignar tab) ── */
  .gac-curso-selector {
    background: #fdf5f5; border: 1.5px solid #f0dede;
    border-radius: 12px; padding: 16px 18px; margin-bottom: 20px;
    display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
  }
  .gac-curso-selector label { font-size: 0.68rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #8b1a1a; white-space: nowrap; }
  .gac-curso-selector select {
    flex: 1; min-width: 180px; padding: 9px 12px;
    border: 1.5px solid #f0dede; border-radius: 8px;
    font-size: 0.89rem; font-weight: 600; color: #2d1f1f;
    background: #fff; outline: none;
    font-family: 'Nunito', sans-serif;
    transition: border-color .2s; appearance: none;
  }
  .gac-curso-selector select:focus { border-color: #8b1a1a; }

  /* ── Info boxes ── */
  .gac-info {
    text-align: center; padding: 40px 20px; color: #c8a8a8;
    font-size: 0.85rem; font-weight: 600;
  }
  .gac-info-icon { font-size: 2rem; margin-bottom: 8px; }

  /* ── Contador ── */
  .gac-count {
    display: inline-flex; align-items: center; justify-content: center;
    background: #8b1a1a; color: #fff; font-size: 0.63rem; font-weight: 800;
    border-radius: 20px; padding: 1px 7px; margin-left: 7px;
  }

  /* ── Nombre en tabla ── */
  .gac-nombre-cell { display: flex; align-items: center; gap: 9px; }
  .gac-nombre-dot { width: 8px; height: 8px; border-radius: 50%; background: #c0392b; flex-shrink: 0; }
`;

const IconAcad = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    <line x1="9" y1="7" x2="15" y2="7"/>
    <line x1="9" y1="11" x2="15" y2="11"/>
  </svg>
);

const IconSave = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17,21 17,13 7,13 7,21"/>
    <polyline points="7,3 7,8 15,8"/>
  </svg>
);

export default function CursosMateriasPage() {
  const { user, loading } = useAuth();
  const [activeTab, setActiveTab] = useState("cursos");

  const [cursos, setCursos]   = useState([]);
  const [materias, setMaterias] = useState([]);
  const [docentes, setDocentes] = useState([]);

  const [nombreCurso, setNombreCurso]     = useState("");
  const [nombreMateria, setNombreMateria] = useState("");
  const [cursoIdMateria, setCursoIdMateria] = useState("");
  const [cursoIdAsignar, setCursoIdAsignar] = useState("");
  const [materiasDelCurso, setMateriasDelCurso] = useState([]);

  const cargarCursos   = async () => { try { const { data } = await client.get("/cursos");   setCursos(Array.isArray(data) ? data : []);   } catch {} };
  const cargarMaterias = async () => { try { const { data } = await client.get("/materias"); setMaterias(Array.isArray(data) ? data : []); } catch {} };
  const cargarDocentes = async () => { try { const { data } = await client.get("/docentes"); setDocentes(Array.isArray(data) ? data : []); } catch {} };

  const cargarMateriasDelCurso = async (cursoId) => {
    if (!cursoId) return setMateriasDelCurso([]);
    try { const { data } = await client.get(`/cursos/${cursoId}/docentes`); setMateriasDelCurso(Array.isArray(data) ? data : []); }
    catch { setMateriasDelCurso([]); }
  };

  useEffect(() => {
    if (loading || !user) return;
    cargarCursos(); cargarMaterias(); cargarDocentes();
  }, [loading, user]);

  const crearCurso = async (e) => {
    e.preventDefault();
    try { await client.post("/cursos", { nombre: nombreCurso }); setNombreCurso(""); cargarCursos(); }
    catch (err) { alert(err.response?.data?.message || "Error al crear curso"); }
  };

  const crearMateria = async (e) => {
    e.preventDefault();
    if (!cursoIdMateria) return alert("Debe seleccionar un curso");
    try { await client.post("/materias", { nombre: nombreMateria, cursoId: Number(cursoIdMateria) }); setNombreMateria(""); setCursoIdMateria(""); cargarMaterias(); }
    catch (err) { alert(err.response?.data?.message || "Error al crear materia"); }
  };

  const asignarDocente = async (materiaId, docenteId) => {
    try { await client.put(`/cursos/${cursoIdAsignar}/materias/${materiaId}/docente`, { docenteId: docenteId ? Number(docenteId) : null }); cargarMateriasDelCurso(cursoIdAsignar); }
    catch (err) { alert(err.response?.data?.message || "Error al asignar docente"); }
  };

  const TABS = [
    { key: "cursos",   label: "Cursos" },
    { key: "materias", label: "Materias" },
    { key: "asignar",  label: "Asignar Docentes" },
  ];

  return (
    <>
      <style>{styles}</style>
      <div className="gac-wrap">

        {/* ── Encabezado ── */}
        <div className="gac-header">
          <div className="gac-header-icon"><IconAcad /></div>
          <div>
            <h2>Gestión Académica</h2>
            <p>Administración de cursos, materias y asignación de docentes</p>
          </div>
        </div>

        {/* ── Tabs ── */}
        <div className="gac-tabs">
          {TABS.map((t) => (
            <button key={t.key} className={`gac-tab${activeTab === t.key ? " active" : ""}`}
              onClick={() => setActiveTab(t.key)}>
              {t.label}
            </button>
          ))}
        </div>

        {/* ══════════ TAB: CURSOS ══════════ */}
        {activeTab === "cursos" && (
          <div className="gac-layout">
            <div className="gac-card">
              <div className="gac-card-header">
                <span className="gac-card-bar" />
                <span className="gac-card-title">Registrar Curso</span>
              </div>
              <div className="gac-card-body">
                <form onSubmit={crearCurso}>
                  <div className="gac-field">
                    <label>Nombre del Curso</label>
                    <input value={nombreCurso} placeholder="Ej: 4°B"
                      onChange={(e) => setNombreCurso(e.target.value)} required />
                  </div>
                  <button className="gac-submit" type="submit"><IconSave /> Guardar Curso</button>
                </form>
              </div>
            </div>

            <div className="gac-card">
              <div className="gac-card-header">
                <span className="gac-card-bar" />
                <span className="gac-card-title">
                  Cursos registrados
                  {cursos.length > 0 && <span className="gac-count">{cursos.length}</span>}
                </span>
              </div>
              <div className="gac-table-wrap">
                <table className="gac-table">
                  <thead><tr><th>ID</th><th>Curso</th><th style={{textAlign:"center"}}>Materias</th></tr></thead>
                  <tbody>
                    {cursos.length > 0 ? cursos.map((c) => (
                      <tr key={c.id}>
                        <td><span className="gac-chip-id">#{c.id}</span></td>
                        <td>
                          <div className="gac-nombre-cell">
                            <span className="gac-nombre-dot" />
                            {c.nombre}
                          </div>
                        </td>
                        <td style={{textAlign:"center"}}>
                          <span className="gac-chip-count">{c.materias?.length || 0}</span>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="3"><div className="gac-info"><div className="gac-info-icon">📋</div><p>No hay cursos registrados</p></div></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ TAB: MATERIAS ══════════ */}
        {activeTab === "materias" && (
          <div className="gac-layout">
            <div className="gac-card">
              <div className="gac-card-header">
                <span className="gac-card-bar" />
                <span className="gac-card-title">Registrar Materia</span>
              </div>
              <div className="gac-card-body">
                <form onSubmit={crearMateria}>
                  <div className="gac-field">
                    <label>Nombre de la Materia</label>
                    <input value={nombreMateria} placeholder="Ej: Matemáticas"
                      onChange={(e) => setNombreMateria(e.target.value)} required />
                  </div>
                  <div className="gac-field">
                    <label>Curso</label>
                    <select value={cursoIdMateria} onChange={(e) => setCursoIdMateria(e.target.value)} required>
                      <option value="">Seleccione un curso</option>
                      {cursos.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                    </select>
                  </div>
                  <button className="gac-submit" type="submit"><IconSave /> Crear Materia</button>
                </form>
              </div>
            </div>

            <div className="gac-card">
              <div className="gac-card-header">
                <span className="gac-card-bar" />
                <span className="gac-card-title">
                  Materias registradas
                  {materias.length > 0 && <span className="gac-count">{materias.length}</span>}
                </span>
              </div>
              <div className="gac-table-wrap">
                <table className="gac-table">
                  <thead><tr><th>ID</th><th>Materia</th></tr></thead>
                  <tbody>
                    {materias.length > 0 ? materias.map((m) => (
                      <tr key={m.id}>
                        <td><span className="gac-chip-id">#{m.id}</span></td>
                        <td>
                          <div className="gac-nombre-cell">
                            <span className="gac-nombre-dot" />
                            {m.nombre}
                          </div>
                        </td>
                      </tr>
                    )) : (
                      <tr><td colSpan="2"><div className="gac-info"><div className="gac-info-icon">📚</div><p>No hay materias registradas</p></div></td></tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ══════════ TAB: ASIGNAR DOCENTES ══════════ */}
        {activeTab === "asignar" && (
          <div className="gac-card">
            <div className="gac-card-header">
              <span className="gac-card-bar" />
              <span className="gac-card-title">Asignar Docente por Materia</span>
            </div>
            <div className="gac-card-body">

              <div className="gac-curso-selector">
                <label>Seleccionar Curso</label>
                <select value={cursoIdAsignar}
                  onChange={(e) => { setCursoIdAsignar(e.target.value); cargarMateriasDelCurso(e.target.value); }}>
                  <option value="">Seleccione un curso</option>
                  {cursos.map((c) => <option key={c.id} value={c.id}>{c.nombre}</option>)}
                </select>
              </div>

              {materiasDelCurso.length > 0 ? (
                <div className="gac-table-wrap">
                  <table className="gac-table">
                    <thead>
                      <tr><th>Materia</th><th>Docente asignado</th><th>Cambiar docente</th></tr>
                    </thead>
                    <tbody>
                      {materiasDelCurso.map((cm) => (
                        <tr key={cm.id}>
                          <td>
                            <div className="gac-nombre-cell">
                              <span className="gac-nombre-dot" />
                              {cm.materia.nombre}
                            </div>
                          </td>
                          <td>
                            {cm.docente
                              ? <span className="gac-badge-asignado">{cm.docente.user.nombre} {cm.docente.user.apellido}</span>
                              : <span className="gac-badge-sin">Sin asignar</span>
                            }
                          </td>
                          <td>
                            <select className="gac-assign-select"
                              defaultValue={cm.docente?.id || ""}
                              onChange={(e) => asignarDocente(cm.materiaId, e.target.value)}>
                              <option value="">Sin docente</option>
                              {docentes.map((d) => (
                                <option key={d.id} value={d.id}>{d.user.nombre} {d.user.apellido}</option>
                              ))}
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : cursoIdAsignar ? (
                <div className="gac-info"><div className="gac-info-icon">📭</div><p>Este curso no tiene materias asignadas aún</p></div>
              ) : (
                <div className="gac-info"><div className="gac-info-icon">👆</div><p>Selecciona un curso para ver sus materias</p></div>
              )}

            </div>
          </div>
        )}

      </div>
    </>
  );
}