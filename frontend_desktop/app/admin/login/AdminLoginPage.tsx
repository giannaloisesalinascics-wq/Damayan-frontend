"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { ApiError, getProfile, login } from "../../lib/api";
import { saveSession } from "../../lib/session";

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setLoading(true);
      setError(null);
      const result = await login({ email, password, rememberMe: true });

      if (result.user.role !== "admin") {
        setError("This account does not have admin access.");
        return;
      }

      const accessToken = result.access_token?.trim();
      if (!accessToken) {
        setError("Login succeeded but no access token was returned.");
        return;
      }

      // Verify token before redirect to avoid page flash then immediate logout.
      const profile = await getProfile(accessToken);

      saveSession({
        accessToken,
        expiresIn: result.expiresIn,
        user: profile.user,
      });
      router.push("/admin/beforecalamity");
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiError
          ? caughtError.message
          : "Unable to sign in right now.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout
      persona="admin"
      portalName="System Administration"
      eyebrow="Root Operations"
      headline={
        <>
          Central Controls.<br />
          System Integrity.<br />
          <span className="auth-headline-accent">Global Oversight.</span>
        </>
      }
      subline="Manage regional settings, authorize staff credentials, and oversee the entire emergency response platform from the master console."
      badgeText="Root Access"
      formTitle="Admin Console"
      formSub="Sign in to manage the Damayan network."
      switchText="Looking for a staff portal?"
      switchLink="/login"
    >
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="auth-field">
          <label htmlFor="admin-email">Admin Email</label>
          <input
            id="admin-email"
            name="admin-email"
            type="email"
            placeholder="root.admin@agency.gov.ph"
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>

        <div className="auth-field">
          <div className="auth-field-row">
            <label htmlFor="admin-password">Master Key</label>
          </div>
          <div className="auth-input-wrap">
            <input
              id="admin-password"
              name="admin-password"
              type={showPass ? "text" : "password"}
              placeholder="Enter master password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              required
            />
            <button
              type="button"
              className="auth-toggle-pass"
              onClick={() => setShowPass((v) => !v)}
              aria-label="Toggle password visibility"
            >
              {showPass ? "Hide" : "Show"}
            </button>
          </div>
        </div>

        {error ? <p className="auth-error-copy">{error}</p> : null}

        <button className="auth-submit" type="submit">
          {loading ? "Signing in..." : "Initialize System Admin Dashboard"}
        </button>
      </form>
    </AuthLayout>
  );
}
