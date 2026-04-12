"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const sidebarLinks = [
  { label: "Home", href: "/citizen/beforecalamity", key: "home" },
  { label: "Risk Map", href: "/citizen/duringcalamity", key: "risk-map" },
  { label: "Checklists", href: "/citizen/beforecalamity#checklists", key: "checklists" },
  { label: "Reporting", href: "/citizen/duringcalamity#tickets", key: "reporting" },
  { label: "Support", href: "/citizen/duringcalamity#broadcast", key: "support" },
];

const tickets = [
  {
    icon: "MED",
    status: "Ready",
    title: "Medical Kit (Essential)",
    detail: "Ticket ID: #REL-4029",
    meta: "Distribution Point A",
    action: "QR",
    tone: "primary",
  },
  {
    icon: "WTR",
    status: "Queued",
    title: "Potable Water (4L)",
    detail: "Ticket ID: #REL-4055",
    meta: "ETA: 45 Mins",
    action: "ETA",
    tone: "secondary",
  },
];

export default function CitizenDuringCalamityPage() {
  const [activeSidebarItem, setActiveSidebarItem] = useState("risk-map");

  useEffect(() => {
    const hash = window.location.hash;

    if (hash === "#tickets") {
      setActiveSidebarItem("reporting");
      return;
    }

    if (hash === "#broadcast") {
      setActiveSidebarItem("support");
      return;
    }

    setActiveSidebarItem("risk-map");
  }, []);

  return (
    <div className="citizen-response-page">
      <aside className="citizen-response-sidebar">
        <div className="citizen-response-sidebar-brand">
          <h1>Citizen Portal</h1>
          <p>Stay Safe, Stay Informed</p>
        </div>

        <nav className="citizen-response-sidebar-nav" aria-label="Citizen sections">
          {sidebarLinks.map((item, index) => (
            <Link
              key={item.label}
              className={activeSidebarItem === item.key ? "is-active" : undefined}
              href={item.href}
              onClick={() => {
                if (item.key === "reporting" || item.key === "support" || item.key === "risk-map") {
                  setActiveSidebarItem(item.key);
                }
              }}
            >
              <span className="citizen-response-nav-icon" aria-hidden="true">
                {index === 0
                  ? "H"
                  : index === 1
                    ? "M"
                    : index === 2
                      ? "C"
                      : index === 3
                        ? "R"
                        : "S"}
              </span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div className="citizen-response-sidebar-footer">
          <Link className="citizen-response-signout" href="/citizen/login">
            Sign Out
          </Link>
        </div>
      </aside>

      <div className="citizen-response-shell">
        <header className="citizen-response-topbar">
          <div className="citizen-response-topbar-inner">
            <div className="citizen-response-brand-side">
              <Link className="citizen-response-logo" href="/citizen/duringcalamity">
                DAMAYAN
              </Link>
              <p className="citizen-response-topbar-label">Emergency response dashboard</p>
            </div>

            <div className="citizen-response-actions">
              <Link className="is-sos" href="#broadcast">
                Trigger SOS
              </Link>
              <Link className="is-report" href="#tickets">
                Report Incident
              </Link>
              <div className="citizen-response-meta-actions">
                <Link href="#broadcast">Alerts</Link>
                <Link
                  className="citizen-response-profile-chip"
                  href="/citizen/beforecalamity"
                  aria-label="Open citizen profile"
                >
                  <span className="citizen-response-profile-avatar" aria-hidden="true">
                    CP
                  </span>
                  <span className="citizen-response-profile-copy">
                    <strong>Citizen</strong>
                    <small>Profile</small>
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </header>

        <main className="citizen-response-main">
          <div className="citizen-response-workspace">
            <section className="citizen-response-map-zone">
              <div className="citizen-response-map-surface" aria-hidden="true">
                <div className="citizen-response-map-image" />
              </div>

              <div className="citizen-response-map-label">
                <h3>Rescue Map</h3>
                <p>Phase 2: Active Response</p>

                <div className="citizen-response-location-card">
                  <span>Current Location</span>
                  <strong>Brgy. 102, District 4</strong>
                </div>
              </div>

              <div className="citizen-response-pulse">
                <div className="citizen-response-pulse-ring" />
              </div>

              <div className="citizen-response-map-cards" id="map-cards">
                <Link className="citizen-response-map-card is-primary" href="#broadcast">
                  <div className="citizen-response-map-icon">SH</div>
                  <div className="citizen-response-map-copy">
                    <span>Nearest Shelter</span>
                    <h4>Unity High Gymnasium</h4>
                    <p>850m - 12 min walk</p>
                  </div>
                  <strong>Go</strong>
                </Link>

                <Link className="citizen-response-map-card is-secondary" href="#broadcast">
                  <div className="citizen-response-map-icon">HZ</div>
                  <div className="citizen-response-map-copy">
                    <span>Active Hazard</span>
                    <h4>Rising Flood Level</h4>
                    <p>Verdant Relief Alert Zone</p>
                  </div>
                  <strong>Info</strong>
                </Link>
              </div>
            </section>

            <aside className="citizen-response-sidepanel">
              <section className="citizen-response-ticket-panel" id="tickets">
                <h3>Active Tickets</h3>

                <div className="citizen-response-ticket-list">
                  {tickets.map((ticket) => (
                    <article
                      key={ticket.title}
                      className={`citizen-response-ticket is-${ticket.tone}`}
                    >
                      <div className="citizen-response-ticket-head">
                        <span className="citizen-response-ticket-icon">
                          {ticket.icon}
                        </span>
                        <strong>{ticket.status}</strong>
                      </div>
                      <h4>{ticket.title}</h4>
                      <p>{ticket.detail}</p>

                      <div className="citizen-response-ticket-meta">
                        <span>{ticket.meta}</span>
                        <b>{ticket.action}</b>
                      </div>
                    </article>
                  ))}
                </div>
              </section>

              <section className="citizen-response-broadcast" id="broadcast">
                <h4>System Broadcast</h4>
                <p>
                  Flood evacuation phase 2 has commenced. Proceed to Unity High
                  Gymnasium if water levels reach threshold marker.
                </p>
              </section>
            </aside>
          </div>

          <section className="citizen-response-footer-actions">
            <Link href="/citizen/beforecalamity">Back To Prepare</Link>
          </section>
        </main>
      </div>

      <nav className="citizen-response-mobile-nav">
        <Link href="/citizen/beforecalamity">Home</Link>
        <Link className="is-active" href="/citizen/duringcalamity">
          Risk Map
        </Link>
        <Link href="#broadcast">SOS</Link>
        <Link href="#tickets">Tasks</Link>
        <Link href="/citizen/login">Profile</Link>
      </nav>
    </div>
  );
}
