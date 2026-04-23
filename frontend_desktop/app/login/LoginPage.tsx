"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

type Role = "site_manager" | "citizen" | "dispatcher" | "admin";

const roles: {
  id: Role;
  label: string;
  sub: string;
  desc: string;
  color: string;
  bg: string;
  route: string;
}[] = [
  {
    id: "citizen",
    label: "Affected Citizen",
    sub: "Public Portal",
    desc: "Register, receive alerts, access your QR ID, and track relief aid.",
    color: "#2E7D32",
    bg: "rgba(46,125,50,0.08)",
    route: "/citizen/login",
  },
  {
    id: "site_manager",
    label: "Site Manager",
    sub: "Operations Portal",
    desc: "Manage shelter capacity, supplies, and evacuee intake at your site.",
    color: "#FFB300",
    bg: "rgba(255,179,0,0.08)",
    route: "/site-manager/login",
  },
  {
    id: "dispatcher",
    label: "Dispatcher",
    sub: "Command Portal",
    desc: "Coordinate rescue teams, manage incident tickets, and dispatch resources.",
    color: "#81C784",
    bg: "rgba(129,199,132,0.1)",
    route: "/dispatcher/login",
  },
  {
    id: "admin",
    label: "Administrator",
    sub: "System Portal",
    desc: "System-wide monitoring, user approvals, and platform reporting.",
    color: "#4E342E",
    bg: "rgba(78,52,46,0.08)",
    route: "/admin/login",
  },
];

export default function LoginPage() {
  const router = useRouter();
  const [hovered, setHovered] = useState<Role | null>(null);

  return (
    <main className="portal-root">
      <div className="portal-bg-orb portal-bg-orb-1" />
      <div className="portal-bg-orb portal-bg-orb-2" />
      <div className="portal-bg-orb portal-bg-orb-3" />

      <aside className="portal-brand">
        <div className="portal-brand-inner">
          <div className="portal-logo">
            <div className="portal-logo-mark">D</div>
            <div>
              <span className="portal-logo-name">DAMAYAN</span>
              <p className="portal-logo-tagline">Emergency Response Platform</p>
            </div>
          </div>

          <div className="portal-brand-copy">
            <p className="portal-eyebrow">Philippines Disaster Response</p>
            <h1 className="portal-headline">
              One Platform.<br />Every Role.<br />
              <span className="portal-headline-accent">Zero Delay.</span>
            </h1>
            <p className="portal-subline">
              Connecting citizens, site managers, dispatchers, and administrators
              during every phase of a calamity — bringing together responders, coordinators, and communities.
            </p>
          </div>

          <div className="portal-brand-stats">
            <div className="portal-stat">
              <span className="portal-stat-value">4</span>
              <span className="portal-stat-label">Portals</span>
            </div>
            <div className="portal-stat-divider" />
            <div className="portal-stat">
              <span className="portal-stat-value">Real-time</span>
              <span className="portal-stat-label">Sync</span>
            </div>
            <div className="portal-stat-divider" />
            <div className="portal-stat">
              <span className="portal-stat-value">Offline</span>
              <span className="portal-stat-label">Capable</span>
            </div>
          </div>
        </div>
      </aside>

      <section className="portal-selector">
        <header className="portal-selector-head">
          <span className="portal-selector-eyebrow">Select your role to continue</span>
          <h2 className="portal-selector-title">Choose Your Portal</h2>
          <p className="portal-selector-sub">
            Each portal is tailored to your specific role in the emergency response system.
          </p>
        </header>

        <div className="portal-role-grid">
          {roles.map((role) => (
            <button
              key={role.id}
              className={`portal-role-card${hovered === role.id ? " is-hovered" : ""}`}
              type="button"
              style={{
                "--role-color": role.color,
                "--role-bg": role.bg,
              } as React.CSSProperties}
              onClick={() => router.push(role.route)}
              onMouseEnter={() => setHovered(role.id)}
              onMouseLeave={() => setHovered(null)}
            >
              <div className="portal-role-card-inner">
                <div className="portal-role-dot" />
                <div className="portal-role-copy">
                  <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                    <p className="portal-role-sub" style={{ marginBottom: 0 }}>{role.sub}</p>
                  </div>
                  <h3 className="portal-role-label">{role.label}</h3>
                  <p className="portal-role-desc">{role.desc}</p>
                </div>
                <div className="portal-role-arrow">→</div>
              </div>
            </button>
          ))}
        </div>

        <footer className="portal-selector-footer">
          {["Privacy Policy", "Terms of Service", "Help Center"].map((label) => (
            <a key={label} href="#" className="portal-footer-link">{label}</a>
          ))}
        </footer>
      </section>
    </main>
  );
}
