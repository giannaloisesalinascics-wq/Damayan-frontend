"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const checklist = [
  {
    title: "Update Emergency Contact List",
    detail:
      "Ensure all phone numbers and medical info are current for household members.",
    status: "Done",
    done: true,
  },
  {
    title: "Restock 72-Hour Survival Kit",
    detail:
      "Check expiration dates on canned goods and refresh water supply (4L/person/day).",
    status: "Pending",
    done: false,
  },
  {
    title: "Verify Evacuation Route",
    detail:
      "Review the secondary route in case the primary highway is inaccessible.",
    status: "Pending",
    done: false,
  },
];

const sidebarLinks = [
  { label: "Home", href: "/citizen/beforecalamity", key: "home" },
  { label: "Risk Map", href: "/citizen/beforecalamity#sector-map", key: "risk-map" },
  { label: "Checklists", href: "/citizen/beforecalamity#checklists", key: "checklists" },
  { label: "Reporting", href: "/citizen/duringcalamity#tickets", key: "reporting" },
  { label: "Support", href: "/citizen/duringcalamity#broadcast", key: "support" },
];

export default function CitizenBeforeCalamityPage() {
  const [activeSidebarItem, setActiveSidebarItem] = useState("home");

  useEffect(() => {
    function syncActiveSidebarItem() {
      const hash = window.location.hash;

      if (hash === "#sector-map") {
        setActiveSidebarItem("risk-map");
        return;
      }

      if (hash === "#checklists") {
        setActiveSidebarItem("checklists");
        return;
      }

      setActiveSidebarItem("home");
    }

    syncActiveSidebarItem();
    window.addEventListener("hashchange", syncActiveSidebarItem);

    return () => {
      window.removeEventListener("hashchange", syncActiveSidebarItem);
    };
  }, []);

  return (
    <div className="citizen-web-page">
      <aside className="citizen-web-sidebar">
        <div className="citizen-web-sidebar-brand">
          <h1>Citizen Portal</h1>
          <p>Stay Safe, Stay Informed</p>
        </div>

        <nav className="citizen-web-sidebar-nav" aria-label="Citizen sections">
          {sidebarLinks.map((item, index) => (
            <Link
              key={item.label}
              className={activeSidebarItem === item.key ? "is-active" : undefined}
              href={item.href}
              onClick={() => setActiveSidebarItem(item.key)}
            >
              <span className="citizen-web-nav-icon" aria-hidden="true">
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

        <div className="citizen-web-sidebar-footer">
          <Link className="citizen-web-signout" href="/citizen/login">
            Sign Out
          </Link>
        </div>
      </aside>

      <div className="citizen-web-shell">
        <header className="citizen-web-topbar">
          <div className="citizen-web-topbar-inner">
            <div className="citizen-web-topbar-copy">
              <Link className="citizen-web-logo" href="/citizen/beforecalamity">
                ReliefConnect
              </Link>
              <p>Preparedness dashboard</p>
            </div>

            <div className="citizen-web-topactions">
              <Link href="/citizen/duringcalamity#broadcast">Alerts</Link>
              <Link className="citizen-web-profile-chip" href="/citizen/beforecalamity" aria-label="Open citizen profile">
                <span className="citizen-web-profile-avatar" aria-hidden="true">
                  CP
                </span>
                <span className="citizen-web-profile-copy">
                  <strong>Citizen</strong>
                  <small>Profile</small>
                </span>
              </Link>
            </div>
          </div>
        </header>

        <main className="citizen-web-main" id="home">
          <section className="citizen-web-hero">
            <div className="citizen-web-hero-media" aria-hidden="true">
              <div className="citizen-web-hero-overlay" />
            </div>

            <div className="citizen-web-hero-content">
              <div className="citizen-web-status-pill">
                <span className="citizen-web-status-dot" />
                <span>Active Status: Stable</span>
              </div>

              <h2>
                Low-Risk
                <br />
                <span>Condition.</span>
              </h2>

              <p>
                No immediate environmental threats detected in your primary
                zone. Current preparedness phase: Maintenance and Education.
              </p>

              <Link className="citizen-web-primary-action" href="#checklists">
                Update Plan
                <span aria-hidden="true">+</span>
              </Link>
            </div>
          </section>

          <section className="citizen-web-editorial">
            <div className="citizen-web-left-column">
              <section className="citizen-web-section-block" id="checklists">
                <div className="citizen-web-section-head">
                  <div>
                    <h3>Ready-Check</h3>
                    <p>Monthly Preparedness Audit</p>
                  </div>
                  <span>01/03</span>
                </div>

                <div className="citizen-web-checklist">
                  {checklist.map((item) => (
                    <article className="citizen-web-checkitem" key={item.title}>
                      <div
                        className={`citizen-web-checkmark ${
                          item.done ? "is-done" : ""
                        }`}
                        aria-hidden="true"
                      >
                        {item.done ? "OK" : ""}
                      </div>

                      <div className="citizen-web-checkcopy">
                        <h4>{item.title}</h4>
                        <p>{item.detail}</p>
                      </div>

                      <span
                        className={`citizen-web-checkstatus ${
                          item.done ? "is-done" : "is-pending"
                        }`}
                      >
                        {item.status}
                      </span>
                    </article>
                  ))}
                </div>
              </section>

              <section className="citizen-web-section-block" id="household">
                <h3 className="citizen-web-simple-head">Household</h3>

                <div className="citizen-web-household-grid">
                  <article className="citizen-web-household-card">
                    <div className="citizen-web-household-icon">GH</div>
                    <Link href="#household">Edit</Link>
                    <div>
                      <strong>4 Members</strong>
                      <p>Profile: Active</p>
                    </div>
                  </article>

                  <article className="citizen-web-household-card">
                    <div className="citizen-web-household-icon is-secondary">
                      PT
                    </div>
                    <Link href="#household">Add</Link>
                    <div>
                      <strong>2 Animals</strong>
                      <p>Care-plan Required</p>
                    </div>
                  </article>
                </div>
              </section>
            </div>

            <div className="citizen-web-right-column">
              <section className="citizen-web-weather-card" id="weather">
                <div className="citizen-web-weather-symbol" aria-hidden="true">
                  SUN
                </div>

                <div className="citizen-web-weather-top">
                  <span>Atmospheric Status</span>
                </div>

                <div className="citizen-web-weather-main">
                  <div className="citizen-web-weather-temp">24C</div>
                  <div>
                    <strong>Partly Cloudy</strong>
                    <p>Clear visibility (12km)</p>
                  </div>
                </div>

                <div className="citizen-web-weather-stats">
                  <div>
                    <span>Wind Velocity</span>
                    <strong>12 km/h NW</strong>
                  </div>
                  <div>
                    <span>Precipitation</span>
                    <strong>2% Prob.</strong>
                  </div>
                  <div>
                    <span>UV Index</span>
                    <strong>4 (Moderate)</strong>
                  </div>
                </div>
              </section>

              <section className="citizen-web-map-card" id="sector-map">
                <div className="citizen-web-map-label">
                  <span>Current Sector</span>
                  <strong>West District, Zone 4</strong>
                </div>

                <div className="citizen-web-map-surface" aria-hidden="true">
                  <div className="citizen-web-map-grid" />
                </div>

                <Link className="citizen-web-map-route" href="/citizen/duringcalamity">
                  <div>
                    <strong>1.2km to Nearest Shelter</strong>
                    <p>Route: Clear - 15min Walk</p>
                  </div>
                  <span aria-hidden="true">GO</span>
                </Link>
              </section>
            </div>
          </section>

          <section className="citizen-web-footer-actions">
            <Link className="is-primary" href="/citizen/duringcalamity">
              Open Response
            </Link>
          </section>
        </main>
      </div>

      <Link
        className="citizen-web-support-fab"
        href="/citizen/login"
        aria-label="Open support"
        id="support"
      >
        Help
      </Link>
    </div>
  );
}
