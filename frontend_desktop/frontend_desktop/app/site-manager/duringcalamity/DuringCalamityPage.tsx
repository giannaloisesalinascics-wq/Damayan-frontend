"use client";

import Link from "next/link";
import { useState } from "react";

export default function DuringCalamityPage() {
  const [checkInMode, setCheckInMode] = useState<"scan" | "manual">("scan");

  const resources = [
    {
      name: "Potable Water",
      availability: "92% AVAIL",
      value: 92,
      tone: "primary",
      icon: "W",
    },
    {
      name: "Trauma Kits",
      availability: "12% LOW",
      value: 12,
      tone: "error",
      icon: "T",
    },
    {
      name: "Mobile Power",
      availability: "84% AVAIL",
      value: 84,
      tone: "primary",
      icon: "P",
    },
  ];

  const shelters = [
    { name: "North Elementary", level: "98% Full", fill: 98, tone: "error" },
    { name: "St. Jude Stadium", level: "45% Full", fill: 45, tone: "primary" },
    { name: "East Coast Gym", level: "Inactive", fill: 0, tone: "muted" },
  ];

  const feed = [
    {
      time: "08:42 AM - WARNING",
      message:
        "Bridge in Sector 7 reported unstable. Rerouting team Bravo-2.",
      tone: "warning",
      icon: "!",
    },
    {
      time: "08:35 AM - DEPLOYMENT",
      message:
        "Team Delta arrived at South Shelter. Starting health screenings.",
      tone: "primary",
      icon: "D",
    },
    {
      time: "08:20 AM - RESOURCE",
      message: "Food supplies batch #901 received at central hub.",
      tone: "neutral",
      icon: "R",
    },
  ];

  const swimlane = [
    "Evacuee Arrival",
    "Scan QR or Manually Log ID",
    "Update Site Capacity",
    "Manage Relief Distribution",
    "Report Site Incidents",
  ];

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
            <Link className="response-signout-link" href="/site-manager/login">
              Sign Out
            </Link>
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
            <div className="topbar-avatar">SM</div>
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
                  <span>Critical Window: 04:22:10 remaining</span>
                </div>
              </div>
              <h1>Live Status Map</h1>
              <p>
                Live operational view of Typhoon 09B impact zone. Resources are
                being prioritized for Zone A-4 flooding.
              </p>
            </div>

            <div className="response-summary-grid">
              <div className="response-summary-card">
                <span>Total Displaced</span>
                <strong>12,482</strong>
              </div>
              <div className="response-summary-card">
                <span>Active Shelters</span>
                <strong>42/45</strong>
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

              <div className="scanner-manual-card">
                <h3>Manual Intake Backup</h3>
                <div className="manual-field">
                  <label>Evacuee Name</label>
                  <input placeholder="Enter full name" type="text" />
                </div>
                <div className="manual-field">
                  <label>Temporary ID</label>
                  <input placeholder="Assign or enter ID" type="text" />
                </div>
                <button type="button">Save Manual Entry</button>
              </div>
            </div>
          </section>

          <section className="incident-report-card">
            <div className="incident-report-header">
              <div>
                <h2>Report Site Incident</h2>
                <p>Log critical events, supply shortages, or medical emergencies immediately.</p>
              </div>
              <div className="incident-count-badge">3 active alerts</div>
            </div>

            <form className="incident-report-form">
              <div className="incident-form-grid">
                <div className="manual-field">
                  <label>Incident Type</label>
                  <select className="incident-select">
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
                    <button type="button" className="severity-btn critical">Critical</button>
                    <button type="button" className="severity-btn high active">High</button>
                    <button type="button" className="severity-btn moderate">Moderate</button>
                  </div>
                </div>
              </div>
              <div className="manual-field">
                <label>Incident Description</label>
                <textarea className="incident-textarea" placeholder="Describe the situation in detail..."></textarea>
              </div>
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
                {resources.map((resource) => (
                  <article className="response-resource-card" key={resource.name}>
                    <div className="response-resource-top">
                      <div className={`resource-icon resource-${resource.tone}`}>
                        {resource.icon}
                      </div>
                      <span className={`resource-label resource-${resource.tone}`}>
                        {resource.availability}
                      </span>
                    </div>
                    <h3>{resource.name}</h3>
                    <div className="resource-progress-track">
                      <div
                        className={`resource-progress-fill resource-${resource.tone}`}
                        style={{ width: `${resource.value}%` }}
                      />
                    </div>
                  </article>
                ))}
              </div>
            </div>

            <aside className="response-right-column">
              <div className="response-shelter-card">
                <div className="response-panel-header">
                  <h3>Shelter Load</h3>
                  <button type="button">Details</button>
                </div>

                <div className="response-shelter-list">
                  {shelters.map((shelter) => (
                    <article
                      className={`response-shelter-item shelter-${shelter.tone}`}
                      key={shelter.name}
                    >
                      <div className="response-shelter-row">
                        <span>{shelter.name}</span>
                        <strong>{shelter.level}</strong>
                      </div>
                      <div className="response-shelter-track">
                        <div
                          className={`response-shelter-fill shelter-fill-${shelter.tone}`}
                          style={{ width: `${shelter.fill}%` }}
                        />
                      </div>
                    </article>
                  ))}
                </div>
              </div>

              <div className="response-feed-card">
                <div className="response-panel-header">
                  <h3>Live Activity</h3>
                  <span className="response-live-indicator" />
                </div>

                <div className="response-feed-list">
                  {feed.map((item) => (
                    <article className="response-feed-item" key={item.time}>
                      <div className={`feed-icon feed-${item.tone}`}>{item.icon}</div>
                      <div>
                        <span className="response-feed-time">{item.time}</span>
                        <p>{item.message}</p>
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
