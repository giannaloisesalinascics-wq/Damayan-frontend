"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { clearSession, hasRole, loadSession } from "../../lib/session";
import {
  createIncidentReport,
  createManualCheckIn,
  getCapacity,
  getDisasterEvents,
  getIncidentReports,
  getInventory,
} from "../../lib/api";
import type {
  AuthSession,
  CapacityCenter,
  DisasterEvent,
  IncidentReport,
  InventoryItem,
} from "../../lib/types";

// ─── Fallback data ───────────────────────────────────────────────────────────

const FALLBACK_RESOURCES: InventoryItem[] = [
  { id: "1", name: "Potable Water", category: "Water", quantity: 15000, unit: "Liters", status: "available" },
  { id: "2", name: "Trauma Kits", category: "Medical", quantity: 54, unit: "Units", status: "low_stock" },
  { id: "3", name: "Mobile Power", category: "Equipment", quantity: 8, unit: "Units", status: "available" },
];

const FALLBACK_SHELTERS: CapacityCenter[] = [
  { id: "1", name: "North Elementary", address: "", municipality: "", barangay: "", capacity: 100, currentOccupancy: 98, availableSlots: 2, utilizationRate: 98, status: "active" },
  { id: "2", name: "St. Jude Stadium", address: "", municipality: "", barangay: "", capacity: 100, currentOccupancy: 45, availableSlots: 55, utilizationRate: 45, status: "active" },
  { id: "3", name: "East Coast Gym", address: "", municipality: "", barangay: "", capacity: 100, currentOccupancy: 0, availableSlots: 100, utilizationRate: 0, status: "inactive" },
];

const FALLBACK_FEED: IncidentReport[] = [
  { id: "1", disasterId: "", reportedBy: "", title: "Bridge Warning", content: "Bridge in Sector 7 reported unstable. Rerouting team Bravo-2.", severity: "high", location: "Sector 7", status: "pending", createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString() },
  { id: "2", disasterId: "", reportedBy: "", title: "Team Deployment", content: "Team Delta arrived at South Shelter. Starting health screenings.", severity: "moderate", location: "South Shelter", status: "resolved", createdAt: new Date(Date.now() - 25 * 60 * 1000).toISOString() },
  { id: "3", disasterId: "", reportedBy: "", title: "Resource Received", content: "Food supplies batch #901 received at central hub.", severity: "low", location: "Central Hub", status: "resolved", createdAt: new Date(Date.now() - 40 * 60 * 1000).toISOString() },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shelterTone(rate: number, status: string): string {
  if (status === "inactive" || rate === 0) return "muted";
  if (rate >= 85) return "error";
  return "primary";
}

function shelterLevel(rate: number, status: string): string {
  if (status === "inactive") return "Inactive";
  return `${Math.round(rate)}% Full`;
}

function feedTone(severity: string): string {
  if (severity === "critical" || severity === "high") return "warning";
  if (severity === "moderate") return "primary";
  return "neutral";
}

function feedIcon(severity: string): string {
  if (severity === "critical" || severity === "high") return "!";
  if (severity === "moderate") return "D";
  return "R";
}

function feedTimeLabel(iso: string, severity: string): string {
  const d = new Date(iso);
  const time = d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const tag =
    severity === "high" || severity === "critical"
      ? "WARNING"
      : severity === "moderate"
        ? "DEPLOYMENT"
        : "RESOURCE";
  return `${time} – ${tag}`;
}

function resourceTone(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("low") || s.includes("critical") || s.includes("depleted")) return "error";
  return "primary";
}

function resourceAvailability(status: string): string {
  const s = status.toLowerCase();
  if (s.includes("depleted")) return "OUT";
  if (s.includes("low")) return "LOW";
  return "AVAIL";
}

function avatarInitials(session: AuthSession | null): string {
  if (!session) return "SM";
  const f = session.user.firstName?.[0] ?? "";
  const l = session.user.lastName?.[0] ?? "";
  return (f + l).toUpperCase() || "SM";
}

const swimlane = [
  "Evacuee Arrival",
  "Scan QR or Manually Log ID",
  "Update Site Capacity",
  "Manage Relief Distribution",
  "Report Site Incidents",
];

export default function DuringCalamityPage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [checkInMode, setCheckInMode] = useState<"scan" | "manual">("scan");
  const [resources, setResources] = useState<InventoryItem[]>(FALLBACK_RESOURCES);
  const [shelters, setShelters] = useState<CapacityCenter[]>(FALLBACK_SHELTERS);
  const [feed, setFeed] = useState<IncidentReport[]>(FALLBACK_FEED);
  const [activeEvents, setActiveEvents] = useState<DisasterEvent[]>([]);
  const [incidentSeverity, setIncidentSeverity] = useState<"critical" | "high" | "moderate">("high");
  const [checkInName, setCheckInName] = useState("");
  const [checkInId, setCheckInId] = useState("");
  const [incidentType, setIncidentType] = useState("Medical Emergency");
  const [incidentDesc, setIncidentDesc] = useState("");
  const [checkInMsg, setCheckInMsg] = useState<string | null>(null);
  const [incidentMsg, setIncidentMsg] = useState<string | null>(null);

  useEffect(() => {
    const stored = loadSession();
    if (!hasRole(stored, "line_manager")) {
      router.replace("/site-manager/login");
      return;
    }
    setSession(stored);

    async function hydrate() {
      if (!stored) return;
      const token = stored.accessToken;
      const [invResult, capResult, irResult, evResult] = await Promise.allSettled([
        getInventory("site-manager", token),
        getCapacity(token),
        getIncidentReports(token),
        getDisasterEvents("site-manager", token),
      ]);
      if (invResult.status === "fulfilled" && invResult.value.length > 0) setResources(invResult.value.slice(0, 3));
      if (capResult.status === "fulfilled" && capResult.value.length > 0) setShelters(capResult.value);
      if (irResult.status === "fulfilled" && irResult.value.length > 0) setFeed(irResult.value.slice(0, 5));
      if (evResult.status === "fulfilled") setActiveEvents(evResult.value.filter((e) => e.status === "active"));
    }

    hydrate();
  }, [router]);

  const totalDisplaced = shelters.reduce((sum, s) => sum + s.currentOccupancy, 0);
  const activeSheltersCount = shelters.filter((s) => s.status !== "inactive").length;
  const activeAlertCount = feed.filter((r) => r.status === "pending").length;
  const firstActiveEventId = activeEvents[0]?.id ?? "";

  async function handleCheckInSubmit(e: FormEvent) {
    e.preventDefault();
    if (!session || !checkInId.trim()) return;
    const nameParts = checkInName.trim().split(" ");
    try {
      await createManualCheckIn(session.accessToken, {
        evacueeNumber: checkInId.trim(),
        firstName: nameParts[0] ?? "",
        lastName: nameParts.slice(1).join(" ") || undefined,
      });
      setCheckInMsg("Check-in logged successfully.");
      setCheckInName("");
      setCheckInId("");
    } catch {
      setCheckInMsg("Failed to save. Please try again.");
    }
  }

  async function handleIncidentSubmit(e: FormEvent) {
    e.preventDefault();
    if (!session || !incidentDesc.trim()) return;
    try {
      const report = await createIncidentReport(session.accessToken, {
        disasterId: firstActiveEventId,
        reportedBy: session.user.id,
        title: incidentType,
        content: incidentDesc.trim(),
        severity: incidentSeverity,
        location: session.user.name ?? "On-site",
      });
      setFeed((prev) => [report, ...prev.slice(0, 4)]);
      setIncidentMsg("Incident report submitted.");
      setIncidentDesc("");
    } catch {
      setIncidentMsg("Failed to submit. Please try again.");
    }
  }

  function handleSignOut() {
    clearSession();
    router.replace("/site-manager/login");
  }

  return (
    <div className="response-page">
      <aside className="response-sidebar">
        <div className="response-sidebar-inner">
          <div>
            <div className="response-brand">
              <div className="response-brand-mark">D</div>
              <div>
                <div className="response-brand-name">Damayan Portal</div>
                <p className="response-brand-subtitle">Site Manager</p>
              </div>
            </div>

            <nav className="response-nav">
              <button className="is-active" type="button">
                <span className="response-nav-icon">D</span>
                <span>Dashboard</span>
              </button>
              <button type="button">
                <span className="response-nav-icon">A</span>
                <span>Assessment</span>
              </button>
              <button type="button">
                <span className="response-nav-icon">P</span>
                <span>Distribution</span>
              </button>
              <button type="button">
                <span className="response-nav-icon">R</span>
                <span>Recovery</span>
              </button>
              <button type="button">
                <span className="response-nav-icon">I</span>
                <span>Impact Reports</span>
              </button>
              <button type="button">
                <span className="response-nav-icon">S</span>
                <span>Settings</span>
              </button>
            </nav>
          </div>

          <div className="response-sidebar-footer">
            <button className="response-primary-action" type="button">
              Log Rapid Report
            </button>
            <button type="button">Support</button>
            <button className="response-signout-link" type="button" onClick={handleSignOut}>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      <main className="response-main">
        <header className="preparedness-topbar">
          <div className="topbar-left">
            <span className="topbar-title">Evacuation Management</span>
            <div className="topbar-search">
              <span className="topbar-search-icon">S</span>
              <input
                type="text"
                placeholder="Search evacuees or shelters..."
              />
            </div>
          </div>

          <div className="topbar-center">
            <button className="is-active" type="button">Phases</button>
            <button type="button">Resources</button>
            <button type="button">Team</button>
          </div>

          <div className="topbar-right">
            <span className="topbar-divider" />
            <div className="topbar-avatar">{avatarInitials(session)}</div>
          </div>
        </header>

        <div className="response-content">
          <section className="response-hero">
            <div>
              <div className="response-phase-row">
                <span className="response-phase-badge">
                  Phase 2: Active Response
                </span>
                <div className="response-critical-timer">
                  <span className="response-critical-dot" />
                  <span>
                    {activeEvents.length > 0
                      ? `Active Event: ${activeEvents[0].name}`
                      : "Critical Window: 04:22:10 remaining"}
                  </span>
                </div>
              </div>
              <h1>Live Status Map</h1>
              <p>
                Live operational view of{" "}
                {activeEvents.length > 0
                  ? `${activeEvents[0].name} (${activeEvents[0].type})`
                  : "Typhoon 09B"}{" "}
                impact zone. Resources are being prioritized for affected areas.
              </p>
            </div>

            <div className="response-summary-grid">
              <div className="response-summary-card">
                <span>Total Displaced</span>
                <strong>{totalDisplaced.toLocaleString()}</strong>
              </div>
              <div className="response-summary-card">
                <span>Active Shelters</span>
                <strong>{activeSheltersCount}/{shelters.length}</strong>
              </div>
            </div>
          </section>

          <section className="swimlane-card">
            <div className="swimlane-header">
              <div>
                <h2>Dashboard Guide</h2>
                <p>
                  This view follows the daily process: evacuee arrival, identity
                  capture, site capacity updates, relief distribution, and
                  incident reporting.
                </p>
              </div>
              <Link className="swimlane-back-link" href="/site-manager/beforecalamity">
                Back to Before Calamity
              </Link>
            </div>

            <div className="swimlane-track">
              {swimlane.map((step, index) => (
                <div className="swimlane-step" key={step}>
                  <div className="swimlane-node">{index + 1}</div>
                  <div className="swimlane-copy">
                    <strong>{step}</strong>
                    {index === 1 ? (
                      <span>Supports both QR scan and manual ID logging.</span>
                    ) : index === 3 ? (
                      <span>Relief allocation stays tied to site capacity.</span>
                    ) : (
                      <span>Operational checkpoint in the active response path.</span>
                    )}
                  </div>
                  {index < swimlane.length - 1 ? (
                    <div className="swimlane-arrow" aria-hidden="true" />
                  ) : null}
                </div>
              ))}
            </div>
          </section>

          <section className="scanner-flow-card">
            <div className="scanner-flow-header">
              <div>
                <h2>Evacuee Check-in Station</h2>
                <p>
                  Active intake point for arrivals. Operators can scan
                  QR codes or switch to manual logging when needed.
                </p>
              </div>
              <div className="scanner-flow-status">
                <span className="scanner-flow-dot" />
                <span>Scanner Live</span>
              </div>
            </div>

            <div className="scanner-flow-grid">
              <article className="scanner-device-card">
                <div className="scanner-screen">
                  <div className="scanner-frame">
                    <div className="scanner-corners scanner-corner-top-left" />
                    <div className="scanner-corners scanner-corner-top-right" />
                    <div className="scanner-corners scanner-corner-bottom-left" />
                    <div className="scanner-corners scanner-corner-bottom-right" />
                    <div className="scanner-line" />
                    <div className="scanner-qr-pattern" />
                  </div>
                </div>
                <div className="scanner-device-footer">
                  <strong>QR Check-in Camera</strong>
                  <span>Camera aligned and ready for ID scanning.</span>
                </div>
              </article>

              <div className="scanner-decision-card">
                <div className="scanner-decision-diamond">
                  <span>Has QR Code / App?</span>
                </div>
                <div className="scanner-path-grid">
                  <div 
                    className={`scanner-path-card ${checkInMode === "scan" ? "active" : ""}`}
                    onClick={() => setCheckInMode("scan")}
                    style={{ cursor: "pointer" }}
                  >
                    <strong>Yes</strong>
                    <p>Scan QR</p>
                  </div>
                  <div 
                    className={`scanner-path-card ${checkInMode === "manual" ? "active" : ""}`}
                    onClick={() => setCheckInMode("manual")}
                    style={{ cursor: "pointer" }}
                  >
                    <strong>No</strong>
                    <p>Manually Log ID</p>
                  </div>
                </div>
                <div className="scanner-followup">
                  {checkInMode === "scan"
                    ? "Scanner active. Use the camera to capture evacuee QR codes."
                    : "Manual backup active. Enter evacuee details below."}
                </div>
              </div>

              <form className="scanner-manual-card" onSubmit={handleCheckInSubmit}>
                <h3>Manual Intake Backup</h3>
                <div className="manual-field">
                  <label>Evacuee Name</label>
                  <input
                    placeholder="Enter full name"
                    type="text"
                    value={checkInName}
                    onChange={(e) => setCheckInName(e.target.value)}
                  />
                </div>
                <div className="manual-field">
                  <label>Temporary ID</label>
                  <input
                    placeholder="Assign or enter ID"
                    type="text"
                    value={checkInId}
                    onChange={(e) => setCheckInId(e.target.value)}
                  />
                </div>
                {checkInMsg && <p style={{ fontSize: "0.75rem", marginBottom: "0.5rem" }}>{checkInMsg}</p>}
                <button type="submit">Save Manual Entry</button>
              </form>
            </div>
          </section>

          <section className="incident-report-card">
            <div className="incident-report-header">
              <div>
                <h2>Report Site Incident</h2>
                <p>Log critical events, supply shortages, or medical emergencies immediately.</p>
              </div>
              <div className="incident-count-badge">
                {activeAlertCount > 0 ? `${activeAlertCount} active alert${activeAlertCount > 1 ? "s" : ""}` : "No active alerts"}
              </div>
            </div>

            <form className="incident-report-form" onSubmit={handleIncidentSubmit}>
              <div className="incident-form-grid">
                <div className="manual-field">
                  <label>Incident Type</label>
                  <select
                    className="incident-select"
                    value={incidentType}
                    onChange={(e) => setIncidentType(e.target.value)}
                  >
                    <option>Medical Emergency</option>
                    <option>Supply Shortage</option>
                    <option>Infrastructure Damage</option>
                    <option>Security/Conflict</option>
                    <option>Other</option>
                  </select>
                </div>
                <div className="manual-field">
                  <label>Severity Level</label>
                  <div className="severity-toggle">
                    <button
                      type="button"
                      className={`severity-btn critical${incidentSeverity === "critical" ? " active" : ""}`}
                      onClick={() => setIncidentSeverity("critical")}
                    >Critical</button>
                    <button
                      type="button"
                      className={`severity-btn high${incidentSeverity === "high" ? " active" : ""}`}
                      onClick={() => setIncidentSeverity("high")}
                    >High</button>
                    <button
                      type="button"
                      className={`severity-btn moderate${incidentSeverity === "moderate" ? " active" : ""}`}
                      onClick={() => setIncidentSeverity("moderate")}
                    >Moderate</button>
                  </div>
                </div>
              </div>
              <div className="manual-field">
                <label>Incident Description</label>
                <textarea
                  className="incident-textarea"
                  placeholder="Describe the situation in detail..."
                  value={incidentDesc}
                  onChange={(e) => setIncidentDesc(e.target.value)}
                />
              </div>
              {incidentMsg && <p style={{ fontSize: "0.75rem", marginBottom: "0.5rem" }}>{incidentMsg}</p>}
              <button type="submit" className="incident-submit-btn">Submit Incident Report</button>
            </form>
          </section>

          <section className="response-grid">
            <div className="response-left-column">
              <div className="response-map-card">
                <div className="response-map-banner">
                  <span className="response-map-banner-icon">M</span>
                  <span>Terrain View: Active Flood Markers</span>
                </div>

                <div className="response-map-controls">
                  <button type="button">+</button>
                  <button type="button">-</button>
                </div>

                <div className="response-map-legend">
                  <div>
                    <span className="legend-dot legend-error" />
                    <span>Zone A-4: Severe Flooding</span>
                  </div>
                  <div>
                    <span className="legend-dot legend-safe" />
                    <span>Evacuation Routes Clear</span>
                  </div>
                </div>

                <button className="response-expand-button" type="button">
                  Expand Operations Map
                </button>

                <div className="response-map-surface">
                  <div className="response-map-grid" />
                  <div className="response-map-water" />
                  <div className="response-map-hotspot" />
                  <div className="response-map-route" />
                </div>
              </div>

              <div className="response-resource-grid">
                {resources.map((resource) => {
                  const tone = resourceTone(resource.status);
                  const avail = resourceAvailability(resource.status);
                  const pct = tone === "error" ? 20 : 85;
                  return (
                    <article className="response-resource-card" key={resource.id}>
                      <div className="response-resource-top">
                        <div className={`resource-icon resource-${tone}`}>
                          {resource.name.charAt(0).toUpperCase()}
                        </div>
                        <span className={`resource-label resource-${tone}`}>
                          {resource.quantity.toLocaleString()} {resource.unit} – {avail}
                        </span>
                      </div>
                      <h3>{resource.name}</h3>
                      <div className="resource-progress-track">
                        <div
                          className={`resource-progress-fill resource-${tone}`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>

            <aside className="response-right-column">
              <div className="response-shelter-card">
                <div className="response-panel-header">
                  <h3>Shelter Load</h3>
                  <button type="button">Details</button>
                </div>

                <div className="response-shelter-list">
                  {shelters.map((shelter) => {
                    const tone = shelterTone(shelter.utilizationRate, shelter.status);
                    return (
                      <article
                        className={`response-shelter-item shelter-${tone}`}
                        key={shelter.id}
                      >
                        <div className="response-shelter-row">
                          <span>{shelter.name}</span>
                          <strong>{shelterLevel(shelter.utilizationRate, shelter.status)}</strong>
                        </div>
                        <div className="response-shelter-track">
                          <div
                            className={`response-shelter-fill shelter-fill-${tone}`}
                            style={{ width: `${Math.min(100, shelter.utilizationRate)}%` }}
                          />
                        </div>
                      </article>
                    );
                  })}
                </div>
              </div>

              <div className="response-feed-card">
                <div className="response-panel-header">
                  <h3>Live Activity</h3>
                  <span className="response-live-indicator" />
                </div>

                <div className="response-feed-list">
                  {feed.map((item) => (
                    <article className="response-feed-item" key={item.id}>
                      <div className={`feed-icon feed-${feedTone(item.severity)}`}>{feedIcon(item.severity)}</div>
                      <div>
                        <span className="response-feed-time">{feedTimeLabel(item.createdAt, item.severity)}</span>
                        <p>{item.content}</p>
                      </div>
                    </article>
                  ))}
                </div>

                <button className="response-history-button" type="button">
                  View Past Alerts
                </button>
              </div>
            </aside>
          </section>
        </div>

        <button className="response-fab" type="button">
          <span>!</span>
          <span className="response-fab-label">Broadcast Alert</span>
        </button>
      </main>
    </div>
  );
}
