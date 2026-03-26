import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import client from "../api/client";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&display=swap');

  .not-wrap { font-family: 'Nunito', sans-serif; }

  /* ── Encabezado ── */
  .not-header {
    display: flex; align-items: center; gap: 12px; margin-bottom: 24px;
  }
  .not-header-icon {
    width: 44px; height: 44px; border-radius: 12px;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0; box-shadow: 0 4px 14px rgba(139,26,26,0.28);
  }
  .not-header h2 {
    font-size: 1.45rem; font-weight: 800;
    color: #1a0a0a; margin: 0; line-height: 1.2;
  }
  .not-header p { font-size: 0.75rem; color: #a08080; font-weight: 500; margin: 0; }

  /* ── Layout ── */
  .not-layout {
    display: grid;
    grid-template-columns: 340px 1fr;
    gap: 22px; align-items: start;
  }
  @media (max-width: 860px) { .not-layout { grid-template-columns: 1fr; } }

  /* ── Card ── */
  .not-card {
    background: #fff; border-radius: 15px;
    box-shadow: 0 2px 16px rgba(139,26,26,0.07); overflow: hidden;
  }
  .not-card-header {
    display: flex; align-items: center; gap: 9px;
    padding: 18px 22px 14px; border-bottom: 1px solid #f5edec;
  }
  .not-card-header-bar {
    width: 4px; height: 16px; border-radius: 3px;
    background: #8b1a1a; flex-shrink: 0;
  }
  .not-card-header span {
    font-size: 0.72rem; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.09em; color: #8b1a1a;
  }
  .not-card-body { padding: 20px 22px; }

  /* ── Formulario ── */
  .not-field { margin-bottom: 16px; }
  .not-field label {
    display: block; font-size: 0.68rem; font-weight: 700;
    text-transform: uppercase; letter-spacing: 0.07em;
    color: #a08080; margin-bottom: 6px;
  }
  .not-field select,
  .not-field input[type="number"],
  .not-field input[type="date"] {
    width: 100%; padding: 10px 13px;
    border: 1.5px solid #ede5e5; border-radius: 8px;
    font-size: 0.91rem; font-weight: 600; color: #2d1f1f;
    background: #fdf9f9; outline: none;
    font-family: 'Nunito', sans-serif;
    transition: border-color .2s, box-shadow .2s;
    appearance: none;
  }
  .not-field select:focus,
  .not-field input[type="number"]:focus,
  .not-field input[type="date"]:focus {
    border-color: #8b1a1a; background: #fff;
    box-shadow: 0 0 0 3px rgba(139,26,26,0.08);
  }

  /* Nota con indicador de color en tiempo real */
  .not-nota-wrap { position: relative; }
  .not-nota-wrap input { padding-right: 60px; }
  .not-nota-tag {
    position: absolute; right: 10px; top: 50%;
    transform: translateY(-50%);
    font-size: 0.7rem; font-weight: 800;
    padding: 2px 8px; border-radius: 20px;
    pointer-events: none;
  }
  .not-nota-tag.aprobado { background:#edfaf3; color:#1a7a45; border:1.5px solid #a8e6c4; }
  .not-nota-tag.reprobado { background:#fff3f3; color:#8b1a1a; border:1.5px solid #f5c6c6; }
  .not-nota-tag.vacio     { background:#f5f5f5; color:#bbb;    border:1.5px solid #e5e5e5; }

  /* ── Botón submit ── */
  .not-submit {
    display: flex; align-items: center; justify-content: center; gap: 8px;
    width: 100%; padding: 11px; border: none; border-radius: 9px;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    color: #fff; font-size: 0.88rem; font-weight: 700;
    cursor: pointer; font-family: 'Nunito', sans-serif;
    transition: opacity .2s, transform .15s;
    box-shadow: 0 4px 14px rgba(139,26,26,0.3); margin-top: 4px;
  }
  .not-submit:hover  { opacity: .9; transform: translateY(-1px); }
  .not-submit:active { transform: translateY(0); }
  .not-submit:disabled { opacity: .6; cursor: not-allowed; transform: none; }

  /* ── Tabla ── */
  .not-table-wrap { overflow-x: auto; }
  .not-table { width: 100%; border-collapse: collapse; font-size: 0.88rem; }
  .not-table thead tr { border-bottom: 2px solid #f5edec; }
  .not-table thead th {
    padding: 10px 14px; font-size: 0.65rem; font-weight: 800;
    text-transform: uppercase; letter-spacing: 0.08em;
    color: #a08080; white-space: nowrap;
  }
  .not-table tbody tr { border-bottom: 1px solid #faf5f5; transition: background .15s; }
  .not-table tbody tr:hover { background: #fdf8f8; }
  .not-table tbody td { padding: 12px 14px; color: #2d1f1f; font-weight: 600; vertical-align: middle; }

  /* ── Student cell ── */
  .not-student { display: flex; align-items: center; gap: 9px; }
  .not-student-avatar {
    width: 30px; height: 30px; border-radius: 50%;
    background: linear-gradient(135deg,#8b1a1a,#c0392b);
    display: flex; align-items: center; justify-content: center;
    font-size: 0.7rem; font-weight: 800; color: #fff; flex-shrink: 0;
  }

  /* ── Chips ── */
  .not-chip-materia {
    display: inline-flex; align-items: center; gap: 5px;
    background: #f0f4ff; border: 1.5px solid #ccd6f5;
    color: #2d4db3; font-size: 0.78rem; font-weight: 700;
    padding: 4px 10px; border-radius: 20px;
  }
  .not-chip-date {
    display: inline-flex; align-items: center; gap: 5px;
    background: #f5f0ff; border: 1.5px solid #ddd0f5;
    color: #5a3d9a; font-size: 0.78rem; font-weight: 700;
    padding: 4px 10px; border-radius: 20px;
  }

  /* ── Badge nota ── */
  .not-badge-nota {
    display: inline-flex; align-items: center; justify-content: center;
    min-width: 52px; padding: 5px 12px; border-radius: 20px;
    font-size: 0.88rem; font-weight: 800;
  }
  .not-badge-aprobado {
    background: #edfaf3; border: 1.5px solid #a8e6c4; color: #1a7a45;
  }
  .not-badge-reprobado {
    background: #fff3f3; border: 1.5px solid #f5c6c6; color: #8b1a1a;
  }

  /* ── Contador ── */
  .not-count {
    display: inline-flex; align-items: center; justify-content: center;
    background: #8b1a1a; color: #fff;
    font-size: 0.65rem; font-weight: 800;
    border-radius: 20px; padding: 1px 8px; margin-left: 8px;
  }

  /* ── Empty ── */
  .not-empty { text-align: center; padding: 48px 20px; color: #c8a8a8; }
  .not-empty-icon { font-size: 2.5rem; margin-bottom: 10px; }
  .not-empty p { font-size: 0.88rem; font-weight: 600; margin: 0; }
`;

const IconNota = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
    stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14,2 14,8 20,8"/>
    <line x1="16" y1="13" x2="8" y2="13"/>
    <line x1="16" y1="17" x2="8" y2="17"/>
    <polyline points="10,9 9,9 8,9"/>
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

export default function NotasPage() {
  const { user, loading } = useAuth();
  const [notas, setNotas]           = useState([]);
  const [estudiantes, setEstudiantes] = useState([]);
  const [materias, setMaterias]     = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    estudianteId: "", materiaId: "", nota: "", fecha: ""
  });

  useEffect(() => {
    if (loading) return;
    if (!user)   return;
    cargarEstudiantes();
    cargarMaterias();
    cargarNotas();
  }, [loading, user]);

  const cargarNotas = async () => {
    try {
      const res = await client.get("/notas");
      setNotas(Array.isArray(res.data) ? res.data : []);
    } catch { setNotas([]); }
  };

  const cargarEstudiantes = async () => {
    try {
      const res = await client.get("/estudiantes");
      setEstudiantes(Array.isArray(res.data) ? res.data : []);
    } catch { setEstudiantes([]); }
  };

  const cargarMaterias = async () => {
    try {
      const res = await client.get("/materias");
      setMaterias(Array.isArray(res.data) ? res.data : []);
    } catch { setMaterias([]); }
  };

  const crearNota = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await client.post("/notas", {
        ...form,
        nota:          Number(form.nota),
        estudianteId:  Number(form.estudianteId),
        materiaId:     Number(form.materiaId),
      });
      setForm({ estudianteId: "", materiaId: "", nota: "", fecha: "" });
      cargarNotas();
    } finally {
      setSubmitting(false);
    }
  };

  const getInicial = (nombre) => nombre?.[0]?.toUpperCase() || "?";

  const notaTag = () => {
    if (form.nota === "") return { cls: "vacio",    txt: "—" };
    return Number(form.nota) >= 51
      ? { cls: "aprobado",  txt: "✓" }
      : { cls: "reprobado", txt: "✕" };
  };

  const tag = notaTag();

  return (
    <>
      <style>{styles}</style>
      <div className="not-wrap">

        {/* ── Encabezado ── */}
        <div className="not-header">
          <div className="not-header-icon"><IconNota /></div>
          <div>
            <h2>Gestión de Notas</h2>
            <p>Registro y seguimiento de calificaciones estudiantiles</p>
          </div>
        </div>

        <div className="not-layout">

          {/* ── Formulario ── */}
          <div className="not-card">
            <div className="not-card-header">
              <span className="not-card-header-bar" />
              <span>Registrar Nota</span>
            </div>
            <div className="not-card-body">
              <form onSubmit={crearNota}>

                <div className="not-field">
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

                <div className="not-field">
                  <label>Materia</label>
                  <select value={form.materiaId}
                    onChange={(e) => setForm({ ...form, materiaId: e.target.value })} required>
                    <option value="">Seleccione materia</option>
                    {materias.map((m) => (
                      <option key={m.id} value={m.id}>{m.nombre}</option>
                    ))}
                  </select>
                </div>

                <div className="not-field">
                  <label>Nota</label>
                  <div className="not-nota-wrap">
                    <input type="number" min="0" max="100"
                      placeholder="Ej: 85"
                      value={form.nota}
                      onChange={(e) => setForm({ ...form, nota: e.target.value })}
                      required />
                    <span className={`not-nota-tag ${tag.cls}`}>{tag.txt}</span>
                  </div>
                </div>

                <div className="not-field">
                  <label>Fecha</label>
                  <input type="date" value={form.fecha}
                    onChange={(e) => setForm({ ...form, fecha: e.target.value })} required />
                </div>

                <button className="not-submit" type="submit" disabled={submitting}>
                  <IconSave />
                  {submitting ? "Registrando..." : "Registrar Nota"}
                </button>

              </form>
            </div>
          </div>

          {/* ── Tabla ── */}
          <div className="not-card">
            <div className="not-card-header">
              <span className="not-card-header-bar" />
              <span>
                Notas registradas
                {notas.length > 0 && (
                  <span className="not-count">{notas.length}</span>
                )}
              </span>
            </div>
            <div className="not-table-wrap">
              <table className="not-table">
                <thead>
                  <tr>
                    <th>Estudiante</th>
                    <th>Materia</th>
                    <th>Nota</th>
                    <th>Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {notas.length > 0 ? (
                    notas.map((n) => (
                      <tr key={n.id}>
                        <td>
                          <div className="not-student">
                            <div className="not-student-avatar">
                              {getInicial(n.estudiante?.user?.nombre)}
                            </div>
                            <span>
                              {n.estudiante?.user?.nombre}{" "}
                              {n.estudiante?.user?.apellido}
                            </span>
                          </div>
                        </td>
                        <td>
                          <span className="not-chip-materia">
                            📖 {n.materia?.nombre}
                          </span>
                        </td>
                        <td>
                          <span className={`not-badge-nota ${n.nota >= 51 ? "not-badge-aprobado" : "not-badge-reprobado"}`}>
                            {n.nota}
                          </span>
                        </td>
                        <td>
                          <span className="not-chip-date">
                            📅 {n.fecha?.slice(0, 10)}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4">
                        <div className="not-empty">
                          <div className="not-empty-icon">📝</div>
                          <p>No hay notas registradas</p>
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