"use client";

import { useState } from "react";

const mockIncidents = [
  { id: "INC-001", type: "Flood Warning", area: "Brgy. 102, District 4", severity: "HIGH", status: "OPEN", reported: "08:14 AM", reporter: "Citizen App" },
  { id: "INC-002", type: "Road Obstruction", area: "Zone A-4, Sector 7", severity: "MEDIUM", status: "ASSIGNED", reported: "07:55 AM", reporter: "Field Officer" },
  { id: "INC-003", type: "Medical Emergency", area: "North Elementary", severity: "CRITICAL", status: "OPEN", reported: "08:30 AM", reporter: "Triage System" },
  { id: "INC-004", type: "Supply Shortage", area: "St. Jude Stadium", severity: "LOW", status: "RESOLVED", reported: "06:40 AM", reporter: "Site Manager" },
];

const mockResources = [
  { name: "Medical Responders", total: 30, deployed: 24, unit: "personnel" },
  { name: "Logistics Personnel", total: 12, deployed: 12, unit: "personnel" },
  { name: "Relief Vehicles", total: 8, deployed: 5, unit: "vehicles" },
  { name: "Potable Water", total: 500, deployed: 420, unit: "liters (x100)" },
  { name: "Trauma Kits", total: 120, deployed: 15, unit: "kits" },
];

const mockSites = [
  { name: "Unity High Gymnasium", capacity: 350, current: 210, status: "ACTIVE" },
  { name: "North Elementary", capacity: 200, current: 198, status: "CRITICAL" },
  { name: "St. Jude Stadium", capacity: 800, current: 340, status: "ACTIVE" },
  { name: "East Coast Gym", capacity: 150, current: 0, status: "STANDBY" },
];

const severityColor: Record<string, string> = {
  CRITICAL: "#c62828", HIGH: "#e65100", MEDIUM: "#f9a825", LOW: "#2e7d32",
};

const statusStyle: Record<string, { bg: string; color: string }> = {
  OPEN: { bg: "#fce4ec", color: "#880e4f" },
  ASSIGNED: { bg: "#e3f2fd", color: "#1565c0" },
  RESOLVED: { bg: "#e8f5e9", color: "#1b5e20" },
};

export default function DispatcherBeforeCalamity() {
  const [activeTab, setActiveTab] = useState<"incidents" | "resources" | "sites">("incidents");
  const [showPlanModal, setShowPlanModal] = useState(false);
  const handleSignOut = () => {
    window.location.href = "/loginportal";
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "#f5f6f8", fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: 200, background: "#fff", borderRight: "1px solid #e8eaed", display: "flex", flexDirection: "column", padding: "0 0 24px" }}>
        <div style={{ padding: "20px 16px 16px", borderBottom: "1px solid #e8eaed" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <div style={{ width: 28, height: 28, background: "#1b5e20", borderRadius: 6, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 700, fontSize: 13 }}>D</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: 13, color: "#1a1f2e" }}>Damayan Portal</div>
              <div style={{ fontSize: 10, color: "#6b7494", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase" }}>Dispatcher</div>
            </div>
          </div>
        </div>
        <nav style={{ flex: 1, padding: "12px 8px" }}>
          {[
            { key: "D", label: "Dashboard", active: true },
            { key: "I", label: "Incidents" },
            { key: "T", label: "Tickets" },
            { key: "R", label: "Resources" },
            { key: "M", label: "Map View" },
            { key: "S", label: "Settings" },
          ].map((item) => (
            <div key={item.key} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "9px 10px",
              borderRadius: 6, marginBottom: 2, cursor: "pointer",
              background: item.active ? "#e8f5e9" : "transparent",
              borderLeft: item.active ? "3px solid #2e7d32" : "3px solid transparent",
            }}>
              <div style={{ width: 22, height: 22, borderRadius: 4, background: item.active ? "#2e7d32" : "#e8eaed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: item.active ? "#fff" : "#6b7494" }}>{item.key}</div>
              <span style={{ fontSize: 13, fontWeight: item.active ? 600 : 400, color: item.active ? "#1b5e20" : "#3c4152" }}>{item.label}</span>
            </div>
          ))}
        </nav>
        <div style={{ padding: "0 8px" }}>
          {["Log Rapid Report", "Support", "Sign Out"].map(label => (
            <div key={label} onClick={label === "Sign Out" ? handleSignOut : undefined} style={{ padding: "8px 10px", fontSize: 12, color: "#6b7494", cursor: "pointer" }}>{label}</div>
          ))}
        </div>
      </aside>

      {/* Main */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Topbar */}
        <header style={{ background: "#fff", borderBottom: "1px solid #e8eaed", padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <span style={{ fontWeight: 600, fontSize: 14, color: "#1a1f2e" }}>Humanitarian Response</span>
            <nav style={{ display: "flex", gap: 4 }}>
              {["Phases", "Resources", "Team"].map(t => (
                <button key={t} style={{ padding: "6px 14px", borderRadius: 6, border: "none", background: t === "Phases" ? "#f0f2f7" : "transparent", fontSize: 13, fontWeight: t === "Phases" ? 600 : 400, color: "#3c4152", cursor: "pointer" }}>{t}</button>
              ))}
            </nav>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#e8eaed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>N</div>
            <div style={{ width: 30, height: 30, borderRadius: "50%", background: "#e8eaed", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 600 }}>H</div>
            <button style={{ padding: "7px 16px", background: "#2e7d32", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Deploy Team</button>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#e65100", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>DS</div>
          </div>
        </header>

        {/* Content */}
        <main style={{ flex: 1, padding: "28px 28px 40px", overflowY: "auto" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
            <span style={{ background: "#fff3e0", border: "1px solid #f9a825", color: "#795000", fontSize: 10, fontWeight: 700, padding: "4px 10px", borderRadius: 4, letterSpacing: "0.06em" }}>PHASE 1</span>
            <span style={{ fontSize: 12, color: "#6b7494", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase" }}>Active Preparedness Mode</span>
          </div>
          <h1 style={{ fontSize: 36, fontWeight: 800, color: "#1a1f2e", marginBottom: 6, lineHeight: 1.1 }}>Dispatch Command<br />Center</h1>
          <p style={{ color: "#6b7494", fontSize: 14, marginBottom: 24 }}>Dispatcher: <strong>Metro Cluster 3</strong>. Monitor incoming incidents, pre-position resources, and coordinate response teams ahead of forecasted weather event.</p>

          {/* KPI row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 12, marginBottom: 24 }}>
            {[
              { label: "Open Incidents", value: "3", sub: "2 high severity", accent: "#e65100" },
              { label: "Active Tickets", value: "11", sub: "4 unassigned", accent: "#1565c0" },
              { label: "Teams Deployed", value: "7/9", sub: "2 on standby", accent: "#2e7d32" },
              { label: "Response Readiness", value: "88%", sub: "Target: 90%", accent: "#6a1b9a" },
            ].map(k => (
              <div key={k.label} style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, padding: "16px 20px" }}>
                <div style={{ fontSize: 11, color: "#6b7494", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.06em", marginBottom: 6 }}>{k.label}</div>
                <div style={{ fontSize: 28, fontWeight: 800, color: k.accent, lineHeight: 1 }}>{k.value}</div>
                <div style={{ fontSize: 11, color: "#9aa3b2", marginTop: 4 }}>{k.sub}</div>
              </div>
            ))}
          </div>

          {/* Banner */}
          <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, padding: "16px 20px", marginBottom: 20, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 4 }}>Dispatch Readiness Checklist</div>
              <div style={{ fontSize: 13, color: "#6b7494" }}>Complete all checklist items before active response phase begins.</div>
            </div>
            <button onClick={() => setShowPlanModal(true)} style={{ padding: "9px 20px", background: "#2e7d32", color: "#fff", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>View Response Plan →</button>
          </div>

          {/* Tabs */}
          <div style={{ display: "flex", gap: 4, marginBottom: 16, borderBottom: "2px solid #e8eaed" }}>
            {(["incidents", "resources", "sites"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: "10px 18px", border: "none", borderRadius: "6px 6px 0 0",
                background: activeTab === tab ? "#fff" : "transparent",
                borderBottom: activeTab === tab ? "2px solid #2e7d32" : "2px solid transparent",
                fontWeight: activeTab === tab ? 700 : 500, fontSize: 13, cursor: "pointer",
                color: activeTab === tab ? "#1b5e20" : "#6b7494", textTransform: "capitalize",
              }}>{tab === "incidents" ? "Incidents & Reports" : tab === "resources" ? "Resources" : "Relief Sites"}</button>
            ))}
          </div>

          {/* Incidents */}
          {activeTab === "incidents" && (
            <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #e8eaed", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Incoming Incidents</span>
                <button style={{ padding: "7px 14px", background: "#e65100", color: "#fff", border: "none", borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: "pointer" }}>+ Log Incident</button>
              </div>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "#f5f6f8" }}>
                    {["ID", "Type", "Area", "Severity", "Status", "Reported", "Reporter", "Action"].map(h => (
                      <th key={h} style={{ padding: "10px 16px", textAlign: "left", fontSize: 10, fontWeight: 700, color: "#6b7494", textTransform: "uppercase", letterSpacing: "0.06em" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {mockIncidents.map((inc, i) => (
                    <tr key={inc.id} style={{ borderTop: "1px solid #f0f2f7", background: i % 2 === 0 ? "#fff" : "#fafbfc" }}>
                      <td style={{ padding: "12px 16px", fontSize: 12, fontFamily: "monospace", fontWeight: 600 }}>{inc.id}</td>
                      <td style={{ padding: "12px 16px", fontSize: 13, fontWeight: 500 }}>{inc.type}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b7494" }}>{inc.area}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: severityColor[inc.severity] + "22", color: severityColor[inc.severity], fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4 }}>{inc.severity}</span>
                      </td>
                      <td style={{ padding: "12px 16px" }}>
                        <span style={{ background: statusStyle[inc.status].bg, color: statusStyle[inc.status].color, fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4 }}>{inc.status}</span>
                      </td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b7494" }}>{inc.reported}</td>
                      <td style={{ padding: "12px 16px", fontSize: 12, color: "#6b7494" }}>{inc.reporter}</td>
                      <td style={{ padding: "12px 16px" }}>
                        <button style={{ padding: "5px 12px", background: "#e3f2fd", color: "#1565c0", border: "1px solid #90caf9", borderRadius: 5, fontSize: 11, fontWeight: 600, cursor: "pointer" }}>Assign →</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          {/* Resources */}
          {activeTab === "resources" && (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              {mockResources.map(r => {
                const pct = Math.round((r.deployed / r.total) * 100);
                const color = pct > 90 ? "#c62828" : pct > 70 ? "#e65100" : "#2e7d32";
                return (
                  <div key={r.name} style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                      <span style={{ fontWeight: 600, fontSize: 14 }}>{r.name}</span>
                      <span style={{ fontSize: 12, color: "#6b7494" }}>{r.deployed}/{r.total} {r.unit}</span>
                    </div>
                    <div style={{ background: "#f0f2f7", borderRadius: 4, height: 8, marginBottom: 6 }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: color, borderRadius: 4 }} />
                    </div>
                    <div style={{ fontSize: 11, color, fontWeight: 600 }}>{pct}% deployed</div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Sites */}
          {activeTab === "sites" && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12 }}>
              {mockSites.map(s => {
                const pct = s.capacity > 0 ? Math.round((s.current / s.capacity) * 100) : 0;
                const statusColors: Record<string, string> = { ACTIVE: "#2e7d32", CRITICAL: "#c62828", STANDBY: "#6b7494" };
                return (
                  <div key={s.name} style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, padding: "18px 20px" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                      <div style={{ fontWeight: 700, fontSize: 14 }}>{s.name}</div>
                      <span style={{ background: statusColors[s.status] + "22", color: statusColors[s.status], fontSize: 10, fontWeight: 700, padding: "3px 8px", borderRadius: 4 }}>{s.status}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7494", marginBottom: 10 }}>Capacity: {s.current} / {s.capacity} evacuees</div>
                    <div style={{ background: "#f0f2f7", borderRadius: 4, height: 8 }}>
                      <div style={{ width: `${pct}%`, height: "100%", background: statusColors[s.status], borderRadius: 4 }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </main>
      </div>

      {/* Modal */}
      {showPlanModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 32, width: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 8 }}>Response Plan — Metro Cluster 3</h2>
            <p style={{ color: "#6b7494", fontSize: 13, marginBottom: 20 }}>Pre-configured dispatch plan for Typhoon 09B readiness phase.</p>
            {["Pre-position medical teams at Brgy. 102 & Zone A-4", "Ensure all vehicles are fueled and GPS-tagged", "Sync QR verification with site managers at 3 sites", "Confirm comms channel with Admin dashboard", "Set 30-minute check-in intervals for field teams"].map((item, i) => (
              <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                <div style={{ width: 20, height: 20, borderRadius: "50%", background: "#e8f5e9", color: "#2e7d32", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>{i + 1}</div>
                <span style={{ fontSize: 13, color: "#3c4152" }}>{item}</span>
              </div>
            ))}
            <button onClick={() => setShowPlanModal(false)} style={{ marginTop: 16, width: "100%", padding: "12px", background: "#2e7d32", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer" }}>Confirm & Close</button>
          </div>
        </div>
      )}
    </div>
  );
}
