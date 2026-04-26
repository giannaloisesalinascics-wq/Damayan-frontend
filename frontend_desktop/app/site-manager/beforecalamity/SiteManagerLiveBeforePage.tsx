"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  clearSession,
  hasRole,
  loadSession,
  saveSession,
} from "../../lib/session";
import {
  ApiError,
  getCapacity,
  getDashboard,
  getDisasterEvents,
  getInventory,
  getProfile,
  getRecentCheckIns,
} from "../../lib/api";
import type {
  AuthSession,
  CapacityCenter,
  CheckInRecord,
  DashboardOverview,
  DisasterEvent,
  InventoryItem,
} from "../../lib/types";

export default function SiteManagerLiveBeforePage() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [capacity, setCapacity] = useState<CapacityCenter[]>([]);
  const [recentCheckIns, setRecentCheckIns] = useState<CheckInRecord[]>([]);
  const [disasters, setDisasters] = useState<DisasterEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

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
        const [profile, dashboard, inventoryRows, centers, recent, eventList] =
          await Promise.all([
            getProfile(activeSession.accessToken),
            getDashboard("site-manager", activeSession.accessToken),
            getInventory("site-manager", activeSession.accessToken),
            getCapacity(activeSession.accessToken),
            getRecentCheckIns(activeSession.accessToken, 6),
            getDisasterEvents("site-manager", activeSession.accessToken),
          ]);

        const nextSession = {
          ...activeSession,
          user: profile.user,
        };

        saveSession(nextSession);
        setSession(nextSession);
        setOverview(dashboard);
        setInventory(inventoryRows);
        setCapacity(centers);
        setRecentCheckIns(
          recent.map((item) => ({
            ...item,
            fullName:
              item.fullName || `${item.firstName ?? ""} ${item.lastName ?? ""}`.trim(),
          })),
        );
        setDisasters(eventList);
        setError(null);
      } catch (caughtError) {
        if (caughtError instanceof ApiError && caughtError.status === 401) {
          clearSession();
          router.replace("/site-manager/login");
          return;
        }

        setError(
          caughtError instanceof ApiError
            ? caughtError.message
            : "Unable to load the site manager dashboard.",
        );
      } finally {
        setLoading(false);
      }
    }

    void hydrate(stored);
  }, [router]);

  if (loading) {
    return (
      <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", background: "#f8fafc" }}>
        <p style={{ color: "#334155", fontSize: 18 }}>Loading site operations...</p>
      </main>
    );
  }

  if (!session) {
    return null;
  }

  const activeDisaster =
    disasters.find((event) => event.status.toLowerCase() === "active") ?? disasters[0];
  const lowStock = inventory.filter((item) => item.status === "low").slice(0, 4);
  const topCenters = capacity.slice(0, 4);

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "linear-gradient(180deg, #ecfeff 0%, #f8fafc 100%)",
        color: "#0f172a",
        padding: "32px 24px 48px",
      }}
    >
      <section style={{ maxWidth: 1180, margin: "0 auto", display: "grid", gap: 24 }}>
        <div
          style={{
            borderRadius: 28,
            padding: 24,
            background: "linear-gradient(135deg, #0f766e 0%, #164e63 100%)",
            color: "#f0fdfa",
            display: "flex",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ maxWidth: 720 }}>
            <p style={{ margin: 0, color: "#99f6e4", fontSize: 12, textTransform: "uppercase", letterSpacing: 1.2 }}>
              Site Manager Command
            </p>
            <h1 style={{ margin: "10px 0 12px", fontSize: "clamp(2rem, 4vw, 3rem)", lineHeight: 1.08 }}>
              Preparedness dashboard driven by the live backend.
            </h1>
            <p style={{ margin: 0, color: "#ccfbf1", lineHeight: 1.6 }}>
              Signed in as {session.user.name || session.user.email}. The readiness, inventory, capacity, and recent intake panels below now come from the NestJS gateway instead of local arrays.
            </p>
          </div>
          <div style={{ display: "grid", gap: 12, justifyItems: "end" }}>
            <button
              type="button"
              onClick={() => router.push("/site-manager/duringcalamity")}
              style={{ border: 0, borderRadius: 999, padding: "12px 18px", fontWeight: 700, cursor: "pointer", background: "#f0fdfa", color: "#115e59" }}
            >
              Open Active Response
            </button>
            <button
              type="button"
              onClick={() => {
                clearSession();
                router.replace("/site-manager/login");
              }}
              style={{ border: "1px solid rgba(240, 253, 250, 0.28)", borderRadius: 999, padding: "12px 18px", fontWeight: 700, cursor: "pointer", background: "transparent", color: "#f0fdfa" }}
            >
              Sign out
            </button>
          </div>
        </div>

        {error ? (
          <div style={{ background: "#fef2f2", color: "#991b1b", border: "1px solid #fecaca", borderRadius: 18, padding: 16 }}>
            <strong>Backend request failed.</strong>
            <p style={{ margin: "8px 0 0" }}>{error}</p>
          </div>
        ) : null}

        <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))" }}>
          {[
            ["Readiness window", `${Math.max(24, Math.round((overview?.capacity.availableSlots ?? 0) / 10))}h`, "Shelter capacity still available across the network."],
            ["Inventory units", `${overview?.inventory.totalItems ?? 0}`, `${overview?.inventory.lowStockItems ?? 0} items below threshold.`],
            ["Checked-in evacuees", `${overview?.checkIns.totalCheckedIn ?? 0}`, `${overview?.checkIns.totalCheckedOut ?? 0} already checked out.`],
            ["Open centers", `${overview?.capacity.totalCenters ?? 0}`, `${overview?.capacity.fullCenters ?? 0} centers currently full.`],
          ].map(([label, value, detail], index) => (
            <article key={label} style={{ background: "#fff", borderRadius: 20, padding: 20, border: "1px solid rgba(15, 118, 110, 0.08)", boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)", borderTop: `4px solid ${["#0f766e", "#14b8a6", "#2563eb", "#f97316"][index]}` }}>
              <div style={{ color: "#475569", fontSize: 14 }}>{label}</div>
              <div style={{ fontSize: 32, fontWeight: 800, marginTop: 8 }}>{value}</div>
              <div style={{ color: "#64748b", marginTop: 8, lineHeight: 1.5 }}>{detail}</div>
            </article>
          ))}
        </div>

        <div style={{ display: "grid", gap: 20, gridTemplateColumns: "minmax(0, 1.5fr) minmax(320px, 1fr)" }}>
          <section style={{ background: "#fff", borderRadius: 24, padding: 20, border: "1px solid rgba(15, 23, 42, 0.08)", boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "baseline", flexWrap: "wrap" }}>
              <div>
                <h2 style={{ margin: 0, fontSize: 24 }}>Operational focus</h2>
                <p style={{ margin: "8px 0 0", color: "#64748b" }}>Current disaster signal and the next transition to active response.</p>
              </div>
            </div>
            {activeDisaster ? (
              <div style={{ marginTop: 20, padding: 18, borderRadius: 20, background: "linear-gradient(135deg, #ccfbf1 0%, #ecfeff 100%)" }}>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
                  <strong style={{ fontSize: 20 }}>{activeDisaster.name}</strong>
                  <span style={{ padding: "6px 10px", borderRadius: 999, background: "#fff", color: "#0f766e", fontWeight: 700, textTransform: "uppercase", fontSize: 12 }}>
                    {activeDisaster.status}
                  </span>
                </div>
                <p style={{ margin: "10px 0 0", color: "#155e75", lineHeight: 1.6 }}>
                  {activeDisaster.type} in {activeDisaster.province} with severity {activeDisaster.severityLevel}. Affected areas: {activeDisaster.affectedAreas.join(", ") || "No areas listed"}.
                </p>
                <button
                  type="button"
                  onClick={() => router.push("/site-manager/duringcalamity")}
                  style={{ marginTop: 16, border: 0, borderRadius: 999, padding: "12px 16px", fontWeight: 700, cursor: "pointer", background: "#0f766e", color: "#fff" }}
                >
                  Continue to active response
                </button>
              </div>
            ) : (
              <p style={{ marginTop: 20, color: "#64748b" }}>No active disaster event is available yet.</p>
            )}

            <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", marginTop: 20 }}>
              {(lowStock.length ? lowStock : inventory.slice(0, 4)).map((item) => (
                <article key={item.id} style={{ padding: 16, borderRadius: 18, background: item.status === "low" ? "#fff7ed" : "#f0fdfa", border: "1px solid rgba(148, 163, 184, 0.18)" }}>
                  <strong>{item.name}</strong>
                  <div style={{ marginTop: 8, fontSize: 28, fontWeight: 800 }}>{item.quantity}</div>
                  <div style={{ color: "#64748b" }}>{item.unit} • {item.category}</div>
                  <div style={{ marginTop: 8, color: item.status === "low" ? "#c2410c" : "#047857", fontWeight: 700, textTransform: "uppercase", fontSize: 12 }}>
                    {item.status}
                  </div>
                </article>
              ))}
            </div>
          </section>

          <aside style={{ display: "grid", gap: 20 }}>
            <section style={{ background: "#fff", borderRadius: 24, padding: 20, border: "1px solid rgba(15, 23, 42, 0.08)", boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)" }}>
              <h2 style={{ margin: 0, fontSize: 22 }}>Shelter load</h2>
              <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
                {topCenters.length ? (
                  topCenters.map((center) => (
                    <div key={center.id} style={{ padding: 14, borderRadius: 16, background: "#f8fafc" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <strong>{center.name}</strong>
                        <span style={{ color: center.status === "full" ? "#b91c1c" : center.status === "high" ? "#c2410c" : "#0f766e", fontWeight: 700 }}>
                          {center.utilizationRate}%
                        </span>
                      </div>
                      <div style={{ marginTop: 8, height: 10, borderRadius: 999, background: "#e2e8f0", overflow: "hidden" }}>
                        <div style={{ width: `${center.utilizationRate}%`, height: "100%", background: center.status === "full" ? "#ef4444" : center.status === "high" ? "#f97316" : "#14b8a6" }} />
                      </div>
                      <div style={{ color: "#64748b", marginTop: 8 }}>{center.currentOccupancy} / {center.capacity} occupants</div>
                    </div>
                  ))
                ) : (
                  <p style={{ margin: 0, color: "#64748b" }}>No capacity records are available yet.</p>
                )}
              </div>
            </section>

            <section style={{ background: "#fff", borderRadius: 24, padding: 20, border: "1px solid rgba(15, 23, 42, 0.08)", boxShadow: "0 20px 50px rgba(15, 23, 42, 0.06)" }}>
              <h2 style={{ margin: 0, fontSize: 22 }}>Recent intake</h2>
              <div style={{ display: "grid", gap: 12, marginTop: 18 }}>
                {recentCheckIns.length ? (
                  recentCheckIns.map((item) => (
                    <div key={item.id} style={{ padding: 14, borderRadius: 16, background: "#f8fafc" }}>
                      <div style={{ display: "flex", justifyContent: "space-between", gap: 12 }}>
                        <strong>{item.fullName || "Unidentified evacuee"}</strong>
                        <span style={{ color: item.status === "checked-in" ? "#0f766e" : "#64748b", fontWeight: 700 }}>{item.status}</span>
                      </div>
                      <div style={{ color: "#64748b", marginTop: 6 }}>{item.zone || "Unassigned zone"} • {item.location || "Unknown shelter"}</div>
                    </div>
                  ))
                ) : (
                  <p style={{ margin: 0, color: "#64748b" }}>No recent check-ins were returned from the backend.</p>
                )}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </main>
  );
}