import { useState } from "react";

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const DS = {
  // Admin — deep crimson
  admin: {
    primary: "#C41E1E", primaryDk: "#8B0F0F", primaryLt: "#FEF0F0",
    accent: "#E8940A", surface: "#FFFFFF", bg: "#F7F6F8",
    border: "#E8E7EA", text: "#1A1A1E", textSec: "#6B6B72", textTert: "#A0A0A8",
    status: "#A01010", success: "#0F7A4A", successBg: "#E8F7EF",
    warning: "#D6660A", warningBg: "#FEF4E6", info: "#1B5FA0", infoBg: "#EBF3FC",
    danger: "#C41E1E", dangerBg: "#FEF0F0", purple: "#6B3FCC", purpleBg: "#F2EEFF",
  },
  // Technician — deep amber/orange
  tech: {
    primary: "#D47A08", primaryDk: "#945204", primaryLt: "#FFF8E8",
    surface: "#FFFFFF", bg: "#FAFAF5",
    border: "#EAE8DF", text: "#1A1A0E", textSec: "#6B6A58", textTert: "#A0A08A",
    status: "#B56A06", success: "#0F7A4A", successBg: "#E8F7EF",
    warning: "#C41E1E", warningBg: "#FEF0F0", info: "#1B5FA0", infoBg: "#EBF3FC",
    danger: "#C41E1E", dangerBg: "#FEF0F0",
    offline: "#E84040", offlineBg: "#FEECEC",
    pending: "#D47A08", pendingBg: "#FFF3D6",
  },
  // Customer — forest teal
  cust: {
    primary: "#0A6E4E", primaryDk: "#064A34", primaryLt: "#E8F7EF",
    surface: "#FFFFFF", bg: "#F5FAF7",
    border: "#DFF0E8", text: "#0A1A14", textSec: "#3D6B58", textTert: "#7AA090",
    status: "#085A3E", success: "#0A6E4E", successBg: "#E8F7EF",
    warning: "#D47A08", warningBg: "#FFF8E8", info: "#1B5FA0", infoBg: "#EBF3FC",
    danger: "#C41E1E", dangerBg: "#FEF0F0",
    amber: "#E8940A", amberBg: "#FFF3D6",
  },
};

// ─── SHARED STYLES ────────────────────────────────────────────────────────────
const phoneWrap = {
  width: 390, minHeight: 844, borderRadius: 40,
  overflow: "hidden", position: "relative",
  boxShadow: "0 40px 100px rgba(0,0,0,0.22), 0 0 0 1px rgba(0,0,0,0.08)",
  fontFamily: "'DM Sans', 'Outfit', system-ui, sans-serif",
  display: "flex", flexDirection: "column",
};

// ─── UTILITY COMPONENTS ───────────────────────────────────────────────────────
const Badge = ({ label, bg, color, size = 10 }) => (
  <span style={{
    background: bg, color, fontSize: size, fontWeight: 600,
    padding: "3px 8px", borderRadius: 99, whiteSpace: "nowrap",
  }}>{label}</span>
);

const Btn = ({ label, bg, color, onClick, full, small, outline, borderColor }) => (
  <button onClick={onClick} style={{
    background: outline ? "transparent" : bg,
    color: outline ? (borderColor || bg) : color,
    border: outline ? `1.5px solid ${borderColor || bg}` : "none",
    borderRadius: 10, padding: small ? "6px 14px" : "12px 20px",
    fontSize: small ? 11 : 13, fontWeight: 600, cursor: "pointer",
    width: full ? "100%" : "auto", letterSpacing: 0.2,
    transition: "opacity 0.15s", fontFamily: "inherit",
  }}
    onMouseEnter={e => e.currentTarget.style.opacity = "0.85"}
    onMouseLeave={e => e.currentTarget.style.opacity = "1"}
  >{label}</button>
);

const Card = ({ children, style, onClick }) => (
  <div onClick={onClick} style={{
    background: "#fff", borderRadius: 14,
    boxShadow: "0 2px 12px rgba(0,0,0,0.06), 0 0 0 0.5px rgba(0,0,0,0.06)",
    padding: 14, cursor: onClick ? "pointer" : "default",
    transition: "transform 0.1s", ...style,
  }}
    onMouseEnter={e => onClick && (e.currentTarget.style.transform = "scale(1.005)")}
    onMouseLeave={e => onClick && (e.currentTarget.style.transform = "scale(1)")}
  >{children}</div>
);

const StatusBar = ({ bg, light }) => (
  <div style={{ background: bg, padding: "12px 20px 8px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
    <span style={{ fontSize: 13, fontWeight: 700, color: light ? "#fff" : "#1A1A1E" }}>9:41</span>
    <span style={{ fontSize: 11, color: light ? "rgba(255,255,255,0.8)" : "#888" }}>●●● WiFi 🔋</span>
  </div>
);

const OfflineBanner = ({ c }) => (
  <div style={{ background: c.offlineBg || c.warningBg, padding: "8px 16px", display: "flex", alignItems: "center", gap: 6, borderBottom: `1px solid ${c.border}` }}>
    <span style={{ fontSize: 14 }}>⚠</span>
    <span style={{ fontSize: 11, fontWeight: 600, color: c.offline || c.warning }}>Offline Mode — 3 uploads pending</span>
  </div>
);

const BottomNav = ({ items, active, onNav, primary }) => (
  <div style={{
    position: "sticky", bottom: 0, background: "#fff",
    borderTop: "0.5px solid #E8E7EA",
    display: "flex", padding: "6px 0 10px",
  }}>
    {items.map((item, i) => (
      <button key={i} onClick={() => onNav(i)} style={{
        flex: 1, background: "none", border: "none", cursor: "pointer",
        display: "flex", flexDirection: "column", alignItems: "center", gap: 3, padding: "4px 0",
      }}>
        <span style={{ fontSize: 18 }}>{item.icon}</span>
        <span style={{ fontSize: 9, fontWeight: i === active ? 700 : 400, color: i === active ? primary : "#A0A0A8" }}>
          {item.label}
        </span>
        {i === active && <div style={{ width: 20, height: 2.5, background: primary, borderRadius: 2 }} />}
      </button>
    ))}
  </div>
);

const BackHeader = ({ title, sub, onBack, color, badge }) => (
  <div style={{
    background: "#fff", padding: "12px 16px 12px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
    display: "flex", alignItems: "center", gap: 10,
  }}>
    <button onClick={onBack} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 20, color, padding: 0 }}>←</button>
    <div style={{ flex: 1 }}>
      <div style={{ fontSize: 15, fontWeight: 700, color: "#1A1A1E" }}>{title}</div>
      {sub && <div style={{ fontSize: 10, color: "#888", marginTop: 1 }}>{sub}</div>}
    </div>
    {badge}
  </div>
);

const SectionLabel = ({ label, action, onAction, color }) => (
  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", margin: "16px 0 8px" }}>
    <span style={{ fontSize: 14, fontWeight: 700, color: "#1A1A1E" }}>{label}</span>
    {action && <button onClick={onAction} style={{ background: "none", border: "none", fontSize: 12, fontWeight: 600, color, cursor: "pointer" }}>{action}</button>}
  </div>
);

const InputField = ({ label, placeholder, value, onChange, icon }) => (
  <div style={{ marginBottom: 14 }}>
    {label && <div style={{ fontSize: 11, fontWeight: 600, color: "#6B6B72", marginBottom: 5 }}>{label}</div>}
    <div style={{ position: "relative" }}>
      {icon && <span style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>{icon}</span>}
      <input
        value={value || ""} onChange={e => onChange && onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%", padding: icon ? "11px 12px 11px 36px" : "11px 12px",
          border: "1px solid #E8E7EA", borderRadius: 10, fontSize: 13,
          outline: "none", boxSizing: "border-box", fontFamily: "inherit",
          background: "#fff", color: "#1A1A1E",
        }}
      />
    </div>
  </div>
);

const ProgressBar = ({ value, max, color, bg }) => (
  <div style={{ background: bg || "#EEE", borderRadius: 99, height: 5, overflow: "hidden" }}>
    <div style={{ width: `${(value / max) * 100}%`, background: color, height: "100%", borderRadius: 99, transition: "width 0.5s ease" }} />
  </div>
);

const MetricCard = ({ label, value, sub, color, bg, icon }) => (
  <Card style={{ padding: 12, position: "relative", overflow: "hidden" }}>
    <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 3, background: color, borderRadius: "14px 14px 0 0" }} />
    <div style={{ fontSize: 10, color: "#888", marginBottom: 4, marginTop: 4 }}>{label}</div>
    <div style={{ fontSize: 22, fontWeight: 800, color, lineHeight: 1 }}>{value}</div>
    {icon && <div style={{ position: "absolute", right: 10, top: 12, fontSize: 22, opacity: 0.15 }}>{icon}</div>}
    {sub && <div style={{ fontSize: 9, color: "#0F7A4A", fontWeight: 600, marginTop: 4 }}>{sub}</div>}
  </Card>
);

// ════════════════════════════════════════════════════════════════════════════
// ██████████████████████   ADMIN APP   ██████████████████████████████████████
// ════════════════════════════════════════════════════════════════════════════

function AdminApp({ onSwitch }) {
  const c = DS.admin;
  const [screen, setScreen] = useState("dashboard");
  const [activeTab, setActiveTab] = useState(0);
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = [
    { id: "SF-089", customer: "Ravi Kumar", stage: "Stage 4 — Installation", status: "In Progress", statusBg: c.infoBg, statusColor: c.info, amount: "₹1,40,000", paid: "₹70,000", flagged: false, stageNum: 4 },
    { id: "SF-088", customer: "Priya Sharma", stage: "Stage 2 — Survey", status: "Blocked", statusBg: c.dangerBg, statusColor: c.danger, amount: "₹95,000", paid: "₹20,000", flagged: true, stageNum: 2 },
    { id: "SF-087", customer: "Amit Singh", stage: "Stage 7 — Inspection", status: "Completed", statusBg: c.successBg, statusColor: c.success, amount: "₹2,10,000", paid: "₹2,10,000", flagged: false, stageNum: 7 },
    { id: "SF-086", customer: "Meena Pillai", stage: "Stage 1 — Survey", status: "Pending", statusBg: c.warningBg, statusColor: c.warning, amount: "₹78,000", paid: "₹0", flagged: false, stageNum: 1 },
    { id: "SF-085", customer: "Suresh Nair", stage: "Stage 6 — Testing", status: "In Progress", statusBg: c.infoBg, statusColor: c.info, amount: "₹1,65,000", paid: "₹1,20,000", flagged: false, stageNum: 6 },
  ];

  const navItems = [
    { icon: "⊞", label: "Home" }, { icon: "📋", label: "Projects" },
    { icon: "📦", label: "Stock" }, { icon: "💳", label: "Finance" }, { icon: "🔔", label: "Alerts" },
  ];

  const stageNames = ["Survey", "Quote", "KYC", "Dispatch", "Install", "Inspect", "Connect", "Handover"];

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  const Dashboard = () => (
    <div style={{ ...phoneWrap, background: c.bg }}>
      <StatusBar bg={c.status} light />
      {/* App Bar */}
      <div style={{ background: "#fff", padding: "10px 16px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: 18, fontWeight: 800, color: c.primary }}>SolarFlow Admin</div>
            <div style={{ fontSize: 10, color: c.textSec }}>Javed Ahmad · Manager</div>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ background: c.primaryLt, borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, cursor: "pointer" }}>🔔</div>
            <div style={{ position: "absolute", top: -3, right: -3, background: c.danger, borderRadius: 99, width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9, fontWeight: 800, color: "#fff" }}>3</div>
          </div>
        </div>
      </div>
      {/* Alert */}
      <div style={{ background: c.warningBg, padding: "8px 16px", borderBottom: `1px solid ${c.border}`, display: "flex", gap: 6, alignItems: "center" }}>
        <span style={{ fontSize: 13 }}>⚠</span>
        <span style={{ fontSize: 11, fontWeight: 600, color: c.warning }}>2 projects blocked · 4 inventory items low</span>
      </div>
      {/* Scrollable content */}
      <div style={{ flex: 1, overflowY: "auto", padding: "0 16px 16px" }}>
        <SectionLabel label="Overview" color={c.primary} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 8 }}>
          <MetricCard label="Pending Quotes" value="5" sub="+ 2 today" color={c.primary} icon="📝" />
          <MetricCard label="Active Projects" value="23" sub="3 overdue" color={c.info} icon="🏗" />
          <MetricCard label="Low Stock" value="4" sub="Order now" color={c.warning} icon="📦" />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
          <MetricCard label="Tasks Today" value="12" sub="4 unassigned" color={c.accent} icon="✓" />
          <MetricCard label="Dispatches" value="3" sub="On track" color={c.success} icon="🚚" />
          <MetricCard label="Revenue MTD" value="₹4.2L" sub="↑ 18%" color={c.primaryDk} icon="₹" />
        </div>
        <SectionLabel label="Quick Actions" color={c.primary} />
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 6 }}>
          {[["＋ Project", c.primary], ["New Quote", c.info], ["Assign Task", c.success]].map(([l, bg]) => (
            <Btn key={l} label={l} bg={bg} color="#fff" onClick={() => {}} />
          ))}
        </div>
        <SectionLabel label="Recent Projects" action="See all →" onAction={() => setScreen("projects")} color={c.primary} />
        {projects.slice(0, 4).map(p => (
          <Card key={p.id} style={{ marginBottom: 8, padding: "10px 14px" }} onClick={() => { setSelectedProject(p); setScreen("project-detail"); }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
              <div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: c.text }}>{p.id}</span>
                  {p.flagged && <span style={{ fontSize: 11 }}>⚠</span>}
                </div>
                <div style={{ fontSize: 11, color: c.textSec, margin: "2px 0" }}>{p.customer}</div>
                <div style={{ fontSize: 10, color: c.textTert }}>{p.stage}</div>
              </div>
              <Badge label={p.status} bg={p.statusBg} color={p.statusColor} />
            </div>
          </Card>
        ))}
      </div>
      <BottomNav items={navItems} active={activeTab} onNav={i => { setActiveTab(i); if (i === 1) setScreen("projects"); }} primary={c.primary} />
    </div>
  );

  // ── PROJECTS LIST ──────────────────────────────────────────────────────────
  const ProjectsList = () => (
    <div style={{ ...phoneWrap, background: c.bg }}>
      <StatusBar bg={c.status} light />
      <div style={{ background: "#fff", padding: "12px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
        <div style={{ fontSize: 18, fontWeight: 800, color: c.primary }}>Projects</div>
        <div style={{ fontSize: 10, color: c.textSec }}>23 active · 4 overdue</div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
        <InputField placeholder="Search projects..." icon="🔍" />
        {/* Filter pills */}
        <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
          {[["All", c.primary, "#fff"], ["In Progress", c.infoBg, c.info], ["Blocked", c.dangerBg, c.danger], ["Completed", c.successBg, c.success]].map(([l, bg, col]) => (
            <Badge key={l} label={l} bg={l === "All" ? c.primary : bg} color={l === "All" ? "#fff" : col} size={10} />
          ))}
        </div>
        {projects.map(p => (
          <Card key={p.id} style={{ marginBottom: 10, padding: "12px 14px" }} onClick={() => { setSelectedProject(p); setScreen("project-detail"); }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>{p.id}</span>
                  {p.flagged && <Badge label="⚠ Flagged" bg={c.warningBg} color={c.warning} size={9} />}
                </div>
                <div style={{ fontSize: 12, color: c.textSec, marginTop: 2 }}>{p.customer}</div>
              </div>
              <Badge label={p.status} bg={p.statusBg} color={p.statusColor} />
            </div>
            <ProgressBar value={p.stageNum} max={8} color={c.primary} />
            <div style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ fontSize: 10, color: c.textTert }}>{p.stage}</span>
              <span style={{ fontSize: 10, fontWeight: 600, color: c.primary }}>{p.stageNum}/8 stages</span>
            </div>
          </Card>
        ))}
      </div>
      <BottomNav items={navItems} active={1} onNav={i => { setActiveTab(i); if (i === 0) setScreen("dashboard"); }} primary={c.primary} />
    </div>
  );

  // ── PROJECT DETAIL ─────────────────────────────────────────────────────────
  const ProjectDetail = () => {
    const [detailTab, setDetailTab] = useState(0);
    const p = selectedProject || projects[0];
    return (
      <div style={{ ...phoneWrap, background: c.bg }}>
        <StatusBar bg={c.status} light />
        <BackHeader title={p.id} sub={`${p.customer} · Koramangala, Bengaluru`} onBack={() => setScreen("projects")} color={c.primary}
          badge={<Badge label={p.status} bg={p.statusBg} color={p.statusColor} />}
        />
        {/* Stage progress */}
        <div style={{ background: "#fff", padding: "10px 16px 12px", borderBottom: `1px solid ${c.border}` }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            {stageNames.map((s, i) => (
              <div key={i} style={{ flex: 1, textAlign: "center" }}>
                <div style={{
                  width: 20, height: 20, borderRadius: 99, margin: "0 auto 2px",
                  background: i < p.stageNum ? c.primary : i === p.stageNum ? c.accent : c.border,
                  display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, color: "#fff", fontWeight: 700,
                }}>{i < p.stageNum ? "✓" : i + 1}</div>
                <div style={{ fontSize: 6.5, color: i < p.stageNum ? c.primary : c.textTert, lineHeight: 1.2 }}>{s}</div>
              </div>
            ))}
          </div>
          <ProgressBar value={p.stageNum} max={8} color={c.primary} />
        </div>
        {/* Tabs */}
        <div style={{ background: "#fff", display: "flex", borderBottom: `1px solid ${c.border}` }}>
          {["Overview", "Tasks", "Finance", "Docs", "Photos"].map((t, i) => (
            <button key={t} onClick={() => setDetailTab(i)} style={{
              flex: 1, padding: "10px 0", fontSize: 11, fontWeight: i === detailTab ? 700 : 400,
              color: i === detailTab ? c.primary : c.textSec, background: "none", border: "none",
              borderBottom: i === detailTab ? `2px solid ${c.primary}` : "2px solid transparent",
              cursor: "pointer", fontFamily: "inherit",
            }}>{t}</button>
          ))}
        </div>
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
          {detailTab === 0 && <>
            <Card style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: c.textSec, marginBottom: 8 }}>Project Info</div>
              {[["Customer", p.customer], ["Phone", "+91 98765 43210"], ["Address", "Flat 4B, Koramangala"], ["System", "5 kW Rooftop Solar"]].map(([k, v]) => (
                <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: `0.5px solid ${c.border}` }}>
                  <span style={{ fontSize: 11, color: c.textSec }}>{k}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, color: c.text }}>{v}</span>
                </div>
              ))}
            </Card>
            <Card style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: c.textSec, marginBottom: 8 }}>Financials</div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
                <div><div style={{ fontSize: 9, color: c.textSec }}>Quoted</div><div style={{ fontSize: 14, fontWeight: 800, color: c.text }}>{p.amount}</div></div>
                <div><div style={{ fontSize: 9, color: c.textSec }}>Paid</div><div style={{ fontSize: 14, fontWeight: 800, color: c.success }}>{p.paid}</div></div>
                <div><div style={{ fontSize: 9, color: c.textSec }}>Pending</div><div style={{ fontSize: 14, fontWeight: 800, color: c.warning }}>₹70,000</div></div>
              </div>
            </Card>
            <Card style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: c.textSec, marginBottom: 8 }}>Assigned Technician</div>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ width: 40, height: 40, borderRadius: 99, background: c.primary, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 800, color: "#fff" }}>RA</div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700 }}>Rahul Anand</div>
                  <div style={{ fontSize: 10, color: c.textSec }}>Field Technician · Available</div>
                </div>
                <Btn label="Reassign" bg={c.primaryLt} color={c.primary} small outline={false} />
              </div>
            </Card>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <Btn label="✓ Approve Stage" bg={c.primary} color="#fff" />
              <Btn label="⛔ Block Project" bg={c.warningBg} color={c.warning} />
            </div>
          </>}
          {detailTab === 1 && (
            <div>
              {["Install mounting brackets", "Connect DC wiring", "Mount solar panels", "Install inverter", "Commission system test"].map((task, i) => (
                <Card key={i} style={{ marginBottom: 8, padding: "10px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ width: 20, height: 20, borderRadius: 99, background: i < 2 ? c.successBg : i === 2 ? c.infoBg : c.border, border: `2px solid ${i < 2 ? c.success : i === 2 ? c.info : c.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 9 }}>{i < 2 ? "✓" : ""}</div>
                      <div>
                        <div style={{ fontSize: 12, fontWeight: 600, color: i < 2 ? c.textSec : c.text, textDecoration: i < 2 ? "line-through" : "none" }}>{task}</div>
                        <div style={{ fontSize: 9, color: c.textTert }}>Rahul Anand</div>
                      </div>
                    </div>
                    <Badge label={i < 2 ? "Done" : i === 2 ? "Active" : "Pending"} bg={i < 2 ? c.successBg : i === 2 ? c.infoBg : c.border} color={i < 2 ? c.success : i === 2 ? c.info : c.textTert} size={9} />
                  </div>
                </Card>
              ))}
            </div>
          )}
          {detailTab === 2 && (
            <div>
              <Card style={{ marginBottom: 10, background: c.primary, color: "#fff" }}>
                <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Total Project Value</div>
                <div style={{ fontSize: 28, fontWeight: 800 }}>{p.amount}</div>
                <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 4 }}>50% collected · ₹70,000 pending</div>
              </Card>
              {[["Advance (25%)", "₹35,000", "Paid", "Apr 1"], ["Milestone (25%)", "₹35,000", "Paid", "Apr 8"], ["Completion (50%)", "₹70,000", "Due", "Apr 30"]].map(([name, amt, status, date]) => (
                <Card key={name} style={{ marginBottom: 8, padding: "10px 14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600 }}>{name}</div>
                      <div style={{ fontSize: 10, color: c.textSec }}>Due: {date}</div>
                      <div style={{ fontSize: 15, fontWeight: 800, marginTop: 4 }}>{amt}</div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <Badge label={status} bg={status === "Paid" ? c.successBg : c.warningBg} color={status === "Paid" ? c.success : c.warning} />
                      {status !== "Paid" && <div style={{ marginTop: 6 }}><Btn label="Mark Paid" bg={c.success} color="#fff" small /></div>}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  // ── INVENTORY ──────────────────────────────────────────────────────────────
  const Inventory = () => {
    const items = [
      { name: "Solar Panels (400W)", sku: "SKU-SP400", qty: "32 pcs", status: "Allocated", bg: c.infoBg, col: c.info },
      { name: "String Inverter (5kW)", sku: "SKU-INV5K", qty: "8 units", status: "Low Stock", bg: c.warningBg, col: c.warning },
      { name: "Mounting Structure", sku: "SKU-MS001", qty: "15 sets", status: "Available", bg: c.successBg, col: c.success },
      { name: "DC Cable (6mm)", sku: "SKU-DC6", qty: "200 m", status: "Available", bg: c.successBg, col: c.success },
      { name: "AC Distribution Box", sku: "SKU-ADB01", qty: "2 units", status: "Critical", bg: c.dangerBg, col: c.danger },
    ];
    return (
      <div style={{ ...phoneWrap, background: c.bg }}>
        <StatusBar bg={c.status} light />
        <BackHeader title="Inventory & Dispatch" sub="5 item types · 4 low stock" onBack={() => setScreen("dashboard")} color={c.primary} />
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
          <InputField placeholder="Search items..." icon="🔍" />
          <div style={{ display: "flex", gap: 6, marginBottom: 12, flexWrap: "wrap" }}>
            {[["All", c.primary, "#fff"], ["Low Stock", c.warningBg, c.warning], ["Critical", c.dangerBg, c.danger]].map(([l, bg, col]) => (
              <Badge key={l} label={l} bg={bg} color={col} />
            ))}
          </div>
          {items.map((item, i) => (
            <Card key={i} style={{ marginBottom: 10, padding: "12px 14px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{item.name}</div>
                  <div style={{ fontSize: 10, color: c.textTert, marginBottom: 4 }}>{item.sku}</div>
                  <div style={{ fontSize: 15, fontWeight: 800, color: c.text }}>{item.qty}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 8 }}>
                  <Badge label={item.status} bg={item.bg} color={item.col} />
                  <Btn label={item.status === "Available" ? "Allocate" : "Reorder"} bg={item.status === "Available" ? c.infoBg : c.primary} color={item.status === "Available" ? c.info : "#fff"} small />
                </div>
              </div>
            </Card>
          ))}
          <div style={{ marginTop: 8 }}>
            <Btn label="🚚 Dispatch Selected Items →" bg={c.primary} color="#fff" full />
          </div>
        </div>
        <BottomNav items={navItems} active={2} onNav={() => setScreen("dashboard")} primary={c.primary} />
      </div>
    );
  };

  // ── APPROVALS ──────────────────────────────────────────────────────────────
  const Approvals = () => (
    <div style={{ ...phoneWrap, background: c.bg }}>
      <StatusBar bg={c.status} light />
      <div style={{ background: "#fff", padding: "12px 16px", boxShadow: "0 2px 8px rgba(0,0,0,0.05)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: c.primary }}>Approvals</div>
          <div style={{ fontSize: 10, color: c.textSec }}>5 items pending action</div>
        </div>
        <Badge label="5 Pending" bg={c.dangerBg} color={c.danger} />
      </div>
      {/* Tabs */}
      <div style={{ background: "#fff", display: "flex", borderBottom: `1px solid ${c.border}` }}>
        {["Quotes", "Tasks", "Payments"].map((t, i) => (
          <button key={t} style={{ flex: 1, padding: "10px 0", fontSize: 12, fontWeight: i === 0 ? 700 : 400, color: i === 0 ? c.primary : c.textSec, background: "none", border: "none", borderBottom: i === 0 ? `2px solid ${c.primary}` : "2px solid transparent", cursor: "pointer", fontFamily: "inherit" }}>{t}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
        <SectionLabel label="Quotation Approvals" color={c.primary} />
        {[
          { code: "SF-092", cust: "Sunita Reddy", amt: "₹1,82,000", size: "8kW", date: "Submitted Apr 7" },
          { code: "SF-091", cust: "Vikram Bose", amt: "₹95,000", size: "4kW", date: "Submitted Apr 6" },
        ].map(q => (
          <Card key={q.code} style={{ marginBottom: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 12, fontWeight: 700 }}>{q.code}</span>
              <span style={{ fontSize: 10, color: c.textSec }}>{q.date}</span>
            </div>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 2 }}>{q.cust}</div>
            <div style={{ fontSize: 11, color: c.textSec, marginBottom: 8 }}>System: {q.size} · Bengaluru</div>
            <div style={{ background: c.bg, borderRadius: 8, padding: "8px 10px", marginBottom: 10 }}>
              <div style={{ fontSize: 10, color: c.textSec }}>Quoted Amount</div>
              <div style={{ fontSize: 20, fontWeight: 800, color: c.primary }}>{q.amt}</div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              <Btn label="✓ Approve" bg={c.success} color="#fff" />
              <Btn label="✗ Reject" bg={c.dangerBg} color={c.danger} />
            </div>
          </Card>
        ))}
        <SectionLabel label="Blocked Tasks" color={c.primary} />
        {[["Install inverter mount", "Rahul Anand", "SF-089", c.dangerBg, c.danger, "Blocked"], ["Survey roof", "Meena Pillai", "SF-086", c.warningBg, c.warning, "Pending"]].map(([t, who, proj, bg, col, st]) => (
          <Card key={t} style={{ marginBottom: 8, padding: "10px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{t}</div>
                <div style={{ fontSize: 10, color: c.textSec }}>{who} · {proj}</div>
              </div>
              <Badge label={st} bg={bg} color={col} />
            </div>
          </Card>
        ))}
      </div>
      <BottomNav items={navItems} active={0} onNav={() => setScreen("dashboard")} primary={c.primary} />
    </div>
  );

  const screens = { dashboard: <Dashboard />, projects: <ProjectsList />, "project-detail": <ProjectDetail />, inventory: <Inventory />, approvals: <Approvals /> };
  return screens[screen] || <Dashboard />;
}

// ════════════════════════════════════════════════════════════════════════════
// ████████████████████   TECHNICIAN APP   ████████████████████████████████████
// ════════════════════════════════════════════════════════════════════════════

function TechApp({ onSwitch }) {
  const c = DS.tech;
  const [screen, setScreen] = useState("dashboard");
  const [activeTab, setActiveTab] = useState(0);
  const [taskTab, setTaskTab] = useState(0);
  const [isOffline, setIsOffline] = useState(false);

  const tasks = [
    { title: "Install mounting brackets", id: "T-001", status: "Done", priority: false },
    { title: "Run DC wiring harness", id: "T-002", status: "Done", priority: false },
    { title: "Mount solar panels (10 units)", id: "T-003", status: "Active", priority: true },
    { title: "Install string inverter", id: "T-004", status: "Locked", priority: false },
    { title: "Commission system & test", id: "T-005", status: "Locked", priority: false },
  ];

  const navItems = [
    { icon: "⊞", label: "Today" }, { icon: "📋", label: "Tasks" },
    { icon: "📷", label: "Photos" }, { icon: "📝", label: "Notes" }, { icon: "☰", label: "More" },
  ];

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  const TechDash = () => (
    <div style={{ ...phoneWrap, background: c.bg }}>
      <StatusBar bg={c.status} light />
      {isOffline && <OfflineBanner c={c} />}
      {/* Header */}
      <div style={{ background: c.primary, padding: "12px 16px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 13, color: "rgba(255,255,255,0.7)", marginBottom: 2 }}>Good morning,</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>Rahul Anand</div>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 }}>Field Technician · ID: TECH-042</div>
          </div>
          <button onClick={() => setIsOffline(!isOffline)} style={{ background: isOffline ? c.offlineBg : "rgba(255,255,255,0.2)", border: "none", borderRadius: 8, padding: "6px 10px", cursor: "pointer", fontSize: 11, fontWeight: 700, color: isOffline ? c.offline : "#fff", fontFamily: "inherit" }}>
            {isOffline ? "⚠ Offline" : "● Online"}
          </button>
        </div>
        {/* Today summary */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginTop: 14 }}>
          {[["Jobs Today", "2"], ["Tasks Left", "3"], ["Photos", "12"]].map(([l, v]) => (
            <div key={l} style={{ background: "rgba(255,255,255,0.15)", borderRadius: 10, padding: "8px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>{v}</div>
              <div style={{ fontSize: 9, color: "rgba(255,255,255,0.7)" }}>{l}</div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
        <SectionLabel label="Today's Jobs" color={c.primary} />
        {/* Active job card */}
        <div style={{ background: "#fff", borderRadius: 14, border: `2px solid ${c.primary}`, padding: 14, marginBottom: 10, boxShadow: "0 2px 12px rgba(212,122,8,0.15)" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
            <div>
              <Badge label="🔥 Priority" bg={c.primaryLt} color={c.primary} />
              <div style={{ fontSize: 14, fontWeight: 700, marginTop: 6 }}>SF-2024-089</div>
              <div style={{ fontSize: 11, color: c.textSec }}>Ravi Kumar · Koramangala</div>
            </div>
            <div style={{ fontSize: 24 }}>🏗</div>
          </div>
          <ProgressBar value={2} max={5} color={c.primary} />
          <div style={{ fontSize: 10, color: c.textSec, marginTop: 4, marginBottom: 10 }}>Task 3/5 — Mount solar panels</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <Btn label="▶ Continue" bg={c.primary} color="#fff" onClick={() => setScreen("project")} />
            <Btn label="🗺 Navigate" bg={c.primaryLt} color={c.primary} />
          </div>
        </div>
        {/* Second job */}
        <Card style={{ marginBottom: 10, padding: "12px 14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>SF-2024-090</div>
              <div style={{ fontSize: 11, color: c.textSec }}>Anita Verma · Whitefield</div>
            </div>
            <Badge label="Scheduled" bg={c.infoBg} color={c.info} />
          </div>
          <div style={{ fontSize: 10, color: c.textTert }}>2:00 PM — Survey & Inspection</div>
        </Card>
        <SectionLabel label="Pending Sync" color={c.primary} />
        <Card style={{ padding: "10px 14px" }}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 22 }}>{isOffline ? "⚠" : "✅"}</span>
            <div>
              <div style={{ fontSize: 12, fontWeight: 700 }}>{isOffline ? "3 items queued" : "All synced"}</div>
              <div style={{ fontSize: 10, color: c.textSec }}>{isOffline ? "Will upload when online" : "Last sync: just now"}</div>
            </div>
          </div>
        </Card>
      </div>
      <BottomNav items={navItems} active={0} onNav={i => { setActiveTab(i); if (i === 1) setScreen("project"); }} primary={c.primary} />
    </div>
  );

  // ── PROJECT / TASK EXECUTION ───────────────────────────────────────────────
  const TechProject = () => (
    <div style={{ ...phoneWrap, background: c.bg }}>
      <StatusBar bg={c.status} light />
      {isOffline && <OfflineBanner c={c} />}
      <BackHeader title="SF-2024-089" sub="Ravi Kumar · Stage 4 — Installation" onBack={() => setScreen("dashboard")} color={c.primary}
        badge={<div style={{ fontSize: 20, cursor: "pointer" }} onClick={() => setScreen("escalate")}>🚨</div>}
      />
      {/* Tabs */}
      <div style={{ background: "#fff", display: "flex", borderBottom: `1px solid ${c.border}` }}>
        {["Checklist", "Photos", "Notes", "Inventory"].map((t, i) => (
          <button key={t} onClick={() => setTaskTab(i)} style={{ flex: 1, padding: "10px 0", fontSize: 10, fontWeight: i === taskTab ? 700 : 400, color: i === taskTab ? c.primary : c.textSec, background: "none", border: "none", borderBottom: i === taskTab ? `2px solid ${c.primary}` : "2px solid transparent", cursor: "pointer", fontFamily: "inherit" }}>{t}</button>
        ))}
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
        {taskTab === 0 && (
          <div>
            <div style={{ background: c.primaryLt, borderRadius: 10, padding: "8px 12px", marginBottom: 12, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: c.primary }}>2/5 tasks completed</span>
              <ProgressBar value={2} max={5} color={c.primary} />
            </div>
            {tasks.map((task, i) => {
              const isDone = task.status === "Done";
              const isActive = task.status === "Active";
              const isLocked = task.status === "Locked";
              return (
                <Card key={i} style={{ marginBottom: 8, padding: "12px 14px", opacity: isLocked ? 0.6 : 1, border: isActive ? `2px solid ${c.primary}` : "none" }}>
                  <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                    <div style={{
                      width: 24, height: 24, borderRadius: 99, flexShrink: 0,
                      background: isDone ? c.success : isActive ? c.primary : c.border,
                      display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, color: "#fff",
                    }}>{isDone ? "✓" : isLocked ? "🔒" : isActive ? "▶" : i + 1}</div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: isDone ? c.textSec : c.text, textDecoration: isDone ? "line-through" : "none" }}>{task.title}</div>
                      <div style={{ fontSize: 10, color: c.textTert }}>{task.id} {task.priority && "· 🔥 Priority"}</div>
                    </div>
                    {isActive && <Btn label="Done ✓" bg={c.primary} color="#fff" small />}
                  </div>
                </Card>
              );
            })}
            <div style={{ marginTop: 12, background: c.border, borderRadius: 10, padding: "10px 14px", display: "flex", gap: 6, alignItems: "center" }}>
              <span style={{ fontSize: 14 }}>ℹ</span>
              <span style={{ fontSize: 11, color: c.textSec }}>Complete task 3 to unlock tasks 4 and 5</span>
            </div>
          </div>
        )}
        {taskTab === 1 && (
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Photo Evidence</span>
              <Btn label="📷 Capture" bg={c.primary} color="#fff" small />
            </div>
            {[["Roof assessment — Before", "Uploaded ✓", c.successBg, c.success], ["Mounting brackets installed", "Uploaded ✓", c.successBg, c.success], ["Panel placement layout", "Uploading 67%", c.primaryLt, c.primary], ["DC wiring complete", "Queued ⚡", isOffline ? c.warningBg : c.infoBg, isOffline ? c.warning : c.info]].map(([name, status, bg, col]) => (
              <Card key={name} style={{ marginBottom: 8, padding: "10px 14px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 48, height: 48, borderRadius: 8, background: c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>📷</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{name}</div>
                    <Badge label={status} bg={bg} color={col} size={9} />
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
        {taskTab === 2 && (
          <div>
            <div style={{ background: "#fff", borderRadius: 10, border: `1px solid ${c.border}`, padding: 12, marginBottom: 12 }}>
              <InputField placeholder="Add a note, observation, or issue..." />
              <div style={{ display: "flex", gap: 8 }}>
                <Btn label="📝 Text" bg={c.bg} color={c.textSec} small />
                <Btn label="📷 Photo" bg={c.bg} color={c.textSec} small />
                <Btn label="🎤 Voice" bg={c.bg} color={c.textSec} small />
              </div>
            </div>
            {[["10:32 AM", "Wiring complete at panel 4. Need extra cable ties.", "Rahul Anand"], ["09:14 AM", "Roof surface checked — no asbestos. Safe to proceed.", "Rahul Anand"], ["08:45 AM", "Arrived on site. Customer present.", "Rahul Anand"]].map(([time, note, who]) => (
              <Card key={time} style={{ marginBottom: 8, padding: "10px 14px" }}>
                <div style={{ fontSize: 10, color: c.textTert, marginBottom: 4 }}>{time} · {who}</div>
                <div style={{ fontSize: 12, color: c.text }}>{note}</div>
              </Card>
            ))}
          </div>
        )}
        {taskTab === 3 && (
          <div>
            {[["Solar Panels (400W)", "10 pcs", "Received ✓", c.successBg, c.success], ["String Inverter (5kW)", "1 unit", "Received ✓", c.successBg, c.success], ["Mounting Structure", "1 set", "Received ✓", c.successBg, c.success], ["DC Cable (6mm)", "50 m", "Missing ✗", c.warningBg, c.warning], ["Junction Box", "2 units", "Damaged ⚠", c.dangerBg, c.danger]].map(([name, qty, status, bg, col]) => (
              <Card key={name} style={{ marginBottom: 8, padding: "10px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{name}</div>
                    <div style={{ fontSize: 10, color: c.textSec }}>{qty}</div>
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 4 }}>
                    <Badge label={status} bg={bg} color={col} size={9} />
                    {(status.includes("Missing") || status.includes("Damaged")) && <Btn label="Report" bg={c.dangerBg} color={c.danger} small />}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
      {/* Stage complete button */}
      <div style={{ padding: "10px 16px", background: "#fff", borderTop: `1px solid ${c.border}` }}>
        <Btn label="Complete Stage 4 →" bg={c.primary} color="#fff" full />
      </div>
    </div>
  );

  // ── ESCALATE ───────────────────────────────────────────────────────────────
  const Escalate = () => (
    <div style={{ ...phoneWrap, background: c.bg }}>
      <StatusBar bg={c.status} light />
      <BackHeader title="Escalate Issue" sub="SF-2024-089 · Ravi Kumar" onBack={() => setScreen("project")} color={c.primary} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px" }}>
        <div style={{ background: c.dangerBg, borderRadius: 12, padding: "12px 14px", marginBottom: 16, display: "flex", gap: 8 }}>
          <span style={{ fontSize: 20 }}>🚨</span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: c.danger }}>Escalation creates high-priority alert</div>
            <div style={{ fontSize: 11, color: c.textSec, marginTop: 2 }}>Manager is notified immediately via push & SMS</div>
          </div>
        </div>
        <SectionLabel label="Issue Type" color={c.primary} />
        {[["📦 Material Missing", "Required item not delivered or insufficient"], ["🏗 Site Issue", "Unsafe conditions, access problem, or damage"], ["👤 Customer Unavailable", "Cannot proceed without customer presence"], ["⚡ Technical Problem", "Equipment fault or unexpected technical issue"], ["🔒 Safety Concern", "Immediate safety risk — urgent escalation"]].map(([type, desc]) => (
          <Card key={type} style={{ marginBottom: 8, padding: "12px 14px", cursor: "pointer", border: `1.5px solid ${c.border}` }}
            onClick={() => {}}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 2 }}>{type}</div>
            <div style={{ fontSize: 11, color: c.textSec }}>{desc}</div>
          </Card>
        ))}
        <InputField label="Describe the issue" placeholder="What exactly is the problem? Be specific..." />
        <InputField label="Immediate action needed" placeholder="What do you need from the manager?" />
        <Btn label="🚨 Send Escalation Now" bg={c.danger} color="#fff" full />
      </div>
    </div>
  );

  // ── SERIAL NUMBERS ─────────────────────────────────────────────────────────
  const Serials = () => (
    <div style={{ ...phoneWrap, background: c.bg }}>
      <StatusBar bg={c.status} light />
      <BackHeader title="Serial Numbers" sub="Panel verification · 10 required" onBack={() => setScreen("project")} color={c.primary} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
        <div style={{ background: "#fff", borderRadius: 14, border: `2px dashed ${c.primary}`, padding: 20, textAlign: "center", marginBottom: 16, cursor: "pointer" }}>
          <div style={{ fontSize: 36 }}>📷</div>
          <div style={{ fontSize: 14, fontWeight: 700, color: c.primary, marginTop: 6 }}>Scan Barcode</div>
          <div style={{ fontSize: 11, color: c.textSec, marginTop: 2 }}>Point camera at panel barcode</div>
        </div>
        <InputField label="Or enter manually" placeholder="Serial number (e.g. SP400-2024-XXXXX)" icon="✏" />
        <SectionLabel label="Scanned Panels (4/10)" color={c.primary} />
        {[["SP400-2024-00841", "Valid ✓", c.successBg, c.success], ["SP400-2024-00842", "Valid ✓", c.successBg, c.success], ["SP400-2024-00843", "Pending verification ⏳", isOffline ? c.warningBg : c.infoBg, isOffline ? c.warning : c.info], ["SP400-2024-00844", "Duplicate detected ✗", c.dangerBg, c.danger]].map(([serial, status, bg, col]) => (
          <Card key={serial} style={{ marginBottom: 8, padding: "10px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontSize: 12, fontWeight: 600, fontFamily: "monospace" }}>{serial}</span>
              <Badge label={status} bg={bg} color={col} size={9} />
            </div>
          </Card>
        ))}
        {isOffline && (
          <div style={{ background: c.warningBg, borderRadius: 10, padding: "10px 12px", display: "flex", gap: 6 }}>
            <span style={{ fontSize: 14 }}>ℹ</span>
            <span style={{ fontSize: 11, color: c.warning }}>Offline — serials saved locally. Verification will happen on reconnect.</span>
          </div>
        )}
      </div>
    </div>
  );

  const screens = { dashboard: <TechDash />, project: <TechProject />, escalate: <Escalate />, serials: <Serials /> };
  return screens[screen] || <TechDash />;
}

// ════════════════════════════════════════════════════════════════════════════
// ████████████████████   CUSTOMER APP   ██████████████████████████████████████
// ════════════════════════════════════════════════════════════════════════════

function CustomerApp({ onSwitch }) {
  const c = DS.cust;
  const [screen, setScreen] = useState("login");
  const [otp, setOtp] = useState("");
  const [docStates, setDocStates] = useState({ aadhaar: "pending", pan: "approved", bill: "rejected", mandate: null });

  const stages = [
    { name: "Survey", icon: "📐", done: true, date: "Mar 22" },
    { name: "Quotation", icon: "📄", done: true, date: "Mar 25" },
    { name: "KYC Upload", icon: "📂", done: true, date: "Mar 28" },
    { name: "Payment", icon: "💳", done: true, date: "Apr 1" },
    { name: "Dispatch", icon: "🚚", done: true, date: "Apr 3" },
    { name: "Installation", icon: "⚡", done: false, active: true, date: "In Progress" },
    { name: "Inspection", icon: "🔍", done: false, date: "Upcoming" },
    { name: "Handover", icon: "🏠", done: false, date: "Upcoming" },
  ];

  // ── LOGIN ──────────────────────────────────────────────────────────────────
  const Login = () => (
    <div style={{ ...phoneWrap, background: c.bg, justifyContent: "flex-end" }}>
      <StatusBar bg="transparent" light={false} />
      {/* Hero */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "0 32px" }}>
        <div style={{ fontSize: 56, marginBottom: 16 }}>☀️</div>
        <div style={{ fontSize: 28, fontWeight: 800, color: c.primary, textAlign: "center", lineHeight: 1.2 }}>SolarFlow</div>
        <div style={{ fontSize: 14, color: c.textSec, textAlign: "center", marginTop: 6, marginBottom: 40 }}>Track your solar installation journey</div>
        <div style={{ width: "100%", background: "#fff", borderRadius: 16, padding: 24, boxShadow: "0 8px 40px rgba(10,110,78,0.12)" }}>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Enter your mobile number</div>
          <div style={{ fontSize: 11, color: c.textSec, marginBottom: 14 }}>We'll send you a 6-digit OTP</div>
          <InputField placeholder="+91  XXXXX XXXXX" icon="📱" />
          <Btn label="Send OTP →" bg={c.primary} color="#fff" full onClick={() => setScreen("otp")} />
          <div style={{ textAlign: "center", marginTop: 12, fontSize: 11, color: c.textSec }}>
            Your data is encrypted & secure 🔒
          </div>
        </div>
      </div>
      <div style={{ padding: "16px 32px 32px", textAlign: "center" }}>
        <div style={{ fontSize: 10, color: c.textTert }}>By continuing you agree to our Terms & Privacy Policy</div>
      </div>
    </div>
  );

  // ── OTP SCREEN ─────────────────────────────────────────────────────────────
  const OTPScreen = () => (
    <div style={{ ...phoneWrap, background: c.bg }}>
      <StatusBar bg="transparent" light={false} />
      <div style={{ flex: 1, display: "flex", flexDirection: "column", padding: "20px 24px" }}>
        <button onClick={() => setScreen("login")} style={{ background: "none", border: "none", fontSize: 20, cursor: "pointer", color: c.primary, alignSelf: "flex-start", marginBottom: 20 }}>←</button>
        <div style={{ fontSize: 24, fontWeight: 800, color: c.primary, marginBottom: 6 }}>Verify OTP</div>
        <div style={{ fontSize: 13, color: c.textSec, marginBottom: 24 }}>Sent to +91 98765 43210<br />
          <span style={{ fontSize: 11, color: c.textTert }}>Didn't receive? Try WhatsApp OTP or Email OTP</span>
        </div>
        {/* OTP boxes */}
        <div style={{ display: "flex", gap: 10, marginBottom: 24 }}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <div key={i} style={{ flex: 1, height: 52, border: `2px solid ${i < 2 ? c.primary : c.border}`, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, fontWeight: 800, color: c.primary }}>
              {i === 0 ? "4" : i === 1 ? "2" : ""}
            </div>
          ))}
        </div>
        <Btn label="Verify & Login →" bg={c.primary} color="#fff" full onClick={() => setScreen("dashboard")} />
        <div style={{ display: "flex", gap: 10, marginTop: 14 }}>
          <Btn label="💬 WhatsApp OTP" bg={c.bg} color={c.textSec} full outline borderColor={c.border} />
          <Btn label="📧 Email OTP" bg={c.bg} color={c.textSec} full outline borderColor={c.border} />
        </div>
        <div style={{ textAlign: "center", marginTop: 16, fontSize: 12, color: c.textSec }}>
          Resend OTP in <span style={{ fontWeight: 700, color: c.primary }}>28s</span>
        </div>
      </div>
    </div>
  );

  // ── DASHBOARD ──────────────────────────────────────────────────────────────
  const CustDash = () => (
    <div style={{ ...phoneWrap, background: c.bg }}>
      <StatusBar bg={c.status} light />
      {/* Header */}
      <div style={{ background: c.primary, padding: "14px 16px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <div>
            <div style={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>Welcome back,</div>
            <div style={{ fontSize: 20, fontWeight: 800, color: "#fff" }}>Ravi Kumar</div>
          </div>
          <div style={{ position: "relative" }}>
            <div style={{ background: "rgba(255,255,255,0.2)", borderRadius: 10, width: 40, height: 40, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20 }}>🔔</div>
            <div style={{ position: "absolute", top: -2, right: -2, width: 14, height: 14, background: c.amber, borderRadius: 99, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8, fontWeight: 800, color: "#fff" }}>2</div>
          </div>
        </div>
        {/* Active project card */}
        <div style={{ background: "rgba(255,255,255,0.15)", borderRadius: 14, padding: "12px 14px", marginTop: 14 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700, color: "#fff" }}>SF-2024-089 · 5kW Rooftop</span>
            <Badge label="Stage 6/8" bg="rgba(255,255,255,0.25)" color="#fff" />
          </div>
          <ProgressBar value={6} max={8} color={c.amber} bg="rgba(255,255,255,0.2)" />
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)", marginTop: 6 }}>⚡ Installation in progress · Est. completion Apr 15</div>
        </div>
      </div>
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
        {/* Action required */}
        <div style={{ background: c.amberBg, border: `1.5px solid ${c.amber}`, borderRadius: 12, padding: "10px 14px", marginBottom: 12, cursor: "pointer" }} onClick={() => setScreen("kyc")}>
          <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
            <span style={{ fontSize: 22 }}>📂</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: c.warning }}>Action Required</div>
              <div style={{ fontSize: 11, color: c.textSec }}>Electricity bill rejected — re-upload required</div>
            </div>
            <span style={{ marginLeft: "auto", fontSize: 16, color: c.warning }}>→</span>
          </div>
        </div>
        {/* Quick nav */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 14 }}>
          {[["📍 Timeline", "track", c.primaryLt, c.primary], ["📄 Quotation", "quotation", "#EBF3FC", c.info], ["💳 Payments", "payments", c.amberBg, c.amber], ["📂 Documents", "kyc", c.successBg, c.success]].map(([label, scr, bg, col]) => (
            <Card key={label} style={{ padding: "14px 14px", textAlign: "center", background: bg, cursor: "pointer" }} onClick={() => setScreen(scr)}>
              <div style={{ fontSize: 22, marginBottom: 4 }}>{label.split(" ")[0]}</div>
              <div style={{ fontSize: 12, fontWeight: 700, color: col }}>{label.split(" ").slice(1).join(" ")}</div>
            </Card>
          ))}
        </div>
        <SectionLabel label="Recent Updates" color={c.primary} />
        {[["⚡", "Installation started", "Your technician Rahul has started work", "Today, 9:15 AM", c.primaryLt, c.primary], ["🚚", "Materials delivered", "All equipment delivered to your site", "Apr 3, 2:30 PM", c.successBg, c.success], ["✅", "Payment confirmed", "₹70,000 advance payment received", "Apr 1, 11:00 AM", c.amberBg, c.amber]].map(([icon, title, desc, time, bg, col]) => (
          <Card key={title} style={{ marginBottom: 8, padding: "10px 14px" }}>
            <div style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
              <div style={{ width: 36, height: 36, borderRadius: 10, background: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{title}</div>
                <div style={{ fontSize: 10, color: c.textSec, marginTop: 2 }}>{desc}</div>
                <div style={{ fontSize: 9, color: c.textTert, marginTop: 3 }}>{time}</div>
              </div>
            </div>
          </Card>
        ))}
      </div>
      <BottomNav items={[{ icon: "⊞", label: "Home" }, { icon: "📍", label: "Timeline" }, { icon: "💳", label: "Payments" }, { icon: "💬", label: "Support" }]} active={0} onNav={i => { if (i === 1) setScreen("track"); if (i === 2) setScreen("payments"); if (i === 3) setScreen("support"); }} primary={c.primary} />
    </div>
  );

  // ── TIMELINE ───────────────────────────────────────────────────────────────
  const Timeline = () => (
    <div style={{ ...phoneWrap, background: c.bg }}>
      <StatusBar bg={c.status} light />
      <BackHeader title="Installation Timeline" sub="SF-2024-089 · Updated just now" onBack={() => setScreen("dashboard")} color={c.primary} />
      <div style={{ flex: 1, overflowY: "auto", padding: "16px 16px" }}>
        <div style={{ background: c.primaryLt, borderRadius: 10, padding: "8px 12px", marginBottom: 16, display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 14, color: c.success }}>●</span>
          <span style={{ fontSize: 11, fontWeight: 600, color: c.primary }}>Live updates · Last refreshed just now</span>
        </div>
        {/* Timeline */}
        <div style={{ position: "relative", paddingLeft: 40 }}>
          <div style={{ position: "absolute", left: 14, top: 10, bottom: 10, width: 2, background: `linear-gradient(to bottom, ${c.primary} 60%, ${c.border} 100%)` }} />
          {stages.map((stage, i) => (
            <div key={i} style={{ position: "relative", marginBottom: 20 }}>
              <div style={{
                position: "absolute", left: -32, width: 26, height: 26, borderRadius: 99,
                background: stage.done ? c.primary : stage.active ? c.amber : "#fff",
                border: stage.done ? "none" : stage.active ? `2px solid ${c.amber}` : `2px solid ${c.border}`,
                display: "flex", alignItems: "center", justifyContent: "center", fontSize: stage.done ? 12 : 13,
                color: stage.done ? "#fff" : stage.active ? c.amber : c.border,
                boxShadow: stage.active ? `0 0 0 4px ${c.amberBg}` : "none",
              }}>{stage.done ? "✓" : stage.icon}</div>
              <div style={{ background: "#fff", borderRadius: 10, padding: "10px 12px", border: stage.active ? `1.5px solid ${c.amber}` : "none", boxShadow: "0 1px 6px rgba(0,0,0,0.05)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 13, fontWeight: 700, color: stage.done ? c.text : stage.active ? c.warning : c.textTert }}>{stage.name}</span>
                  <span style={{ fontSize: 10, color: stage.active ? c.warning : c.textTert, fontWeight: stage.active ? 700 : 400 }}>{stage.date}</span>
                </div>
                {stage.active && <div style={{ fontSize: 11, color: c.warning, marginTop: 4 }}>⚡ In progress · Technician on site</div>}
                {stage.done && i === 4 && <div style={{ fontSize: 11, color: c.success, marginTop: 4 }}>All materials confirmed delivered</div>}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  // ── QUOTATION ──────────────────────────────────────────────────────────────
  const Quotation = () => (
    <div style={{ ...phoneWrap, background: c.bg }}>
      <StatusBar bg={c.status} light />
      <BackHeader title="Quotation" sub="SF-2024-089 · Approved Apr 25" onBack={() => setScreen("dashboard")} color={c.primary}
        badge={<Badge label="Approved ✓" bg={c.successBg} color={c.success} />}
      />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
        {/* Lock notice */}
        <div style={{ background: c.successBg, borderRadius: 10, padding: "8px 12px", marginBottom: 12, display: "flex", gap: 6 }}>
          <span style={{ fontSize: 14 }}>🔒</span>
          <span style={{ fontSize: 11, color: c.success, fontWeight: 600 }}>Quotation approved and locked on Mar 25, 2024</span>
        </div>
        {/* Summary card */}
        <Card style={{ marginBottom: 12, background: c.primary, color: "#fff" }}>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginBottom: 4 }}>Total Quoted Amount</div>
          <div style={{ fontSize: 32, fontWeight: 800 }}>₹1,40,000</div>
          <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 4 }}>5kW Rooftop Solar · Bengaluru · MNRE Certified</div>
          <div style={{ marginTop: 12, padding: "8px 10px", background: "rgba(255,255,255,0.15)", borderRadius: 8 }}>
            <div style={{ fontSize: 11, color: "rgba(255,255,255,0.8)" }}>Price locked until Apr 30, 2024. No hidden charges.</div>
          </div>
        </Card>
        {/* Line items */}
        <Card style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 700, color: c.textSec, marginBottom: 8 }}>Quotation Breakdown</div>
          {[["Solar Panels (10 × 400W)", "₹60,000"], ["String Inverter (5kW)", "₹28,000"], ["Mounting Structure", "₹12,000"], ["Wiring & Accessories", "₹8,000"], ["Installation & Labour", "₹18,000"], ["GST (18%)", "₹14,000"]].map(([item, amt]) => (
            <div key={item} style={{ display: "flex", justifyContent: "space-between", padding: "7px 0", borderBottom: `0.5px solid ${c.border}` }}>
              <span style={{ fontSize: 12, color: c.text }}>{item}</span>
              <span style={{ fontSize: 12, fontWeight: 600, color: c.text }}>{amt}</span>
            </div>
          ))}
          <div style={{ display: "flex", justifyContent: "space-between", padding: "10px 0 4px", marginTop: 4 }}>
            <span style={{ fontSize: 14, fontWeight: 800 }}>Total</span>
            <span style={{ fontSize: 14, fontWeight: 800, color: c.primary }}>₹1,40,000</span>
          </div>
        </Card>
        {/* Trust badges */}
        <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
          {["🏛 MNRE Certified", "⭐ 5-Year Warranty", "🔒 Secure Payment", "📋 Subsidy Eligible"].map(b => (
            <Badge key={b} label={b} bg={c.primaryLt} color={c.primary} />
          ))}
        </div>
      </div>
    </div>
  );

  // ── KYC / DOCUMENTS ────────────────────────────────────────────────────────
  const KYC = () => {
    const docs = [
      { id: "aadhaar", name: "Aadhaar Card", icon: "🪪", required: true },
      { id: "pan", name: "PAN Card", icon: "📛", required: true },
      { id: "bill", name: "Electricity Bill", icon: "⚡", required: true },
      { id: "mandate", name: "Bank Mandate", icon: "🏦", required: false },
    ];
    const stateConfig = {
      null: { label: "Upload required", bg: c.border, color: c.textTert, icon: "⬆" },
      pending: { label: "Pending review", bg: c.amberBg, color: c.warning, icon: "⏳" },
      approved: { label: "Approved ✓", bg: c.successBg, color: c.success, icon: "✓" },
      rejected: { label: "Rejected — re-upload", bg: c.dangerBg, color: c.danger, icon: "✗" },
    };
    return (
      <div style={{ ...phoneWrap, background: c.bg }}>
        <StatusBar bg={c.status} light />
        <BackHeader title="KYC Documents" sub="3/4 submitted · 1 needs attention" onBack={() => setScreen("dashboard")} color={c.primary} />
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
          <div style={{ background: c.amberBg, borderRadius: 10, padding: "8px 12px", marginBottom: 12, display: "flex", gap: 6 }}>
            <span style={{ fontSize: 14 }}>ℹ</span>
            <span style={{ fontSize: 11, color: c.warning }}>Documents are reviewed within 24 hours. You'll be notified of any changes.</span>
          </div>
          {docs.map(doc => {
            const state = docStates[doc.id];
            const cfg = stateConfig[state];
            return (
              <Card key={doc.id} style={{ marginBottom: 10, padding: "12px 14px", border: state === "rejected" ? `1.5px solid ${c.danger}` : state === "pending" ? `1.5px solid ${c.amber}` : "none" }}>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: state === "approved" ? c.successBg : state === "rejected" ? c.dangerBg : c.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>{doc.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 13, fontWeight: 700 }}>{doc.name}{doc.required && <span style={{ color: c.danger, marginLeft: 2 }}>*</span>}</div>
                    <Badge label={cfg.label} bg={cfg.bg} color={cfg.color} size={9} />
                    {state === "rejected" && <div style={{ fontSize: 10, color: c.danger, marginTop: 4 }}>Reason: Document unclear, please re-upload</div>}
                  </div>
                  <div>
                    {(state === null || state === "rejected") && (
                      <Btn label={state === "rejected" ? "Re-upload" : "Upload"} bg={state === "rejected" ? c.danger : c.primary} color="#fff" small
                        onClick={() => setDocStates(prev => ({ ...prev, [doc.id]: "pending" }))}
                      />
                    )}
                    {state === "approved" && <span style={{ fontSize: 22 }}>✅</span>}
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      </div>
    );
  };

  // ── PAYMENTS ───────────────────────────────────────────────────────────────
  const Payments = () => (
    <div style={{ ...phoneWrap, background: c.bg }}>
      <StatusBar bg={c.status} light />
      <BackHeader title="Payments" sub="SF-2024-089 · ₹70,000 remaining" onBack={() => setScreen("dashboard")} color={c.primary} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
        {/* Summary */}
        <Card style={{ marginBottom: 12, background: c.primary }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 10 }}>
            <div>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Total Project</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: "#fff" }}>₹1,40,000</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: 11, color: "rgba(255,255,255,0.7)" }}>Remaining</div>
              <div style={{ fontSize: 22, fontWeight: 800, color: c.amber }}>₹70,000</div>
            </div>
          </div>
          <ProgressBar value={70000} max={140000} color={c.amber} bg="rgba(255,255,255,0.2)" />
          <div style={{ fontSize: 10, color: "rgba(255,255,255,0.6)", marginTop: 6 }}>50% paid · Dispatch unlocked</div>
        </Card>
        {/* Milestone cards */}
        {[
          { name: "Advance Payment (25%)", amt: "₹35,000", status: "paid", date: "Apr 1, 2024", note: null },
          { name: "Mid-Project (25%)", amt: "₹35,000", status: "paid", date: "Apr 8, 2024", note: null },
          { name: "Completion Payment (50%)", amt: "₹70,000", status: "due", date: "Due Apr 30, 2024", note: "Pay to unlock final inspection & handover" },
        ].map((m, i) => (
          <Card key={i} style={{ marginBottom: 10 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 8 }}>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{m.name}</div>
                <div style={{ fontSize: 10, color: c.textSec, marginTop: 2 }}>{m.date}</div>
                {m.note && <div style={{ fontSize: 10, color: c.warning, marginTop: 4 }}>ℹ {m.note}</div>}
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: 16, fontWeight: 800, color: m.status === "paid" ? c.success : c.warning }}>{m.amt}</div>
                <Badge label={m.status === "paid" ? "Paid ✓" : "Due"} bg={m.status === "paid" ? c.successBg : c.amberBg} color={m.status === "paid" ? c.success : c.warning} size={9} />
              </div>
            </div>
            {m.status !== "paid" && (
              <Btn label="💳 Pay Now — ₹70,000" bg={c.primary} color="#fff" full />
            )}
            {m.status === "paid" && (
              <div style={{ fontSize: 11, color: c.textSec }}>📧 Receipt sent to ravi@email.com</div>
            )}
          </Card>
        ))}
        <div style={{ background: c.border, borderRadius: 10, padding: "8px 12px", display: "flex", gap: 6, alignItems: "center" }}>
          <span style={{ fontSize: 14 }}>🔒</span>
          <span style={{ fontSize: 10, color: c.textSec }}>Payments are secured by 256-bit encryption. UPI, cards & netbanking accepted.</span>
        </div>
      </div>
    </div>
  );

  // ── SUPPORT ─────────────────────────────────────────────────────────────────
  const Support = () => (
    <div style={{ ...phoneWrap, background: c.bg }}>
      <StatusBar bg={c.status} light />
      <BackHeader title="Support" sub="We typically respond within 2 hours" onBack={() => setScreen("dashboard")} color={c.primary} />
      <div style={{ flex: 1, overflowY: "auto", padding: "12px 16px" }}>
        <div style={{ background: c.primaryLt, borderRadius: 12, padding: "12px 14px", marginBottom: 14 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: c.primary }}>🙋 Need help?</div>
          <div style={{ fontSize: 11, color: c.textSec, marginTop: 4 }}>Raise a ticket or call us. Your dedicated manager Priya will assist you.</div>
          <div style={{ display: "flex", gap: 8, marginTop: 10 }}>
            <Btn label="📞 Call Now" bg={c.primary} color="#fff" small />
            <Btn label="💬 WhatsApp" bg="#25D366" color="#fff" small />
          </div>
        </div>
        <SectionLabel label="Raise a Ticket" color={c.primary} />
        <Card style={{ marginBottom: 12 }}>
          <InputField label="Subject" placeholder="What's the issue?" />
          <InputField label="Details" placeholder="Describe your issue in detail..." />
          <div style={{ marginBottom: 14 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: c.textSec, marginBottom: 6 }}>Category</div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {["Billing", "Installation", "Document", "Technical", "Other"].map(cat => (
                <Badge key={cat} label={cat} bg={c.bg} color={c.textSec} />
              ))}
            </div>
          </div>
          <Btn label="Submit Ticket" bg={c.primary} color="#fff" full />
        </Card>
        <SectionLabel label="Your Tickets" color={c.primary} />
        {[["#TKT-001", "Why is my document rejected?", "Resolved ✓", c.successBg, c.success], ["#TKT-002", "Expected completion date query", "In Progress", c.amberBg, c.warning]].map(([id, sub, st, bg, col]) => (
          <Card key={id} style={{ marginBottom: 8, padding: "10px 14px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontSize: 11, color: c.textTert }}>{id}</div>
                <div style={{ fontSize: 12, fontWeight: 600, marginTop: 2 }}>{sub}</div>
              </div>
              <Badge label={st} bg={bg} color={col} size={9} />
            </div>
          </Card>
        ))}
      </div>
    </div>
  );

  const custScreens = { login: <Login />, otp: <OTPScreen />, dashboard: <CustDash />, track: <Timeline />, quotation: <Quotation />, kyc: <KYC />, payments: <Payments />, support: <Support /> };
  return custScreens[screen] || <Login />;
}

// ════════════════════════════════════════════════════════════════════════════
// ██████████████████████   MAIN APP   ████████████████████████████████████████
// ════════════════════════════════════════════════════════════════════════════

export default function SolarFlowApp() {
  const [activeApp, setActiveApp] = useState("admin");

  const tabs = [
    { id: "admin", label: "🛡 Admin", color: DS.admin.primary },
    { id: "tech", label: "⚡ Technician", color: DS.tech.primary },
    { id: "cust", label: "🌞 Customer", color: DS.cust.primary },
  ];

  return (
    <div style={{ minHeight: "100vh", background: "linear-gradient(135deg, #0A0A0F 0%, #1A1025 50%, #0F1A12 100%)", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 20px 48px", fontFamily: "'DM Sans', system-ui, sans-serif" }}>
      {/* Title */}
      <div style={{ textAlign: "center", marginBottom: 28 }}>
        <div style={{ fontSize: 36, fontWeight: 900, color: "#fff", letterSpacing: -1 }}>☀ SolarFlow</div>
        <div style={{ fontSize: 13, color: "rgba(255,255,255,0.45)", marginTop: 4 }}>End-to-End Solar Installation Platform — Interactive Prototype</div>
      </div>
      {/* App switcher */}
      <div style={{ display: "flex", background: "rgba(255,255,255,0.06)", borderRadius: 14, padding: 4, gap: 2, marginBottom: 32, border: "1px solid rgba(255,255,255,0.1)" }}>
        {tabs.map(tab => (
          <button key={tab.id} onClick={() => setActiveApp(tab.id)} style={{
            padding: "10px 20px", borderRadius: 10, border: "none", cursor: "pointer",
            background: activeApp === tab.id ? "#fff" : "transparent",
            color: activeApp === tab.id ? tab.color : "rgba(255,255,255,0.5)",
            fontSize: 13, fontWeight: 700, transition: "all 0.2s", fontFamily: "inherit",
          }}>{tab.label}</button>
        ))}
      </div>
      {/* Phone */}
      <div style={{ position: "relative" }}>
        {/* Phone frame */}
        <div style={{ position: "absolute", inset: -8, borderRadius: 48, background: "linear-gradient(135deg, #2A2A2A, #1A1A1A)", zIndex: 0, boxShadow: "0 60px 120px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.1)" }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          {activeApp === "admin" && <AdminApp onSwitch={setActiveApp} />}
          {activeApp === "tech" && <TechApp onSwitch={setActiveApp} />}
          {activeApp === "cust" && <CustomerApp onSwitch={setActiveApp} />}
        </div>
      </div>
      {/* Label */}
      <div style={{ marginTop: 24, textAlign: "center" }}>
        <div style={{ fontSize: 11, color: "rgba(255,255,255,0.3)" }}>390 × 844 · iPhone 14 Pro · Tap to navigate between screens</div>
        <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 10 }}>
          {tabs.map(tab => (
            <div key={tab.id} style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 99, background: tab.color }} />
              <span style={{ fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{tab.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
