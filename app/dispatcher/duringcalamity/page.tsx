"use client";

import { useState, useEffect } from "react";

type TicketStatus = "UNASSIGNED" | "ASSIGNED" | "IN_PROGRESS" | "RESOLVED";

interface Ticket {
  id: string;
  type: string;
  citizen: string;
  area: string;
  priority: string;
  status: TicketStatus;
  site: string | null;
  programme: string | null;
}

const initialTickets: Ticket[] = [
  { id: "TKT-2201", type: "Medical", citizen: "Juan dela Cruz", area: "Brgy. 102, D4", priority: "CRITICAL", status: "UNASSIGNED", site: null, programme: null },
  { id: "TKT-2202", type: "Food Relief", citizen: "Maria Santos", area: "Zone A-4", priority: "HIGH", status: "ASSIGNED", site: "Unity High Gymnasium", programme: "Food Pack Alpha" },
  { id: "TKT-2203", type: "Evacuation", citizen: "Pedro Reyes", area: "Sector 7", priority: "HIGH", status: "IN_PROGRESS", site: "North Elementary", programme: null },
  { id: "TKT-2204", type: "Water Supply", citizen: "Ana Lim", area: "District 3", priority: "MEDIUM", status: "ASSIGNED", site: "St. Jude Stadium", programme: "Water Tanker 2" },
  { id: "TKT-2205", type: "Medical", citizen: "Carlo Bautista", area: "Brgy. 89, D2", priority: "CRITICAL", status: "UNASSIGNED", site: null, programme: null },
];

const priorityColor: Record<string, string> = {
  CRITICAL: "#c62828", HIGH: "#e65100", MEDIUM: "#f9a825", LOW: "#2e7d32",
};

const statusStyle: Record<TicketStatus, { bg: string; color: string }> = {
  UNASSIGNED: { bg: "#fce4ec", color: "#c62828" },
  ASSIGNED: { bg: "#e3f2fd", color: "#1565c0" },
  IN_PROGRESS: { bg: "#fff3e0", color: "#e65100" },
  RESOLVED: { bg: "#e8f5e9", color: "#1b5e20" },
};

const sites = ["Unity High Gymnasium", "North Elementary", "St. Jude Stadium", "East Coast Gym"];
const programmes = ["Food Pack Alpha", "Medical Response Unit", "Water Tanker 2", "Evacuation Convoy B"];

export default function DispatcherDuringCalamity() {
  const [time, setTime] = useState("04:22:10");
  const [tickets, setTickets] = useState<Ticket[]>(initialTickets);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [selectedSite, setSelectedSite] = useState("");
  const [selectedProgramme, setSelectedProgramme] = useState("");
  const [toast, setToast] = useState<string | null>(null);
  const [showBroadcast, setShowBroadcast] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [filterStatus, setFilterStatus] = useState<TicketStatus | "ALL">("ALL");
  const handleSignOut = () => {
    window.location.href = "/loginportal";
  };
  const [liveLog, setLiveLog] = useState([
    { time: "08:42 AM", type: "WARNING", msg: "Bridge in Sector 7 unstable. Rerouting team Bravo-2." },
    { time: "08:35 AM", type: "DEPLOYMENT", msg: "Team Delta arrived at South Shelter." },
    { time: "08:20 AM", type: "RESOURCE", msg: "Food supplies batch #901 received at central hub." },
    { time: "08:05 AM", type: "ALERT", msg: "Typhoon 09B upgraded — Category 4 landfall imminent." },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(prev => {
        const [h, m, s] = prev.split(":").map(Number);
        let newS = s - 1, newM = m, newH = h;
        if (newS < 0) { newS = 59; newM -= 1; }
        if (newM < 0) { newM = 59; newH -= 1; }
        if (newH < 0) return "00:00:00";
        return [String(newH).padStart(2, "0"), String(newM).padStart(2, "0"), String(newS).padStart(2, "0")].join(":");
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const handleSelectTicket = (ticket: Ticket) => {
    setSelectedTicket(ticket);
    setSelectedSite(ticket.site || "");
    setSelectedProgramme(ticket.programme || "");
  };

  const handleAssign = () => {
    if (!selectedTicket || !selectedSite || !selectedProgramme) return;

    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });

    setTickets(prev => prev.map(t =>
      t.id === selectedTicket.id
        ? { ...t, status: "ASSIGNED", site: selectedSite, programme: selectedProgramme }
        : t
    ));

    setLiveLog(prev => [{
      time: timeStr,
      type: "DEPLOYMENT",
      msg: `${selectedTicket.id} assigned to ${selectedSite} — ${selectedProgramme}.`,
    }, ...prev]);

    showToast(`✓ ${selectedTicket.id} assigned to ${selectedSite}`);
    setSelectedTicket(null);
    setSelectedSite("");
    setSelectedProgramme("");
  };

  const handleMarkResolved = (ticketId: string) => {
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    const ticket = tickets.find(t => t.id === ticketId);

    setTickets(prev => prev.map(t =>
      t.id === ticketId ? { ...t, status: "RESOLVED" } : t
    ));

    setLiveLog(prev => [{
      time: timeStr,
      type: "RESOURCE",
      msg: `${ticketId} marked resolved — ${ticket?.type} for ${ticket?.citizen}.`,
    }, ...prev]);

    showToast(`✓ ${ticketId} marked as resolved`);
    if (selectedTicket?.id === ticketId) setSelectedTicket(null);
  };

  const handleBroadcast = () => {
    if (!broadcastMsg.trim()) return;
    const now = new Date();
    const timeStr = now.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
    setLiveLog(prev => [{
      time: timeStr,
      type: "ALERT",
      msg: `Broadcast sent: "${broadcastMsg}"`,
    }, ...prev]);
    setBroadcastSent(true);
    setTimeout(() => {
      setShowBroadcast(false);
      setBroadcastSent(false);
      setBroadcastMsg("");
    }, 2000);
  };

  const filteredTickets = filterStatus === "ALL"
    ? tickets
    : tickets.filter(t => t.status === filterStatus);

  const unassignedCount = tickets.filter(t => t.status === "UNASSIGNED").length;
  const activeCount = tickets.filter(t => t.status !== "RESOLVED").length;
  const resolvedCount = tickets.filter(t => t.status === "RESOLVED").length;

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
            <button style={{ padding: "7px 16px", background: "#2e7d32", color: "#fff", border: "none", borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: "pointer" }}>Deploy Team</button>
            <div style={{ width: 34, height: 34, borderRadius: "50%", background: "#e65100", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 12, fontWeight: 700, color: "#fff" }}>DS</div>
          </div>
        </header>

        <main style={{ flex: 1, padding: "24px 28px 40px", overflowY: "auto" }}>
          {/* Phase banner */}
          <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 16 }}>
            <span style={{ background: "#e91e63", color: "#fff", fontSize: 10, fontWeight: 700, padding: "5px 12px", borderRadius: 4, letterSpacing: "0.06em" }}>PHASE 2: ACTIVE RESPONSE</span>
            <span style={{ display: "flex", alignItems: "center", gap: 6, color: "#c62828", fontWeight: 700, fontSize: 13 }}>
              <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#c62828", display: "inline-block" }} />
              Critical Window: {time} remaining
            </span>
          </div>

          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20 }}>
            <div>
              <h1 style={{ fontSize: 32, fontWeight: 800, color: "#1a1f2e", lineHeight: 1.1, marginBottom: 6 }}>Active Dispatch<br />Operations</h1>
              <p style={{ color: "#6b7494", fontSize: 13 }}>Typhoon 09B — Metro Cluster 3. Assign tickets, monitor missions, coordinate field teams.</p>
            </div>
            <div style={{ display: "flex", gap: 24 }}>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#c62828" }}>{unassignedCount}</div>
                <div style={{ fontSize: 10, color: "#6b7494", textTransform: "uppercase", letterSpacing: "0.06em" }}>Unassigned</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#1565c0" }}>{activeCount}</div>
                <div style={{ fontSize: 10, color: "#6b7494", textTransform: "uppercase", letterSpacing: "0.06em" }}>Active</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: 28, fontWeight: 800, color: "#2e7d32" }}>{resolvedCount}</div>
                <div style={{ fontSize: 10, color: "#6b7494", textTransform: "uppercase", letterSpacing: "0.06em" }}>Resolved</div>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 320px", gap: 16 }}>
            {/* Ticket queue */}
            <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, overflow: "hidden" }}>
              <div style={{ padding: "14px 20px", borderBottom: "1px solid #e8eaed", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>Relief Ticket Queue</span>
                <div style={{ display: "flex", gap: 6 }}>
                  {(["ALL", "UNASSIGNED", "ASSIGNED", "IN_PROGRESS", "RESOLVED"] as const).map(f => (
                    <button key={f} onClick={() => setFilterStatus(f)} style={{
                      padding: "4px 10px", borderRadius: 20, border: "1px solid",
                      borderColor: filterStatus === f ? "#2e7d32" : "#e8eaed",
                      background: filterStatus === f ? "#e8f5e9" : "#fff",
                      color: filterStatus === f ? "#1b5e20" : "#6b7494",
                      fontSize: 10, fontWeight: 600, cursor: "pointer",
                    }}>{f === "IN_PROGRESS" ? "IN PROGRESS" : f}</button>
                  ))}
                </div>
              </div>

              {filteredTickets.length === 0 && (
                <div style={{ padding: "32px", textAlign: "center", color: "#9aa3b2", fontSize: 13 }}>No tickets match this filter.</div>
              )}

              {filteredTickets.map((ticket, i) => (
                <div key={ticket.id} onClick={() => ticket.status !== "RESOLVED" && handleSelectTicket(ticket)} style={{
                  padding: "14px 20px",
                  borderBottom: i < filteredTickets.length - 1 ? "1px solid #f0f2f7" : "none",
                  cursor: ticket.status === "RESOLVED" ? "default" : "pointer",
                  background: selectedTicket?.id === ticket.id ? "#f0f7ff" : ticket.status === "RESOLVED" ? "#fafbfc" : i % 2 === 0 ? "#fff" : "#fafbfc",
                  display: "flex", alignItems: "center", gap: 12,
                  opacity: ticket.status === "RESOLVED" ? 0.6 : 1,
                  transition: "background 0.15s",
                }}>
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: priorityColor[ticket.priority] + "22", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 11, fontWeight: 700, color: priorityColor[ticket.priority], flexShrink: 0 }}>
                    {ticket.type[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 3 }}>
                      <span style={{ fontWeight: 600, fontSize: 13 }}>{ticket.type}</span>
                      <span style={{ fontFamily: "monospace", fontSize: 11, color: "#6b7494" }}>{ticket.id}</span>
                    </div>
                    <div style={{ fontSize: 12, color: "#6b7494" }}>{ticket.citizen} · {ticket.area}</div>
                    {ticket.site && <div style={{ fontSize: 11, color: "#1565c0", marginTop: 2 }}>→ {ticket.site} {ticket.programme && `· ${ticket.programme}`}</div>}
                  </div>
                  <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 5 }}>
                    <span style={{ background: priorityColor[ticket.priority] + "22", color: priorityColor[ticket.priority], fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 3 }}>{ticket.priority}</span>
                    <span style={{ background: statusStyle[ticket.status].bg, color: statusStyle[ticket.status].color, fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 3 }}>{ticket.status}</span>
                  </div>
                  {ticket.status === "ASSIGNED" && (
                    <button onClick={(e) => { e.stopPropagation(); handleMarkResolved(ticket.id); }} style={{ padding: "5px 10px", background: "#e8f5e9", color: "#1b5e20", border: "1px solid #a5d6a7", borderRadius: 5, fontSize: 10, fontWeight: 600, cursor: "pointer", flexShrink: 0 }}>
                      ✓ Resolve
                    </button>
                  )}
                </div>
              ))}
            </div>

            {/* Right panel */}
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {/* Assign panel */}
              {selectedTicket ? (
                <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, padding: "18px" }}>
                  <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 4 }}>Assign Ticket</div>
                  <div style={{ fontSize: 12, color: "#6b7494", marginBottom: 12, padding: "8px 10px", background: "#f5f6f8", borderRadius: 6 }}>
                    <div><strong style={{ color: "#1a1f2e" }}>{selectedTicket.id}</strong> · {selectedTicket.type}</div>
                    <div style={{ marginTop: 2 }}>{selectedTicket.citizen} · {selectedTicket.area}</div>
                    <div style={{ marginTop: 4 }}>
                      <span style={{ background: priorityColor[selectedTicket.priority] + "22", color: priorityColor[selectedTicket.priority], fontSize: 9, fontWeight: 700, padding: "2px 7px", borderRadius: 3 }}>{selectedTicket.priority}</span>
                    </div>
                  </div>

                  <div style={{ marginBottom: 12 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7494", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Relief Site *</label>
                    <select value={selectedSite} onChange={e => setSelectedSite(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${selectedSite ? "#a5d6a7" : "#e8eaed"}`, borderRadius: 6, fontSize: 13, outline: "none" }}>
                      <option value="">Select site...</option>
                      {sites.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>

                  <div style={{ marginBottom: 16 }}>
                    <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7494", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 5 }}>Programme *</label>
                    <select value={selectedProgramme} onChange={e => setSelectedProgramme(e.target.value)} style={{ width: "100%", padding: "9px 12px", border: `1px solid ${selectedProgramme ? "#a5d6a7" : "#e8eaed"}`, borderRadius: 6, fontSize: 13, outline: "none" }}>
                      <option value="">Select programme...</option>
                      {programmes.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                  </div>

                  <button
                    onClick={handleAssign}
                    disabled={!selectedSite || !selectedProgramme}
                    style={{ width: "100%", padding: "10px", background: selectedSite && selectedProgramme ? "#2e7d32" : "#c8d6c8", color: "#fff", border: "none", borderRadius: 7, fontWeight: 700, fontSize: 13, cursor: selectedSite && selectedProgramme ? "pointer" : "default", marginBottom: 8 }}
                  >
                    Assign & Dispatch
                  </button>
                  <button onClick={() => setSelectedTicket(null)} style={{ width: "100%", padding: "9px", background: "#f0f2f7", color: "#6b7494", border: "none", borderRadius: 7, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Cancel</button>
                </div>
              ) : (
                <div style={{ background: "#fff", border: "1px dashed #e8eaed", borderRadius: 10, padding: "24px 18px", textAlign: "center", color: "#9aa3b2", fontSize: 13 }}>
                  Click any unassigned ticket to assign it
                </div>
              )}

              {/* Live activity */}
              <div style={{ background: "#fff", border: "1px solid #e8eaed", borderRadius: 10, padding: "16px 18px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                  <span style={{ fontWeight: 700, fontSize: 13 }}>Live Activity</span>
                  <span style={{ width: 8, height: 8, borderRadius: "50%", background: "#c62828", display: "inline-block" }} />
                </div>
                <div style={{ maxHeight: 220, overflowY: "auto" }}>
                  {liveLog.map((log, i) => (
                    <div key={i} style={{ display: "flex", gap: 10, marginBottom: 10, alignItems: "flex-start" }}>
                      <div style={{ width: 28, height: 28, borderRadius: "50%", background: log.type === "WARNING" || log.type === "ALERT" ? "#fce4ec" : log.type === "DEPLOYMENT" ? "#e3f2fd" : "#e8f5e9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 700, color: log.type === "WARNING" || log.type === "ALERT" ? "#c62828" : log.type === "DEPLOYMENT" ? "#1565c0" : "#2e7d32", flexShrink: 0 }}>{log.type[0]}</div>
                      <div>
                        <div style={{ fontSize: 10, color: "#9aa3b2" }}>{log.time} · {log.type}</div>
                        <div style={{ fontSize: 12, color: "#3c4152", lineHeight: 1.4 }}>{log.msg}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Broadcast button */}
              <button onClick={() => setShowBroadcast(true)} style={{ width: "100%", padding: "12px", background: "#c62828", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 14, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                <span>⚠</span> Broadcast Alert to All
              </button>
            </div>
          </div>
        </main>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{ position: "fixed", bottom: 28, left: "50%", transform: "translateX(-50%)", background: "#1b5e20", color: "#fff", padding: "12px 24px", borderRadius: 8, fontWeight: 600, fontSize: 13, boxShadow: "0 8px 32px rgba(0,0,0,0.2)", zIndex: 200 }}>
          {toast}
        </div>
      )}

      {/* Broadcast modal */}
      {showBroadcast && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.4)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div style={{ background: "#fff", borderRadius: 12, padding: 32, width: 480, boxShadow: "0 20px 60px rgba(0,0,0,0.2)" }}>
            {broadcastSent ? (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 40, marginBottom: 12 }}>✅</div>
                <div style={{ fontWeight: 800, fontSize: 18, color: "#1b5e20" }}>Broadcast Sent</div>
                <div style={{ color: "#6b7494", fontSize: 13, marginTop: 6 }}>All registered citizens and staff have been notified.</div>
              </div>
            ) : (
              <>
                <h2 style={{ fontWeight: 800, fontSize: 20, marginBottom: 4 }}>Broadcast Emergency Alert</h2>
                <p style={{ color: "#6b7494", fontSize: 13, marginBottom: 20 }}>This message will be sent to all registered citizens and field staff via push notification and SMS.</p>
                <div style={{ marginBottom: 8 }}>
                  <label style={{ fontSize: 11, fontWeight: 600, color: "#6b7494", textTransform: "uppercase", letterSpacing: "0.06em", display: "block", marginBottom: 6 }}>Alert Message</label>
                  <textarea
                    value={broadcastMsg}
                    onChange={e => setBroadcastMsg(e.target.value)}
                    placeholder="Type your emergency message here..."
                    rows={4}
                    style={{ width: "100%", padding: "10px 14px", border: "1.5px solid #e8eaed", borderRadius: 8, fontSize: 13, resize: "none", outline: "none", boxSizing: "border-box" }}
                  />
                </div>
                <div style={{ fontSize: 11, color: "#9aa3b2", marginBottom: 20 }}>{broadcastMsg.length} characters</div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => { setShowBroadcast(false); setBroadcastMsg(""); }} style={{ flex: 1, padding: "11px", background: "#f0f2f7", color: "#6b7494", border: "none", borderRadius: 8, fontWeight: 600, fontSize: 13, cursor: "pointer" }}>Cancel</button>
                  <button onClick={handleBroadcast} disabled={!broadcastMsg.trim()} style={{ flex: 2, padding: "11px", background: broadcastMsg.trim() ? "#c62828" : "#e0c0c0", color: "#fff", border: "none", borderRadius: 8, fontWeight: 700, fontSize: 13, cursor: broadcastMsg.trim() ? "pointer" : "default" }}>
                    Send Broadcast Now
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
