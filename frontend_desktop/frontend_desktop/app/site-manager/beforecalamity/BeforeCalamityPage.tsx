import Link from "next/link";

export default function BeforeCalamityPage() {
  const inventory = [
    {
      name: "Potable Water",
      detail: "15,000 Liters",
      percent: "92%",
      status: "Secure",
      tone: "secure",
      icon: "W",
    },
    {
      name: "Medical Kits",
      detail: "450 Units",
      percent: "84%",
      status: "Secure",
      tone: "secure",
      icon: "M",
    },
    {
      name: "Blankets & Shelter",
      detail: "800 Kits",
      percent: "61%",
      status: "Low Stock",
      tone: "warning",
      icon: "B",
    },
    {
      name: "Dry Rations",
      detail: "2,500 Boxes",
      percent: "95%",
      status: "Secure",
      tone: "secure",
      icon: "R",
    },
  ];

  const timeline = [
    {
      time: "08:45 AM - TODAY",
      title: "Fleet Arrival: Convoy Gamma",
      description:
        "Arrived at Northern Staging Point with 2,000L of potable water and 10 responders.",
      tone: "primary",
    },
    {
      time: "07:12 AM - TODAY",
      title: "Comms Established: Sector 4",
      description:
        "Satellite uplink successfully stabilized at temporary command post. Signal strength 92%.",
      tone: "primary",
    },
    {
      time: "YESTERDAY - 11:30 PM",
      title: "Warning Issued: Coastal Inundation",
      description:
        "Evacuation protocols initiated for low-lying areas in Cluster B. Logistics teams mobilized.",
      tone: "warning",
    },
  ];

  return (
    <div className="preparedness-page">
      <aside className="preparedness-sidebar">
        <div className="preparedness-sidebar-inner">
          <div>
            <div className="preparedness-brand">
              <div className="preparedness-brand-mark">D</div>
              <div>
                <div className="preparedness-brand-name">Damayan Portal</div>
                <p className="preparedness-brand-subtitle">Site Manager</p>
              </div>
            </div>

            <nav className="preparedness-nav">
              <button className="is-active" type="button">
                <span className="nav-icon">D</span>
                <span>Dashboard</span>
              </button>
              <button type="button">
                <span className="nav-icon">A</span>
                <span>Assessment</span>
              </button>
              <button type="button">
                <span className="nav-icon">P</span>
                <span>Distribution</span>
              </button>
              <button type="button">
                <span className="nav-icon">R</span>
                <span>Recovery</span>
              </button>
              <button type="button">
                <span className="nav-icon">I</span>
                <span>Impact Reports</span>
              </button>
              <button type="button">
                <span className="nav-icon">S</span>
                <span>Settings</span>
              </button>
            </nav>
          </div>

          <div className="preparedness-sidebar-footer">
            <button className="primary-utility-button" type="button">
              Log Rapid Report
            </button>
            <button type="button">Support</button>
            <Link className="sidebar-signout-link" href="/site-manager/login">
              Sign Out
            </Link>
          </div>
        </div>
      </aside>

      <main className="preparedness-main">
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
            <button className="is-active" type="button">
              Phases
            </button>
            <button type="button">Resources</button>
            <button type="button">Team</button>
          </div>

          <div className="topbar-right">
            <span className="topbar-divider" />
            <div className="topbar-avatar">SM</div>
          </div>
        </header>

        <div className="preparedness-content">
          <section className="hero-section">
            <div className="hero-section-copy">
              <div className="hero-badges">
                <span className="phase-badge">Phase 1</span>
                <span className="phase-label">Active Preparedness Mode</span>
              </div>
              <h1>Regional Preparedness Dashboard</h1>
              <p>
                Site Manager: <strong>Central Visayas Cluster</strong>. Monitoring
                regional logistics and readiness ahead of forecasted weather
                event.
              </p>

              <div className="phase-transition-card">
                <div>
                  <strong>Next Phase</strong>
                  <p>
                    When operations shift from preparedness to live response,
                    continue to the during calamity dashboard.
                  </p>
                </div>
                <Link className="phase-transition-link" href="/site-manager/duringcalamity">
                  Open Active Response
                </Link>
              </div>
            </div>

            <div className="hero-metrics">
              <div className="hero-metric-card">
                <span className="metric-value">72h</span>
                <span className="metric-label">Window</span>
              </div>
              <div className="hero-metric-card is-highlight">
                <span className="metric-value">88%</span>
                <span className="metric-label">Readiness</span>
              </div>
            </div>
          </section>

          <section className="prep-actions-card">
            <div className="prep-actions-header">
              <div>
                <h2>Before Calamity Checklist</h2>
                <p>
                  Core readiness actions aligned to your swimlane before the
                  response phase begins.
                </p>
              </div>
            </div>

            <div className="prep-actions-grid">
              <article className="prep-action-item">
                <div className="prep-action-badge">1</div>
                <div className="prep-action-copy">
                  <h3>Verify Inventory & Capacity</h3>
                  <p>
                    Confirm relief stock levels, shelter space, responder
                    readiness, and staging coverage across the region.
                  </p>
                  <span className="prep-action-status is-ready">
                    Inventory verified
                  </span>
                </div>
              </article>

              <article className="prep-action-item">
                <div className="prep-action-badge">2</div>
                <div className="prep-action-copy">
                  <h3>Enable / Prepare Check-In Scanner</h3>
                  <p>
                    Test QR scanning, validate fallback manual ID entry, and
                    confirm check-in devices are ready for evacuee intake.
                  </p>

                  <div className="scanner-prep-panel">
                    <div className="scanner-prep-status">
                      <span className="scanner-prep-dot" />
                      <span>Scanner Ready</span>
                    </div>
                    <div className="scanner-prep-tags">
                      <span>2 tablets paired</span>
                      <span>Offline mode synced</span>
                      <span>Manual log enabled</span>
                    </div>
                    <Link
                      className="scanner-prep-link"
                      href="/site-manager/duringcalamity"
                    >
                      Open Check-In Flow
                    </Link>
                  </div>
                </div>
              </article>
            </div>
          </section>

          <section className="preparedness-grid">
            <div className="map-card">
              <div className="map-overlay">
                <h3>Live Fleet & Command</h3>
                <div className="map-alert-list">
                  <div className="map-alert-item">
                    <span className="map-alert-dot is-primary" />
                    <span>Mobile Command Alpha</span>
                    <strong>Active</strong>
                  </div>
                  <div className="map-alert-item">
                    <span className="map-alert-dot is-warning" />
                    <span>Alert Zone: Sector 4</span>
                    <strong>Critical</strong>
                  </div>
                  <div className="map-alert-item">
                    <span className="map-alert-dot is-muted" />
                    <span>Supply Depot C</span>
                    <strong>Standby</strong>
                  </div>
                </div>
              </div>

              <div className="map-actions">
                <button type="button">+</button>
                <button type="button">-</button>
                <button type="button">◎</button>
              </div>

              <div className="map-surface">
                <div className="map-grid" />
                <div className="map-zone zone-one" />
                <div className="map-zone zone-two" />
                <div className="map-route" />
              </div>
            </div>

            <div className="side-metrics">
              <div className="deployment-card">
                <h3>Team Deployment</h3>
                <div className="deployment-list">
                  <div>
                    <div className="deployment-row">
                      <span>Medical Responders</span>
                      <strong>24 / 30</strong>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill is-80" />
                    </div>
                  </div>
                  <div>
                    <div className="deployment-row">
                      <span>Logistics Personnel</span>
                      <strong>12 / 12</strong>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill is-100" />
                    </div>
                  </div>
                  <div>
                    <div className="deployment-row">
                      <span>Community Volunteers</span>
                      <strong>145 / 200</strong>
                    </div>
                    <div className="progress-track">
                      <div className="progress-fill is-72" />
                    </div>
                  </div>
                </div>
              </div>

              <div className="priority-card">
                <span className="priority-icon">!</span>
                <span className="priority-tag">Priority High</span>
                <h4>Resource Shortfall: Sector 4</h4>
                <p>
                  Medical kits in Sector 4 are currently at 45% capacity.
                  Immediate reallocation suggested from Central Depot.
                </p>
                <button type="button">Initiate Reallocation</button>
              </div>
            </div>

            <div className="inventory-card">
              <div className="inventory-card-header">
                <div>
                  <h2>Essential Supply Checklist</h2>
                  <p>Real-time inventory levels across regional staging areas.</p>
                </div>
                <button type="button">Export Inventory Data</button>
              </div>

              <div className="inventory-grid">
                {inventory.map((item) => (
                  <article
                    key={item.name}
                    className={`inventory-item inventory-${item.tone}`}
                  >
                    <div className="inventory-item-top">
                      <div className={`inventory-icon inventory-icon-${item.tone}`}>
                        {item.icon}
                      </div>
                      <div>
                        <h4>{item.name}</h4>
                        <p>{item.detail}</p>
                      </div>
                    </div>
                    <div className="inventory-item-bottom">
                      <span className="inventory-percent">{item.percent}</span>
                      <span className={`inventory-status inventory-status-${item.tone}`}>
                        {item.status}
                      </span>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="timeline-card">
            <h3>Recent Staging Activities</h3>
            <div className="timeline-list">
              {timeline.map((item, index) => (
                <article className="timeline-item" key={item.title}>
                  <div className="timeline-rail">
                    <span className={`timeline-dot timeline-dot-${item.tone}`} />
                    {index < timeline.length - 1 ? (
                      <span className="timeline-line" />
                    ) : null}
                  </div>
                  <div className="timeline-copy">
                    <span className="timeline-time">{item.time}</span>
                    <h4>{item.title}</h4>
                    <p>{item.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
