import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import api from "../api/client";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .asi-wrap { font-family: 'Nunito', sans-serif; }

  /* ── Encabezado ── */
  .asi-header {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-bottom: 24px;
  }
  .asi-header-icon {
    width: 44px; height: 44px;
    border-radius: 12px;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 14px rgba(139,26,26,0.28);
  }
  .asi-header h2 {
    font-size: 1.45rem; font-weight: 800;
    color: #1a0a0a; margin: 0; line-height: 1.2;
  }
  .asi-header p {
    font-size: 0.75rem; color: #a08080;
    font-weight: 500; margin: 0;
  }

  /* ── Layout ── */
  .asi-layout {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 22px;
    align-items: start;
  }
  @media (max-width: 860px) { .asi-layout { grid-template-columns: 1fr; } }

  /* ── Card ── */
  .asi-card {
    background: #fff;
    border-radius: 15px;
    box-shadow: 0 2px 16px rgba(139,26,26,0.07);
    overflow: hidden;
  }
  .asi-card-header {
    display: flex; align-items: center; gap: 9px;
    padding: 18px 22px 14px;
    border-bottom: 1px solid #f5edec;
  }
  .asi-card-header-bar {
    width: 4px; height: 16px; border-radius: 3px;
    background: #8b1a1a; flex-shrink: 0;
  }
  .asi-card-header span {
    font-size: 0.72rem; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.09em; color: #8b1a1a;
  }
  .asi-card-body { padding: 20px 22px; }

  /* ── Formulario ── */
  .asi-field { margin-bottom: 16px; }
  .asi-field label {
    display: block; font-size: 0.68rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.07em;
    color: #a08080; margin-bottom: 6px;
  }
  .asi-field select,
  .asi-field input[type="date"] {
    width: 100%; padding: 10px 13px;
    border: 1.5px solid #ede5e5; border-radius: 8px;
    font-size: 0.91rem; font-weight: 600; color: #2d1f1f;
    background: #fdf9f9; outline: none;
    font-family: 'Nunito', sans-serif;
    transition: border-color .2s, box-shadow .2s;
    appearance: none;
  }
  .asi-field select:focus,
  .asi-field input[type="date"]:focus {
    border-color: #8b1a1a; background: #fff;
    box-shadow: 0 0 0 3px rgba(139,26,26,0.08);
  }

  /* ── Botón submit ── */
  .asi-submit {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 11px; border: none; border-radius: 9px;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    color: #fff; font-size: 0.88rem; font-weight: 700;
    cursor: pointer; font-family: 'Nunito', sans-serif;
    transition: opacity .2s, transform .15s;
    box-shadow: 0 4px 14px rgba(139,26,26,0.3);
    margin-top: 4px;
  }
  .asi-submit:hover  { opacity: .9; transform: translateY(-1px); }
  .asi-submit:active { transform: translateY(0); }
  .asi-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; }

  /* ── Tabla ── */
  .asi-table-wrap { overflow-x: auto; }
  .asi-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
  .asi-table thead tr { border-bottom: 2px solid #f5edec; }
  .asi-table thead th {
    padding: 10px 14px; font-size: 0.65rem; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.08em;
    color: #a08080; white-space: nowrap;
  }
  .asi-table tbody tr {
    border-bottom: 1px solid #faf5f5;
    transition: background .15s;
  }
  .asi-table tbody tr:hover { background: #fdf8f8; }
  .asi-table tbody td {
    padding: 12px 14px; color: #2d1f1f;
    font-weight: 600; vertical-align: middle;
  }

  /* ── Student cell ── */
  .asi-student { display: flex; align-items: center; gap: 9px; }
  .asi-student-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; font-weight: 800; color: #fff; flex-shrink: 0;
  }

  /* ── Chips ── */
  .asi-chip-materia {
    display: inline-flex; align-items: center; gap: 5px;
    background: #f0f4ff; border: 1.5px solid #ccd6f5;
    color: #2d4db3; font-size: 0.78rem; font-weight: 700;
    padding: 4px 10px; border-radius: 20px;
  }
  .asi-chip-date {
    display: inline-flex; align-items: center; gap: 5px;
    background: #f5f0ff; border: 1.5px solid #ddd0f5;
    color: #5a3d9a; font-size: 0.78rem; font-weight: 700;
    padding: 4px 10px; border-radius: 20px;
  }
  .asi-badge-presente {
    display: inline-flex; align-items: center; gap: 5px;
    background: #edfaf3; border: 1.5px solid #a8e6c4;
    color: #1a7a45; font-size: 0.78rem; font-weight: 700;
    padding: 4px 11px; border-radius: 20px;
  }
  .asi-badge-ausente {
    display: inline-flex; align-items: center; gap: 5px;
    background: #fff3f3; border: 1.5px solid #f5c6c6;
    color: #8b1a1a; font-size: 0.78rem; font-weight: 700;
    padding: 4px 11px; border-radius: 20px;
  }

  /* ── Contador ── */
  .asi-count {
    display: inline-flex; align-items: center; justify-content: center;
    background: #8b1a1a; color: #fff;
    font-size: 0.65rem; font-weight: 800;
    border-radius: 20px; padding: 1px 8px; margin-left: 8px;
  }

  /* ── Empty ── */
  .asi-empty { text-align: center; padding: 48px 20px; color: #c8a8a8; }
  .asi-empty-icon { font-size: 2.5rem; margin-bottom: 10px; }
  .asi-empty p { font-size: 0.88rem; font-weight: 600; margin: 0; }
`;

// SVG helpers
const IconCalendar = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2"/>
    <line x1="16" y1="2" x2="16" y2="6"/>
    <line x1="8" y1="2" x2="8" y2="6"/>
    <line x1="3" y1="10" x2="21" y2="10"/>
    <polyline points="9,16 11,18 15,14"/>
  </svg>
);
const IconSave = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"/>
    <polyline points="17,21 17,13 7,13 7,21"/>
    <polyline points="7,3 7,8 15,8"/>
  </svg>
);

export default function AsistenciasPage() {
  const { user, loading } = useAuth();
  const [asistencias, setAsistencias]   = useState([]);
  const [estudiantes, setEstudiantes]   = useState([]);
  const [materias, setMaterias]         = useState([]);
  const [submitting, setSubmitting]     = useState(false);
  const [form, setForm] = useState({
    estudianteId: "", materiaId: "", estado: "", fecha: ""
  });

  useEffect(() => {
    if (loading) return;
    if (!user) return;
    if (!user.roles.includes("ADMIN")) return;
    cargarAsistencias();
    cargarEstudiantes();
    cargarMaterias();
  }, [loading, user]);

  const cargarAsistencias = async () => {
    const res = await api.get("/asistencias");
    setAsistencias(res.data);
  };
  const cargarEstudiantes = async () => {
    const res = await api.get("/estudiantes");
    setEstudiantes(res.data);
  };
  const cargarMaterias = async () => {
    const res = await api.get("/materias");
    setMaterias(res.data);
  };

  const crearAsistencia = async (e) => {
    e.preventDefault();
    if (!form.estudianteId || !form.materiaId || !form.fecha || !form.estado) {
      alert("Todos los campos son obligatorios");
      return;
    }
    setSubmitting(true);
    try {
      await api.post("/asistencias", {
        estudianteId: Number(form.estudianteId),
        materiaId:    Number(form.materiaId),
        fecha:        form.fecha,
        estado:       form.estado,
      });
      setForm({ estudianteId: "", materiaId: "", estado: "", fecha: "" });
      cargarAsistencias();
    } finally {
      setSubmitting(false);
    }
  };

  const getInicial = (nombre) => nombre?.[0]?.toUpperCase() || "?";

  return (
    <>
      <style>{styles}</style>
      <div className="asi-wrap">

        {/* ── Encabezado ── */}
        <div className="asi-header">
          <div className="asi-header-icon"><IconCalendar /></div>
          <div>
            <h2>Gestión de Asistencias</h2>
            <p>Registro y seguimiento de asistencia estudiantil</p>
          </div>
        </div>

        <div className="asi-layout">

          {/* ── Formulario ── */}
          <div className="asi-card">
            <div className="asi-card-header">
              <span className="asi-card-header-bar" />
              <span>Registrar Asistencia</span>
            </div>
            <div className="asi-card-body">
              <form onSubmit={crearAsistencia}>

                <div className="asi-field">
                  <label>Estudiante</label>
                  <select value={form.estudianteId}
                    onChange={(e) => setForm({ ...form, estudianteId: e.target.value })} required>
                    <option value="">Seleccione estudiante</option>
                    {estudiantes.map((e) => {
                      const nombre   = e.user?.nombre   || "Sin nombre";
                      const apellido = e.user?.apellido || "";
                      const dni      = e.dni || e.user?.email || "";
                      return (
                        <option key={e.id} value={e.id}>
                          {nombre} {apellido} — {dni}
                        </option>
                      );
                    })}
                  </select>
                </div>

                <div className="asi-field">
                  <label>Materia</label>
                  <select value={form.materiaId}
                    onChange={(e) => setForm({ ...form, materiaId: e.target.value })} required>
                    <option value="">Seleccione materia</option>
                    {materias.map((m) => (
                      <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="asi-field">
                  <label>Fecha</label>
                  <input type="date" value={form.fecha}
                    onChange={(e) => setForm({ ...form, fecha: e.target.value })} required />
                </div>

                <div className="asi-field">
                  <label>Estado</label>
                  <select value={form.estado}
                    onChange={(e) => setForm({ ...form, estado: e.target.value })} required>
                    <option value="">Seleccione estado</option>
                    <option value="PRESENTE">✅ Presente</option>
                    <option value="AUSENTE">❌ Ausente</option>
                  </select>
                </div>

                <button className="asi-submit" type="submit" disabled={submitting}>
                  <IconSave />
                  {submitting ? "Registrando..." : "Registrar Asistencia"}
                </button>

              </form>
            </div>
          </div>

          {/* ── Tabla ── */}
          <div className="asi-card">
            <div className="asi-card-header">
              <span className="asi-card-header-bar" />
              <span>
                Asistencias registradas
                {asistencias.length > 0 && (
                  <span className="asi-count">{asistencias.length}</span>
                )}
              </span>
            </div>
            <div className="asi-table-wrap">
              <table className="asi-table">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Materia</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {asistencias.length > 0 ? (
                    asistencias.map((a) => (
                      <tr key={a.id}>
                        <td>
                          <div className="asi-student">
                            <div className="asi-student-avatar">
                              {getInicial(a.estudiante?.user?.nombre)}
                            </div>
                            <span>
                              {a.estudiante?.user?.nombre}{" "}
                              {a.estudiante?.user?.apellido}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="asi-chip-materia">
                            📖 {a.materia?.nombre}
                          </span>
                        </td>
                        <td>
                          <span className="asi-chip-date">
                            📅 {a.fecha?.slice(0, 10)}
                          </span>
                        </td>
                        <td>
                          {a.estado === "PRESENTE" ? (
                            <span className="asi-badge-presente">✓ Presente</span>
                          ) : (
                            <span className="asi-badge-ausente">✕ Ausente</span>
                          )}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">
                        <div className="asi-empty">
                          <div className="asi-empty-icon">📅</div>
                          <p>No hay asistencias registradas</p>
                        </div>
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}