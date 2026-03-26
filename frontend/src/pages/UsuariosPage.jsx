import { useEffect, useState, useCallback } from "react";
import client from "../api/client";

/* ── paleta ── */
const C = {
  bg:       "#0f1117",
  surface:  "#181c27",
  card:     "#1e2333",
  border:   "#2a3050",
  accent:   "#4f8ef7",
  accentH:  "#6ba3ff",
  danger:   "#f75f5f",
  success:  "#3dd68c",
  text:     "#e8ecf4",
  muted:    "#7a85a0",
};

/* ── helpers de estilo ── */
const s = {
  root: {
    fontFamily: "'Segoe UI', sans-serif",
    background: C.bg,
    color: C.text,
    minHeight: "100vh",
    padding: "2rem 2.5rem",
  },
  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "2rem",
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: 700,
    background: `linear-gradient(135deg, ${C.text} 40%, ${C.accent})`,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
  },
  subtitle: { fontSize: ".82rem", color: C.muted, marginTop: ".15rem" },

  // botones
  btnBase: {
    display: "inline-flex", alignItems: "center", gap: ".4rem",
    border: "none", borderRadius: "8px", cursor: "pointer",
    fontFamily: "inherit", fontSize: ".82rem", fontWeight: 600,
    padding: ".5rem 1rem", transition: "all .2s",
  },
  btnPrimary: { background: C.accent, color: "#fff" },
  btnGhost:   { background: "transparent", color: C.muted, border: `1px solid ${C.border}` },
  btnDanger:  { background: `${C.danger}22`, color: C.danger, border: `1px solid ${C.danger}44` },
  btnSm:      { padding: ".32rem .65rem", fontSize: ".76rem", borderRadius: "6px" },

  // tabla
  tableWrap: {
    background: C.card,
    border: `1px solid ${C.border}`,
    borderRadius: "12px",
    overflow: "hidden",
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    padding: ".85rem 1.1rem", textAlign: "left",
    fontSize: ".7rem", fontWeight: 600,
    letterSpacing: ".08em", textTransform: "uppercase",
    color: C.muted, background: C.surface,
    borderBottom: `1px solid ${C.border}`,
  },
  td: { padding: ".9rem 1.1rem", fontSize: ".84rem", verticalAlign: "middle",
        borderBottom: `1px solid ${C.border}22` },

  // badges
  badgeRole: { display:"inline-flex", alignItems:"center", padding:".18rem .5rem", borderRadius:"20px", fontSize:".7rem", fontWeight:600, margin:".1rem .1rem .1rem 0", background:`${C.accent}22`, color:C.accent, border:`1px solid ${C.accent}40` },
  badgeOn:   { display:"inline-flex", alignItems:"center", padding:".18rem .5rem", borderRadius:"20px", fontSize:".7rem", fontWeight:600, background:`${C.success}22`, color:C.success, border:`1px solid ${C.success}40` },
  badgeOff:  { display:"inline-flex", alignItems:"center", padding:".18rem .5rem", borderRadius:"20px", fontSize:".7rem", fontWeight:600, background:`${C.danger}22`,  color:C.danger,  border:`1px solid ${C.danger}40` },

  // search
  searchWrap: { position: "relative", width: "240px" },
  searchIcon: { position:"absolute", left:".75rem", top:"50%", transform:"translateY(-50%)", color:C.muted, pointerEvents:"none" },
  searchInput: {
    width:"100%", padding:".52rem .75rem .52rem 2.1rem",
    background:C.card, border:`1px solid ${C.border}`,
    borderRadius:"8px", color:C.text, fontFamily:"inherit", fontSize:".83rem",
    outline:"none",
  },

  // avatar
  avatar: (id) => {
    const colors = [["#4f8ef7","#1a2540"],["#3dd68c","#122a20"],["#f7c948","#2e2408"],["#c97ef7","#271535"],["#f75f5f","#2e1010"],["#5ec4f7","#0e2535"]];
    const [fg,bg] = colors[id % colors.length];
    return { width:34, height:34, borderRadius:"50%", display:"inline-flex", alignItems:"center", justifyContent:"center", fontSize:".72rem", fontWeight:700, flexShrink:0, background:bg, color:fg };
  },

  // MODAL — estilos fijos para no ser afectados por Bootstrap
  overlay: {
    position: "fixed",
    top: 0, left: 0, right: 0, bottom: 0,
    zIndex: 99999,
    backgroundColor: "rgba(0,0,0,0.78)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "1rem",
  },
  modal: {
    position: "relative",
    backgroundColor: "#1e2333",
    border: `1px solid #2a3050`,
    borderRadius: "16px",
    width: "100%",
    maxWidth: "520px",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow: "0 24px 60px rgba(0,0,0,0.85)",
    zIndex: 100000,
  },
  modalHeader: {
    padding: "1.3rem 1.6rem 1rem",
    borderBottom: `1px solid #2a3050`,
    display:"flex", alignItems:"center", justifyContent:"space-between",
    backgroundColor: "#1e2333",
  },
  modalTitle: { fontSize:"1rem", fontWeight:700, color: "#e8ecf4" },
  modalBody:  { padding:"1.3rem 1.6rem", display:"flex", flexDirection:"column", gap:"1rem", backgroundColor: "#1e2333" },
  modalFooter:{ padding:"1rem 1.6rem 1.3rem", borderTop:`1px solid #2a3050`, display:"flex", justifyContent:"flex-end", gap:".6rem", backgroundColor: "#1e2333" },

  // form
  field:    { display:"flex", flexDirection:"column", gap:".3rem" },
  fieldRow: { display:"grid", gridTemplateColumns:"1fr 1fr", gap:".75rem" },
  label:    { fontSize:".72rem", fontWeight:600, color:C.muted, letterSpacing:".04em", textTransform:"uppercase" },
  input: {
    padding:".58rem .85rem",
    backgroundColor: "#181c27",
    border:`1px solid #2a3050`,
    borderRadius:"8px",
    color: "#e8ecf4",
    fontFamily:"inherit",
    fontSize:".84rem",
    outline:"none",
    width:"100%",
    boxSizing: "border-box",
  },
  select: {
    padding:".58rem .85rem",
    backgroundColor: "#181c27",
    border:`1px solid #2a3050`,
    borderRadius:"8px",
    color: "#e8ecf4",
    fontFamily:"inherit",
    fontSize:".84rem",
    outline:"none",
    width:"100%",
    boxSizing: "border-box",
  },
  sectionLabel: {
    fontSize:".68rem", fontWeight:700, letterSpacing:".1em",
    textTransform:"uppercase", color:C.muted,
    paddingBottom:".4rem", borderBottom:`1px solid ${C.border}`,
  },
  roleChip: (selected) => ({
    padding:".28rem .75rem", borderRadius:"20px", fontSize:".74rem", fontWeight:600,
    cursor:"pointer", userSelect:"none",
    border: selected ? `1.5px solid ${C.accent}` : `1.5px solid ${C.border}`,
    background: selected ? `${C.accent}22` : C.surface,
    color: selected ? C.accent : C.muted,
  }),

  // toasts
  toastWrap: { position:"fixed", bottom:"1.5rem", right:"1.5rem", zIndex:200000, display:"flex", flexDirection:"column", gap:".5rem" },
  toastOk:  { padding:".65rem 1rem", borderRadius:"10px", fontSize:".82rem", fontWeight:600, background:`${C.success}22`, border:`1px solid ${C.success}55`, color:C.success, display:"flex", alignItems:"center", gap:".5rem" },
  toastErr: { padding:".65rem 1rem", borderRadius:"10px", fontSize:".82rem", fontWeight:600, background:`${C.danger}22`,  border:`1px solid ${C.danger}55`,  color:C.danger,  display:"flex", alignItems:"center", gap:".5rem" },

  empty: { textAlign:"center", padding:"3rem", color:C.muted, fontSize:".88rem" },
  closeBtn: { background:"none", border:"none", cursor:"pointer", color:C.muted, fontSize:"1.3rem", lineHeight:1, padding:".2rem .4rem", borderRadius:"4px" },
};

const emptyForm = { nombre:"", apellido:"", apellidoP:"", apellidoM:"", email:"", password:"", activo:true, roleIds:[] };

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState([]);
  const [roles,    setRoles]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [search,   setSearch]   = useState("");
  const [modal,    setModal]    = useState(null);
  const [form,     setForm]     = useState(emptyForm);
  const [saving,   setSaving]   = useState(false);
  const [toasts,   setToasts]   = useState([]);

  /* ── cargar ── */
  const cargar = useCallback(async () => {
    setLoading(true);
    try {
      const [uR, rR] = await Promise.all([
        client.get("/admin/users"),
        client.get("/admin/users/roles"),
      ]);
      setUsuarios(uR.data);
      setRoles(rR.data);
    } catch { addToast("Error cargando datos", "err"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { cargar(); }, [cargar]);

  /* ── toast ── */
  const addToast = (msg, type = "ok") => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3000);
  };

  /* ── modales ── */
  const openCreate = () => { setForm(emptyForm); setModal({ mode:"create" }); };
  const openEdit   = (u) => {
    setForm({
      nombre: u.nombre, apellido: u.apellido,
      apellidoP: u.apellidoP||"", apellidoM: u.apellidoM||"",
      email: u.email, password: "",
      activo: u.activo,
      roleIds: u.roles.map(r => r.roleId ?? r.role?.id),
    });
    setModal({ mode:"edit", userId: u.id });
  };

  /* ── guardar ── */
  const guardar = async () => {
    if (!form.nombre || !form.apellido || !form.email) { addToast("Nombre, apellido y email son obligatorios","err"); return; }
    if (modal.mode === "create" && !form.password)      { addToast("La contraseña es obligatoria al crear","err"); return; }
    setSaving(true);
    try {
      const payload = { ...form };
      if (modal.mode === "edit" && !payload.password) delete payload.password;
      if (modal.mode === "create") {
        await client.post("/admin/users", payload);
        addToast("Usuario creado ✓");
      } else {
        await client.put(`/admin/users/${modal.userId}`, payload);
        addToast("Usuario actualizado ✓");
      }
      setModal(null);
      cargar();
    } catch (e) {
      addToast(e.response?.data?.message || "Error al guardar","err");
    } finally { setSaving(false); }
  };

  /* ── eliminar ── */
  const eliminar = async (id) => {
    if (!confirm("¿Eliminar este usuario?")) return;
    try {
      await client.delete(`/admin/users/${id}`);
      addToast("Usuario eliminado");
      cargar();
    } catch { addToast("Error al eliminar","err"); }
  };

  const toggleRole = (rid) => setForm(f => ({
    ...f,
    roleIds: f.roleIds.includes(rid) ? f.roleIds.filter(r => r !== rid) : [...f.roleIds, rid]
  }));

  const setF = (key) => (e) => setForm(f => ({ ...f, [key]: e.target.value }));

  /* ── filtro ── */
  const filtrados = usuarios.filter(u => {
    const q = search.toLowerCase();
    return u.nombre.toLowerCase().includes(q) || u.apellido.toLowerCase().includes(q) ||
           u.email.toLowerCase().includes(q) || u.roles.some(r => r.role.nombre.toLowerCase().includes(q));
  });

  /* ── render ── */
  return (
    <div style={s.root}>

      {/* Header */}
      <div style={s.header}>
        <div>
          <div style={s.title}>Gestión de Usuarios</div>
          <div style={s.subtitle}>{usuarios.length} usuarios registrados</div>
        </div>
        <div style={{ display:"flex", gap:".75rem", alignItems:"center" }}>
          <div style={s.searchWrap}>
            <span style={s.searchIcon}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
              </svg>
            </span>
            <input style={s.searchInput} placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <button style={{...s.btnBase,...s.btnPrimary}} onClick={openCreate}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
            Nuevo Usuario
          </button>
        </div>
      </div>

      {/* Tabla */}
      <div style={s.tableWrap}>
        {loading ? (
          <div style={s.empty}>Cargando usuarios…</div>
        ) : filtrados.length === 0 ? (
          <div style={s.empty}>No se encontraron usuarios.</div>
        ) : (
          <table style={s.table}>
            <thead>
              <tr>
                {["Usuario","Email","Roles","Estado","Acciones"].map(h => (
                  <th key={h} style={{...s.th, textAlign: h==="Acciones"?"right":"left"}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtrados.map(u => (
                <tr key={u.id}>
                  <td style={s.td}>
                    <div style={{ display:"flex", alignItems:"center", gap:".7rem" }}>
                      <div style={s.avatar(u.id)}>{(u.nombre[0]+u.apellido[0]).toUpperCase()}</div>
                      <div>
                        <div style={{ fontWeight:600 }}>{u.nombre} {u.apellido}</div>
                        {(u.apellidoP||u.apellidoM) && (
                          <div style={{ fontSize:".72rem", color:C.muted }}>{[u.apellidoP,u.apellidoM].filter(Boolean).join(" ")}</div>
                        )}
                      </div>
                    </div>
                  </td>
                  <td style={{...s.td, fontFamily:"monospace", fontSize:".78rem", color:C.muted}}>{u.email}</td>
                  <td style={s.td}>
                    {u.roles.length === 0
                      ? <span style={{ color:C.muted, fontSize:".75rem" }}>Sin rol</span>
                      : u.roles.map(r => <span key={r.id} style={s.badgeRole}>{r.role.nombre}</span>)
                    }
                  </td>
                  <td style={s.td}>
                    <span style={u.activo ? s.badgeOn : s.badgeOff}>{u.activo ? "● Activo" : "○ Inactivo"}</span>
                  </td>
                  <td style={{...s.td, textAlign:"right"}}>
                    <div style={{ display:"flex", gap:".4rem", justifyContent:"flex-end" }}>
                      <button style={{...s.btnBase,...s.btnGhost,...s.btnSm}} onClick={() => openEdit(u)}>
                        ✏️ Editar
                      </button>
                      <button style={{...s.btnBase,...s.btnDanger,...s.btnSm}} onClick={() => eliminar(u.id)}>
                        🗑 Eliminar
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* ── MODAL ── */}
      {modal && (
        <div style={s.overlay} onClick={e => { if (e.target === e.currentTarget) setModal(null); }}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>

            <div style={s.modalHeader}>
              <span style={s.modalTitle}>{modal.mode === "create" ? "✦ Nuevo Usuario" : "✦ Editar Usuario"}</span>
              <button style={s.closeBtn} onClick={() => setModal(null)}>✕</button>
            </div>

            <div style={s.modalBody}>
              <div style={s.sectionLabel}>Datos personales</div>

              <div style={s.fieldRow}>
                <div style={s.field}>
                  <label style={s.label}>Nombre *</label>
                  <input style={s.input} value={form.nombre} onChange={setF("nombre")} placeholder="Juan" />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Apellido *</label>
                  <input style={s.input} value={form.apellido} onChange={setF("apellido")} placeholder="Pérez" />
                </div>
              </div>

              <div style={s.fieldRow}>
                <div style={s.field}>
                  <label style={s.label}>Apellido Paterno</label>
                  <input style={s.input} value={form.apellidoP} onChange={setF("apellidoP")} placeholder="Opcional" />
                </div>
                <div style={s.field}>
                  <label style={s.label}>Apellido Materno</label>
                  <input style={s.input} value={form.apellidoM} onChange={setF("apellidoM")} placeholder="Opcional" />
                </div>
              </div>

              <div style={s.sectionLabel}>Acceso</div>

              <div style={s.field}>
                <label style={s.label}>Email *</label>
                <input style={s.input} type="email" value={form.email} onChange={setF("email")} placeholder="usuario@colegio.cl" />
              </div>

              <div style={s.field}>
                <label style={s.label}>{modal.mode === "edit" ? "Nueva contraseña (vacío = no cambiar)" : "Contraseña *"}</label>
                <input style={s.input} type="password" value={form.password} onChange={setF("password")} placeholder="••••••••" />
              </div>

              <div style={s.field}>
                <label style={s.label}>Estado</label>
                <select style={s.select} value={form.activo ? "1" : "0"} onChange={e => setForm(f => ({...f, activo: e.target.value==="1"}))}>
                  <option value="1">Activo</option>
                  <option value="0">Inactivo</option>
                </select>
              </div>

              <div style={s.sectionLabel}>Roles</div>
              <div style={{ display:"flex", flexWrap:"wrap", gap:".5rem" }}>
                {roles.map(r => (
                  <div key={r.id} style={s.roleChip(form.roleIds.includes(r.id))} onClick={() => toggleRole(r.id)}>
                    {r.nombre}
                  </div>
                ))}
                {roles.length === 0 && <span style={{ color:C.muted, fontSize:".78rem" }}>No hay roles disponibles</span>}
              </div>
            </div>

            <div style={s.modalFooter}>
              <button style={{...s.btnBase,...s.btnGhost}} onClick={() => setModal(null)}>Cancelar</button>
              <button style={{...s.btnBase,...s.btnPrimary}} onClick={guardar} disabled={saving}>
                {saving ? "Guardando…" : modal.mode === "create" ? "Crear Usuario" : "Guardar Cambios"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Toasts */}
      <div style={s.toastWrap}>
        {toasts.map(t => (
          <div key={t.id} style={t.type === "ok" ? s.toastOk : s.toastErr}>
            {t.type === "ok" ? "✓" : "✕"} {t.msg}
          </div>
        ))}
      </div>

    </div>
  );
}