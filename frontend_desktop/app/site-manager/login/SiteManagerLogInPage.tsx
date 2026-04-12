"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SiteManagerLogInPage() {
  const router = useRouter();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/site-manager/beforecalamity");
  }

  return (
    <main style={{ minHeight: "100vh", padding: "24px", background: "#f5f7f5", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Inter', sans-serif" }}>
      <section style={{ width: "min(84rem, 100%)", minHeight: "calc(100vh - 48px)", display: "grid", gridTemplateColumns: "minmax(352px, 0.9fr) minmax(0, 1fr)", borderRadius: 32, overflow: "hidden", background: "#fcfdfb", boxShadow: "0 30px 90px rgba(40,50,56,0.12)" }}>
        <aside style={{ padding: "56px", color: "#fff", background: "#2e7d32", display: "flex", flexDirection: "column", justifyContent: "center", gap: 32 }}>
          <div style={{ display: "grid", alignContent: "center", flex: 1 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 48 }}>
              <div style={{ width: 40, height: 40, borderRadius: 12, display: "grid", placeItems: "center", background: "rgba(245,247,245,0.18)", fontWeight: 900, fontSize: 18 }}>D</div>
              <div>
                <div style={{ fontSize: 20, fontWeight: 800 }}>DAMAYAN</div>
                <div style={{ fontSize: 12, letterSpacing: "0.14em", opacity: 0.86, textTransform: "uppercase" }}>Site Manager Portal</div>
              </div>
            </div>

            <p style={{ margin: 0, fontSize: 12, letterSpacing: "0.16em", textTransform: "uppercase", opacity: 0.84, fontWeight: 800 }}>
              Site Operations
            </p>
            <h1 style={{ margin: "22px 0 18px", fontSize: 72, lineHeight: 0.98, letterSpacing: "-0.05em" }}>Manage Every Relief Site.</h1>
            <p style={{ margin: 0, maxWidth: 420, fontSize: 20, lineHeight: 1.8, color: "rgba(245,247,245,0.88)" }}>
              Oversee shelter readiness, supplies, and local coordination from the site manager portal.
            </p>
          </div>

        </aside>

        <section style={{ padding: "56px", display: "flex", flexDirection: "column", justifyContent: "center", background: "#fcfdfb" }}>
          <div style={{ marginBottom: 24 }}>
            <span style={{ display: "inline-block", padding: "8px 14px", borderRadius: 999, background: "#d9f2d5", color: "#2e7d32", fontSize: 12, letterSpacing: "0.14em", textTransform: "uppercase", fontWeight: 800 }}>Site Manager</span>
            <h2 style={{ margin: "18px 0 14px", fontSize: 58, lineHeight: 1.02, letterSpacing: "-0.05em", color: "#283238" }}>Site Manager Access</h2>
            <p style={{ margin: 0, color: "#5f6b66", fontSize: 18, lineHeight: 1.7 }}>Sign in to continue to the site manager dashboard.</p>
          </div>

          <div style={{ marginBottom: 20, padding: "18px 20px", borderRadius: 18, background: "#f5f7f5", border: "1px solid rgba(46,125,50,0.14)", color: "#5f6b66", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
            <span>Need a different portal instead?</span>
            <Link href="/loginportal" style={{ color: "#2e7d32", textDecoration: "none", fontWeight: 800 }}>Open role selector</Link>
          </div>

          <article style={{ maxWidth: 704, padding: 28, borderRadius: 24, background: "#ffffff", border: "1px solid rgba(46,125,50,0.14)", boxShadow: "0 18px 40px rgba(40,50,56,0.06)" }}>
            <div style={{ marginBottom: 20 }}>
              <h3 style={{ margin: "0 0 8px", fontSize: 24, letterSpacing: "-0.03em", color: "#283238" }}>Site Manager Login</h3>
              <p style={{ margin: 0, color: "#5f6b66", fontSize: 16 }}>Enter your account details below.</p>
            </div>

            <form onSubmit={handleSubmit} style={{ display: "grid", gap: 16 }}>
              <div style={{ display: "grid", gap: 8 }}>
                <label htmlFor="site-manager-username" style={{ color: "#5f6b66", fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>Username</label>
                <input id="site-manager-username" type="text" placeholder="Enter username" style={{ width: "100%", padding: "16px 18px", borderRadius: 16, border: "1px solid rgba(129,199,132,0.38)", background: "#f5f7f5", outline: "none", fontSize: 16, boxSizing: "border-box", color: "#283238" }} />
              </div>

              <div style={{ display: "grid", gap: 8 }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>
                  <label htmlFor="site-manager-password" style={{ color: "#5f6b66", fontSize: 12, fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase" }}>Password</label>
                  <button type="button" style={{ border: 0, background: "transparent", color: "#a06f00", fontWeight: 800, fontSize: 13, cursor: "pointer" }}>Forgot password?</button>
                </div>
                <input id="site-manager-password" type="password" placeholder="********" style={{ width: "100%", padding: "16px 18px", borderRadius: 16, border: "1px solid rgba(129,199,132,0.38)", background: "#f5f7f5", outline: "none", fontSize: 16, boxSizing: "border-box", color: "#283238" }} />
              </div>

              <button type="submit" style={{ marginTop: 8, padding: "16px 18px", border: 0, borderRadius: 16, background: "#2e7d32", color: "#fff", fontSize: 18, fontWeight: 800, cursor: "pointer", boxShadow: "0 14px 28px rgba(46,125,50,0.22)" }}>
                Log In To Site Manager Dashboard
              </button>
            </form>
          </article>
        </section>
      </section>
    </main>
  );
}
