import { useState, useMemo } from "react";

const INITIAL_LEADS = [
  { id: 1, name: "Arjun Mehta", email: "arjun@techstartup.io", phone: "+91 98765 43210", source: "Contact Form", status: "new", notes: [], createdAt: "2026-02-20T09:15:00Z" },
  { id: 2, name: "Priya Sharma", email: "priya@designco.in", phone: "+91 87654 32109", source: "LinkedIn", status: "contacted", notes: [{ text: "Sent intro email, awaiting reply", date: "2026-02-22" }], createdAt: "2026-02-19T14:30:00Z" },
  { id: 3, name: "Rohan Verma", email: "rohan@ecommerce.com", phone: "+91 76543 21098", source: "Referral", status: "converted", notes: [{ text: "Onboarded. Project kickoff on Mar 1", date: "2026-02-25" }], createdAt: "2026-02-15T11:00:00Z" },
  { id: 4, name: "Sneha Patel", email: "sneha@fintech.in", phone: "+91 65432 10987", source: "Contact Form", status: "new", notes: [], createdAt: "2026-02-27T08:45:00Z" },
  { id: 5, name: "Karan Singh", email: "karan@agencyblue.in", phone: "+91 54321 09876", source: "Instagram", status: "contacted", notes: [{ text: "Had a call. Needs proposal by next week", date: "2026-02-26" }], createdAt: "2026-02-24T16:20:00Z" },
];

const STATUS_CONFIG = {
  new: { label: "New", color: "#3b82f6", bg: "rgba(59,130,246,0.12)", icon: "◆" },
  contacted: { label: "Contacted", color: "#f59e0b", bg: "rgba(245,158,11,0.12)", icon: "◈" },
  converted: { label: "Converted", color: "#10b981", bg: "rgba(16,185,129,0.12)", icon: "◉" },
};

const formatDate = (iso) => new Date(iso).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
const timeAgo = (iso) => {
  const diff = Date.now() - new Date(iso).getTime();
  const d = Math.floor(diff / 86400000);
  return d === 0 ? "Today" : d === 1 ? "Yesterday" : `${d} days ago`;
};

export default function MiniCRM() {
  const [leads, setLeads] = useState(INITIAL_LEADS);
  const [view, setView] = useState("dashboard"); // dashboard | leads | add
  const [selectedLead, setSelectedLead] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [newNote, setNewNote] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [loginForm, setLoginForm] = useState({ user: "", pass: "" });
  const [loginError, setLoginError] = useState("");
  const [addForm, setAddForm] = useState({ name: "", email: "", phone: "", source: "Contact Form" });
  const [toast, setToast] = useState(null);

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const handleLogin = () => {
    if (loginForm.user === "admin" && loginForm.pass === "admin123") {
      setLoggedIn(true);
      setLoginError("");
    } else {
      setLoginError("Invalid credentials. Try admin / admin123");
    }
  };

  const filteredLeads = useMemo(() => leads.filter(l => {
    const matchSearch = l.name.toLowerCase().includes(search.toLowerCase()) ||
      l.email.toLowerCase().includes(search.toLowerCase()) ||
      l.source.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || l.status === filterStatus;
    return matchSearch && matchStatus;
  }), [leads, search, filterStatus]);

  const stats = useMemo(() => ({
    total: leads.length,
    new: leads.filter(l => l.status === "new").length,
    contacted: leads.filter(l => l.status === "contacted").length,
    converted: leads.filter(l => l.status === "converted").length,
    convRate: leads.length ? Math.round((leads.filter(l => l.status === "converted").length / leads.length) * 100) : 0,
  }), [leads]);

  const updateStatus = (id, status) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status } : l));
    if (selectedLead?.id === id) setSelectedLead(prev => ({ ...prev, status }));
    showToast(`Status updated to "${STATUS_CONFIG[status].label}"`);
  };

  const addNoteToLead = (id) => {
    if (!newNote.trim()) return;
    const note = { text: newNote.trim(), date: new Date().toISOString().slice(0, 10) };
    setLeads(prev => prev.map(l => l.id === id ? { ...l, notes: [...l.notes, note] } : l));
    setSelectedLead(prev => ({ ...prev, notes: [...prev.notes, note] }));
    setNewNote("");
    showToast("Note added!");
  };

  const deleteLead = (id) => {
    setLeads(prev => prev.filter(l => l.id !== id));
    setSelectedLead(null);
    showToast("Lead deleted", "error");
  };

  const submitAddForm = () => {
    if (!addForm.name || !addForm.email) return showToast("Name & Email required", "error");
    const lead = { ...addForm, id: Date.now(), status: "new", notes: [], createdAt: new Date().toISOString() };
    setLeads(prev => [lead, ...prev]);
    setAddForm({ name: "", email: "", phone: "", source: "Contact Form" });
    setView("leads");
    showToast("Lead added successfully!");
  };

  // ─── LOGIN SCREEN ───────────────────────────────────────────────
  if (!loggedIn) return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Georgia', serif" }}>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        input:focus { outline: none; }
        ::placeholder { color: #444; }
      `}</style>
      <div style={{ width: 380, padding: "48px 40px", background: "#111116", border: "1px solid #1e1e28", borderRadius: 16 }}>
        <div style={{ marginBottom: 32, textAlign: "center" }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", margin: "0 auto 16px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>◈</div>
          <h1 style={{ fontFamily: "'Playfair Display', serif", color: "#f0f0f5", fontSize: 26 }}>LeadFlow CRM</h1>
          <p style={{ color: "#555", fontSize: 13, marginTop: 6, fontFamily: "'DM Sans', sans-serif" }}>Admin Access Only</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          <input value={loginForm.user} onChange={e => setLoginForm(p => ({ ...p, user: e.target.value }))}
            placeholder="Username" style={{ padding: "12px 14px", background: "#1a1a22", border: "1px solid #2a2a35", borderRadius: 8, color: "#ddd", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }} />
          <input type="password" value={loginForm.pass} onChange={e => setLoginForm(p => ({ ...p, pass: e.target.value }))}
            onKeyDown={e => e.key === "Enter" && handleLogin()}
            placeholder="Password" style={{ padding: "12px 14px", background: "#1a1a22", border: "1px solid #2a2a35", borderRadius: 8, color: "#ddd", fontSize: 14, fontFamily: "'DM Sans', sans-serif" }} />
          {loginError && <p style={{ color: "#f87171", fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}>{loginError}</p>}
          <button onClick={handleLogin} style={{ padding: "13px", background: "linear-gradient(135deg, #6366f1, #8b5cf6)", border: "none", borderRadius: 8, color: "#fff", fontSize: 14, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", marginTop: 4 }}>
            Sign In →
          </button>
        </div>
        <p style={{ color: "#333", fontSize: 11, textAlign: "center", marginTop: 20, fontFamily: "'DM Sans', sans-serif" }}>Demo: admin / admin123</p>
      </div>
    </div>
  );

  // ─── MAIN APP ────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#0a0a0f", fontFamily: "'DM Sans', sans-serif", color: "#e0e0e8" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;700&family=DM+Sans:wght@400;500;600&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 4px; } ::-webkit-scrollbar-thumb { background: #2a2a35; border-radius: 4px; }
        input:focus, textarea:focus, select:focus { outline: none; }
        ::placeholder { color: #444; }
        .nav-btn { background: none; border: none; cursor: pointer; padding: 10px 16px; border-radius: 8px; font-size: 13px; font-family: inherit; font-weight: 500; transition: all 0.2s; }
        .nav-btn:hover { background: #1e1e28; }
        .stat-card { background: #111116; border: 1px solid #1e1e28; border-radius: 12px; padding: 20px 22px; }
        .lead-row { background: #111116; border: 1px solid #1e1e28; border-radius: 10px; padding: 14px 18px; cursor: pointer; transition: all 0.15s; display: flex; align-items: center; gap: 14px; }
        .lead-row:hover { border-color: #2e2e40; background: #13131a; }
        .btn { padding: 8px 16px; border-radius: 7px; border: none; cursor: pointer; font-size: 12px; font-weight: 600; font-family: inherit; transition: all 0.15s; }
      `}</style>

      {/* SIDEBAR */}
      <div style={{ display: "flex", minHeight: "100vh" }}>
        <div style={{ width: 220, background: "#0d0d13", borderRight: "1px solid #1a1a22", padding: "24px 16px", display: "flex", flexDirection: "column", gap: 4, position: "fixed", top: 0, bottom: 0 }}>
          <div style={{ padding: "0 8px 24px" }}>
            <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 18, color: "#f0f0f5", fontWeight: 700 }}>◈ LeadFlow</div>
            <div style={{ fontSize: 11, color: "#444", marginTop: 3 }}>CRM Dashboard</div>
          </div>
          {[["dashboard", "◻ Dashboard"], ["leads", "◈ All Leads"], ["add", "+ Add Lead"]].map(([v, label]) => (
            <button key={v} className="nav-btn" onClick={() => { setView(v); setSelectedLead(null); }}
              style={{ textAlign: "left", color: view === v ? "#a78bfa" : "#666", background: view === v ? "rgba(167,139,250,0.08)" : "none", borderLeft: view === v ? "2px solid #8b5cf6" : "2px solid transparent" }}>
              {label}
            </button>
          ))}
          <div style={{ marginTop: "auto", padding: "12px 8px", borderTop: "1px solid #1a1a22" }}>
            <div style={{ fontSize: 12, color: "#555", marginBottom: 8 }}>Signed in as <span style={{ color: "#888" }}>Admin</span></div>
            <button className="nav-btn" onClick={() => setLoggedIn(false)} style={{ color: "#f87171", padding: "8px 12px", width: "100%", textAlign: "left", fontSize: 12 }}>⬡ Logout</button>
          </div>
        </div>

        {/* MAIN CONTENT */}
        <div style={{ marginLeft: 220, flex: 1, padding: "32px 36px", maxWidth: 1100 }}>

          {/* TOAST */}
          {toast && (
            <div style={{ position: "fixed", top: 20, right: 24, padding: "12px 20px", borderRadius: 8, background: toast.type === "error" ? "#1f0a0a" : "#0a1f12", border: `1px solid ${toast.type === "error" ? "#7f1d1d" : "#14532d"}`, color: toast.type === "error" ? "#fca5a5" : "#86efac", fontSize: 13, zIndex: 100 }}>
              {toast.msg}
            </div>
          )}

          {/* ── DASHBOARD ── */}
          {view === "dashboard" && (
            <>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#f0f0f5", marginBottom: 6 }}>Overview</h2>
              <p style={{ color: "#555", fontSize: 13, marginBottom: 28 }}>Welcome back, Admin. Here's your pipeline at a glance.</p>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 14, marginBottom: 32 }}>
                {[
                  { label: "Total Leads", value: stats.total, color: "#6366f1" },
                  { label: "New", value: stats.new, color: "#3b82f6" },
                  { label: "Contacted", value: stats.contacted, color: "#f59e0b" },
                  { label: "Converted", value: stats.converted, color: "#10b981" },
                ].map(s => (
                  <div key={s.label} className="stat-card">
                    <div style={{ fontSize: 28, fontWeight: 700, color: s.color, fontFamily: "'Playfair Display', serif" }}>{s.value}</div>
                    <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>{s.label}</div>
                  </div>
                ))}
              </div>

              {/* Conversion bar */}
              <div className="stat-card" style={{ marginBottom: 28 }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                  <span style={{ fontSize: 13, color: "#aaa" }}>Conversion Rate</span>
                  <span style={{ fontSize: 13, color: "#10b981", fontWeight: 600 }}>{stats.convRate}%</span>
                </div>
                <div style={{ height: 6, background: "#1a1a22", borderRadius: 6, overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${stats.convRate}%`, background: "linear-gradient(90deg, #6366f1, #10b981)", borderRadius: 6, transition: "width 0.6s ease" }} />
                </div>
                <div style={{ display: "flex", gap: 16, marginTop: 14 }}>
                  {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                    <div key={key} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12 }}>
                      <div style={{ width: 8, height: 8, borderRadius: 2, background: cfg.color }} />
                      <span style={{ color: "#666" }}>{cfg.label}: </span>
                      <span style={{ color: "#aaa" }}>{leads.filter(l => l.status === key).length}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Recent leads */}
              <div>
                <h3 style={{ fontSize: 14, color: "#888", marginBottom: 14, textTransform: "uppercase", letterSpacing: 1 }}>Recent Leads</h3>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {leads.slice(0, 4).map(l => (
                    <div key={l.id} className="lead-row" onClick={() => { setSelectedLead(l); setView("leads"); }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                        {l.name[0]}
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, color: "#ddd", fontWeight: 500 }}>{l.name}</div>
                        <div style={{ fontSize: 12, color: "#555" }}>{l.email}</div>
                      </div>
                      <div style={{ fontSize: 12, color: "#555" }}>{timeAgo(l.createdAt)}</div>
                      <div style={{ padding: "3px 10px", borderRadius: 20, background: STATUS_CONFIG[l.status].bg, color: STATUS_CONFIG[l.status].color, fontSize: 11, fontWeight: 600 }}>
                        {STATUS_CONFIG[l.status].label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* ── LEADS LIST + DETAIL ── */}
          {view === "leads" && (
            <div style={{ display: "flex", gap: 20 }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", gap: 10, marginBottom: 20, alignItems: "center" }}>
                  <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, color: "#f0f0f5", flex: 1 }}>All Leads</h2>
                  <button className="btn" onClick={() => setView("add")} style={{ background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff" }}>+ Add</button>
                </div>
                <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
                  <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search leads..."
                    style={{ flex: 1, padding: "9px 14px", background: "#111116", border: "1px solid #1e1e28", borderRadius: 8, color: "#ddd", fontSize: 13 }} />
                  <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)}
                    style={{ padding: "9px 12px", background: "#111116", border: "1px solid #1e1e28", borderRadius: 8, color: "#ddd", fontSize: 13 }}>
                    <option value="all">All Status</option>
                    {Object.entries(STATUS_CONFIG).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {filteredLeads.length === 0 && <div style={{ color: "#555", textAlign: "center", padding: 40, fontSize: 14 }}>No leads found</div>}
                  {filteredLeads.map(l => (
                    <div key={l.id} className="lead-row" onClick={() => setSelectedLead(l)}
                      style={{ borderColor: selectedLead?.id === l.id ? "#6366f1" : "#1e1e28" }}>
                      <div style={{ width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 700, color: "#fff", flexShrink: 0 }}>{l.name[0]}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 14, color: "#ddd", fontWeight: 500 }}>{l.name}</div>
                        <div style={{ fontSize: 12, color: "#555" }}>{l.email} · {l.source}</div>
                      </div>
                      <div style={{ fontSize: 11, color: "#444" }}>{timeAgo(l.createdAt)}</div>
                      <div style={{ padding: "3px 10px", borderRadius: 20, background: STATUS_CONFIG[l.status].bg, color: STATUS_CONFIG[l.status].color, fontSize: 11, fontWeight: 600 }}>
                        {STATUS_CONFIG[l.status].label}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* LEAD DETAIL PANEL */}
              {selectedLead && (
                <div style={{ width: 320, background: "#111116", border: "1px solid #1e1e28", borderRadius: 14, padding: 22, height: "fit-content", position: "sticky", top: 20 }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
                    <div>
                      <div style={{ width: 44, height: 44, borderRadius: 12, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", marginBottom: 10 }}>{selectedLead.name[0]}</div>
                      <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, color: "#f0f0f5" }}>{selectedLead.name}</div>
                      <div style={{ fontSize: 12, color: "#555", marginTop: 2 }}>{selectedLead.email}</div>
                    </div>
                    <button onClick={() => setSelectedLead(null)} style={{ background: "none", border: "none", color: "#555", cursor: "pointer", fontSize: 18 }}>×</button>
                  </div>

                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 18 }}>
                    {[["Source", selectedLead.source], ["Phone", selectedLead.phone || "—"], ["Added", formatDate(selectedLead.createdAt)], ["Notes", selectedLead.notes.length]].map(([k, v]) => (
                      <div key={k} style={{ background: "#0d0d13", borderRadius: 8, padding: "9px 12px" }}>
                        <div style={{ fontSize: 10, color: "#555", marginBottom: 3, textTransform: "uppercase", letterSpacing: 0.5 }}>{k}</div>
                        <div style={{ fontSize: 13, color: "#aaa" }}>{v}</div>
                      </div>
                    ))}
                  </div>

                  <div style={{ marginBottom: 18 }}>
                    <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Update Status</div>
                    <div style={{ display: "flex", gap: 6 }}>
                      {Object.entries(STATUS_CONFIG).map(([key, cfg]) => (
                        <button key={key} className="btn" onClick={() => updateStatus(selectedLead.id, key)}
                          style={{ flex: 1, background: selectedLead.status === key ? cfg.bg : "transparent", color: selectedLead.status === key ? cfg.color : "#555", border: `1px solid ${selectedLead.status === key ? cfg.color : "#2a2a35"}`, fontSize: 11 }}>
                          {cfg.icon} {cfg.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginBottom: 14 }}>
                    <div style={{ fontSize: 11, color: "#555", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 8 }}>Follow-up Notes</div>
                    {selectedLead.notes.length === 0 && <div style={{ fontSize: 12, color: "#444", marginBottom: 10 }}>No notes yet</div>}
                    {selectedLead.notes.map((n, i) => (
                      <div key={i} style={{ background: "#0d0d13", borderRadius: 8, padding: "9px 12px", marginBottom: 6 }}>
                        <div style={{ fontSize: 12, color: "#bbb" }}>{n.text}</div>
                        <div style={{ fontSize: 11, color: "#444", marginTop: 4 }}>{n.date}</div>
                      </div>
                    ))}
                    <div style={{ display: "flex", gap: 6, marginTop: 8 }}>
                      <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Add note..."
                        onKeyDown={e => e.key === "Enter" && addNoteToLead(selectedLead.id)}
                        style={{ flex: 1, padding: "8px 12px", background: "#0d0d13", border: "1px solid #1e1e28", borderRadius: 7, color: "#ddd", fontSize: 12 }} />
                      <button className="btn" onClick={() => addNoteToLead(selectedLead.id)} style={{ background: "#6366f1", color: "#fff" }}>+</button>
                    </div>
                  </div>

                  <button className="btn" onClick={() => deleteLead(selectedLead.id)}
                    style={{ width: "100%", background: "rgba(239,68,68,0.08)", color: "#f87171", border: "1px solid rgba(239,68,68,0.2)", marginTop: 4 }}>
                    Delete Lead
                  </button>
                </div>
              )}
            </div>
          )}

          {/* ── ADD LEAD ── */}
          {view === "add" && (
            <div style={{ maxWidth: 480 }}>
              <h2 style={{ fontFamily: "'Playfair Display', serif", fontSize: 24, color: "#f0f0f5", marginBottom: 6 }}>Add New Lead</h2>
              <p style={{ color: "#555", fontSize: 13, marginBottom: 28 }}>Enter the details of the incoming client lead.</p>
              <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
                {[["Name *", "name", "text", "Full name"], ["Email *", "email", "email", "email@example.com"], ["Phone", "phone", "tel", "+91 99999 00000"]].map(([label, key, type, placeholder]) => (
                  <div key={key}>
                    <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>{label}</label>
                    <input type={type} value={addForm[key]} onChange={e => setAddForm(p => ({ ...p, [key]: e.target.value }))}
                      placeholder={placeholder}
                      style={{ width: "100%", padding: "11px 14px", background: "#111116", border: "1px solid #1e1e28", borderRadius: 8, color: "#ddd", fontSize: 14 }} />
                  </div>
                ))}
                <div>
                  <label style={{ fontSize: 12, color: "#666", display: "block", marginBottom: 6, textTransform: "uppercase", letterSpacing: 0.5 }}>Source</label>
                  <select value={addForm.source} onChange={e => setAddForm(p => ({ ...p, source: e.target.value }))}
                    style={{ width: "100%", padding: "11px 14px", background: "#111116", border: "1px solid #1e1e28", borderRadius: 8, color: "#ddd", fontSize: 14 }}>
                    {["Contact Form", "LinkedIn", "Instagram", "Referral", "Cold Email", "Other"].map(s => <option key={s}>{s}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", gap: 10, marginTop: 4 }}>
                  <button className="btn" onClick={() => setView("leads")} style={{ flex: 1, background: "#1a1a22", color: "#888", border: "1px solid #1e1e28", padding: "12px" }}>Cancel</button>
                  <button className="btn" onClick={submitAddForm} style={{ flex: 2, background: "linear-gradient(135deg, #6366f1, #8b5cf6)", color: "#fff", padding: "12px", fontSize: 14 }}>Add Lead →</button>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
