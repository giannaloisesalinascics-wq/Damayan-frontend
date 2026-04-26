"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import AuthLayout from "../../components/AuthLayout";
import { login } from "../../lib/api";
import { saveSession } from "../../lib/session";
import { AppRole } from "../../lib/types";

export default function CitizenAuthPage() {
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleLogin(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(event.currentTarget);
    const email = formData.get("citizen-email") as string;
    const password = formData.get("citizen-password") as string;

    try {
      const response = await login({
        email,
        password,
        requiredRole: AppRole.CITIZEN,
      });

      saveSession({
        accessToken: response.access_token,
        expiresIn: response.expiresIn,
        user: response.user,
      });

      router.push("/citizen/beforecalamity");
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <AuthLayout
      persona="citizen"
      portalName="Affected Citizen Portal"
      eyebrow="Community Emergency Access"
      headline={
        <>
          Stay Ready.<br />Stay Safe.<br />
          <span className="auth-headline-accent">Stay Connected.</span>
        </>
      }
      subline="Access real-time alerts, your QR ID, evacuation routes, and relief aid updates — all in one place."
      badgeText="Citizen Login"
      formTitle="Welcome back"
      formSub="Sign in to access your citizen dashboard."
      switchText="Need a staff portal?"
      switchLink="/login"
    >
      <form className="auth-form" onSubmit={handleLogin}>
        <div className="auth-field">
          <label htmlFor="citizen-email">Email Address</label>
          <input
            id="citizen-email"
            name="citizen-email"
            type="email"
            placeholder="juan.delacruz@email.com"
            autoComplete="email"
            required
          />
        </div>

        <div className="auth-field">
          <div className="auth-field-row">
            <label htmlFor="citizen-password">Password</label>
            <Link href="/citizen/forgot-password" className="auth-forgot-link">
              Forgot password?
            </Link>
          </div>
          <div className="auth-input-wrap">
            <input
              id="citizen-password"
              name="citizen-password"
              type={showPass ? "text" : "password"}
              placeholder="Enter your password"
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
          {isLoading ? "Signing in..." : "Sign In to Citizen Dashboard"}
        </button>
      </form>

      <p className="auth-switch-copy">
        Don&apos;t have an account?{" "}
        <Link href="/citizen/signup">Create one here</Link>
      </p>
    </AuthLayout>
  );
}
