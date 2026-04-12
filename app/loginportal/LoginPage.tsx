"use client";

import { useRouter } from "next/navigation";

type Role = "site_manager" | "citizen" | "dispatcher" | "admin";

const roles: { id: Role; label: string; desc: string; dot: string }[] = [
  { id: "admin", label: "Admin", desc: "System monitoring, approvals & reporting", dot: "#1565c0" },
  { id: "dispatcher", label: "Dispatcher", desc: "Incident management & resource dispatch", dot: "#e65100" },
  { id: "site_manager", label: "Site Manager", desc: "Relief site capacity & distribution", dot: "#2e7d32" },
  { id: "citizen", label: "Affected Citizen", desc: "Register, alerts, QR access & relief tracking", dot: "#c62828" },
];

const routeMap: Record<Role, string> = {
  admin: "/admin/login",
  dispatcher: "/dispatcher/login",
  site_manager: "/site-manager/login",
  citizen: "/citizen/login",
};

export default function LoginPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "#f0f4f0", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif", padding: 24 }}>
      <div style={{ display: "flex", width: "100%", maxWidth: 1320, minHeight: 700, borderRadius: 28, overflow: "hidden", boxShadow: "0 30px 90px rgba(0,0,0,0.14)" }}>
        <div style={{ width: 590, background: "linear-gradient(160deg, #1b5e20 0%, #2e7d32 60%, #388e3c 100%)", padding: "64px 56px", display: "flex", flexDirection: "column", justifyContent: "space-between", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 80% 20%, rgba(255,255,255,0.07) 0%, transparent 60%)" }} />
          <div style={{ position: "relative" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 48 }}>
              <div style={{ width: 40, height: 40, background: "rgba(255,255,255,0.15)", borderRadius: 12, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 18, color: "#fff" }}>D</div>
              <span style={{ fontWeight: 700, fontSize: 20, color: "#fff" }}>DAMAYAN</span>
            </div>
            <h2 style={{ fontSize: 72, fontWeight: 900, color: "#fff", lineHeight: 0.98, marginBottom: 24, letterSpacing: "-0.04em" }}>The Resilient<br />Sanctuary.</h2>
            <p style={{ color: "rgba(255,255,255,0.82)", fontSize: 20, lineHeight: 1.8, maxWidth: 430 }}>Providing digital infrastructure for human connection during times of crisis. Editorial clarity meets emergency response.</p>
          </div>
         
        </div>

        <div style={{ flex: 1, background: "#fff", padding: "68px 64px", display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <div style={{ marginBottom: 12 }}>
            <h1 style={{ fontSize: 58, fontWeight: 800, color: "#1a1f2e", lineHeight: 1.02, letterSpacing: "-0.04em" }}>Choose Your Portal</h1>
          </div>
          <p style={{ color: "#6b7494", fontSize: 18, marginBottom: 34, lineHeight: 1.7, maxWidth: 560 }}>Select one of the four roles below to open its portal directly.</p>

          <div style={{ marginBottom: 34 }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#6b7494", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: 14 }}>Select Your Role</div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => router.push(routeMap[role.id])}
                  style={{
                    border: `1.5px solid ${role.dot}22`,
                    borderRadius: 18,
                    padding: "24px 22px",
                    cursor: "pointer",
                    background: "#fafbfc",
                    transition: "all 0.15s",
                    textAlign: "left",
                    minHeight: 160,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 9, marginBottom: 10 }}>
                    <span style={{ width: 10, height: 10, borderRadius: "50%", background: role.dot, display: "inline-block" }} />
                    <span style={{ fontSize: 14, fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.06em", color: "#3c4152" }}>{role.label}</span>
                  </div>
                  <div style={{ fontSize: 14, color: "#7f8898", lineHeight: 1.6 }}>{role.desc}</div>
                  <div style={{ marginTop: 16, fontSize: 14, fontWeight: 700, color: role.dot }}>Open portal</div>
                </button>
              ))}
            </div>
          </div>

          <div style={{ display: "flex", justifyContent: "center", gap: 18, marginTop: 32 }}>
            {["Privacy Policy", "Terms of Service", "Help Center"].map((label) => (
              <a key={label} href="#" style={{ fontSize: 13, color: "#9aa3b2", textDecoration: "none" }}>{label}</a>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
