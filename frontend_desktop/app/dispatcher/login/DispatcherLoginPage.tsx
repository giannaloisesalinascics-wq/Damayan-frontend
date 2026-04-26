"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { login } from "../../lib/api";
import { saveSession } from "../../lib/session";
import { AppRole } from "../../lib/types";

export default function DispatcherLoginPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("dispatcher-email") as string;
    const password = formData.get("dispatcher-password") as string;

    try {
      const response = await login({
        email,
        password,
        requiredRole: AppRole.DISPATCHER,
      });

      saveSession({
        accessToken: response.access_token,
        expiresIn: response.expiresIn,
        user: response.user,
      });

      router.push("/dispatcher/beforecalamity");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      persona="dispatcher"
      portalName="Dispatcher Portal"
      eyebrow="Dispatch & Coordination"
      headline={
        <>
          Unified Commands.<br />
          Rapid Rescues.<br />
          <span className="auth-headline-accent">Real-time Relief.</span>
        </>
      }
      subline="Access the live dispatch map, incident reports, and emergency resource allocation to coordinate rescue operations across all sites."
      badgeText="Dispatcher Login"
      formTitle="Mission Control"
      formSub="Sign in to oversee the emergency response network."
      switchText="Need the staff portal?"
      switchLink="/login"
    >
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="auth-field">
          <label htmlFor="dispatcher-email">Email Address</label>
          <input
            id="dispatcher-email"
            name="dispatcher-email"
            type="email"
            placeholder="dispatcher@damayan.ph"
            autoComplete="email"
            required
          />
        </div>

        <div className="auth-field">
          <div className="auth-field-row">
            <label htmlFor="dispatcher-password">Password</label>
          </div>
          <div className="auth-input-wrap">
            <input
              id="dispatcher-password"
              name="dispatcher-password"
              type={showPass ? "text" : "password"}
              placeholder="Enter your security credential"
              autoComplete="current-password"
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

        {error && <p className="auth-error-copy">{error}</p>}

        <button 
          className="auth-submit" 
          type="submit" 
          disabled={isLoading}
          style={{ opacity: isLoading ? 0.7 : 1, cursor: isLoading ? "not-allowed" : "pointer" }}
        >
          {isLoading ? "Signing in..." : "Log In to Dispatch Dashboard"}
        </button>
      </form>
    </AuthLayout>
  );
}
