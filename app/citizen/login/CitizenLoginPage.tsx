"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";


export default function CitizenLoginPage() {
  const router = useRouter();

  function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/citizen/beforecalamity");
  }

  return (
    <main className="citizen-entry-page">
      <section className="citizen-entry-layout">
        <aside className="citizen-entry-brand">
          <div className="citizen-entry-brand-head">
            <div className="citizen-entry-mark">D</div>
            <div>
              <span className="citizen-entry-name">DAMAYAN</span>
              <p className="citizen-entry-kicker">Affected Citizen Portal</p>
            </div>
          </div>

          <div className="citizen-entry-brand-copy">
            <p className="citizen-entry-eyebrow">Community Preparedness Access</p>
            <h1>Stay Ready, Stay Connected.</h1>
            <p>Access alerts, QR ID, and support updates in one place.</p>
          </div>

        </aside>

        <section className="citizen-entry-panel">
          <div className="citizen-entry-mobile-head">
            <div className="citizen-entry-mark citizen-entry-mark-mobile">D</div>
            <span className="citizen-entry-name citizen-entry-name-mobile">
              DAMAYAN
            </span>
          </div>

          <header className="citizen-entry-intro">
            <span className="citizen-entry-badge">Login</span>
            <h2>Affected Citizen Access</h2>
            <p>Sign in to continue to your citizen dashboard.</p>
          </header>

          <div className="citizen-entry-return">
            <span>Need a staff portal instead?</span>
            <Link href="/loginportal">Open staff login</Link>
          </div>

          <article className="citizen-entry-card">
            <div className="citizen-entry-card-top">
              <h3>Already Registered</h3>
              <p>Enter your account details below.</p>
            </div>

            <form className="citizen-entry-form" onSubmit={handleLogin}>
              <div className="citizen-entry-field">
                <label htmlFor="citizen-username">Username</label>
                <input
                  id="citizen-username"
                  name="citizen-username"
                  type="text"
                  placeholder="juan.delacruz"
                />
              </div>

              <div className="citizen-entry-field">
                <div className="citizen-entry-field-row">
                  <label htmlFor="citizen-password">Password</label>
                  <button type="button">Forgot password?</button>
                </div>
                <input
                  id="citizen-password"
                  name="citizen-password"
                  type="password"
                  placeholder="********"
                />
              </div>

              <button className="citizen-entry-primary" type="submit">
                Log In To Citizen Dashboard
              </button>
            </form>

            <p className="citizen-entry-switch-copy">
              If you do not have an account,{" "}
              <Link href="/citizen/signup">create an account</Link>.
            </p>
          </article>
        </section>
      </section>
    </main>
  );
}
