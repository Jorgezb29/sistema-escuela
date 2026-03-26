import { useEffect, useState } from "react";
import client from "../api/client";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .doc-wrap { font-family: 'Nunito', sans-serif; }

  /* ── Encabezado ── */
  .doc-header { display: flex; align-items: center; gap: 12px; margin-bottom: 24px; }
  .doc-header-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; box-shadow: 0 4px 14px rgba(139,26,26,0.28);
  }
  .doc-header h2 { font-size: 1.45rem; font-weight: 800; color: #1a0a0a; margin: 0; line-height: 1.2; }
  .doc-header p  { font-size: 0.75rem; color: #a08080; font-weight: 500; margin: 0; }

  /* ── Layout ── */
  .doc-layout { display: grid; grid-template-columns: 340px 1fr; gap: 22px; align-items: start; }
  @media (max-width: 860px) { .doc-layout { grid-template-columns: 1fr; } }

  /* ── Card ── */
  .doc-card { background: #fff; border-radius: 15px; box-shadow: 0 2px 16px rgba(139,26,26,0.07); overflow: hidden; }
  .doc-card-header { display: flex; align-items: center; gap: 9px; padding: 18px 22px 14px; border-bottom: 1px solid #f5edec; }
  .doc-card-header-bar { width: 4px; height: 16px; border-radius: 3px; background: #8b1a1a; flex-shrink: 0; }
  .doc-card-header span { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.09em; color: #8b1a1a; }
  .doc-card-body { padding: 20px 22px; }

  /* ── Formulario ── */
  .doc-field { margin-bottom: 15px; }
  .doc-field label { display: block; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.07em; color: #a08080; margin-bottom: 6px; }
  .doc-field input {
    width: 100%; padding: 10px 13px;
    border: 1.5px solid #ede5e5; border-radius: 8px;
    font-size: 0.91rem; font-weight: 600; color: #2d1f1f;
    background: #fdf9f9; outline: none;
    font-family: 'Nunito', sans-serif;
    transition: border-color .2s, box-shadow .2s;
  }
  .doc-field input:focus { border-color: #8b1a1a; background: #fff; box-shadow: 0 0 0 3px rgba(139,26,26,0.08); }

  .doc-submit {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 11px; border: none; border-radius: 9px;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    color: #fff; font-size: 0.88rem; font-weight: 700;
    cursor: pointer; font-family: 'Nunito', sans-serif;
    transition: opacity .2s, transform .15s;
    box-shadow: 0 4px 14px rgba(139,26,26,0.3); margin-top: 6px;
  }
  .doc-submit:hover { opacity: .9; transform: translateY(-1px); }
  .doc-submit:active { transform: translateY(0); }

  /* ── Buscador ── */
  .doc-search-wrap { position: relative; margin-bottom: 16px; }
  .doc-search-wrap svg { position: absolute; left: 12px; top: 50%; transform: translateY(-50%); color: #b08080; pointer-events: none; }
  .doc-search {
    width: 100%; padding: 10px 13px 10px 38px;
    border: 1.5px solid #ede5e5; border-radius: 9px;
    font-size: 0.88rem; font-weight: 600; color: #2d1f1f;
    background: #fdf9f9; outline: none;
    font-family: 'Nunito', sans-serif;
    transition: border-color .2s, box-shadow .2s;
  }
  .doc-search:focus { border-color: #8b1a1a; background: #fff; box-shadow: 0 0 0 3px rgba(139,26,26,0.08); }

  /* ── Tabla ── */
  .doc-table-wrap { overflow-x: auto; }
  .doc-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
  .doc-table thead tr { border-bottom: 2px solid #f5edec; }
  .doc-table thead th { padding: 10px 14px; font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.08em; color: #a08080; white-space: nowrap; }
  .doc-table tbody tr { border-bottom: 1px solid #faf5f5; transition: background .15s; }
  .doc-table tbody tr:hover { background: #fdf8f8; }
  .doc-table tbody td { padding: 12px 14px; color: #2d1f1f; font-weight: 600; vertical-align: middle; }

  /* ── Docente cell ── */
  .doc-person { display: flex; align-items: center; gap: 10px; }
  .doc-avatar {
    width: 34px; height: 34px; border-radius: 50%;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.75rem; font-weight: 800; color: #fff; flex-shrink: 0;
  }
  .doc-person-name  { font-size: 0.88rem; font-weight: 700; color: #2d1f1f; }
  .doc-person-email { font-size: 0.72rem; color: #a08080; font-weight: 500; }

  /* ── Chips ── */
  .doc-chip-titulo {
    display: inline-flex; align-items: center; gap: 5px;
    background: #f0f4ff; border: 1.5px solid #ccd6f5;
    color: #2d4db3; font-size: 0.75rem; font-weight: 700;
    padding: 3px 10px; border-radius: 20px;
  }

  /* ── Acciones ── */
  .doc-actions { display: flex; align-items: center; gap: 7px; }
  .doc-btn-edit {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 8px;
    background: #fff8e8; border: 1.5px solid #f5d87a;
    color: #b58a00; cursor: pointer; transition: background .15s;
    font-size: 0.8rem;
  }
  .doc-btn-edit:hover { background: #fff0c0; }
  .doc-btn-del {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 8px;
    background: #fff3f3; border: 1.5px solid #f5c6c6;
    color: #8b1a1a; cursor: pointer; transition: background .15s;
    font-size: 0.8rem;
  }
  .doc-btn-del:hover { background: #ffe0e0; }

  /* ── Contador ── */
  .doc-count {
    display: inline-flex; align-items: center; justify-content: center;
    background: #8b1a1a; color: #fff; font-size: 0.65rem; font-weight: 800;
    border-radius: 20px; padding: 1px 8px; margin-left: 8px;
  }

  /* ── Empty ── */
  .doc-empty { text-align: center; padding: 48px 20px; color: #c8a8a8; }
  .doc-empty-icon { font-size: 2.5rem; margin-bottom: 10px; }
  .doc-empty p { font-size: 0.88rem; font-weight: 600; margin: 0; }

  /* ── MODAL OVERLAY ── */
  .doc-overlay {
    position: fixed; inset: 0; background: rgba(0,0,0,0.45);
    display: flex; align-items: center; justify-content: center;
    z-index: 1000; animation: docFadeIn .2s ease;
  }
  @keyframes docFadeIn { from { opacity:0 } to { opacity:1 } }

  .doc-modal {
    background: #fff; border-radius: 16px;
    box-shadow: 0 8px 40px rgba(0,0,0,0.18);
    width: 100%; max-width: 420px; overflow: hidden;
    animation: docSlideUp .25s ease;
  }
  @keyframes docSlideUp { from { transform:translateY(20px); opacity:0 } to { transform:translateY(0); opacity:1 } }

  .doc-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 22px; border-bottom: 1px solid #f5edec;
  }
  .doc-modal-title { display: flex; align-items: center; gap: 9px; }
  .doc-modal-title-bar { width: 4px; height: 16px; border-radius: 3px; background: #8b1a1a; flex-shrink: 0; }
  .doc-modal-title span { font-size: 0.72rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.09em; color: #8b1a1a; }

  .doc-modal-close {
    width: 28px; height: 28px; border-radius: 7px;
    border: 1.5px solid #ede5e5; background: #fdf9f9;
    display: flex; align-items: center; justify-content: center;
    cursor: pointer; color: #a08080; font-size: 1rem;
    transition: background .15s;
  }
  .doc-modal-close:hover { background: #f5edec; color: #8b1a1a; }

  .doc-modal-body { padding: 20px 22px 22px; }
`;

const IconDoc = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
    <circle cx="12" cy="7" r="4"/>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
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

export default function DocentesPage() {
  const [docentes, setDocentes]   = useState([]);
  const [search, setSearch]       = useState("");
  const [showEdit, setShowEdit]   = useState(false);
  const [submitting, setSubmitting] = useState(false);

  const [form, setForm] = useState({ nombre: "", apellido: "", dni: "", titulo: "", telefono: "" });
  const [editData, setEditData] = useState({ id: "", nombre: "", apellido: "", titulo: "", telefono: "" });

  const cargar = async () => {
    const { data } = await client.get("/docentes");
    setDocentes(data);
  };

  useEffect(() => { cargar(); }, []);

  const crear = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await client.post("/docentes", { ...form });
      alert(`Docente creado\nCorreo: ${form.dni}@docente.colegio.cl\nContraseña: ${form.dni}`);
      setForm({ nombre: "", apellido: "", dni: "", titulo: "", telefono: "" });
      cargar();
    } catch (err) {
      alert(err.response?.data?.message || "Error al registrar docente");
    } finally {
      setSubmitting(false);
    }
  };

  const abrirEditar = (doc) => {
    setEditData({ id: doc.id, nombre: doc.user.nombre, apellido: doc.user.apellido, titulo: doc.titulo || "", telefono: doc.telefono || "" });
    setShowEdit(true);
  };

  const guardarEdicion = async () => {
    await client.put(`/docentes/${editData.id}`, {
      nombre: editData.nombre, apellido: editData.apellido,
      titulo: editData.titulo, telefono: editData.telefono,
    });
    setShowEdit(false);
    cargar();
  };

  const eliminar = async (id) => {
    if (confirm("¿Eliminar docente permanentemente?")) {
      await client.delete(`/docentes/${id}`);
      cargar();
    }
  };

  const docentesFiltrados = docentes.filter((d) =>
    `${d.user.nombre} ${d.user.apellido}`.toLowerCase().includes(search.toLowerCase())
  );

  const getIniciales = (nombre, apellido) =>
    `${nombre?.[0] || ""}${apellido?.[0] || ""}`.toUpperCase() || "D";

  return (
    <>
      <style>{styles}</style>
      <div className="doc-wrap">

        {/* ── Encabezado ── */}
        <div className="doc-header">
          <div className="doc-header-icon"><IconDoc /></div>
          <div>
            <h2>Gestión de Docentes</h2>
            <p>Registro y administración del personal docente</p>
          </div>
        </div>

        <div className="doc-layout">

          {/* ── Formulario ── */}
          <div className="doc-card">
            <div className="doc-card-header">
              <span className="doc-card-header-bar" />
              <span>Registrar Docente</span>
            </div>
            <div className="doc-card-body">
              <form onSubmit={crear}>
                {[
                  { key: "nombre",   label: "Nombre",             placeholder: "Ej: Carlos" },
                  { key: "apellido", label: "Apellido",           placeholder: "Ej: Mamani" },
                  { key: "dni",      label: "DNI",                placeholder: "Ej: 12345678" },
                  { key: "titulo",   label: "Título profesional", placeholder: "Ej: Lic. Matemáticas" },
                  { key: "telefono", label: "Teléfono",           placeholder: "Ej: 75123456" },
                ].map(({ key, label, placeholder }) => (
                  <div className="doc-field" key={key}>
                    <label>{label}</label>
                    <input
                      value={form[key]}
                      placeholder={placeholder}
                      onChange={(e) => setForm({ ...form, [key]: e.target.value })}
                      required={["nombre","apellido","dni"].includes(key)}
                    />
                  </div>
                ))}
                <button className="doc-submit" type="submit" disabled={submitting}>
                  <IconSave />
                  {submitting ? "Guardando..." : "Guardar Docente"}
                </button>
              </form>
            </div>
          </div>

          {/* ── Tabla ── */}
          <div className="doc-card">
            <div className="doc-card-header">
              <span className="doc-card-header-bar" />
              <span>
                Docentes registrados
                {docentesFiltrados.length > 0 && (
                  <span className="doc-count">{docentesFiltrados.length}</span>
                )}
              </span>
            </div>
            <div className="doc-card-body" style={{ paddingBottom: 0 }}>
              <div className="doc-search-wrap">
                <IconSearch />
                <input
                  className="doc-search"
                  placeholder="Buscar docente por nombre..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>
            <div className="doc-table-wrap">
              <table className="doc-table">
                <thead>
                  <tr>
                    <th>Docente</th>
                    <th>Título</th>
                    <th style={{ textAlign: "center" }}>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {docentesFiltrados.length > 0 ? (
                    docentesFiltrados.map((d) => (
                      <tr key={d.id}>
                        <td>
                          <div className="doc-person">
                            <div className="doc-avatar">
                              {getIniciales(d.user.nombre, d.user.apellido)}
                            </div>
                            <div>
                              <div className="doc-person-name">{d.user.nombre} {d.user.apellido}</div>
                              <div className="doc-person-email">{d.user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          {d.titulo
                            ? <span className="doc-chip-titulo">🎓 {d.titulo}</span>
                            : <span style={{ color: "#ccc", fontSize: "0.8rem" }}>—</span>
                          }
                        </td>
                        <td style={{ textAlign: "center" }}>
                          <div className="doc-actions" style={{ justifyContent: "center" }}>
                            <button className="doc-btn-edit" onClick={() => abrirEditar(d)} title="Editar">✏️</button>
                            <button className="doc-btn-del"  onClick={() => eliminar(d.id)} title="Eliminar">🗑️</button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="3">
                        <div className="doc-empty">
                          <div className="doc-empty-icon"></div>
                          <p>No hay docentes registrados</p>
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
          <div className="doc-overlay" onClick={() => setShowEdit(false)}>
            <div className="doc-modal" onClick={(e) => e.stopPropagation()}>
              <div className="doc-modal-header">
                <div className="doc-modal-title">
                  <span className="doc-modal-title-bar" />
                  <span>Editar Docente</span>
                </div>
                <button className="doc-modal-close" onClick={() => setShowEdit(false)}>✕</button>
              </div>
              <div className="doc-modal-body">
                {[
                  { key: "nombre",   label: "Nombre" },
                  { key: "apellido", label: "Apellido" },
                  { key: "titulo",   label: "Título profesional" },
                  { key: "telefono", label: "Teléfono" },
                ].map(({ key, label }) => (
                  <div className="doc-field" key={key}>
                    <label>{label}</label>
                    <input
                      value={editData[key]}
                      onChange={(e) => setEditData({ ...editData, [key]: e.target.value })}
                    />
                  </div>
                ))}
                <button className="doc-submit" onClick={guardarEdicion}>
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