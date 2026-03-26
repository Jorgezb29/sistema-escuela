import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .est-wrap { font-family: 'Nunito', sans-serif; }

  /* ── Encabezado ── */
  .est-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
  .est-header-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; box-shadow: 0 4px 14px rgba(139,26,26,0.28);
  }
  .est-header h2 { font-size: 1.45rem; font-weight: 800; color: #1a0a0a; margin: 0; line-height: 1.2; }
  .est-header p  { font-size: 0.75rem; color: #a08080; font-weight: 500; margin: 0; }

  /* ── Layout ── */
  .est-layout { display: grid; grid-template-columns: 360px 1fr; gap: 22px; align-items: start; }
  @media (max-width: 900px) { .est-layout { grid-template-columns: 1fr; } }

  /* ── Card ── */
  .est-card { background: #fff; border-radius: 15px; box-shadow: 0 2px 16px rgba(139,26,26,0.07); overflow: hidden; }
  .est-card-header { display: flex; align-items: center; gap: 9px; padding: 18px 22px 14px; border-bottom: 1px solid #f5edec; }
  .est-card-header-bar { width: 4px; height: 16px; border-radius: 3px; background: #8b1a1a; flex-shrink: 0; }
  .est-card-header span { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.09em; color: #8b1a1a; }
  .est-card-body { padding: 20px 22px; }

  /* ── Formulario ── */
  .est-field { margin-bottom: 14px; }
  .est-field label { display: block; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #a08080; margin-bottom: 5px; }
  .est-field input,
  .est-field select {
    width: 100%; padding: 9px 13px;
    border: 1.5px solid #ede5e5; border-radius: 8px;
    font-size: 0.89rem; font-weight: 600; color: #2d1f1f;
    background: #fdf9f9; outline: none;
    font-family: 'Nunito', sans-serif;
    transition: border-color .2s, box-shadow .2s;
    appearance: none;
  }
  .est-field input:focus,
  .est-field select:focus { border-color: #8b1a1a; background: #fff; box-shadow: 0 0 0 3px rgba(139,26,26,0.08); }

  /* ── Divider de sección ── */
  .est-form-section {
    display: flex; align-items: center; gap: 9px;
    margin: 18px 0 14px;
  }
  .est-form-section-bar { flex: 1; height: 1px; background: #f5edec; }
  .est-form-section span {
    font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.1em; color: #8b1a1a; white-space: nowrap;
  }

  /* ── Docentes del curso ── */
  .est-docentes-box {
    background: #fdf5f5; border: 1.5px solid #f0dede;
    border-radius: 10px; padding: 12px 14px; margin-bottom: 14px;
  }
  .est-docentes-title {
    font-size: 0.65rem; font-weight: 800; text-transform: uppercase;
    letter-spacing: 0.08em; color: #8b1a1a; margin-bottom: 9px;
    display: flex; align-items: center; gap: 6px;
  }
  .est-docente-row { display: flex; align-items: center; gap: 7px; margin-bottom: 5px; font-size: 0.8rem; }
  .est-docente-materia { font-weight: 700; color: #8b1a1a; }
  .est-docente-nombre  { font-weight: 600; color: #2d1f1f; }
  .est-docente-sin     { font-weight: 600; color: #c8a050; font-style: italic; }

  /* ── Botón submit ── */
  .est-submit {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 11px; border: none; border-radius: 9px;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    color: #fff; font-size: 0.88rem; font-weight: 700;
    cursor: pointer; font-family: 'Nunito', sans-serif;
    transition: opacity .2s, transform .15s;
    box-shadow: 0 4px 14px rgba(139,26,26,0.3); margin-top: 6px;
  }
  .est-submit:hover { opacity: .9; transform: translateY(-1px); }
  .est-submit:active { transform: translateY(0); }

  /* ── Buscador ── */
  .est-search-wrap { position: relative; margin-bottom: 16px; }
  .est-search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #b08080; pointer-events: none; }
  .est-search {
    width: 100%; padding: 10px 13px 10px 38px;
    border: 1.5px solid #ede5e5; border-radius: 9px;
    font-size: 0.88rem; font-weight: 600; color: #2d1f1f;
    background: #fdf9f9; outline: none;
    font-family: 'Nunito', sans-serif;
    transition: border-color .2s, box-shadow .2s;
  }
  .est-search:focus { border-color: #8b1a1a; background: #fff; box-shadow: 0 0 0 3px rgba(139,26,26,0.08); }

  /* ── Tabla ── */
  .est-table-wrap { overflow-x: auto; }
  .est-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
  .est-table thead tr { border-bottom: 2px solid #f5edec; }
  .est-table thead th { padding: 10px 14px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #a08080; white-space: nowrap; }
  .est-table tbody tr { border-bottom: 1px solid #faf5f5; transition: background .15s; }
  .est-table tbody tr:hover { background: #fdf8f8; }
  .est-table tbody td { padding: 12px 14px; color: #2d1f1f; font-weight: 600; vertical-align: middle; }

  /* ── Estudiante cell ── */
  .est-person { display: flex; align-items: center; gap: 10px; }
  .est-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 800; color: #fff; flex-shrink: 0;
  }
  .est-person-name  { font-size: 0.88rem; font-weight: 700; color: #2d1f1f; }
  .est-person-email { font-size: 0.72rem; color: #a08080; font-weight: 500; }

  .est-dni-chip {
    display: inline-flex; align-items: center;
    background: #f5f0ff; border: 1.5px solid #ddd0f5;
    color: #5a3d9a; font-size: 0.78rem; font-weight: 700;
    padding: 3px 10px; border-radius: 20px;
  }

  /* ── Acciones ── */
  .est-actions { display: flex; align-items: center; gap: 7px; }
  .est-btn-edit {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 8px;
    background: #fff8e8; border: 1.5px solid #f5d87a;
    color: #b58a00; cursor: pointer; transition: background .15s; font-size: 0.8rem;
  }
  .est-btn-edit:hover { background: #fff0c0; }
  .est-btn-del {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 8px;
    background: #fff3f3; border: 1.5px solid #f5c6c6;
    color: #8b1a1a; cursor: pointer; transition: background .15s; font-size: 0.8rem;
  }
  .est-btn-del:hover { background: #ffe0e0; }

  /* ── Contador ── */
  .est-count {
    display: inline-flex; align-items: center; justify-content: center;
    background: #8b1a1a; color: #fff; font-size: 0.65rem; font-weight: 800;
    border-radius: 20px; padding: 1px 8px; margin-left: 8px;
  }

  /* ── Empty ── */
  .est-empty { text-align: center; padding: 48px 20px; color: #c8a8a8; }
  .est-empty-icon { font-size: 2.5rem; margin-bottom: 10px; }
  .est-empty p { font-size: 0.88rem; font-weight: 600; margin: 0; }

  /* ── Modal ── */
  .est-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.45);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; animation: estFadeIn .2s ease;
  }
  @keyframes estFadeIn { from { opacity:0 } to { opacity:1 } }
  .est-modal {
    background: #fff; border-radius: 16px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.18);
    width: 100%; max-width: 400px; overflow: hidden;
    animation: estSlideUp .25s ease;
  }
  @keyframes estSlideUp { from { transform:translateY(20px); opacity:0 } to { transform:translateY(0); opacity:1 } }
  .est-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 22px; border-bottom: 1px solid #f5edec;
  }
  .est-modal-title { display: flex; align-items: center; gap: 9px; }
  .est-modal-title-bar { width: 4px; height: 16px; border-radius: 3px; background: #8b1a1a; flex-shrink: 0; }
  .est-modal-title span { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.09em; color: #8b1a1a; }
  .est-modal-close {
    width: 28px; height: 28px; border-radius: 7px;
    border: 1.5px solid #ede5e5; background: #fdf9f9;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #a08080; font-size: 1rem; transition: background .15s;
  }
  .est-modal-close:hover { background: #f5edec; color: #8b1a1a; }
  .est-modal-body { padding: 20px 22px 22px; }
`;

const IconStudents = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
    <circle cx="9" cy="7" r="4"/>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/>
  </svg>
);
const IconSearch = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
  </svg>
);
const IconSave = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17,21 17,13 7,13 7,21"/>
    <polyline points="7,3 7,8 15,8"/>
  </svg>
);

export default function EstudiantesPage() {
  const { user, loading } = useAuth();
  const [estudiantes, setEstudiantes] = useState([]);
  const [cursos, setCursos]           = useState([]);
  const [search, setSearch]           = useState("");
  const [showEdit, setShowEdit]       = useState(false);
  const [docentesCurso, setDocentesCurso] = useState([]);
  const [submitting, setSubmitting]   = useState(false);

  const [form, setForm] = useState({
    nombre: "", apellido: "", dni: "", cursoId: "",
    fechaNacimiento: "", direccion: "",
    tutorNombre: "", tutorDni: "", tutorEmail: "", tutorTelefono: ""
  });
  const [editData, setEditData] = useState({ id: "", direccion: "" });

  const cargarDocentesCurso = async (cursoId) => {
    if (!cursoId) return setDocentesCurso([]);
    try {
      const res = await client.get(`/cursos/${cursoId}/docentes`);
      setDocentesCurso(Array.isArray(res.data) ? res.data : []);
    } catch { setDocentesCurso([]); }
  };

  const cargar = async () => {
    try { const r = await client.get("/cursos");      setCursos(Array.isArray(r.data) ? r.data : []); } catch { setCursos([]); }
    try { const r = await client.get("/estudiantes"); setEstudiantes(Array.isArray(r.data) ? r.data : []); } catch { setEstudiantes([]); }
  };

  useEffect(() => {
    if (loading || !user) return;
    cargar();
  }, [loading, user]);

  const crear = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await client.post("/estudiantes", { ...form, cursoId: Number(form.cursoId) });
      alert(`Estudiante creado\nCorreo: ${form.dni}@alumno.colegio.cl\nContraseña: ${form.dni}`);
      setForm({ nombre: "", apellido: "", dni: "", cursoId: "", fechaNacimiento: "", direccion: "", tutorNombre: "", tutorDni: "", tutorEmail: "", tutorTelefono: "" });
      setDocentesCurso([]);
      cargar();
    } catch (err) {
      alert(err.response?.data?.message || "Error al registrar estudiante");
    } finally { setSubmitting(false); }
  };

  const abrirEditar = (e) => { setEditData({ id: e.id, direccion: e.direccion ?? "" }); setShowEdit(true); };
  const guardarEdicion = async () => {
    await client.put(`/estudiantes/${editData.id}`, { direccion: editData.direccion });
    setShowEdit(false); cargar();
  };
  const eliminar = async (id) => {
    if (confirm("¿Eliminar estudiante permanentemente?")) { await client.delete(`/estudiantes/${id}`); cargar(); }
  };

  const estudiantesFiltrados = estudiantes.filter((e) =>
    e.dni?.toLowerCase().includes(search.toLowerCase())
  );

  const getInicial = (nombre) => nombre?.[0]?.toUpperCase() || "E";

  return (
    <>
      <style>{styles}</style>
      <div className="est-wrap">

        {/* ── Encabezado ── */}
        <div className="est-header">
          <div className="est-header-icon"><IconStudents /></div>
          <div>
            <h2>Gestión de Estudiantes</h2>
            <p>Registro y administración del alumnado</p>
          </div>
        </div>

        <div className="est-layout">

          {/* ── Formulario ── */}
          <div className="est-card">
            <div className="est-card-header">
              <span className="est-card-header-bar" />
              <span>Registrar Estudiante</span>
            </div>
            <div className="est-card-body">
              <form onSubmit={crear}>

                {/* Datos del estudiante */}
                <div className="est-form-section">
                  <span>Datos del Estudiante</span>
                  <span className="est-form-section-bar" />
                </div>

                {[
                  { key: "nombre",          label: "Nombre",           ph: "Ej: Juan",        req: true },
                  { key: "apellido",         label: "Apellido",         ph: "Ej: Mamani",      req: true },
                  { key: "dni",              label: "DNI",              ph: "Ej: 12345678",    req: true },
                  { key: "fechaNacimiento",  label: "Fecha nacimiento", ph: "",                req: false, type: "date" },
                  { key: "direccion",        label: "Dirección",        ph: "Ej: Av. 123",     req: false },
                ].map(({ key, label, ph, req, type }) => (
                  <div className="est-field" key={key}>
                    <label>{label}</label>
                    <input type={type || "text"} placeholder={ph}
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      required={req} />
                  </div>
                ))}

                {/* Curso */}
                <div className="est-field">
                  <label>Curso</label>
                  <select value={form.cursoId}
                    onChange={(e) => { setForm({ ...form, cursoId: e.target.value }); cargarDocentesCurso(e.target.value); }}
                    required>
                    <option value="">Seleccione un curso</option>
                    {cursos.map((c) => (
                      <option key={c.id} value={c.id}>{c.nombre}</option>
                    ))}
                  </select>
                </div>

                {/* Docentes del curso */}
                {docentesCurso.length > 0 && (
                  <div className="est-docentes-box">
                    <div className="est-docentes-title">📚 Docentes de este curso</div>
                    {docentesCurso.map((cm) => (
                      <div className="est-docente-row" key={cm.id}>
                        <span className="est-docente-materia">{cm.materia?.nombre}:</span>
                        {cm.docente
                          ? <span className="est-docente-nombre">{cm.docente.user.nombre} {cm.docente.user.apellido}</span>
                          : <span className="est-docente-sin">Sin docente asignado</span>
                        }
                      </div>
                    ))}
                  </div>
                )}

                {/* Datos del tutor */}
                <div className="est-form-section">
                  <span>Datos del Tutor</span>
                  <span className="est-form-section-bar" />
                </div>

                {[
                  { key: "tutorNombre",   label: "Nombre tutor",   ph: "Ej: María",             req: true },
                  { key: "tutorDni",      label: "DNI tutor",      ph: "Ej: 87654321",          req: true },
                  { key: "tutorEmail",    label: "Correo tutor",   ph: "tutor@email.com",       req: true, type: "email" },
                  { key: "tutorTelefono", label: "Teléfono tutor", ph: "Ej: 75123456",          req: false },
                ].map(({ key, label, ph, req, type }) => (
                  <div className="est-field" key={key}>
                    <label>{label}</label>
                    <input type={type || "text"} placeholder={ph}
                      value={form[key]}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      required={req} />
                  </div>
                ))}

                <button className="est-submit" type="submit" disabled={submitting}>
                  <IconSave />
                  {submitting ? "Guardando..." : "Guardar Estudiante"}
                </button>
              </form>
            </div>
          </div>

          {/* ── Tabla ── */}
          <div className="est-card">
            <div className="est-card-header">
              <span className="est-card-header-bar" />
              <span>
                Estudiantes registrados
                {estudiantesFiltrados.length > 0 && (
                  <span className="est-count">{estudiantesFiltrados.length}</span>
                )}
              </span>
            </div>
            <div className="est-card-body" style={{ paddingBottom: 0 }}>
              <div className="est-search-wrap">
                <IconSearch />
                <input className="est-search" placeholder="Buscar por DNI..."
                  value={search} onChange={(e) => setSearch(e.target.value)} />
              </div>
            </div>
            <div className="est-table-wrap">
              <table className="est-table">
                <thead>
                  <tr>
                    <th>DNI</th>
                    <th>Estudiante</th>
                    <th style={{ textAlign: "center" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {estudiantesFiltrados.length > 0 ? (
                    estudiantesFiltrados.map((e) => (
                      <tr key={e.id}>
                        <td>
                          <span className="est-dni-chip">{e.dni}</span>
                        </td>
                        <td>
                          <div className="est-person">
                            <div className="est-avatar">
                              {getInicial(e.user?.nombre)}
                            </div>
                            <div>
                              <div className="est-person-name">
                                {[e.user?.nombre, e.user?.apellidoP, e.user?.apellidoM].filter(Boolean).join(" ")}
                              </div>
                              <div className="est-person-email">{e.user?.email}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <div className="est-actions" style={{ justifyContent: "center" }}>
                            <button className="est-btn-edit" onClick={() => abrirEditar(e)} title="Editar">✏️</button>
                            <button className="est-btn-del"  onClick={() => eliminar(e.id)} title="Eliminar">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">
                        <div className="est-empty">
                          <div className="est-empty-icon">👨‍🎓</div>
                          <p>No hay estudiantes registrados</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* ── Modal Editar ── */}
        {showEdit && (
          <div className="est-overlay" onClick={() => setShowEdit(false)}>
            <div className="est-modal" onClick={(e) => e.stopPropagation()}>
              <div className="est-modal-header">
                <div className="est-modal-title">
                  <span className="est-modal-title-bar" />
                  <span>Editar Estudiante</span>
                </div>
                <button className="est-modal-close" onClick={() => setShowEdit(false)}>✕</button>
              </div>
              <div className="est-modal-body">
                <div className="est-field">
                  <label>Dirección</label>
                  <input value={editData.direccion}
                    onChange={(e) => setEditData({ ...editData, direccion: e.target.value })}
                    placeholder="Ej: Av. Blas Villas 423" />
                </div>
                <button className="est-submit" onClick={guardarEdicion}>
                  <IconSave />
                  Guardar Cambios
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}