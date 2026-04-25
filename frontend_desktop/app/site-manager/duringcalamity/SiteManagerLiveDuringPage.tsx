"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearSession,
  hasRole,
  loadSession,
  saveSession,
} from "../../lib/session";
import {
  ApiError,
  createIncidentReport,
  createManualCheckIn,
  getCapacity,
  getDisasterEvents,
  getIncidentReports,
  getInventory,
  getProfile,
  getRecentCheckIns,
} from "../../lib/api";
import type {
  AuthSession,
  CapacityCenter,
  CheckInRecord,
  DisasterEvent,
  IncidentReport,
  InventoryItem,
} from "../../lib/types";

const initialCheckInForm = {
  evacueeNumber: "",
  firstName: "",
  lastName: "",
  zone: "",
  location: "",
};

const initialIncidentForm = {
  title: "",
  content: "",
  severity: "high",
  location: "",
  disasterId: "",
};

export default function SiteManagerLiveDuringPage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [capacity, setCapacity] = useState<CapacityCenter[]>([]);
  const [recentCheckIns, setRecentCheckIns] = useState<CheckInRecord[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [disasters, setDisasters] = useState<DisasterEvent[]>([]);
  const [checkInForm, setCheckInForm] = useState(initialCheckInForm);
  const [incidentForm, setIncidentForm] = useState(initialIncidentForm);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submittingCheckIn, setSubmittingCheckIn] = useState(false);
  const [submittingIncident, setSubmittingIncident] = useState(false);

  useEffect(() => {
    const stored = loadSession();

    if (!hasRole(stored, "line_manager")) {
      clearSession();
      router.replace("/site-manager/login");
      return;
    }

    setSession(stored);

    async function hydrate(activeSession: AuthSession) {
      try {
        const [profile, inventoryRows, centers, recent, incidentRows, eventList] =
          await Promise.all([
            getProfile(activeSession.accessToken),
            getInventory("site-manager", activeSession.accessToken),
            getCapacity(activeSession.accessToken),
            getRecentCheckIns(activeSession.accessToken, 8),
            getIncidentReports(activeSession.accessToken),
            getDisasterEvents("site-manager", activeSession.accessToken),
          ]);

        const nextSession = { ...activeSession, user: profile.user };
        saveSession(nextSession);
        setSession(nextSession);
        setInventory(inventoryRows);
        setCapacity(centers);
        setRecentCheckIns(
          recent.map((item) => ({
            ...item,
            fullName:
              item.fullName || `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim(),
          })),
        );
        setIncidents(incidentRows);
        setDisasters(eventList);
        setIncidentForm((current) => ({
          ...current,
          disasterId:
            current.disasterId ||
            eventList.find((event) => event.status.toLowerCase() === "active")?.id ||
            eventList[0]?.id ||
            "",
        }));
        setError(null);
      } catch (caughtError) {
        setError(
          caughtError instanceof ApiError
            ? caughtError.message
            : "Unable to load the active response view.",
        );
      } finally {
        setLoading(false);
      }
    }

    void hydrate(stored);
  }, [router]);

  async function refreshLists(activeSession: AuthSession) {
    const [recent, incidentRows] = await Promise.all([
      getRecentCheckIns(activeSession.accessToken, 8),
      getIncidentReports(activeSession.accessToken),
    ]);

    setRecentCheckIns(
      recent.map((item) => ({
        ...item,
        fullName:
          item.fullName || `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim(),
      })),
    );
    setIncidents(incidentRows);
  }

  async function handleCheckInSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) {
      return;
    }

    try {
      setSubmittingCheckIn(true);
      setSuccess(null);
      setError(null);
      await createManualCheckIn(session.accessToken, checkInForm);
      await refreshLists(session);
      setCheckInForm(initialCheckInForm);
      setSuccess("Manual evacuee check-in saved.");
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiError
          ? caughtError.message
          : "Unable to save the manual check-in.",
      );
    } finally {
      setSubmittingCheckIn(false);
    }
  }

  async function handleIncidentSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!session) {
      return;
    }

    try {
      setSubmittingIncident(true);
      setSuccess(null);
      setError(null);
      await createIncidentReport(session.accessToken, {
        disasterId: incidentForm.disasterId,
        reportedBy: session.user.authUserId ?? session.user.id,
        title: incidentForm.title,
        content: incidentForm.content,
        severity: incidentForm.severity,
        location: incidentForm.location,
      });
      await refreshLists(session);
      setIncidentForm((current) => ({ ...initialIncidentForm, disasterId: current.disasterId }));
      setSuccess("Incident report submitted.");
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiError
          ? caughtError.message
          : "Unable to submit the incident report.",
      );
    } finally {
      setSubmittingIncident(false);
    }
  }

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8fafc" }}>
        <p style={{ color: "#334155", fontSize: 18 }}>Loading active response data...</p>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  const activeDisaster =
    disasters.find((event) => event.status.toLowerCase() === "active") ?? disasters[0];
  const strainedCenters = capacity.filter((center) => center.utilizationRate >= 80).slice(0, 4);
  const watchInventory = inventory.filter((item) => item.status === "low").slice(0, 4);

  return (
    <main style={{ minHeight: "100vh", background: "linear-gradient(180deg, #eff6ff 0%, #f8fafc 100%)", color: "#0f172a", padding: "32px 24px 48px" }}>
      <section style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gap: 24 }}>
        <div style={{ borderRadius: 28, padding: 24, background: "linear-gradient(135deg, #1d4ed8 0%, #0f172a 85%)", color: "#eff6ff", display: "flex", justifyContent: "space-between", gap: 16, flexWrap: "wrap" }}>
          <div style={{ maxWidth: 760 }}>
            <p style={{ margin: 0, color: "#93c5fd", fontSize: 12, letterSpacing: 1.2, textTransform: "uppercase" }}>Active Response</p>
            <h1 style={{ margin: "10px 0 12px", fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.08 }}>
              Live site operations using real incident and check-in endpoints.
            </h1>
            <p style={{ margin: 0, color: "#dbeafe", lineHeight: 1.6 }}>
              {activeDisaster
                ? `${activeDisaster.name} is the current operational focus in ${activeDisaster.province}.`
                : "No active disaster event is loaded yet."}
            </p>
          </div>
          <div style={{ display: "grid", gap: 12, justifyItems: "end" }}>
            <button type="button" onClick={() => router.push("/site-manager/beforecalamity")} style={{ border: 0, borderRadius: 999, padding: "12px 18px", fontWeight: 700, cursor: "pointer", background: "#eff6ff", color: "#1d4ed8" }}>Back to preparedness</button>
            <button type="button" onClick={() => { clearSession(); router.replace("/site-manager/login"); }} style={{ border: "1px solid rgba(219, 234, 254, 0.24)", borderRadius: 999, padding: "12px 18px", fontWeight: 700, cursor: "pointer", background: "transparent", color: "#eff6ff" }}>Sign out</button>
          </div>
        </div>

        {error ? <div style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca", borderRadius: 18, padding: 16 }}>{error}</div> : null}
        {success ? <div style={{ background: "#ecfdf5", color: "#166534", border: "1px solid #bbf7d0", borderRadius: 18, padding: 16 }}>{success}</div> : null}

        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
          {[
            ["Recent check-ins", `${recentCheckIns.length}`, "New arrivals listed below from the backend feed."],
            ["Open incidents", `${incidents.filter((incident) => incident.status !== "closed").length}`, "Incident report queue synchronized from Supabase."],
            ["Strained centers", `${strainedCenters.length}`, "Centers at or above 80% utilization."],
            ["Low-stock items", `${watchInventory.length}`, "Inventory watchlist for immediate action."],
          ].map(([label, value, detail], index) => (
            <article key={label} style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid rgba(37, 99, 235, 0.08)", boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)", borderTop: `4px solid ${["#2563eb", "#ef4444", "#f97316", "#14b8a6"][index]}` }}>
              <div style={{ color: "#475569", fontSize: 14 }}>{label}</div>
              <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8 }}>{value}</div>
              <div style={{ color: "#64748b", marginTop: 8 }}>{detail}</div>
            </article>
          ))}
        </div>

        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "minmax(0, 1.1fr) minmax(0, 1.1fr) minmax(320px, 0.9fr)" }}>
          <form onSubmit={handleCheckInSubmit} style={{ background: "#fff", borderRadius: 24, padding: 20, border: "1px solid rgba(15, 23, 42, 0.08)", boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)", display: "grid", gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 24 }}>Manual evacuee intake</h2>
            <input value={checkInForm.evacueeNumber} onChange={(event) => setCheckInForm((current) => ({ ...current, evacueeNumber: event.target.value }))} placeholder="Evacuee number or temporary ID" required style={inputStyle} />
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
              <input value={checkInForm.firstName} onChange={(event) => setCheckInForm((current) => ({ ...current, firstName: event.target.value }))} placeholder="First name" style={inputStyle} />
              <input value={checkInForm.lastName} onChange={(event) => setCheckInForm((current) => ({ ...current, lastName: event.target.value }))} placeholder="Last name" style={inputStyle} />
            </div>
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
              <input value={checkInForm.zone} onChange={(event) => setCheckInForm((current) => ({ ...current, zone: event.target.value }))} placeholder="Zone" style={inputStyle} />
              <input value={checkInForm.location} onChange={(event) => setCheckInForm((current) => ({ ...current, location: event.target.value }))} placeholder="Location / shelter" style={inputStyle} />
            </div>
            <button type="submit" disabled={submittingCheckIn} style={primaryButtonStyle}>
              {submittingCheckIn ? "Saving..." : "Save manual check-in"}
            </button>
          </form>

          <form onSubmit={handleIncidentSubmit} style={{ background: "#fff", borderRadius: 24, padding: 20, border: "1px solid rgba(15, 23, 42, 0.08)", boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)", display: "grid", gap: 12 }}>
            <h2 style={{ margin: 0, fontSize: 24 }}>Incident report</h2>
            <select value={incidentForm.disasterId} onChange={(event) => setIncidentForm((current) => ({ ...current, disasterId: event.target.value }))} required style={inputStyle}>
              <option value="">Select disaster event</option>
              {disasters.map((event) => (
                <option key={event.id} value={event.id}>{event.name}</option>
              ))}
            </select>
            <input value={incidentForm.title} onChange={(event) => setIncidentForm((current) => ({ ...current, title: event.target.value }))} placeholder="Incident title" required style={inputStyle} />
            <textarea value={incidentForm.content} onChange={(event) => setIncidentForm((current) => ({ ...current, content: event.target.value }))} placeholder="Describe the incident" required style={{ ...inputStyle, minHeight: 120, resize: "vertical" }} />
            <div style={{ display: "grid", gap: 12, gridTemplateColumns: "repeat(2, minmax(0, 1fr))" }}>
              <select value={incidentForm.severity} onChange={(event) => setIncidentForm((current) => ({ ...current, severity: event.target.value }))} style={inputStyle}>
                {[
                  ["low", "Low"],
                  ["moderate", "Moderate"],
                  ["high", "High"],
                  ["critical", "Critical"],
                ].map(([value, label]) => <option key={value} value={value}>{label}</option>)}
              </select>
              <input value={incidentForm.location} onChange={(event) => setIncidentForm((current) => ({ ...current, location: event.target.value }))} placeholder="Incident location" required style={inputStyle} />
            </div>
            <button type="submit" disabled={submittingIncident} style={secondaryButtonStyle}>
              {submittingIncident ? "Submitting..." : "Submit incident"}
            </button>
          </form>

          <aside style={{ display: "grid", gap: 20 }}>
            <section style={{ background: "#fff", borderRadius: 24, padding: 20, border: "1px solid rgba(15, 23, 42, 0.08)", boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)" }}>
              <h2 style={{ margin: 0, fontSize: 22 }}>Center strain</h2>
              <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
                {(strainedCenters.length ? strainedCenters : capacity.slice(0, 4)).map((center) => (
                  <div key={center.id} style={{ padding: 14, borderRadius: 16, background: "#f8fafc" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                      <strong>{center.name}</strong>
                      <span style={{ color: center.utilizationRate >= 95 ? "#b91c1c" : center.utilizationRate >= 80 ? "#c2410c" : "#0f766e", fontWeight: 700 }}>{center.utilizationRate}%</span>
                    </div>
                    <div style={{ marginTop: 8, color: "#64748b" }}>{center.currentOccupancy} / {center.capacity} occupants</div>
                  </div>
                ))}
              </div>
            </section>

            <section style={{ background: "#fff", borderRadius: 24, padding: 20, border: "1px solid rgba(15, 23, 42, 0.08)", boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)" }}>
              <h2 style={{ margin: 0, fontSize: 22 }}>Low-stock watch</h2>
              <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
                {(watchInventory.length ? watchInventory : inventory.slice(0, 4)).map((item) => (
                  <div key={item.id} style={{ padding: 14, borderRadius: 16, background: item.status === "low" ? "#fff7ed" : "#f0fdfa" }}>
                    <strong>{item.name}</strong>
                    <div style={{ marginTop: 8, color: "#64748b" }}>{item.quantity} {item.unit} • {item.category}</div>
                  </div>
                ))}
              </div>
            </section>
          </aside>
        </div>

        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))" }}>
          <section style={{ background: "#fff", borderRadius: 24, padding: 20, border: "1px solid rgba(15, 23, 42, 0.08)", boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)" }}>
            <h2 style={{ margin: 0, fontSize: 22 }}>Recent check-ins</h2>
            <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
              {recentCheckIns.map((item) => (
                <div key={item.id} style={{ padding: 14, borderRadius: 16, background: "#f8fafc" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <strong>{item.fullName || "Unidentified evacuee"}</strong>
                    <span style={{ color: item.status === "checked-in" ? "#0f766e" : "#64748b", fontWeight: 700 }}>{item.status}</span>
                  </div>
                  <div style={{ marginTop: 8, color: "#64748b" }}>{item.zone || "Unassigned zone"} • {item.location || "Unknown shelter"}</div>
                </div>
              ))}
            </div>
          </section>

          <section style={{ background: "#fff", borderRadius: 24, padding: 20, border: "1px solid rgba(15, 23, 42, 0.08)", boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)" }}>
            <h2 style={{ margin: 0, fontSize: 22 }}>Incident queue</h2>
            <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
              {incidents.slice(0, 6).map((incident) => (
                <div key={incident.id} style={{ padding: 14, borderRadius: 16, background: "#f8fafc" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                    <strong>{incident.title}</strong>
                    <span style={{ color: incident.status === "closed" ? "#64748b" : "#b91c1c", fontWeight: 700 }}>{incident.status}</span>
                  </div>
                  <div style={{ marginTop: 8, color: "#475569", lineHeight: 1.6 }}>{incident.content}</div>
                  <div style={{ marginTop: 8, color: "#64748b" }}>{incident.location} • {incident.severity}</div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </section>
    </main>
  );
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 14,
  border: "1px solid #cbd5e1",
  padding: "12px 14px",
  font: "inherit",
  color: "#0f172a",
  background: "#fff",
};

const primaryButtonStyle: React.CSSProperties = {
  border: 0,
  borderRadius: 999,
  padding: "12px 16px",
  fontWeight: 700,
  cursor: "pointer",
  background: "#1d4ed8",
  color: "#fff",
};

const secondaryButtonStyle: React.CSSProperties = {
  ...primaryButtonStyle,
  background: "#0f766e",
};