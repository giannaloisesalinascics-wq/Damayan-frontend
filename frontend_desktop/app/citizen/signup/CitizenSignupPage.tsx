"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const verificationSteps = [
  "Upload a valid government ID.",
  "Wait for verification review.",
  "Validated credentials unlock citizen access.",
];

export default function CitizenSignupPage() {
  const router = useRouter();
  const [selectedIdName, setSelectedIdName] = useState("No file selected");

  function handleRegister(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    router.push("/citizen/login");
  }

  return (
    <main className="citizen-signup-web-page">
      <section className="citizen-signup-web-layout">
        <aside className="citizen-signup-web-brand">
          <div className="citizen-signup-web-brand-head">
            <div className="citizen-signup-web-mark">D</div>
            <div>
              <span className="citizen-signup-web-name">DAMAYAN</span>
              <p className="citizen-signup-web-kicker">Citizen Registration</p>
            </div>
          </div>

          <div className="citizen-signup-web-copy">
            <span className="citizen-signup-web-badge">Register</span>
            <h1>Create A Citizen Account</h1>
            <p>
              Register for the affected-citizen portal, validate your identity,
              and prepare your household access before emergencies escalate.
            </p>
          </div>

        </aside>

        <section className="citizen-signup-web-panel">
          <header className="citizen-signup-web-intro">
            <h2>Citizen Registration</h2>
            <p>
              Complete the registration form to activate citizen preparedness
              access, alerts, and response support.
            </p>
          </header>

          <article className="citizen-signup-web-card">
            <form className="citizen-signup-web-form" onSubmit={handleRegister}>
              <div className="citizen-signup-web-field">
                <label htmlFor="signup-username">Create username</label>
                <input
                  id="signup-username"
                  name="signup-username"
                  type="text"
                  placeholder="family.cluster.04"
                />
              </div>

              <div className="citizen-signup-web-field">
                <label htmlFor="signup-password">Create password</label>
                <input
                  id="signup-password"
                  name="signup-password"
                  type="password"
                  placeholder="********"
                />
              </div>

              <div className="citizen-signup-web-field">
                <label htmlFor="signup-id">Upload government ID</label>
                <div className="citizen-signup-web-upload">
                  <input
                    className="citizen-signup-web-file-input"
                    id="signup-id"
                    name="signup-id"
                    type="file"
                    accept=".jpg,.jpeg,.png"
                    onChange={(event) =>
                      setSelectedIdName(
                        event.target.files?.[0]?.name ?? "No file selected"
                      )
                    }
                  />
                  <label
                    className="citizen-signup-web-upload-dropzone"
                    htmlFor="signup-id"
                  >
                    <div className="citizen-signup-web-upload-icon">📄</div>
                    <div className="citizen-signup-web-upload-content">
                      <span className="citizen-signup-web-upload-title">
                        {selectedIdName === "No file selected" 
                          ? "Upload file or drag here" 
                          : "File selected"}
                      </span>
                      <span className="citizen-signup-web-upload-hint">
                        JPG or PNG • Max 5MB
                      </span>
                      {selectedIdName !== "No file selected" && (
                        <span className="citizen-signup-web-upload-name">
                          {selectedIdName}
                        </span>
                      )}
                    </div>
                  </label>
                </div>
              </div>

              <button className="citizen-signup-web-primary" type="submit">
                Submit Registration
              </button>
            </form>

            <p className="citizen-signup-web-login-copy">
              Already have an account? <Link href="/citizen/login">Log in here</Link>.
            </p>
          </article>
        </section>
      </section>
    </main>
  );
}
