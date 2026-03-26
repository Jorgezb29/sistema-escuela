import { useEffect, useState } from "react";
import client from "../../api/client";

const TABS = [
  { key: "datos",      label: "Datos personales", icon: "" },
  { key: "notas",      label: "Notas",            icon: "" },
  { key: "asistencia", label: "Asistencia",        icon: "" },
  { key: "incidencias",label: "Incidencias",       icon: "" },
];

function getInitials(nombre = "", apellido = "") {
  return `${nombre[0] ?? ""}${apellido[0] ?? ""}`.toUpperCase();
}

function getColor(index) {
  const colors = ["#4f46e5","#0891b2","#059669","#d97706","#dc2626","#7c3aed"];
  return colors[index % colors.length];
}

function Badge({ estado }) {
  const map = {
    presente: { bg: "#d1fae5", color: "#065f46", label: "Presente" },
    ausente:  { bg: "#fee2e2", color: "#991b1b", label: "Ausente"  },
    tardanza: { bg: "#fef3c7", color: "#92400e", label: "Tardanza" },
  };
  const s = map[estado?.toLowerCase()] ?? { bg: "#f1f5f9", color: "#475569", label: estado };
  return (
    <span style={{ background: s.bg, color: s.color, borderRadius: 6, fontSize: 12, padding: "3px 10px", fontWeight: 500 }}>
      {s.label}
    </span>
  );
}

function NotaBar({ nota }) {
  const pct = Math.min((nota / 20) * 100, 100);
  const color = nota >= 14 ? "#059669" : nota >= 11 ? "#d97706" : "#dc2626";
  return (
    <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
      <div style={{ flex: 1, background: "#f1f5f9", borderRadius: 4, height: 8, overflow: "hidden" }}>
        <div style={{ width: `${pct}%`, background: color, height: "100%", borderRadius: 4, transition: "width 0.6s ease" }} />
      </div>
      <span style={{ fontWeight: 600, fontSize: 14, color, minWidth: 28 }}>{nota}</span>
    </div>
  );
}

export default function ApoderadoDashboard() {
  const [hijos, setHijos]           = useState([]);
  const [hijoActivo, setHijoActivo] = useState(null);
  const [tab, setTab]               = useState("datos");
  const [notas, setNotas]           = useState([]);
  const [asistencias, setAsistencias] = useState([]);
  const [incidencias, setIncidencias] = useState([]);
  const [loading, setLoading]       = useState(true);
  const [loadingTab, setLoadingTab] = useState(false);

  /* Cargar hijos */
  useEffect(() => {
    client.get("/apoderado/hijos")
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : [res.data];
        setHijos(data);
        setHijoActivo(data[0] ?? null);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  /* Cargar datos del hijo activo */
  useEffect(() => {
    if (!hijoActivo) return;
    setLoadingTab(true);
    Promise.all([
      client.get(`/apoderado/notas/${hijoActivo.id}`),
      client.get(`/apoderado/asistencias/${hijoActivo.id}`),
      client.get(`/apoderado/incidencias/${hijoActivo.id}`),
    ])
      .then(([n, a, i]) => {
        setNotas(n.data);
        setAsistencias(a.data);
        setIncidencias(i.data);
      })
      .catch(() => {})
      .finally(() => setLoadingTab(false));
  }, [hijoActivo]);

  if (loading) return (
    <div style={s.center}>
      <div style={s.spinner} />
      <p style={{ color: "#64748b", marginTop: 12, fontSize: 14 }}>Cargando información...</p>
    </div>
  );

  if (!hijoActivo) return (
    <div style={s.center}>
      <p style={{ color: "#64748b", fontSize: 15 }}>No tienes estudiantes registrados.</p>
    </div>
  );

  const promedio   = notas.length
    ? (notas.reduce((acc, n) => acc + n.nota, 0) / notas.length).toFixed(1)
    : "—";
  const asistidos  = asistencias.filter(a => a.estado?.toLowerCase() === "presente").length;
  const pctAsist   = asistencias.length
    ? Math.round((asistidos / asistencias.length) * 100)
    : null;

  return (
    <div style={s.root}>

      {/* ── Sidebar hijos ── */}
      <aside style={s.sidebar}>
        <p style={s.sidebarLabel}>Mis hijos</p>
        {hijos.map((h, i) => {
          const activo = h.id === hijoActivo.id;
          const color  = getColor(i);
          return (
            <button
              key={h.id}
              onClick={() => { setHijoActivo(h); setTab("datos"); }}
              style={{ ...s.hijoBtn, background: activo ? "#f0f4ff" : "transparent", borderColor: activo ? "#4f46e5" : "transparent" }}
            >
              <div style={{ ...s.avatar, background: color }}>
                {getInitials(h.user?.nombre, h.user?.apellido)}
              </div>
              <div style={{ textAlign: "left", overflow: "hidden" }}>
                <p style={{ ...s.hijoNombre, color: activo ? "#4f46e5" : "#0f172a" }}>
                  {h.user?.nombre} {h.user?.apellido}
                </p>
                <p style={s.hijoCurso}>{h.curso?.nombre ?? "Sin curso"}</p>
              </div>
            </button>
          );
        })}
      </aside>

      {/* ── Panel principal ── */}
      <main style={s.main}>

        {/* Header */}
        <div style={s.header}>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ ...s.avatarLg, background: getColor(hijos.findIndex(h => h.id === hijoActivo.id)) }}>
              {getInitials(hijoActivo.user?.nombre, hijoActivo.user?.apellido)}
            </div>
            <div>
              <h2 style={s.headerNombre}>
                {hijoActivo.user?.nombre} {hijoActivo.user?.apellido}
              </h2>
              <p style={s.headerSub}>{hijoActivo.curso?.nombre ?? "Sin curso asignado"}</p>
            </div>
          </div>

          <div style={s.statsRow}>
            <StatCard label="Promedio"    value={promedio}
              color={Number(promedio) >= 14 ? "#059669" : Number(promedio) >= 11 ? "#d97706" : "#dc2626"} />
            <StatCard label="Asistencia"  value={pctAsist !== null ? `${pctAsist}%` : "—"}
              color={(pctAsist ?? 0) >= 75 ? "#059669" : "#dc2626"} />
            <StatCard label="Incidencias" value={incidencias.length}
              color={incidencias.length > 0 ? "#dc2626" : "#059669"} />
          </div>
        </div>

        {/* Tabs */}
        <div style={s.tabsBar}>
          {TABS.map(t => (
            <button
              key={t.key}
              onClick={() => setTab(t.key)}
              style={{ ...s.tabBtn, ...(tab === t.key ? s.tabActive : {}) }}
            >
              <span style={{ fontSize: 15 }}>{t.icon}</span>
              {t.label}
            </button>
          ))}
        </div>

        {/* Contenido */}
        <div style={s.content}>
          {loadingTab
            ? <div style={{ display: "flex", justifyContent: "center", padding: "3rem 0" }}><div style={s.spinner} /></div>
            : <>
                {tab === "datos"       && <TabDatos       estudiante={hijoActivo} />}
                {tab === "notas"       && <TabNotas       notas={notas} />}
                {tab === "asistencia"  && <TabAsistencia  asistencias={asistencias} />}
                {tab === "incidencias" && <TabIncidencias incidencias={incidencias} />}
              </>
          }
        </div>

      </main>
    </div>
  );
}

/* ─────────────────────────────────────────
   SUB-COMPONENTES
───────────────────────────────────────── */

function StatCard({ label, value, color }) {
  return (
    <div style={s.statCard}>
      <span style={s.statLabel}>{label}</span>
      <span style={{ ...s.statVal, color }}>{value}</span>
    </div>
  );
}

function TabDatos({ estudiante }) {
  const campos = [
    ["DNI",               estudiante.dni],
    ["Fecha de nacimiento", estudiante.fechaNacimiento?.slice(0, 10) ?? "No registrada"],
    ["Dirección",         estudiante.direccion ?? "No registrada"],
    ["Curso",             estudiante.curso?.nombre ?? "No asignado"],
    ["Correo",            estudiante.user?.email ?? "—"],
  ];
  return (
    <div style={s.card}>
      <h3 style={s.cardTitle}>Información personal</h3>
      <div style={s.grid2}>
        {campos.map(([label, val]) => (
          <div key={label} style={s.campo}>
            <span style={s.campoLabel}>{label}</span>
            <span style={s.campoVal}>{val}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabNotas({ notas }) {
  if (!notas.length) return <Empty msg="Sin notas registradas" />;
  return (
    <div style={s.card}>
      <h3 style={s.cardTitle}>Notas por materia</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {notas.map(n => (
          <div key={n.id} style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <span style={s.materiaLabel}>{n.materia?.nombre ?? "Materia"}</span>
            <div style={{ flex: 1 }}><NotaBar nota={n.nota} /></div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabAsistencia({ asistencias }) {
  if (!asistencias.length) return <Empty msg="Sin registros de asistencia" />;
  return (
    <div style={s.card}>
      <h3 style={s.cardTitle}>Registro de asistencia</h3>
      <div style={{ overflowX: "auto" }}>
        <table style={s.table}>
          <thead>
            <tr>
              {["Fecha", "Materia", "Estado"].map(h => (
                <th key={h} style={s.th}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {asistencias.map(a => (
              <tr key={a.id} style={s.tr}>
                <td style={s.td}>{a.fecha?.slice(0, 10)}</td>
                <td style={s.td}>{a.materia?.nombre ?? "—"}</td>
                <td style={s.td}><Badge estado={a.estado} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function TabIncidencias({ incidencias }) {
  if (!incidencias.length) return <Empty msg="Sin incidencias registradas" icon="✅" />;
  return (
    <div style={s.card}>
      <h3 style={s.cardTitle}>Incidencias</h3>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {incidencias.map(inc => (
          <div key={inc.id} style={s.incCard}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <span style={s.incFecha}>{inc.fecha?.slice(0, 10)}</span>
              {inc.materia && <span style={s.incMateria}>{inc.materia.nombre}</span>}
            </div>
            <p style={s.incDesc}>{inc.descripcion}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function Empty({ msg, icon = "📭" }) {
  return (
    <div style={{ textAlign: "center", padding: "3rem 1rem", color: "#94a3b8" }}>
      <div style={{ fontSize: 36, marginBottom: 12 }}>{icon}</div>
      <p style={{ fontSize: 14 }}>{msg}</p>
    </div>
  );
}

/* ─────────────────────────────────────────
   ESTILOS
───────────────────────────────────────── */
const s = {
  root:        { display: "flex", minHeight: "100vh", background: "#f8fafc", fontFamily: "'DM Sans','Segoe UI',sans-serif" },
  center:      { display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "60vh" },
  spinner:     { width: 28, height: 28, border: "3px solid #e2e8f0", borderTopColor: "#4f46e5", borderRadius: "50%", animation: "spin 0.8s linear infinite" },

  sidebar:     { width: 220, minHeight: "100vh", background: "#fff", borderRight: "1px solid #e2e8f0", padding: "24px 12px", display: "flex", flexDirection: "column", gap: 4, flexShrink: 0 },
  sidebarLabel:{ fontSize: 11, fontWeight: 600, color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: 8, paddingLeft: 8 },
  hijoBtn:     { display: "flex", alignItems: "center", gap: 10, padding: "10px 8px", borderRadius: 10, border: "1.5px solid transparent", cursor: "pointer", width: "100%", transition: "all 0.15s" },
  avatar:      { width: 36, height: 36, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13, flexShrink: 0 },
  avatarLg:    { width: 52, height: 52, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 18, flexShrink: 0 },
  hijoNombre:  { margin: 0, fontSize: 13, fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 130 },
  hijoCurso:   { margin: 0, fontSize: 11, color: "#94a3b8", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", maxWidth: 130 },

  main:        { flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" },
  header:      { background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "20px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 16 },
  headerNombre:{ margin: 0, fontSize: 20, fontWeight: 700, color: "#0f172a" },
  headerSub:   { margin: 0, fontSize: 13, color: "#64748b", marginTop: 2 },
  statsRow:    { display: "flex", gap: 12 },
  statCard:    { background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: 10, padding: "10px 20px", textAlign: "center", minWidth: 90 },
  statLabel:   { display: "block", fontSize: 11, color: "#94a3b8", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 4 },
  statVal:     { display: "block", fontSize: 22, fontWeight: 700 },

  tabsBar:     { display: "flex", background: "#fff", borderBottom: "1px solid #e2e8f0", padding: "0 28px", overflowX: "auto" },
  tabBtn:      { display: "flex", alignItems: "center", gap: 6, padding: "14px 18px", fontSize: 13, fontWeight: 500, color: "#64748b", background: "transparent", border: "none", borderBottom: "2px solid transparent", cursor: "pointer", whiteSpace: "nowrap", transition: "all 0.15s" },
  tabActive:   { color: "#4f46e5", borderBottomColor: "#4f46e5" },

  content:     { flex: 1, padding: "24px 28px", overflowY: "auto" },
  card:        { background: "#fff", border: "1px solid #e2e8f0", borderRadius: 14, padding: 24 },
  cardTitle:   { margin: "0 0 20px", fontSize: 15, fontWeight: 600, color: "#0f172a" },
  grid2:       { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: 20 },
  campo:       { display: "flex", flexDirection: "column", gap: 4 },
  campoLabel:  { fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" },
  campoVal:    { fontSize: 14, color: "#1e293b", fontWeight: 500 },
  materiaLabel:{ fontSize: 13, color: "#475569", fontWeight: 500, minWidth: 140 },

  table:       { width: "100%", borderCollapse: "collapse", fontSize: 13 },
  th:          { textAlign: "left", fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em", padding: "0 12px 10px", borderBottom: "1px solid #e2e8f0" },
  tr:          { borderBottom: "1px solid #f1f5f9" },
  td:          { padding: 12, color: "#334155", verticalAlign: "middle" },

  incCard:     { background: "#fff7ed", border: "1px solid #fed7aa", borderRadius: 10, padding: "14px 16px" },
  incFecha:    { fontSize: 12, color: "#92400e", fontWeight: 600 },
  incMateria:  { fontSize: 12, background: "#ffedd5", color: "#9a3412", padding: "2px 8px", borderRadius: 6, fontWeight: 500 },
  incDesc:     { margin: 0, fontSize: 13, color: "#7c2d12", lineHeight: 1.5 },
};

const _style = document.createElement("style");
_style.textContent = `@keyframes spin { to { transform: rotate(360deg); } }`;
document.head.appendChild(_style);