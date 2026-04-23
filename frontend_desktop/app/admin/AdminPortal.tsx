"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import "./AdminPortal.css";

// ─── Types ────────────────────────────────────────────────────────────────────
type AdminPage =
  | "overview"
  | "approvals"
  | "qr_management"
  | "disaster_monitoring"
  | "early_warning"
  | "system_health"
  | "profile";

type AccountStatus = "PENDING" | "APPROVED" | "REJECTED";
type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";
type CalamityPhase = "BEFORE" | "DURING" | "AFTER";
type WarningStep =
  | "monitor"
  | "forecast"
  | "identify"
  | "validate"
  | "configure"
  | "broadcast"
  | "monitor_response"
  | "calamity_check"
  | "risk_check"
  | "escalate"
  | "deescalate"
  | "notify_passed";
type CalamityState = "none" | "before" | "during" | "after";
type ServiceStatus = "OPERATIONAL" | "DEGRADED" | "DOWN";

interface PendingAccount {
  id: string;
  name: string;
  role: string;
  area: string;
  email: string;
  submitted: string;
  docs: { name: string; type: string; status: "VERIFIED" | "PENDING" | "FAILED" }[];
  status: AccountStatus;
  rejectReason?: string;
  qrGenerated?: boolean;
  familyQrRequested?: boolean;
  familyQrGenerated?: boolean;
}

interface QRRecord {
  id: string;
  name: string;
  type: "individual" | "family";
  area: string;
  issuedAt: string;
  familySize?: number;
  linkedAccountId?: string;
}

interface DisasterEvent {
  id: string;
  name: string;
  type: string;
  severity: string;
  phase: CalamityPhase;
  areas: string;
  affected: number;
  tickets: number;
  dispatchers: number;
  riskLevel: RiskLevel;
  notes?: string;
}

interface WarningConfig {
  type: string;
  areas: string[];
  severity: string;
  message: string;
  useSMS: boolean;
  usePush: boolean;
}

interface ServiceHealth {
  name: string;
  status: ServiceStatus;
  latency: string;
  uptime: string;
  note?: string;
}

interface AdminProfile {
  name: string;
  initials: string;
  badge: string;
  station: string;
  email: string;
  phone: string;
  role: string;
}

interface ToastItem {
  id: number;
  type: "success" | "error" | "info" | "warning";
  title: string;
  sub?: string;
}

interface Notification {
  id: number;
  title: string;
  sub: string;
  time: string;
  type: "red" | "blue" | "green" | "amber";
  read: boolean;
}

// ─── Initial Data ─────────────────────────────────────────────────────────────
const INITIAL_ACCOUNTS: PendingAccount[] = [
  {
    id: "ACC-1041",
    name: "Ana Torres",
    role: "Dispatcher",
    area: "Metro Cluster 5",
    email: "a.torres@ndrrmc.gov.ph",
    submitted: "2h ago",
    docs: [
      { name: "Government-Issued ID", type: "UMID", status: "VERIFIED" },
      { name: "Employment Certificate", type: "PDF", status: "VERIFIED" },
    ],
    status: "PENDING",
  },
  {
    id: "ACC-1042",
    name: "Renz Villanueva",
    role: "Dispatcher",
    area: "Metro Cluster 3",
    email: "r.villanueva@ndrrmc.gov.ph",
    submitted: "4h ago",
    docs: [
      { name: "Government-Issued ID", type: "Passport", status: "VERIFIED" },
      { name: "Barangay Clearance", type: "PDF", status: "PENDING" },
    ],
    status: "PENDING",
  },
  {
    id: "ACC-1043",
    name: "Liza Ramos",
    role: "Site Manager",
    area: "Zone B-3",
    email: "l.ramos@dswd.gov.ph",
    submitted: "1d ago",
    docs: [
      { name: "Government-Issued ID", type: "Driver's License", status: "VERIFIED" },
      { name: "Employment Certificate", type: "PDF", status: "VERIFIED" },
      { name: "Authorization Letter", type: "PDF", status: "PENDING" },
    ],
    status: "PENDING",
  },
  {
    id: "ACC-1044",
    name: "Carlos Mendez",
    role: "Site Manager",
    area: "District 4",
    email: "c.mendez@lgu-qc.gov.ph",
    submitted: "2d ago",
    docs: [
      { name: "Government-Issued ID", type: "PhilSys ID", status: "VERIFIED" },
      { name: "Appointment Order", type: "PDF", status: "VERIFIED" },
    ],
    status: "APPROVED",
    qrGenerated: true,
  },
  {
    id: "ACC-1045",
    name: "Patricia Gomez",
    role: "Dispatcher",
    area: "Metro Cluster 7",
    email: "p.gomez@ndrrmc.gov.ph",
    submitted: "3d ago",
    docs: [{ name: "Government-Issued ID", type: "UMID", status: "FAILED" }],
    status: "REJECTED",
    rejectReason: "Submitted ID is expired. Please resubmit with a valid document.",
  },
];

const INITIAL_QR: QRRecord[] = [
  { id: "QR-5001", name: "Carlos Mendez", type: "individual", area: "District 4", issuedAt: "Today 10:00", linkedAccountId: "ACC-1044" },
  { id: "QR-5002", name: "Santos Family", type: "family", area: "Zone A-4", issuedAt: "Today 09:30", familySize: 5 },
  { id: "QR-5003", name: "Maria Reyes", type: "individual", area: "North District", issuedAt: "Today 09:00" },
  { id: "QR-5004", name: "Dela Rosa Family", type: "family", area: "Sector 12", issuedAt: "Yesterday", familySize: 3 },
];

const INITIAL_DISASTERS: DisasterEvent[] = [
  { id: "DIS-001", name: "Typhoon Kristine", type: "Typhoon", severity: "CAT 3", phase: "DURING", areas: "Metro Manila, Rizal, Laguna", affected: 18432, tickets: 142, dispatchers: 4, riskLevel: "CRITICAL" },
  { id: "DIS-002", name: "Flooding — Laguna Basin", type: "Flood", severity: "WATCH", phase: "BEFORE", areas: "Laguna, Cavite", affected: 3200, tickets: 12, dispatchers: 1, riskLevel: "HIGH" },
  { id: "DIS-003", name: "Landslide — Rizal Province", type: "Landslide", severity: "RESOLVED", phase: "AFTER", areas: "Antipolo, Montalban", affected: 780, tickets: 87, dispatchers: 0, riskLevel: "LOW" },
];

const FORECAST_DATA = [
  { area: "Metro Manila", risk: "CRITICAL" as RiskLevel, rainfall: "Heavy (120mm+)", wind: "140 km/h", action: "Immediate evacuation recommended" },
  { area: "Laguna Basin", risk: "HIGH" as RiskLevel, rainfall: "Moderate-Heavy", wind: "80 km/h", action: "Pre-position resources, monitor closely" },
  { area: "Rizal Province", risk: "HIGH" as RiskLevel, rainfall: "Moderate", wind: "65 km/h", action: "Pre-emptive evacuation for high-risk zones" },
  { area: "Cavite Lowlands", risk: "MEDIUM" as RiskLevel, rainfall: "Moderate", wind: "55 km/h", action: "Alert standing by" },
  { area: "Bulacan North", risk: "LOW" as RiskLevel, rainfall: "Light", wind: "30 km/h", action: "Standard monitoring" },
];

const LIVE_FEEDS = [
  { src: "PAGASA", data: "Typhoon Kristine — CAT 3, winds 140 km/h, ETA landfall +5h", status: "LIVE" },
  { src: "NDRRMC", data: "Flood watch: Laguna Basin, Marikina River approaching Lvl 2", status: "LIVE" },
  { src: "Rainfall Sensors", data: "Heavy rainfall sustained 4h in Districts 3, 4, 5", status: "LIVE" },
  { src: "River Level Monitor", data: "Marikina River: 18.6m — Alert Level 2 (threshold: 20m)", status: "LIVE" },
];

const SYSTEM_SERVICES: ServiceHealth[] = [
  { name: "API Gateway", status: "OPERATIONAL", latency: "11ms", uptime: "99.98%" },
  { name: "Auth Service", status: "OPERATIONAL", latency: "8ms", uptime: "99.99%" },
  { name: "Notification Service", status: "DEGRADED", latency: "340ms", uptime: "98.1%", note: "SMS provider rate limiting — ETA fix 15min" },
  { name: "GIS / Mapping API", status: "OPERATIONAL", latency: "24ms", uptime: "99.95%" },
  { name: "Screening API", status: "OPERATIONAL", latency: "58ms", uptime: "99.91%" },
  { name: "QR Code Service", status: "OPERATIONAL", latency: "15ms", uptime: "99.97%" },
  { name: "Database (Supabase)", status: "OPERATIONAL", latency: "18ms", uptime: "99.99%" },
  { name: "File Storage", status: "OPERATIONAL", latency: "22ms", uptime: "99.93%" },
];

const ADMIN_PROFILE: AdminProfile = {
  name: "Juan C. dela Cruz",
  initials: "JD",
  badge: "ADM-2024-0012",
  station: "NDRRMC National Operations Center",
  email: "j.delacruz@ndrrmc.gov.ph",
  phone: "09XX-801-0012",
  role: "System Administrator",
};

const INITIAL_NOTIFICATIONS: Notification[] = [
  { id: 1, title: "3 Pending Approvals", sub: "ACC-1041, ACC-1042, ACC-1043 awaiting review", time: "Just now", type: "red", read: false },
  { id: 2, title: "Notification Service Degraded", sub: "SMS latency 340ms — engineering notified", time: "5 min ago", type: "amber", read: false },
  { id: 3, title: "DIS-001 Status Update", sub: "Typhoon Kristine — risk level remains CRITICAL", time: "12 min ago", type: "red", read: false },
  { id: 4, title: "QR-5001 Issued", sub: "Carlos Mendez individual QR generated", time: "2h ago", type: "green", read: true },
];

// ─── Color maps ───────────────────────────────────────────────────────────────
const RISK_CLASS: Record<RiskLevel, string> = {
  CRITICAL: "red",
  HIGH: "orange",
  MEDIUM: "amber",
  LOW: "green",
};

const PHASE_CLASS: Record<CalamityPhase, string> = {
  BEFORE: "before",
  DURING: "during",
  AFTER: "after",
};

const PHASE_LABEL: Record<CalamityPhase, string> = {
  BEFORE: "⚡ Before",
  DURING: "🚨 During",
  AFTER: "✅ After",
};

const RISK_COLOR: Record<RiskLevel, string> = {
  CRITICAL: "var(--admin-red)",
  HIGH: "var(--admin-orange)",
  MEDIUM: "var(--admin-amber)",
  LOW: "var(--admin-green)",
};

const TOAST_ICONS = { success: "✅", error: "❌", info: "ℹ️", warning: "⚠️" };

// ─── Toast container ──────────────────────────────────────────────────────────
function ToastContainer({ toasts }: { toasts: ToastItem[] }) {
  return (
    <div className="admin-toast-wrap">
      {toasts.map((t) => (
        <div key={t.id} className={`admin-toast ${t.type}`}>
          <span className="admin-toast-ico">{TOAST_ICONS[t.type]}</span>
          <div>
            <div className="admin-toast-title">{t.title}</div>
            {t.sub && <div className="admin-toast-sub">{t.sub}</div>}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Modal ────────────────────────────────────────────────────────────────────
function Modal({
  title,
  onClose,
  children,
  footer,
  wide,
  narrow,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  wide?: boolean;
  narrow?: boolean;
}) {
  const cls = ["admin-modal", wide ? "wide" : "", narrow ? "narrow" : ""].filter(Boolean).join(" ");
  return (
    <div className="admin-modal-backdrop" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className={cls}>
        <div className="admin-modal-header">
          <div className="admin-modal-title">{title}</div>
          <button className="admin-modal-close" onClick={onClose}>✕</button>
        </div>
        <div className="admin-modal-body">{children}</div>
        {footer && <div className="admin-modal-footer">{footer}</div>}
      </div>
    </div>
  );
}

// ─── Stepper ──────────────────────────────────────────────────────────────────
function Stepper({ steps, current }: { steps: { id: string; label: string }[]; current: string }) {
  const currentIdx = steps.findIndex((s) => s.id === current);
  return (
    <div className="admin-stepper">
      {steps.map((step, i) => {
        const isDone = i < currentIdx;
        const isActive = i === currentIdx;
        return (
          <div key={step.id} className="admin-step-wrap">
            <div className="admin-step">
              <div className={`admin-step-circle ${isDone ? "done" : isActive ? "active" : "pending"}`}>
                {isDone ? "✓" : i + 1}
              </div>
              <div className={`admin-step-label ${isDone ? "done" : isActive ? "active" : ""}`}>
                {step.label}
              </div>
            </div>
            {i < steps.length - 1 && (
              <div className={`admin-step-connector ${isDone ? "done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  LOGIN PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function AdminLoginPage({ onLogin }: { onLogin: () => void }) {
  const [mode, setMode] = useState<"login" | "register">("login");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [forgotMode, setForgotMode] = useState(false);
  const [forgotEmail, setForgotEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");
  const [loginError, setLoginError] = useState("");
  const [idFile, setIdFile] = useState(false);
  const [waitingVerification, setWaitingVerification] = useState(false);
  const [registerName, setRegisterName] = useState("");
  const [registerEmail, setRegisterEmail] = useState("");

  const handleLogin = () => {
    if (!username || !password) { setLoginError("Enter username and password."); return; }
    if (username === "admin" && password === "admin123") { setLoginError(""); onLogin(); return; }
    // Demo — accept any non-empty
    setLoginError(""); onLogin();
  };

  const handleRegister = () => {
    if (!registerName || !registerEmail || !password || !idFile) return;
    setWaitingVerification(true);
  };

  const handleSendOtp = () => {
    if (!forgotEmail) return;
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (!otp) return;
    setForgotMode(false);
    setOtpSent(false);
    setOtp("");
    setForgotEmail("");
  };

  const features = [
    { icon: "✅", label: "Account Approvals", desc: "Review and validate role applications" },
    { icon: "📱", label: "QR Management", desc: "Issue individual and family QR codes" },
    { icon: "🌀", label: "Disaster Monitoring", desc: "Live feeds, forecasts, risk areas" },
    { icon: "📡", label: "Early Warning", desc: "Configure and broadcast alerts" },
    { icon: "💻", label: "System Health", desc: "Monitor all platform services" },
  ];

  return (
    <div style={{ minHeight: "100vh", display: "flex", background: "#0b0e1f", fontFamily: "Public Sans, sans-serif" }}>
      {/* Left brand panel */}
      <div style={{
        width: "42%",
        background: "linear-gradient(155deg, #0f1a4a 0%, #1e3a8a 50%, #1e40af 100%)",
        padding: "3rem 3rem",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        position: "relative",
        overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{ position: "absolute", top: -80, right: -80, width: 260, height: 260, borderRadius: "50%", background: "rgba(255,255,255,0.04)" }} />
        <div style={{ position: "absolute", bottom: 100, left: -60, width: 200, height: 200, borderRadius: "50%", background: "rgba(0,0,0,0.1)" }} />

        <div style={{ position: "relative" }}>
          {/* Logo */}
          <div style={{ display: "flex", alignItems: "center", gap: "0.75rem", marginBottom: "3rem" }}>
            <div style={{ width: "2.5rem", height: "2.5rem", background: "rgba(255,255,255,0.14)", borderRadius: "0.7rem", display: "grid", placeItems: "center", fontWeight: 900, fontSize: "1.2rem", color: "#fff" }}>D</div>
            <div>
              <div style={{ fontWeight: 900, fontSize: "1.2rem", color: "#fff", letterSpacing: "-0.02em" }}>Damayan</div>
              <div style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.42)" }}>Admin Console</div>
            </div>
          </div>

          <div style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.45)", marginBottom: "0.75rem" }}>
            Command · Control · Coordinate
          </div>
          <h1 style={{ fontSize: "clamp(2.4rem, 3.5vw, 4rem)", fontWeight: 900, color: "#fff", lineHeight: 0.98, letterSpacing: "-0.04em", marginBottom: "1.2rem" }}>
            The Admin<br /><span style={{ color: "rgba(147,197,253,0.9)" }}>Command Center.</span>
          </h1>
          <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "0.88rem", lineHeight: 1.7, maxWidth: "28rem" }}>
            System-wide oversight for the DAMAYAN disaster response platform. Manage accounts, broadcast warnings, monitor disasters, and maintain platform health.
          </p>
        </div>

        {/* Feature grid */}
        <div style={{ position: "relative" }}>
          <div style={{ fontSize: "0.62rem", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", color: "rgba(255,255,255,0.3)", marginBottom: "0.75rem" }}>Platform Capabilities</div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem" }}>
            {features.map((f) => (
              <div key={f.label} style={{ background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "0.85rem", padding: "0.85rem 1rem", display: "flex", gap: "0.65rem", alignItems: "flex-start" }}>
                <span style={{ fontSize: "1.1rem", flexShrink: 0 }}>{f.icon}</span>
                <div>
                  <div style={{ fontWeight: 800, fontSize: "0.78rem", color: "#fff", marginBottom: "0.15rem" }}>{f.label}</div>
                  <div style={{ fontSize: "0.68rem", color: "rgba(255,255,255,0.45)", lineHeight: 1.4 }}>{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right form panel */}
      <div style={{ flex: 1, background: "#fff", padding: "3rem 3.5rem", display: "flex", flexDirection: "column", justifyContent: "center", overflowY: "auto" }}>
        <div style={{ maxWidth: "28rem", width: "100%" }}>

          {/* Waiting for verification */}
          {waitingVerification ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>⏳</div>
              <h2 style={{ fontSize: "1.6rem", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: "0.6rem" }}>Awaiting Verification</h2>
              <p style={{ color: "#6b7494", fontSize: "0.88rem", lineHeight: 1.7, marginBottom: "1.5rem" }}>
                Your Government ID has been submitted. An existing administrator will review and approve your account. You will be notified via email.
              </p>
              <button onClick={() => { setWaitingVerification(false); setMode("login"); }} style={{ padding: "0.75rem 1.5rem", background: "#f5f6f8", border: "1.5px solid #e8eaed", borderRadius: "0.65rem", fontWeight: 700, cursor: "pointer", fontSize: "0.88rem", fontFamily: "Public Sans, sans-serif" }}>
                ← Back to Login
              </button>
            </div>
          ) : forgotMode ? (
            /* Forgot password */
            <div>
              <div style={{ marginBottom: "1.5rem" }}>
                <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.75rem", borderRadius: "999px", background: "rgba(37,99,235,0.08)", color: "#1e40af", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.85rem" }}>Reset Password</div>
                <h2 style={{ fontSize: "1.75rem", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: "0.5rem" }}>Reset Your Password</h2>
                <p style={{ color: "#6b7494", fontSize: "0.85rem", lineHeight: 1.65 }}>Enter your admin email to receive a one-time reset link via Email/SMS.</p>
              </div>
              <div className="admin-form-grid">
                <div className="admin-form-group">
                  <label className="admin-form-label">Admin Email</label>
                  <input className="admin-form-input" type="email" placeholder="admin@damayan.gov.ph" value={forgotEmail} onChange={(e) => setForgotEmail(e.target.value)} />
                </div>
                {!otpSent ? (
                  <button className="admin-btn admin-btn-accent" style={{ width: "100%", justifyContent: "center", padding: "0.85rem" }} onClick={handleSendOtp}>
                    📧 Send Reset Link via Email/SMS
                  </button>
                ) : (
                  <>
                    <div className="admin-alert info">
                      <span className="admin-alert-icon">📧</span>
                      <div>A 6-digit OTP has been sent to <strong>{forgotEmail}</strong>. Enter it below to create a new password.</div>
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">OTP Code</label>
                      <input className="admin-form-input" placeholder="6-digit code" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">New Password</label>
                      <input className="admin-form-input" type="password" placeholder="••••••••" />
                    </div>
                    <button className="admin-btn admin-btn-accent" style={{ width: "100%", justifyContent: "center", padding: "0.85rem" }} onClick={handleVerifyOtp}>
                      Verify OTP & Update Password →
                    </button>
                  </>
                )}
                <button onClick={() => { setForgotMode(false); setOtpSent(false); }} style={{ background: "none", border: "none", color: "#6b7494", fontSize: "0.82rem", cursor: "pointer", fontFamily: "Public Sans, sans-serif", padding: 0, fontWeight: 600, textAlign: "left" }}>
                  ← Back to Login
                </button>
              </div>
            </div>
          ) : (
            <>
              {/* Tab switch */}
              <div style={{ display: "flex", background: "#f5f6f8", borderRadius: "0.75rem", padding: "3px", marginBottom: "1.5rem" }}>
                {(["login", "register"] as const).map((m) => (
                  <button key={m} onClick={() => setMode(m)} style={{ flex: 1, padding: "0.6rem", border: "none", borderRadius: "0.55rem", background: mode === m ? "#fff" : "transparent", fontWeight: mode === m ? 800 : 500, fontSize: "0.82rem", cursor: "pointer", color: mode === m ? "#1a1c2e" : "#6b7494", boxShadow: mode === m ? "0 2px 6px rgba(0,0,0,0.07)" : "none", fontFamily: "Public Sans, sans-serif", transition: "all 0.15s" }}>
                    {m === "login" ? "Login" : "Register"}
                  </button>
                ))}
              </div>

              {mode === "login" ? (
                <>
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.75rem", borderRadius: "999px", background: "rgba(37,99,235,0.08)", color: "#1e40af", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.85rem" }}>Admin Login</div>
                    <h2 style={{ fontSize: "1.75rem", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: "0.4rem" }}>Admin Sign In</h2>
                    <p style={{ color: "#6b7494", fontSize: "0.85rem" }}>Access the DAMAYAN administration console.</p>
                  </div>

                  {loginError && (
                    <div className="admin-alert critical" style={{ marginBottom: "1rem" }}>
                      <span className="admin-alert-icon">❌</span>
                      <div>{loginError}</div>
                    </div>
                  )}

                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Username</label>
                      <input className="admin-form-input" placeholder="admin_username" value={username} onChange={(e) => setUsername(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
                    </div>
                    <div className="admin-form-group">
                      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.45rem" }}>
                        <label className="admin-form-label" style={{ marginBottom: 0 }}>Password</label>
                        <button onClick={() => setForgotMode(true)} style={{ background: "none", border: "none", color: "#2563eb", fontSize: "0.75rem", cursor: "pointer", fontWeight: 700, fontFamily: "Public Sans, sans-serif", padding: 0 }}>
                          Forgot password?
                        </button>
                      </div>
                      <input className="admin-form-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} onKeyDown={(e) => e.key === "Enter" && handleLogin()} />
                    </div>
                    <button className="admin-btn admin-btn-primary" style={{ width: "100%", justifyContent: "center", padding: "0.9rem", fontSize: "0.92rem", borderRadius: "0.75rem", marginTop: "0.25rem" }} onClick={handleLogin}>
                      Sign In to Admin Console →
                    </button>
                  </div>

                  <div style={{ marginTop: "1.2rem", padding: "0.85rem 1rem", background: "#f5f6f8", borderRadius: "0.85rem", fontSize: "0.78rem", color: "#6b7494" }}>
                    <strong style={{ color: "#1a1c2e" }}>Demo access:</strong> username <code style={{ background: "#e8eaed", padding: "1px 5px", borderRadius: "4px", fontSize: "0.75rem" }}>admin</code> · password <code style={{ background: "#e8eaed", padding: "1px 5px", borderRadius: "4px", fontSize: "0.75rem" }}>admin123</code>
                  </div>
                </>
              ) : (
                <>
                  <div style={{ marginBottom: "1.5rem" }}>
                    <div style={{ display: "inline-flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.75rem", borderRadius: "999px", background: "rgba(37,99,235,0.08)", color: "#1e40af", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: "0.85rem" }}>Register</div>
                    <h2 style={{ fontSize: "1.75rem", fontWeight: 900, letterSpacing: "-0.04em", marginBottom: "0.4rem" }}>Create Admin Account</h2>
                    <p style={{ color: "#6b7494", fontSize: "0.85rem", lineHeight: 1.6 }}>Register with your credentials and government ID for admin verification.</p>
                  </div>
                  <div className="admin-form-grid">
                    <div className="admin-form-group">
                      <label className="admin-form-label">Full Name</label>
                      <input className="admin-form-input" placeholder="Juan dela Cruz" value={registerName} onChange={(e) => setRegisterName(e.target.value)} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Email Address</label>
                      <input className="admin-form-input" type="email" placeholder="admin@agency.gov.ph" value={registerEmail} onChange={(e) => setRegisterEmail(e.target.value)} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Password</label>
                      <input className="admin-form-input" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
                    </div>
                    <div className="admin-form-group">
                      <label className="admin-form-label">Upload Valid Government ID *</label>
                      <div
                        className={`admin-upload-zone ${idFile ? "active" : ""}`}
                        onClick={() => setIdFile(true)}
                      >
                        {idFile ? (
                          <div style={{ color: "var(--admin-green)", fontWeight: 700, fontSize: "0.88rem" }}>✅ Government ID Uploaded</div>
                        ) : (
                          <>
                            <div style={{ fontSize: "2rem", marginBottom: "0.5rem" }}>📄</div>
                            <div style={{ fontSize: "0.82rem", color: "var(--admin-text-soft)", fontWeight: 600 }}>Click to upload Government ID</div>
                            <div style={{ fontSize: "0.72rem", color: "#bbb", marginTop: "0.25rem" }}>PNG, JPG, PDF accepted</div>
                          </>
                        )}
                      </div>
                    </div>
                    <button
                      className="admin-btn admin-btn-primary"
                      style={{ width: "100%", justifyContent: "center", padding: "0.9rem", fontSize: "0.92rem", borderRadius: "0.75rem", opacity: registerName && registerEmail && password && idFile ? 1 : 0.5 }}
                      onClick={handleRegister}
                      disabled={!registerName || !registerEmail || !password || !idFile}
                    >
                      Submit Registration →
                    </button>
                  </div>
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DASHBOARD / OVERVIEW
// ═══════════════════════════════════════════════════════════════════════════════
function OverviewPage({
  accounts,
  qrRecords,
  disasters,
  activityLog,
  setPage,
}: {
  accounts: PendingAccount[];
  qrRecords: QRRecord[];
  disasters: DisasterEvent[];
  activityLog: { time: string; type: string; msg: string; col: string }[];
  setPage: (p: AdminPage) => void;
}) {
  const pending = accounts.filter((a) => a.status === "PENDING").length;
  const activeDisasters = disasters.filter((d) => d.phase !== "AFTER").length;

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h2>System Overview</h2>
          <p>Real-time platform status, pending actions, and key metrics</p>
        </div>
        <div className="admin-head-actions">
          <span className="admin-live"><span className="admin-live-dot" />LIVE</span>
        </div>
      </div>

      <div className="admin-stats-row admin-stats-5">
        <div className="admin-stat red">
          <div className="admin-stat-label">Active Disasters</div>
          <div className="admin-stat-value">{activeDisasters}</div>
          <div className="admin-stat-note">Require monitoring</div>
        </div>
        <div className="admin-stat orange">
          <div className="admin-stat-label">Pending Approvals</div>
          <div className="admin-stat-value">{pending}</div>
          <div className="admin-stat-note">Awaiting review</div>
        </div>
        <div className="admin-stat blue">
          <div className="admin-stat-label">QR Codes Issued</div>
          <div className="admin-stat-value">{qrRecords.length}</div>
          <div className="admin-stat-note">Total issued</div>
        </div>
        <div className="admin-stat green">
          <div className="admin-stat-label">Active Dispatchers</div>
          <div className="admin-stat-value">5</div>
          <div className="admin-stat-note">On duty</div>
        </div>
        <div className="admin-stat violet">
          <div className="admin-stat-label">Total Tickets</div>
          <div className="admin-stat-value">{disasters.reduce((s, d) => s + d.tickets, 0)}</div>
          <div className="admin-stat-note">All events</div>
        </div>
      </div>

      <div className="admin-grid-56">
        {/* Disaster events */}
        <div>
          <div className="admin-card" style={{ marginBottom: "1rem" }}>
            <div className="admin-card-header">
              <div className="admin-card-title">🌀 Active Disaster Events</div>
              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setPage("disaster_monitoring")}>View All</button>
            </div>
            <div className="admin-table-wrap">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Event</th>
                    <th>Phase</th>
                    <th>Risk</th>
                    <th>Tickets</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {disasters.map((d) => (
                    <tr key={d.id}>
                      <td>
                        <div style={{ fontWeight: 700, fontSize: "0.82rem" }}>{d.name}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--admin-text-soft)" }}>{d.areas}</div>
                      </td>
                      <td><span className={`admin-calamity-pill ${PHASE_CLASS[d.phase]}`}>{PHASE_LABEL[d.phase]}</span></td>
                      <td><span className={`admin-badge ${RISK_CLASS[d.riskLevel]}`}>{d.riskLevel}</span></td>
                      <td style={{ fontWeight: 800 }}>{d.tickets}</td>
                      <td>
                        <button className="admin-btn admin-btn-ghost admin-btn-xs" onClick={() => setPage("disaster_monitoring")}>Monitor</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity log */}
          {activityLog.length > 0 && (
            <div className="admin-card">
              <div className="admin-card-header"><div className="admin-card-title">🕐 Recent Admin Activity</div></div>
              <div className="admin-card-body">
                <div className="admin-tl">
                  {activityLog.slice(0, 5).map((log, i) => (
                    <div key={i} className="admin-tl-item">
                      <div className="admin-tl-left">
                        <div className="admin-tl-dot" style={{ background: log.col + "18", borderColor: log.col, color: log.col, fontSize: "0.55rem" }}>
                          {log.type === "APPROVED" ? "✓" : log.type === "REJECTED" ? "✕" : log.type === "QR" ? "📱" : "📡"}
                        </div>
                        {i < Math.min(activityLog.length, 5) - 1 && <div className="admin-tl-line" />}
                      </div>
                      <div className="admin-tl-body">
                        <div className="admin-tl-title">{log.msg}</div>
                        <div className="admin-tl-time">{log.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Quick actions + Pending */}
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <div className="admin-card">
            <div className="admin-card-header"><div className="admin-card-title">⚡ Quick Actions</div></div>
            <div className="admin-card-body">
              {[
                { label: "Review Account Approvals", icon: "✅", count: pending, color: "var(--admin-orange)", page: "approvals" as AdminPage },
                { label: "Generate QR Codes", icon: "📱", count: null, color: "var(--admin-blue)", page: "qr_management" as AdminPage },
                { label: "Monitor Disasters", icon: "🌀", count: activeDisasters, color: "var(--admin-red)", page: "disaster_monitoring" as AdminPage },
                { label: "Configure Early Warning", icon: "📡", count: null, color: "var(--admin-violet)", page: "early_warning" as AdminPage },
                { label: "System Health", icon: "💻", count: null, color: "var(--admin-green)", page: "system_health" as AdminPage },
              ].map((qa) => (
                <div
                  key={qa.label}
                  onClick={() => setPage(qa.page)}
                  style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.8rem 0.9rem", background: "var(--admin-surface-low)", borderRadius: "0.65rem", marginBottom: "0.5rem", cursor: "pointer", transition: "background 0.15s" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--admin-surface-muted)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "var(--admin-surface-low)")}
                >
                  <span style={{ fontSize: "1rem" }}>{qa.icon}</span>
                  <span style={{ flex: 1, fontWeight: 700, fontSize: "0.82rem" }}>{qa.label}</span>
                  {qa.count != null && qa.count > 0 ? (
                    <span style={{ background: qa.color, color: "#fff", fontSize: "0.62rem", fontWeight: 800, padding: "2px 8px", borderRadius: "999px" }}>{qa.count}</span>
                  ) : (
                    <span style={{ color: "var(--admin-text-soft)", fontSize: "0.82rem" }}>→</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Pending accounts */}
          {pending > 0 && (
            <div className="admin-card">
              <div className="admin-card-header">
                <div className="admin-card-title">⏳ Pending Approvals</div>
                <button className="admin-btn admin-btn-accent admin-btn-sm" onClick={() => setPage("approvals")}>Review All</button>
              </div>
              <div className="admin-card-body" style={{ padding: "0.75rem" }}>
                {accounts
                  .filter((a) => a.status === "PENDING")
                  .slice(0, 3)
                  .map((a) => (
                    <div key={a.id} style={{ display: "flex", alignItems: "center", gap: "0.75rem", padding: "0.65rem 0.75rem", borderRadius: "0.65rem", marginBottom: "0.4rem", background: "var(--admin-surface-low)" }}>
                      <div style={{ width: "2rem", height: "2rem", borderRadius: "0.5rem", background: "linear-gradient(135deg, var(--admin-accent-mid), var(--admin-accent))", display: "grid", placeItems: "center", color: "#fff", fontWeight: 800, fontSize: "0.75rem", flexShrink: 0 }}>
                        {a.name[0]}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, fontSize: "0.82rem" }}>{a.name}</div>
                        <div style={{ fontSize: "0.7rem", color: "var(--admin-text-soft)" }}>{a.role} · {a.area}</div>
                      </div>
                      <span className="admin-badge amber">{a.submitted}</span>
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  APPROVALS PAGE (Swimlane: Review Docs → Is Document Valid? → Approve/Reject → Generate QR)
// ═══════════════════════════════════════════════════════════════════════════════
function ApprovalsPage({
  accounts,
  onApprove,
  onReject,
  addLog,
  showToast,
}: {
  accounts: PendingAccount[];
  onApprove: (id: string) => void;
  onReject: (id: string, reason: string) => void;
  addLog: (type: string, msg: string, col: string) => void;
  showToast: (type: ToastItem["type"], title: string, sub?: string) => void;
}) {
  const [tab, setTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [rejectTarget, setRejectTarget] = useState<PendingAccount | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [docsTarget, setDocsTarget] = useState<PendingAccount | null>(null);

  const pending = accounts.filter((a) => a.status === "PENDING");
  const approved = accounts.filter((a) => a.status === "APPROVED");
  const rejected = accounts.filter((a) => a.status === "REJECTED");

  const handleReject = () => {
    if (!rejectTarget || !rejectReason.trim()) return;
    onReject(rejectTarget.id, rejectReason);
    showToast("error", "Account Rejected", `${rejectTarget.name} — ${rejectReason.slice(0, 60)}`);
    setRejectTarget(null);
    setRejectReason("");
  };

  const docStatusBadge = (s: "VERIFIED" | "PENDING" | "FAILED") => {
    if (s === "VERIFIED") return <span className="admin-badge green">Verified</span>;
    if (s === "FAILED") return <span className="admin-badge red">Failed</span>;
    return <span className="admin-badge amber">Pending</span>;
  };

  const renderAccount = (a: PendingAccount, showActions: boolean) => (
    <div key={a.id} className="admin-applicant-card" style={{ marginBottom: "0.75rem" }}>
      <div style={{ display: "flex", gap: "1rem", alignItems: "flex-start" }}>
        {/* Avatar */}
        <div style={{ width: "2.8rem", height: "2.8rem", borderRadius: "0.75rem", background: "linear-gradient(135deg, var(--admin-accent-mid), var(--admin-accent))", display: "grid", placeItems: "center", fontSize: "1rem", fontWeight: 900, color: "#fff", flexShrink: 0 }}>
          {a.name[0]}
        </div>
        {/* Info */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.6rem", marginBottom: "0.25rem", flexWrap: "wrap" }}>
            <span style={{ fontWeight: 800, fontSize: "0.95rem" }}>{a.name}</span>
            <span className="admin-mono" style={{ fontSize: "0.7rem", color: "var(--admin-text-soft)" }}>{a.id}</span>
            {a.status === "APPROVED" && <span className="admin-badge green">Approved</span>}
            {a.status === "REJECTED" && <span className="admin-badge red">Rejected</span>}
          </div>
          <div style={{ fontSize: "0.8rem", color: "var(--admin-text-soft)", marginBottom: "0.5rem" }}>
            Role: <strong style={{ color: "var(--admin-text)" }}>{a.role}</strong> · {a.area} · {a.email}
          </div>
          <div style={{ fontSize: "0.7rem", color: "#bbb", marginBottom: "0.6rem" }}>Submitted {a.submitted}</div>
          {/* Docs */}
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
            {a.docs.map((doc) => (
              <div key={doc.name} style={{ display: "flex", alignItems: "center", gap: "0.4rem", padding: "0.3rem 0.65rem", background: "var(--admin-surface-low)", borderRadius: "0.5rem", fontSize: "0.72rem" }}>
                📄 <span style={{ fontWeight: 600 }}>{doc.name}</span> ({doc.type})
                {docStatusBadge(doc.status)}
              </div>
            ))}
          </div>
          {a.rejectReason && (
            <div style={{ marginTop: "0.6rem", padding: "0.5rem 0.75rem", background: "var(--admin-red-bg)", border: "1px solid var(--admin-red-border)", borderRadius: "0.5rem", fontSize: "0.75rem", color: "var(--admin-red)" }}>
              <strong>Rejection reason:</strong> {a.rejectReason}
            </div>
          )}
          {a.qrGenerated && (
            <div style={{ marginTop: "0.5rem", fontSize: "0.72rem", color: "var(--admin-green)", fontWeight: 700 }}>
              ✅ Individual QR generated
              {a.familyQrGenerated && " · 👨‍👩‍👧 Family QR generated"}
            </div>
          )}
        </div>
        {/* Actions */}
        {showActions && (
          <div style={{ display: "flex", flexDirection: "column", gap: "0.4rem", flexShrink: 0 }}>
            <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setDocsTarget(a)}>View Docs</button>
            <button className="admin-btn admin-btn-success admin-btn-sm" onClick={() => onApprove(a.id)}>✓ Approve</button>
            <button className="admin-btn admin-btn-danger admin-btn-sm" onClick={() => setRejectTarget(a)}>✕ Reject</button>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h2>Account Approvals</h2>
          <p>Review documents, validate identity, and approve or reject role applications</p>
        </div>
        <div className="admin-head-actions">
          {pending.length > 0 && <span className="admin-badge red">{pending.length} Pending</span>}
        </div>
      </div>

      {/* Process info */}
      <div className="admin-alert info" style={{ marginBottom: "1.25rem" }}>
        <span className="admin-alert-icon">ℹ️</span>
        <div>
          <strong>Approval Workflow:</strong> Review documents for approval → Validate document authenticity → Approve or Reject account → Auto-generate Individual QR → Check for Family QR requests
        </div>
      </div>

      <div className="admin-tabs">
        <button className={`admin-tab ${tab === "pending" ? "active" : ""}`} onClick={() => setTab("pending")}>
          Pending ({pending.length})
        </button>
        <button className={`admin-tab ${tab === "approved" ? "active" : ""}`} onClick={() => setTab("approved")}>
          Approved ({approved.length})
        </button>
        <button className={`admin-tab ${tab === "rejected" ? "active" : ""}`} onClick={() => setTab("rejected")}>
          Rejected ({rejected.length})
        </button>
      </div>

      {tab === "pending" && (
        pending.length === 0 ? (
          <div className="admin-card" style={{ padding: "3rem", textAlign: "center", color: "var(--admin-text-soft)" }}>
            <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✅</div>
            <div style={{ fontWeight: 700, fontSize: "1rem" }}>All caught up — no pending applications.</div>
          </div>
        ) : pending.map((a) => renderAccount(a, true))
      )}
      {tab === "approved" && (approved.length === 0 ? <div className="admin-card" style={{ padding: "2rem", textAlign: "center", color: "var(--admin-text-soft)" }}>No approved accounts yet.</div> : approved.map((a) => renderAccount(a, false)))}
      {tab === "rejected" && (rejected.length === 0 ? <div className="admin-card" style={{ padding: "2rem", textAlign: "center", color: "var(--admin-text-soft)" }}>No rejected accounts.</div> : rejected.map((a) => renderAccount(a, false)))}

      {/* View Docs Modal */}
      {docsTarget && (
        <Modal
          title={`Documents — ${docsTarget.name}`}
          narrow
          onClose={() => setDocsTarget(null)}
          footer={
            <>
              <button className="admin-btn admin-btn-ghost" onClick={() => setDocsTarget(null)}>Close</button>
              {docsTarget.status === "PENDING" && (
                <button className="admin-btn admin-btn-success" onClick={() => { onApprove(docsTarget.id); setDocsTarget(null); }}>
                  ✓ Approve Account
                </button>
              )}
            </>
          }
        >
          <div style={{ padding: "0.75rem", background: "var(--admin-surface-low)", borderRadius: "0.75rem", marginBottom: "1rem" }}>
            <div style={{ fontWeight: 800, fontSize: "0.95rem" }}>{docsTarget.name}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--admin-text-soft)", marginTop: "0.2rem" }}>{docsTarget.role} · {docsTarget.area} · {docsTarget.id}</div>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem" }}>
            {docsTarget.docs.map((doc) => (
              <div key={doc.name} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "0.8rem 1rem", background: "var(--admin-surface-low)", border: "1px solid var(--admin-outline)", borderRadius: "0.65rem" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: "0.82rem" }}>📄 {doc.name}</div>
                  <div style={{ fontSize: "0.7rem", color: "var(--admin-text-soft)", marginTop: "0.15rem" }}>{doc.type}</div>
                </div>
                <div style={{ display: "flex", gap: "0.5rem", alignItems: "center" }}>
                  {docStatusBadge(doc.status)}
                  <button className="admin-btn admin-btn-ghost admin-btn-xs">Preview</button>
                </div>
              </div>
            ))}
          </div>
        </Modal>
      )}

      {/* Reject Modal */}
      {rejectTarget && (
        <Modal
          title={`Reject Application — ${rejectTarget.name}`}
          narrow
          onClose={() => { setRejectTarget(null); setRejectReason(""); }}
          footer={
            <>
              <button className="admin-btn admin-btn-ghost" onClick={() => { setRejectTarget(null); setRejectReason(""); }}>Cancel</button>
              <button className="admin-btn admin-btn-danger" onClick={handleReject} disabled={!rejectReason.trim()}>
                Confirm Rejection
              </button>
            </>
          }
        >
          <div className="admin-alert warning" style={{ marginBottom: "1rem" }}>
            <span className="admin-alert-icon">⚠️</span>
            <div>Rejecting <strong>{rejectTarget.name}</strong>'s application for <strong>{rejectTarget.role}</strong>. The rejection reason will be sent to the applicant.</div>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Rejection Reason (required)</label>
            <select className="admin-form-select" value={rejectReason} onChange={(e) => setRejectReason(e.target.value)}>
              <option value="">Select a reason…</option>
              <option value="Submitted ID is expired. Please resubmit with a valid document.">Expired government ID</option>
              <option value="Submitted document appears to be tampered or forged.">Document appears tampered</option>
              <option value="Required documents are incomplete. Please submit all required documents.">Incomplete documents</option>
              <option value="Duplicate account detected. An account with this information already exists.">Duplicate account</option>
              <option value="Document failed background screening validation.">Failed background screening</option>
            </select>
          </div>
          {rejectReason && (
            <div style={{ marginTop: "0.75rem", padding: "0.65rem 0.85rem", background: "var(--admin-red-bg)", border: "1px solid var(--admin-red-border)", borderRadius: "0.65rem", fontSize: "0.8rem", color: "var(--admin-red)" }}>
              {rejectReason}
            </div>
          )}
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  QR MANAGEMENT (Swimlane: Generate Individual QR → Check Family QR → Generate Family QR)
// ═══════════════════════════════════════════════════════════════════════════════
function QRManagementPage({
  qrRecords,
  onAddQR,
  accounts,
  showToast,
  addLog,
}: {
  qrRecords: QRRecord[];
  onAddQR: (qr: QRRecord) => void;
  accounts: PendingAccount[];
  showToast: (type: ToastItem["type"], title: string, sub?: string) => void;
  addLog: (type: string, msg: string, col: string) => void;
}) {
  const [name, setName] = useState("");
  const [area, setArea] = useState("");
  const [type, setType] = useState<"individual" | "family">("individual");
  const [familySize, setFamilySize] = useState(3);
  const [generated, setGenerated] = useState<QRRecord | null>(null);
  const [showFamilyRequest, setShowFamilyRequest] = useState(false);
  const [familyName, setFamilyName] = useState("");
  const [familyArea, setFamilyArea] = useState("");
  const [familyCount, setFamilyCount] = useState(3);
  const [search, setSearch] = useState("");

  const handleGenerate = () => {
    if (!name || !area) return;
    const qr: QRRecord = {
      id: `QR-${5000 + qrRecords.length + 1}`,
      name,
      type,
      area,
      issuedAt: "Just now",
      familySize: type === "family" ? familySize : undefined,
    };
    onAddQR(qr);
    setGenerated(qr);
    addLog("QR", `${type === "family" ? "Family" : "Individual"} QR issued for ${name}`, "var(--admin-blue)");
    showToast("success", "QR Code Generated", `${qr.id} — ${name}`);
    setName(""); setArea("");
  };

  const handleFamilyQR = () => {
    if (!familyName || !familyArea) return;
    const qr: QRRecord = {
      id: `QR-${5000 + qrRecords.length + 2}`,
      name: familyName,
      type: "family",
      area: familyArea,
      issuedAt: "Just now",
      familySize: familyCount,
    };
    onAddQR(qr);
    showToast("success", "Family QR Generated", `${qr.id} — ${familyName} (${familyCount} members)`);
    addLog("QR", `Family QR issued for ${familyName} — ${familyCount} members`, "var(--admin-blue)");
    setShowFamilyRequest(false);
    setFamilyName(""); setFamilyArea("");
  };

  const filtered = qrRecords.filter(
    (q) => !search || q.name.toLowerCase().includes(search.toLowerCase()) || q.id.toLowerCase().includes(search.toLowerCase()) || q.area.toLowerCase().includes(search.toLowerCase())
  );

  const approvedNoQR = accounts.filter((a) => a.status === "APPROVED" && !a.qrGenerated);
  const familyQRs = qrRecords.filter((q) => q.type === "family");

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h2>QR Code Management</h2>
          <p>Generate individual and family QR codes for verified citizens and accounts</p>
        </div>
        <div className="admin-head-actions">
          <button className="admin-btn admin-btn-accent" onClick={() => setShowFamilyRequest(true)}>👨‍👩‍👧 Process Family QR Request</button>
        </div>
      </div>

      {approvedNoQR.length > 0 && (
        <div className="admin-alert info" style={{ marginBottom: "1.25rem" }}>
          <span className="admin-alert-icon">📱</span>
          <div><strong>{approvedNoQR.length} approved account(s)</strong> are awaiting QR code generation: {approvedNoQR.map((a) => a.name).join(", ")}</div>
        </div>
      )}

      <div className="admin-grid-2" style={{ marginBottom: "1rem" }}>
        {/* Generate form */}
        <div className="admin-card">
          <div className="admin-card-header"><div className="admin-card-title">📱 Generate QR Code</div></div>
          <div className="admin-card-body">
            <div className="admin-form-grid">
              <div className="admin-form-group">
                <label className="admin-form-label">Citizen / Account Name</label>
                <input className="admin-form-input" placeholder="Full name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">Area / Barangay</label>
                <input className="admin-form-input" placeholder="e.g. Brgy. 102, District 4" value={area} onChange={(e) => setArea(e.target.value)} />
              </div>
              <div className="admin-form-group">
                <label className="admin-form-label">QR Type</label>
                <div style={{ display: "flex", gap: "0.5rem" }}>
                  {(["individual", "family"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setType(t)}
                      style={{ flex: 1, padding: "0.65rem", border: `1.5px solid ${type === t ? "var(--admin-accent-mid)" : "var(--admin-outline)"}`, borderRadius: "0.65rem", background: type === t ? "var(--admin-blue-bg)" : "var(--admin-surface)", color: type === t ? "var(--admin-blue)" : "var(--admin-text-soft)", fontWeight: type === t ? 800 : 600, fontSize: "0.8rem", cursor: "pointer", fontFamily: "Public Sans, sans-serif", transition: "all 0.15s" }}
                    >
                      {t === "individual" ? "👤 Individual" : "👨‍👩‍👧‍👦 Family"}
                    </button>
                  ))}
                </div>
              </div>
              {type === "family" && (
                <div className="admin-form-group">
                  <label className="admin-form-label">Family Size (members)</label>
                  <input className="admin-form-input" type="number" min={2} max={20} value={familySize} onChange={(e) => setFamilySize(Number(e.target.value))} />
                </div>
              )}
              <button
                className="admin-btn admin-btn-accent"
                style={{ width: "100%", justifyContent: "center", padding: "0.8rem" }}
                onClick={handleGenerate}
                disabled={!name || !area}
              >
                📱 Generate QR Code
              </button>
            </div>

            {generated && (
              <div style={{ marginTop: "1rem", padding: "1rem", background: "var(--admin-blue-bg)", border: "1px solid var(--admin-blue-border)", borderRadius: "0.75rem", textAlign: "center" }}>
                <div style={{ fontSize: "2.5rem", marginBottom: "0.5rem" }}>📱</div>
                <div style={{ fontWeight: 800, color: "var(--admin-blue)", marginBottom: "0.2rem" }}>{generated.id} — Generated ✅</div>
                <div style={{ fontSize: "0.78rem", color: "var(--admin-text-soft)" }}>{generated.name} · {generated.area}</div>
                <div style={{ marginTop: "0.75rem", display: "inline-block", background: "var(--admin-surface)", borderRadius: "0.5rem", padding: "0.75rem 1.5rem", border: "1px solid var(--admin-outline)" }}>
                  <div style={{ fontSize: "0.65rem", color: "var(--admin-text-soft)", marginBottom: "0.35rem" }}>QR Preview</div>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(5,1fr)", gap: "2px" }}>
                    {Array(25).fill(0).map((_, i) => (
                      <div key={i} style={{ width: "8px", height: "8px", background: Math.random() > 0.5 ? "var(--admin-text)" : "transparent", borderRadius: "1px" }} />
                    ))}
                  </div>
                </div>
                <button className="admin-btn admin-btn-ghost admin-btn-sm" style={{ marginTop: "0.75rem" }} onClick={() => setGenerated(null)}>Dismiss</button>
              </div>
            )}
          </div>
        </div>

        {/* Family QR requests */}
        <div className="admin-card">
          <div className="admin-card-header">
            <div className="admin-card-title">👨‍👩‍👧‍👦 Family QR Records</div>
            <span className="admin-badge blue">{familyQRs.length} records</span>
          </div>
          <div className="admin-card-body">
            {familyQRs.length === 0 ? (
              <div style={{ textAlign: "center", padding: "2rem", color: "var(--admin-text-soft)" }}>
                <div style={{ fontSize: "1.8rem", marginBottom: "0.5rem" }}>✅</div>
                No family QR requests pending
              </div>
            ) : (
              familyQRs.map((q) => (
                <div key={q.id} style={{ display: "flex", gap: "0.75rem", alignItems: "center", padding: "0.75rem 0.85rem", background: "var(--admin-surface-low)", borderRadius: "0.65rem", marginBottom: "0.5rem", border: "1px solid var(--admin-outline)" }}>
                  <span style={{ fontSize: "1.4rem" }}>👨‍👩‍👧‍👦</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: "0.82rem" }}>{q.name}</div>
                    <div style={{ fontSize: "0.7rem", color: "var(--admin-text-soft)" }}>{q.area} · {q.familySize} members · {q.id}</div>
                    <div style={{ fontSize: "0.65rem", color: "#bbb" }}>{q.issuedAt}</div>
                  </div>
                  <span className="admin-badge green">Issued</span>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* All QR Records Table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">All QR Records</div>
          <div className="admin-search" style={{ minWidth: "14rem" }}>
            <span style={{ color: "#bbb", fontSize: "0.8rem" }}>🔍</span>
            <input placeholder="Search by name, ID, area…" value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>QR ID</th>
                <th>Name / Group</th>
                <th>Type</th>
                <th>Area</th>
                <th>Issued At</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((q) => (
                <tr key={q.id}>
                  <td><span className="admin-mono" style={{ color: "var(--admin-blue)" }}>{q.id}</span></td>
                  <td>
                    <div style={{ fontWeight: 600, fontSize: "0.82rem" }}>{q.name}</div>
                    {q.familySize && <div style={{ fontSize: "0.7rem", color: "var(--admin-text-soft)" }}>×{q.familySize} members</div>}
                  </td>
                  <td><span className={`admin-badge ${q.type === "individual" ? "blue" : "green"}`}>{q.type}</span></td>
                  <td style={{ fontSize: "0.78rem" }}>{q.area}</td>
                  <td><span className="admin-mono" style={{ fontSize: "0.72rem" }}>{q.issuedAt}</span></td>
                  <td><span className="admin-badge green">● Active</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Family QR Request Modal */}
      {showFamilyRequest && (
        <Modal
          title="👨‍👩‍👧‍👦 Process Family QR Request"
          narrow
          onClose={() => setShowFamilyRequest(false)}
          footer={
            <>
              <button className="admin-btn admin-btn-ghost" onClick={() => setShowFamilyRequest(false)}>Cancel</button>
              <button className="admin-btn admin-btn-accent" onClick={handleFamilyQR} disabled={!familyName || !familyArea}>
                Generate Family QR →
              </button>
            </>
          }
        >
          <div className="admin-alert info" style={{ marginBottom: "1rem" }}>
            <span className="admin-alert-icon">ℹ️</span>
            <div>Generate a household Family QR code after the head of the household's Individual QR has been issued.</div>
          </div>
          <div className="admin-form-grid">
            <div className="admin-form-group">
              <label className="admin-form-label">Family / Household Name</label>
              <input className="admin-form-input" placeholder="e.g. Dela Cruz Family" value={familyName} onChange={(e) => setFamilyName(e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Barangay / Area</label>
              <input className="admin-form-input" placeholder="e.g. Brgy. 102, District 4" value={familyArea} onChange={(e) => setFamilyArea(e.target.value)} />
            </div>
            <div className="admin-form-group">
              <label className="admin-form-label">Number of Family Members</label>
              <input className="admin-form-input" type="number" min={2} max={20} value={familyCount} onChange={(e) => setFamilyCount(Number(e.target.value))} />
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  DISASTER MONITORING
// ═══════════════════════════════════════════════════════════════════════════════
function DisasterMonitoringPage({
  disasters,
  setDisasters,
  showToast,
}: {
  disasters: DisasterEvent[];
  setDisasters: React.Dispatch<React.SetStateAction<DisasterEvent[]>>;
  showToast: (type: ToastItem["type"], title: string, sub?: string) => void;
}) {
  const [selected, setSelected] = useState<DisasterEvent | null>(null);
  const [editNotes, setEditNotes] = useState("");

  const updatePhase = (id: string, phase: CalamityPhase) => {
    setDisasters((p) => p.map((d) => d.id === id ? { ...d, phase } : d));
    showToast("info", "Phase Updated", `Disaster event updated to ${phase}`);
  };

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h2>Disaster Monitoring</h2>
          <p>Monitor incoming disaster data, manage active events, and track response</p>
        </div>
        <div className="admin-head-actions">
          <span className="admin-live"><span className="admin-live-dot" />LIVE FEEDS</span>
        </div>
      </div>

      {/* Live feeds */}
      <div className="admin-card" style={{ marginBottom: "1rem" }}>
        <div className="admin-card-header">
          <div className="admin-card-title">📡 Incoming Disaster Data Feeds</div>
          <span className="admin-live"><span className="admin-live-dot" />Real-time</span>
        </div>
        <div className="admin-card-body">
          <div className="admin-grid-2">
            {LIVE_FEEDS.map((f) => (
              <div key={f.src} style={{ padding: "0.85rem 1rem", background: "var(--admin-surface-low)", borderRadius: "0.65rem", border: "1px solid var(--admin-outline)", display: "flex", gap: "0.75rem" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "0.35rem" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "1rem" }}>
                    <span style={{ fontWeight: 800, fontSize: "0.8rem" }}>{f.src}</span>
                    <span className="admin-badge green">● {f.status}</span>
                  </div>
                  <div style={{ fontSize: "0.78rem", color: "var(--admin-text)", lineHeight: 1.5 }}>{f.data}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Disaster event cards */}
      <div className="admin-stats-row admin-stats-3" style={{ marginBottom: "1rem" }}>
        {disasters.map((d) => (
          <div key={d.id} className="admin-disaster-card">
            <div className="admin-disaster-card-top" style={{ background: RISK_COLOR[d.riskLevel] }} />
            <div style={{ padding: "1rem 1.1rem" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.65rem" }}>
                <span className={`admin-calamity-pill ${PHASE_CLASS[d.phase]}`}>{PHASE_LABEL[d.phase]}</span>
                <span className={`admin-badge ${RISK_CLASS[d.riskLevel]}`}>{d.riskLevel}</span>
              </div>
              <div style={{ fontWeight: 900, fontSize: "1rem", letterSpacing: "-0.02em", marginBottom: "0.25rem" }}>{d.name}</div>
              <div style={{ fontSize: "0.75rem", color: "var(--admin-text-soft)", marginBottom: "0.85rem" }}>📍 {d.areas} · {d.type} · {d.severity}</div>

              <div className="admin-grid-2" style={{ gap: "0.5rem", marginBottom: "0.85rem" }}>
                <div style={{ background: "var(--admin-surface-low)", borderRadius: "0.55rem", padding: "0.6rem 0.75rem" }}>
                  <div style={{ fontSize: "0.6rem", color: "var(--admin-text-soft)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.2rem" }}>Affected</div>
                  <div style={{ fontWeight: 900, fontSize: "1.1rem", color: RISK_COLOR[d.riskLevel] }}>{d.affected.toLocaleString()}</div>
                </div>
                <div style={{ background: "var(--admin-surface-low)", borderRadius: "0.55rem", padding: "0.6rem 0.75rem" }}>
                  <div style={{ fontSize: "0.6rem", color: "var(--admin-text-soft)", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "0.2rem" }}>Tickets</div>
                  <div style={{ fontWeight: 900, fontSize: "1.1rem", color: "var(--admin-blue)" }}>{d.tickets}</div>
                </div>
              </div>

              <div style={{ fontSize: "0.72rem", color: "var(--admin-text-soft)", marginBottom: "0.75rem" }}>
                {d.dispatchers} dispatcher(s) active
              </div>

              {/* Phase controls */}
              <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap" }}>
                {(["BEFORE", "DURING", "AFTER"] as CalamityPhase[]).map((ph) => (
                  <button
                    key={ph}
                    className={`admin-btn admin-btn-ghost admin-btn-xs`}
                    style={{ background: d.phase === ph ? RISK_COLOR[d.riskLevel] + "18" : undefined, fontWeight: d.phase === ph ? 800 : 600 }}
                    onClick={() => updatePhase(d.id, ph)}
                  >
                    {ph === "BEFORE" ? "⚡" : ph === "DURING" ? "🚨" : "✅"} {ph}
                  </button>
                ))}
                <button className="admin-btn admin-btn-ghost admin-btn-xs" onClick={() => { setSelected(d); setEditNotes(d.notes || ""); }}>Notes</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Forecast table */}
      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">📊 Forecast & Predictive Risk Analysis</div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Area</th>
                <th>Risk Level</th>
                <th>Rainfall</th>
                <th>Wind</th>
                <th>Recommended Action</th>
              </tr>
            </thead>
            <tbody>
              {FORECAST_DATA.map((f) => (
                <tr key={f.area}>
                  <td style={{ fontWeight: 700 }}>{f.area}</td>
                  <td><span className={`admin-badge ${RISK_CLASS[f.risk]}`}>{f.risk}</span></td>
                  <td style={{ fontSize: "0.78rem" }}>{f.rainfall}</td>
                  <td style={{ fontSize: "0.78rem" }}>{f.wind}</td>
                  <td style={{ fontSize: "0.78rem", color: "var(--admin-text-muted)" }}>{f.action}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Notes modal */}
      {selected && (
        <Modal
          title={`Notes — ${selected.name}`}
          narrow
          onClose={() => setSelected(null)}
          footer={
            <>
              <button className="admin-btn admin-btn-ghost" onClick={() => setSelected(null)}>Cancel</button>
              <button className="admin-btn admin-btn-accent" onClick={() => { setDisasters((p) => p.map((d) => d.id === selected.id ? { ...d, notes: editNotes } : d)); showToast("success", "Notes saved", selected.name); setSelected(null); }}>
                Save Notes
              </button>
            </>
          }
        >
          <div className="admin-form-group">
            <label className="admin-form-label">Event Notes</label>
            <textarea className="admin-form-textarea" rows={5} value={editNotes} onChange={(e) => setEditNotes(e.target.value)} placeholder="Add operational notes for this disaster event…" />
          </div>
        </Modal>
      )}
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  EARLY WARNING (Swimlane: Monitor → Forecast → Identify → Validate → Configure → Broadcast → Monitor Response → Calamity Ended? → Risk Increased? → Escalate/DeEscalate/Notify Passed)
// ═══════════════════════════════════════════════════════════════════════════════
function EarlyWarningPage({
  showToast,
  addLog,
}: {
  showToast: (type: ToastItem["type"], title: string, sub?: string) => void;
  addLog: (type: string, msg: string, col: string) => void;
}) {
  const [step, setStep] = useState<WarningStep>("monitor");
  const [warningRequired, setWarningRequired] = useState<boolean | null>(null);
  const [config, setConfig] = useState<WarningConfig>({ type: "Typhoon", areas: [], severity: "HIGH", message: "", useSMS: true, usePush: true });
  const [broadcastSent, setBroadcastSent] = useState(false);
  const [calamityEnded, setCalamityEnded] = useState<boolean | null>(null);
  const [riskIncreased, setRiskIncreased] = useState<boolean | null>(null);

  const STEPS = [
    { id: "monitor", label: "Monitor Data" },
    { id: "forecast", label: "Forecasts" },
    { id: "identify", label: "High Risk Areas" },
    { id: "validate", label: "Validate Alert" },
    { id: "configure", label: "Configure Warning" },
    { id: "broadcast", label: "Broadcast" },
    { id: "monitor_response", label: "Monitor Response" },
  ];

  const resetCycle = () => {
    setStep("monitor");
    setWarningRequired(null);
    setBroadcastSent(false);
    setCalamityEnded(null);
    setRiskIncreased(null);
    setConfig({ type: "Typhoon", areas: [], severity: "HIGH", message: "", useSMS: true, usePush: true });
  };

  const sendBroadcast = () => {
    setBroadcastSent(true);
    addLog("BROADCAST", `Early warning broadcast sent: ${config.type} — ${config.severity} — ${config.areas.join(", ")}`, "var(--admin-red)");
    showToast("warning", "Early Warning Broadcast Sent", `${config.type} — ${config.areas.join(", ")}`);
  };

  const allAreas = ["Metro Manila", "Laguna Basin", "Rizal Province", "Cavite Lowlands", "Bulacan North", "Metro Cluster 3", "Metro Cluster 5"];

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h2>Early Warning System</h2>
          <p>Follow the decision process to configure and broadcast calamity warnings</p>
        </div>
        {broadcastSent && (
          <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={resetCycle}>🔄 New Warning Cycle</button>
        )}
      </div>

      {/* Stepper */}
      <div className="admin-card" style={{ marginBottom: "1rem" }}>
        <div className="admin-card-body">
          <Stepper steps={STEPS} current={step} />
        </div>
      </div>

      {/* Step content */}
      <div className="admin-card">
        <div className="admin-card-body">

          {/* ── Step 1: Monitor ── */}
          {step === "monitor" && (
            <div>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--admin-text-soft)", marginBottom: "0.35rem" }}>Step 1 of 7</div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.35rem" }}>Monitor Incoming Disaster Data</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--admin-text-soft)" }}>Review real-time feeds from PAGASA, NDRRMC, rainfall sensors, and river level monitors.</p>
              </div>
              <div className="admin-grid-2" style={{ marginBottom: "1.25rem" }}>
                {LIVE_FEEDS.map((f) => (
                  <div key={f.src} style={{ padding: "0.85rem 1rem", background: "var(--admin-surface-low)", border: "1px solid var(--admin-outline)", borderRadius: "0.75rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.4rem" }}>
                      <span style={{ fontWeight: 800, fontSize: "0.8rem" }}>{f.src}</span>
                      <span className="admin-badge green">● LIVE</span>
                    </div>
                    <div style={{ fontSize: "0.78rem", lineHeight: 1.5 }}>{f.data}</div>
                  </div>
                ))}
              </div>
              <button className="admin-btn admin-btn-accent" onClick={() => setStep("forecast")}>
                → Proceed to Forecast Analysis
              </button>
            </div>
          )}

          {/* ── Step 2: Forecast ── */}
          {step === "forecast" && (
            <div>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--admin-text-soft)", marginBottom: "0.35rem" }}>Step 2 of 7</div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.35rem" }}>Review Forecasts & Predictive Analysis</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--admin-text-soft)" }}>Analyze forecast models and predicted impact zones.</p>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", marginBottom: "1.25rem" }}>
                {FORECAST_DATA.map((f) => (
                  <div key={f.area} className="admin-forecast-row" style={{ borderLeftColor: RISK_COLOR[f.risk], background: RISK_COLOR[f.risk] + "08" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "0.2rem" }}>
                      <span style={{ fontWeight: 700, fontSize: "0.85rem" }}>{f.area}</span>
                      <span className={`admin-badge ${RISK_CLASS[f.risk]}`}>{f.risk}</span>
                    </div>
                    <div style={{ fontSize: "0.75rem", color: "var(--admin-text-soft)" }}>Rainfall: {f.rainfall} · Wind: {f.wind} · {f.action}</div>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <button className="admin-btn admin-btn-ghost" onClick={() => setStep("monitor")}>← Back</button>
                <button className="admin-btn admin-btn-accent" onClick={() => setStep("identify")}>→ Identify High Risk Areas</button>
              </div>
            </div>
          )}

          {/* ── Step 3: Identify ── */}
          {step === "identify" && (
            <div>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--admin-text-soft)", marginBottom: "0.35rem" }}>Step 3 of 7</div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.35rem" }}>Identify High Risk Areas</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--admin-text-soft)" }}>Areas classified as HIGH or CRITICAL based on forecast analysis.</p>
              </div>
              <div style={{ marginBottom: "1.25rem" }}>
                {FORECAST_DATA.filter((f) => f.risk === "CRITICAL" || f.risk === "HIGH").map((f) => (
                  <div key={f.area} style={{ display: "flex", alignItems: "center", gap: "0.85rem", padding: "0.85rem 1rem", background: RISK_COLOR[f.risk] + "0d", border: `1px solid ${RISK_COLOR[f.risk]}30`, borderRadius: "0.75rem", marginBottom: "0.5rem" }}>
                    <span style={{ fontSize: "1.2rem" }}>{f.risk === "CRITICAL" ? "🔴" : "🟠"}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 800, fontSize: "0.85rem" }}>{f.area}</div>
                      <div style={{ fontSize: "0.75rem", color: "var(--admin-text-soft)" }}>{f.action}</div>
                    </div>
                    <span className={`admin-badge ${RISK_CLASS[f.risk]}`}>{f.risk}</span>
                  </div>
                ))}
              </div>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <button className="admin-btn admin-btn-ghost" onClick={() => setStep("forecast")}>← Back</button>
                <button className="admin-btn admin-btn-accent" onClick={() => setStep("validate")}>→ Validate Alert Necessity</button>
              </div>
            </div>
          )}

          {/* ── Step 4: Validate ── */}
          {step === "validate" && (
            <div>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--admin-text-soft)", marginBottom: "0.35rem" }}>Step 4 of 7</div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.35rem" }}>Validate Alert Necessity</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--admin-text-soft)" }}>Based on all data — is a warning broadcast required at this time?</p>
              </div>
              <div style={{ background: "var(--admin-surface-low)", border: "1px solid var(--admin-outline)", borderRadius: "0.75rem", padding: "1.1rem", marginBottom: "1.25rem" }}>
                <div style={{ fontWeight: 800, fontSize: "0.88rem", marginBottom: "0.6rem" }}>Assessment Summary</div>
                <div style={{ fontSize: "0.8rem", color: "var(--admin-text-muted)", lineHeight: 1.75 }}>
                  • 2 CRITICAL risk areas identified: Metro Manila, Laguna Basin<br />
                  • Typhoon Kristine landfall expected within 5 hours<br />
                  • Marikina River at Alert Level 2 — 18.6m (threshold: 20m)<br />
                  • Early warning system threshold: <strong style={{ color: "var(--admin-red)" }}>EXCEEDED</strong>
                </div>
              </div>

              <div style={{ fontWeight: 800, fontSize: "0.9rem", marginBottom: "0.85rem" }}>Is a warning broadcast required?</div>
              <div className="admin-grid-2" style={{ gap: "0.65rem", marginBottom: "1rem" }}>
                <button
                  className="admin-calamity-decision-btn"
                  style={{ background: "var(--admin-red-bg)", borderColor: "var(--admin-red-border)", color: "var(--admin-red)" }}
                  onClick={() => { setWarningRequired(true); setStep("configure"); }}
                >
                  <span style={{ fontSize: "1.5rem" }}>🚨</span>
                  <span>Yes — Configure & Broadcast Warning</span>
                </button>
                <button
                  className="admin-calamity-decision-btn"
                  style={{ background: "var(--admin-green-bg)", borderColor: "var(--admin-green-border)", color: "var(--admin-green)" }}
                  onClick={() => { setWarningRequired(false); showToast("info", "Monitoring Continues", "No warning broadcast at this time"); setStep("monitor"); }}
                >
                  <span style={{ fontSize: "1.5rem" }}>✅</span>
                  <span>No — Continue Monitoring Only</span>
                </button>
              </div>
              <button className="admin-btn admin-btn-ghost admin-btn-sm" onClick={() => setStep("identify")}>← Back</button>
            </div>
          )}

          {/* ── Step 5: Configure ── */}
          {step === "configure" && (
            <div>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--admin-text-soft)", marginBottom: "0.35rem" }}>Step 5 of 7</div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.35rem" }}>Configure Warning Parameters</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--admin-text-soft)" }}>Set all parameters before sending the early warning broadcast.</p>
              </div>
              <div className="admin-form-grid">
                <div className="admin-form-grid admin-form-grid-2">
                  <div className="admin-form-group">
                    <label className="admin-form-label">Warning Type</label>
                    <select className="admin-form-select" value={config.type} onChange={(e) => setConfig((p) => ({ ...p, type: e.target.value }))}>
                      <option>Typhoon</option>
                      <option>Flood</option>
                      <option>Landslide</option>
                      <option>Earthquake</option>
                      <option>Tsunami</option>
                      <option>Storm Surge</option>
                    </select>
                  </div>
                  <div className="admin-form-group">
                    <label className="admin-form-label">Severity Level</label>
                    <select className="admin-form-select" value={config.severity} onChange={(e) => setConfig((p) => ({ ...p, severity: e.target.value }))}>
                      <option>LOW</option>
                      <option>MEDIUM</option>
                      <option>HIGH</option>
                      <option>CRITICAL</option>
                    </select>
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Target Areas (select all that apply)</label>
                  <div style={{ display: "flex", flexWrap: "wrap", gap: "0.4rem" }}>
                    {allAreas.map((area) => {
                      const sel = config.areas.includes(area);
                      return (
                        <button
                          key={area}
                          onClick={() => setConfig((p) => ({ ...p, areas: sel ? p.areas.filter((a) => a !== area) : [...p.areas, area] }))}
                          style={{ padding: "0.4rem 0.85rem", border: `1.5px solid ${sel ? "var(--admin-accent-mid)" : "var(--admin-outline)"}`, borderRadius: "999px", background: sel ? "var(--admin-blue-bg)" : "var(--admin-surface)", color: sel ? "var(--admin-blue)" : "var(--admin-text-soft)", fontSize: "0.75rem", fontWeight: sel ? 800 : 600, cursor: "pointer", fontFamily: "Public Sans, sans-serif", transition: "all 0.15s" }}
                        >
                          {sel ? "✓ " : ""}{area}
                        </button>
                      );
                    })}
                  </div>
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Warning Message</label>
                  <textarea
                    className="admin-form-textarea"
                    rows={4}
                    placeholder="EARLY WARNING: Typhoon Kristine is expected to make landfall within 5 hours. Residents in low-lying areas are advised to evacuate immediately to the nearest designated evacuation center…"
                    value={config.message}
                    onChange={(e) => setConfig((p) => ({ ...p, message: e.target.value }))}
                  />
                </div>
                <div className="admin-form-group">
                  <label className="admin-form-label">Broadcast Channels</label>
                  <div style={{ display: "flex", gap: "1rem" }}>
                    {[{ id: "useSMS", label: "📱 SMS Broadcast" }, { id: "usePush", label: "🔔 Push Notification" }].map((c) => (
                      <label key={c.id} style={{ display: "flex", alignItems: "center", gap: "0.5rem", fontSize: "0.82rem", cursor: "pointer", fontWeight: 600 }}>
                        <input type="checkbox" checked={config[c.id as "useSMS" | "usePush"]} onChange={(e) => setConfig((p) => ({ ...p, [c.id]: e.target.checked }))} style={{ accentColor: "var(--admin-accent-mid)", width: "1rem", height: "1rem" }} />
                        {c.label}
                      </label>
                    ))}
                  </div>
                </div>
                <div style={{ display: "flex", gap: "0.6rem" }}>
                  <button className="admin-btn admin-btn-ghost" onClick={() => setStep("validate")}>← Back</button>
                  <button
                    className="admin-btn admin-btn-broadcast"
                    style={{ flex: 1, justifyContent: "center" }}
                    disabled={!config.message || config.areas.length === 0}
                    onClick={() => setStep("broadcast")}
                  >
                    → Review & Broadcast
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* ── Step 6: Broadcast ── */}
          {step === "broadcast" && (
            <div>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--admin-text-soft)", marginBottom: "0.35rem" }}>Step 6 of 7</div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.35rem" }}>Broadcast Early Warning</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--admin-text-soft)" }}>Review the warning summary and confirm broadcast to all target recipients.</p>
              </div>

              {!broadcastSent ? (
                <>
                  <div style={{ background: "var(--admin-red-bg)", border: "1px solid var(--admin-red-border)", borderRadius: "0.85rem", padding: "1.1rem 1.2rem", marginBottom: "1.25rem" }}>
                    <div style={{ fontWeight: 800, fontSize: "0.95rem", color: "var(--admin-red)", marginBottom: "0.75rem" }}>⚠️ Warning Broadcast Summary</div>
                    <div style={{ display: "grid", gap: "0.35rem", fontSize: "0.82rem" }}>
                      <div><strong>Type:</strong> {config.type}</div>
                      <div><strong>Severity:</strong> {config.severity}</div>
                      <div><strong>Target Areas:</strong> {config.areas.join(", ") || "None selected"}</div>
                      <div><strong>Channels:</strong> {[config.useSMS ? "SMS" : "", config.usePush ? "Push Notification" : ""].filter(Boolean).join(", ")}</div>
                    </div>
                    <div style={{ marginTop: "0.75rem", padding: "0.75rem 0.9rem", background: "rgba(255,255,255,0.6)", borderRadius: "0.55rem", fontSize: "0.8rem", fontStyle: "italic", lineHeight: 1.6, color: "var(--admin-text-muted)" }}>
                      "{config.message}"
                    </div>
                  </div>
                  <div style={{ display: "flex", gap: "0.6rem" }}>
                    <button className="admin-btn admin-btn-ghost" onClick={() => setStep("configure")}>← Back to Configure</button>
                    <button className="admin-btn admin-btn-broadcast" style={{ flex: 1, justifyContent: "center", padding: "0.85rem" }} onClick={sendBroadcast}>
                      📡 Send Early Warning Broadcast Now
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <div className="admin-alert success" style={{ marginBottom: "1.25rem" }}>
                    <span className="admin-alert-icon">📡</span>
                    <div>
                      <strong>Early Warning Broadcast Sent Successfully!</strong><br />
                      All registered citizens and response units in target areas have been notified.
                    </div>
                  </div>
                  <button className="admin-btn admin-btn-accent" onClick={() => setStep("monitor_response")}>
                    → Monitor System Response
                  </button>
                </>
              )}
            </div>
          )}

          {/* ── Step 7: Monitor Response ── */}
          {step === "monitor_response" && (
            <div>
              <div style={{ marginBottom: "1rem" }}>
                <div style={{ fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--admin-text-soft)", marginBottom: "0.35rem" }}>Step 7 of 7</div>
                <h3 style={{ fontSize: "1.2rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.35rem" }}>Monitor System Response</h3>
                <p style={{ fontSize: "0.82rem", color: "var(--admin-text-soft)" }}>Track broadcast delivery, notify response units, then assess calamity state.</p>
              </div>

              <div className="admin-stats-row admin-stats-3" style={{ marginBottom: "1.25rem" }}>
                {[
                  { label: "Notifications Sent", val: "18,432", icon: "📲", col: "blue" as const },
                  { label: "Delivery Rate", val: "98.7%", icon: "✅", col: "green" as const },
                  { label: "Response Units Notified", val: "14", icon: "🚨", col: "orange" as const },
                ].map((m) => (
                  <div key={m.label} className={`admin-stat ${m.col}`}>
                    <div style={{ fontSize: "1.2rem", marginBottom: "0.35rem" }}>{m.icon}</div>
                    <div className="admin-stat-label">{m.label}</div>
                    <div className="admin-stat-value">{m.val}</div>
                  </div>
                ))}
              </div>

              <div className="admin-alert success" style={{ marginBottom: "1.25rem" }}>
                <span className="admin-alert-icon">✅</span>
                <div>All dispatchers, site managers, and field response units have been alerted. Teams are mobilizing.</div>
              </div>

              <div style={{ fontWeight: 800, fontSize: "0.9rem", marginBottom: "0.85rem" }}>Calamity Status Assessment:</div>

              <div className="admin-grid-2" style={{ gap: "0.65rem" }}>
                {/* Has calamity ended? */}
                <div style={{ padding: "1.1rem", background: "var(--admin-surface-low)", border: "1px solid var(--admin-outline)", borderRadius: "var(--admin-r)" }}>
                  <div style={{ fontWeight: 800, fontSize: "0.85rem", marginBottom: "0.75rem" }}>Has the calamity ended?</div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="admin-btn admin-btn-success"
                      style={{ flex: 1, justifyContent: "center" }}
                      onClick={() => { setCalamityEnded(true); setStep("notify_passed"); showToast("success", "All-Clear Initiated", "Calamity end notification in progress"); addLog("BROADCAST", "Calamity ended — All-clear notification sent", "var(--admin-green)"); }}
                    >
                      ✅ Yes — Send All-Clear
                    </button>
                    <button
                      className="admin-btn admin-btn-ghost"
                      style={{ flex: 1, justifyContent: "center" }}
                      onClick={() => setStep("risk_check")}
                    >
                      No — Assess Risk
                    </button>
                  </div>
                </div>
                {/* Has risk increased? */}
                <div style={{ padding: "1.1rem", background: "var(--admin-surface-low)", border: "1px solid var(--admin-outline)", borderRadius: "var(--admin-r)" }}>
                  <div style={{ fontWeight: 800, fontSize: "0.85rem", marginBottom: "0.75rem" }}>Has risk level increased?</div>
                  <div style={{ display: "flex", gap: "0.5rem" }}>
                    <button
                      className="admin-btn admin-btn-danger"
                      style={{ flex: 1, justifyContent: "center" }}
                      onClick={() => { setRiskIncreased(true); setStep("escalate"); showToast("error", "Warnings Escalated", "Risk level has increased"); addLog("BROADCAST", "Warnings escalated — risk level increased", "var(--admin-red)"); }}
                    >
                      ↑ Yes — Escalate
                    </button>
                    <button
                      className="admin-btn admin-btn-ghost"
                      style={{ flex: 1, justifyContent: "center" }}
                      onClick={() => { setRiskIncreased(false); setStep("deescalate"); showToast("info", "Warnings De-escalated", "Situation stabilizing"); addLog("BROADCAST", "Warnings de-escalated / maintained", "var(--admin-blue)"); }}
                    >
                      ↓ No — De-Escalate
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ── Escalate ── */}
          {step === "escalate" && (
            <div>
              <div className="admin-alert critical" style={{ marginBottom: "1.25rem" }}>
                <span className="admin-alert-icon">🚨</span>
                <div><strong>Warnings Escalated</strong> — Risk level has increased. Enhanced response protocols are now active. All units and dispatchers have been re-notified.</div>
              </div>
              <div className="admin-stats-row admin-stats-2" style={{ marginBottom: "1.25rem" }}>
                <div className="admin-stat red"><div className="admin-stat-label">Warning Level</div><div className="admin-stat-value">CRITICAL</div></div>
                <div className="admin-stat orange"><div className="admin-stat-label">Units on Alert</div><div className="admin-stat-value">22</div></div>
              </div>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <button className="admin-btn admin-btn-ghost" onClick={() => setStep("monitor_response")}>← Back to Monitor</button>
                <button className="admin-btn admin-btn-accent" onClick={() => setStep("notify_passed")}>→ Mark Calamity Ended</button>
                <button className="admin-btn admin-btn-ghost" onClick={resetCycle}>🔄 Start New Cycle</button>
              </div>
            </div>
          )}

          {/* ── De-escalate ── */}
          {step === "deescalate" && (
            <div>
              <div className="admin-alert info" style={{ marginBottom: "1.25rem" }}>
                <span className="admin-alert-icon">↓</span>
                <div><strong>Warnings De-escalated / Maintained</strong> — Situation is stabilizing. Monitoring continues. Response units remain on standby.</div>
              </div>
              <div style={{ display: "flex", gap: "0.6rem" }}>
                <button className="admin-btn admin-btn-ghost" onClick={() => setStep("monitor_response")}>← Back to Monitor</button>
                <button className="admin-btn admin-btn-success" onClick={() => setStep("notify_passed")}>→ Calamity Has Ended</button>
                <button className="admin-btn admin-btn-ghost" onClick={resetCycle}>🔄 Start New Cycle</button>
              </div>
            </div>
          )}

          {/* ── Notify Passed ── */}
          {step === "notify_passed" && (
            <div style={{ textAlign: "center", padding: "1.5rem 1rem" }}>
              <div style={{ fontSize: "3rem", marginBottom: "0.75rem" }}>✅</div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: 900, letterSpacing: "-0.03em", marginBottom: "0.5rem" }}>Calamity Has Passed</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--admin-text-soft)", lineHeight: 1.7, marginBottom: "1.5rem", maxWidth: "28rem", margin: "0 auto 1.5rem" }}>
                An all-clear notification has been sent to all registered citizens and response units. The calamity event has been marked as resolved.
              </p>
              <div className="admin-stats-row admin-stats-3" style={{ textAlign: "left", marginBottom: "1.5rem" }}>
                <div className="admin-stat green"><div className="admin-stat-label">All-Clear Sent</div><div className="admin-stat-value">✅</div></div>
                <div className="admin-stat blue"><div className="admin-stat-label">Citizens Notified</div><div className="admin-stat-value">18K+</div></div>
                <div className="admin-stat green"><div className="admin-stat-label">Status</div><div className="admin-stat-value" style={{ fontSize: "1.1rem" }}>Resolved</div></div>
              </div>
              <button className="admin-btn admin-btn-accent" onClick={resetCycle}>🔄 Start New Warning Cycle</button>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  SYSTEM HEALTH
// ═══════════════════════════════════════════════════════════════════════════════
function SystemHealthPage({ showToast }: { showToast: (type: ToastItem["type"], title: string, sub?: string) => void }) {
  const [services, setServices] = useState<ServiceHealth[]>(SYSTEM_SERVICES);
  const degraded = services.filter((s) => s.status !== "OPERATIONAL");

  const toggleStatus = (name: string) => {
    setServices((p) => p.map((s) => s.name === name ? { ...s, status: s.status === "OPERATIONAL" ? "DEGRADED" : "OPERATIONAL" } : s));
  };

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div>
          <h2>System Health Monitor</h2>
          <p>Live status of all DAMAYAN platform services and components</p>
        </div>
        <div className="admin-head-actions">
          {degraded.length === 0
            ? <span className="admin-badge green">● All Systems Operational</span>
            : <span className="admin-badge amber">⚠ {degraded.length} Service(s) Degraded</span>
          }
        </div>
      </div>

      {degraded.length > 0 && (
        <div className="admin-alert warning" style={{ marginBottom: "1.25rem" }}>
          <span className="admin-alert-icon">⚠️</span>
          <div>
            <strong>{degraded.length} service(s) are not fully operational:</strong>{" "}
            {degraded.map((s) => s.name).join(", ")}.
            Engineering team has been notified.
            <button className="admin-btn admin-btn-danger admin-btn-xs" style={{ marginLeft: "0.75rem" }} onClick={() => showToast("warning", "Issue Escalated", "Engineering team notified via PagerDuty")}>
              Escalate Issue
            </button>
          </div>
        </div>
      )}

      <div className="admin-stats-row admin-stats-4">
        <div className="admin-stat green"><div className="admin-stat-label">Operational</div><div className="admin-stat-value">{services.filter((s) => s.status === "OPERATIONAL").length}</div></div>
        <div className="admin-stat amber"><div className="admin-stat-label">Degraded</div><div className="admin-stat-value">{services.filter((s) => s.status === "DEGRADED").length}</div></div>
        <div className="admin-stat red"><div className="admin-stat-label">Down</div><div className="admin-stat-value">{services.filter((s) => s.status === "DOWN").length}</div></div>
        <div className="admin-stat blue"><div className="admin-stat-label">Total Services</div><div className="admin-stat-value">{services.length}</div></div>
      </div>

      <div className="admin-card">
        <div className="admin-card-header">
          <div className="admin-card-title">Service Status</div>
        </div>
        <div className="admin-table-wrap">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Service</th>
                <th>Status</th>
                <th>Latency</th>
                <th>Uptime (30d)</th>
                <th>Notes</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {services.map((svc) => (
                <tr key={svc.name}>
                  <td>
                    <div style={{ display: "flex", alignItems: "center", gap: "0.6rem" }}>
                      <div className={`admin-health-dot ${svc.status === "OPERATIONAL" ? "ok" : svc.status === "DEGRADED" ? "degraded" : "down"}`} />
                      <span style={{ fontWeight: 700, fontSize: "0.82rem" }}>{svc.name}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`admin-badge ${svc.status === "OPERATIONAL" ? "green" : svc.status === "DEGRADED" ? "amber" : "red"}`}>
                      {svc.status === "OPERATIONAL" ? "● Operational" : svc.status === "DEGRADED" ? "⚠ Degraded" : "✕ Down"}
                    </span>
                  </td>
                  <td><span className="admin-mono">{svc.latency}</span></td>
                  <td><span style={{ fontWeight: 700, color: parseFloat(svc.uptime) > 99.5 ? "var(--admin-green)" : "var(--admin-amber)" }}>{svc.uptime}</span></td>
                  <td style={{ fontSize: "0.75rem", color: "var(--admin-text-soft)", maxWidth: "14rem" }}>{svc.note || "—"}</td>
                  <td>
                    {svc.status !== "OPERATIONAL" && (
                      <button className="admin-btn admin-btn-success admin-btn-xs" onClick={() => { toggleStatus(svc.name); showToast("success", `${svc.name} Restored`, "Service is now operational"); }}>
                        Restore
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  PROFILE PAGE
// ═══════════════════════════════════════════════════════════════════════════════
function ProfilePage({ profile, onSave, showToast }: { profile: AdminProfile; onSave: (p: AdminProfile) => void; showToast: (type: ToastItem["type"], title: string, sub?: string) => void }) {
  const [form, setForm] = useState(profile);
  const [pwd, setPwd] = useState({ current: "", next: "", confirm: "" });
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState("");

  const handleSave = () => { onSave(form); showToast("success", "Profile Updated", "Changes saved successfully"); };
  const handleOtp = () => { setOtpSent(true); showToast("info", "OTP Sent", `Code sent to ${form.email}`); };
  const handlePwdChange = () => {
    if (!otp || pwd.next !== pwd.confirm) { showToast("error", "Password Error", "OTP or password mismatch"); return; }
    showToast("success", "Password Changed", "Your password has been updated");
    setOtpSent(false); setOtp(""); setPwd({ current: "", next: "", confirm: "" });
  };

  return (
    <div className="admin-page">
      <div className="admin-page-head">
        <div><h2>My Profile</h2><p>View and manage your administrator account information</p></div>
      </div>
      <div className="admin-grid-2">
        <div className="admin-card">
          <div className="admin-card-header"><div className="admin-card-title">👤 Account Information</div></div>
          <div className="admin-card-body">
            <div style={{ display: "flex", alignItems: "center", gap: "1rem", padding: "1rem", background: "var(--admin-surface-low)", borderRadius: "0.85rem", marginBottom: "1.25rem", border: "1px solid var(--admin-outline)" }}>
              <div style={{ width: "3.5rem", height: "3.5rem", borderRadius: "0.85rem", background: "linear-gradient(135deg, var(--admin-accent-mid), var(--admin-accent))", display: "grid", placeItems: "center", fontSize: "1.1rem", fontWeight: 900, color: "#fff" }}>{profile.initials}</div>
              <div>
                <div style={{ fontWeight: 900, fontSize: "1.05rem", letterSpacing: "-0.03em" }}>{form.name}</div>
                <div style={{ fontSize: "0.75rem", color: "var(--admin-text-soft)", marginTop: "0.15rem" }}>{form.badge} · {form.role}</div>
                <span className="admin-badge blue" style={{ marginTop: "0.4rem" }}>System Administrator</span>
              </div>
            </div>
            <div className="admin-form-grid">
              <div className="admin-form-group"><label className="admin-form-label">Full Name</label><input className="admin-form-input" value={form.name} onChange={(e) => setForm((p) => ({ ...p, name: e.target.value }))} /></div>
              <div className="admin-form-group"><label className="admin-form-label">Badge Number</label><input className="admin-form-input" value={form.badge} disabled style={{ background: "var(--admin-surface-low)", color: "var(--admin-text-soft)" }} /></div>
              <div className="admin-form-group"><label className="admin-form-label">Email</label><input className="admin-form-input" type="email" value={form.email} onChange={(e) => setForm((p) => ({ ...p, email: e.target.value }))} /></div>
              <div className="admin-form-group"><label className="admin-form-label">Phone</label><input className="admin-form-input" value={form.phone} onChange={(e) => setForm((p) => ({ ...p, phone: e.target.value }))} /></div>
              <div className="admin-form-group"><label className="admin-form-label">Station / Office</label><input className="admin-form-input" value={form.station} onChange={(e) => setForm((p) => ({ ...p, station: e.target.value }))} /></div>
              <button className="admin-btn admin-btn-accent" onClick={handleSave}>Save Changes</button>
            </div>
          </div>
        </div>
        <div className="admin-card">
          <div className="admin-card-header"><div className="admin-card-title">🔐 Change Password</div></div>
          <div className="admin-card-body">
            <div className="admin-alert info" style={{ marginBottom: "1rem" }}>
              <span className="admin-alert-icon">🔐</span>
              <div>Password changes require OTP verification sent to your registered email address.</div>
            </div>
            <div className="admin-form-grid">
              <div className="admin-form-group"><label className="admin-form-label">Current Password</label><input className="admin-form-input" type="password" placeholder="••••••••" value={pwd.current} onChange={(e) => setPwd((p) => ({ ...p, current: e.target.value }))} /></div>
              {!otpSent ? (
                <button className="admin-btn admin-btn-ghost" onClick={handleOtp}>📧 Send OTP to {form.email}</button>
              ) : (
                <>
                  <div className="admin-form-group"><label className="admin-form-label">OTP Code</label><input className="admin-form-input" placeholder="6-digit code" maxLength={6} value={otp} onChange={(e) => setOtp(e.target.value)} /></div>
                  <div className="admin-form-group"><label className="admin-form-label">New Password</label><input className="admin-form-input" type="password" placeholder="••••••••" value={pwd.next} onChange={(e) => setPwd((p) => ({ ...p, next: e.target.value }))} /></div>
                  <div className="admin-form-group"><label className="admin-form-label">Confirm New Password</label><input className="admin-form-input" type="password" placeholder="••••••••" value={pwd.confirm} onChange={(e) => setPwd((p) => ({ ...p, confirm: e.target.value }))} /></div>
                  <button className="admin-btn admin-btn-accent" onClick={handlePwdChange}>Update Password</button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ═══════════════════════════════════════════════════════════════════════════════
//  ROOT ADMIN PORTAL
// ═══════════════════════════════════════════════════════════════════════════════
export default function AdminPortal() {
  const [loggedIn, setLoggedIn] = useState(true);
  const [page, setPage] = useState<AdminPage>("overview");
  const [accounts, setAccounts] = useState<PendingAccount[]>(INITIAL_ACCOUNTS);
  const [qrRecords, setQRRecords] = useState<QRRecord[]>(INITIAL_QR);
  const [disasters, setDisasters] = useState<DisasterEvent[]>(INITIAL_DISASTERS);
  const [profile, setProfile] = useState<AdminProfile>(ADMIN_PROFILE);
  const [activityLog, setActivityLog] = useState<{ time: string; type: string; msg: string; col: string }[]>([]);
  const [toasts, setToasts] = useState<ToastItem[]>([]);
  const [notifications, setNotifications] = useState<Notification[]>(INITIAL_NOTIFICATIONS);
  const [profileOpen, setProfileOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [broadcastModal, setBroadcastModal] = useState(false);
  const [broadcastMsg, setBroadcastMsg] = useState("");
  const profileRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);
  const toastRef = useRef(0);

  const showToast = useCallback((type: ToastItem["type"], title: string, sub?: string) => {
    const id = ++toastRef.current;
    setToasts((p) => [...p, { id, type, title, sub }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3500);
  }, []);

  const addLog = useCallback((type: string, msg: string, col: string) => {
    const now = new Date();
    const time = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")}`;
    setActivityLog((p) => [{ time, type, msg, col }, ...p]);
  }, []);

  const handleApprove = useCallback((id: string) => {
    const acc = accounts.find((a) => a.id === id);
    if (!acc) return;
    setAccounts((p) => p.map((a) => a.id === id ? { ...a, status: "APPROVED" as AccountStatus, qrGenerated: true } : a));
    const qr: QRRecord = { id: `QR-${5000 + qrRecords.length + 1}`, name: acc.name, type: "individual", area: acc.area, issuedAt: "Just now", linkedAccountId: id };
    setQRRecords((p) => [...p, qr]);
    addLog("APPROVED", `${acc.name} approved as ${acc.role} · ${qr.id} auto-generated`, "var(--admin-green)");
    showToast("success", "Account Approved", `${acc.name} · Individual QR ${qr.id} generated`);
  }, [accounts, qrRecords, addLog, showToast]);

  const handleReject = useCallback((id: string, reason: string) => {
    const acc = accounts.find((a) => a.id === id);
    if (!acc) return;
    setAccounts((p) => p.map((a) => a.id === id ? { ...a, status: "REJECTED" as AccountStatus, rejectReason: reason } : a));
    addLog("REJECTED", `${acc.name} rejected — ${reason.slice(0, 50)}`, "var(--admin-red)");
  }, [accounts, addLog]);

  const sendBroadcast = () => {
    if (!broadcastMsg.trim()) return;
    addLog("BROADCAST", `System broadcast: "${broadcastMsg.slice(0, 60)}…"`, "var(--admin-red)");
    showToast("warning", "Broadcast Sent", broadcastMsg.slice(0, 80));
    setBroadcastModal(false);
    setBroadcastMsg("");
  };

  // Close dropdowns on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) setProfileOpen(false);
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) setNotifOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const pending = accounts.filter((a) => a.status === "PENDING").length;
  const unreadNotifs = notifications.filter((n) => !n.read).length;

  const PAGE_TITLES: Record<AdminPage, { title: string; sub: string }> = {
    overview: { title: "Overview", sub: "System-wide status and key metrics" },
    approvals: { title: "Account Approvals", sub: "Review documents and manage role applications" },
    qr_management: { title: "QR Management", sub: "Generate individual and family QR codes" },
    disaster_monitoring: { title: "Disaster Monitoring", sub: "Live feeds, event tracking, forecast analysis" },
    early_warning: { title: "Early Warning System", sub: "Configure and broadcast calamity warnings" },
    system_health: { title: "System Health", sub: "Platform service status and uptime" },
    profile: { title: "My Profile", sub: "Account settings and password management" },
  };

  const pt = PAGE_TITLES[page];

  if (!loggedIn) return <AdminLoginPage onLogin={() => setLoggedIn(true)} />;

  return (
    <div className="admin-root">
      {/* ── SIDEBAR ── */}
      <div className="admin-sidebar">
        <div className="admin-sb-brand">
          <div className="admin-sb-mark">D</div>
          <div className="admin-sb-brand-text">
            <strong>Damayan</strong>
            <span>Admin Console</span>
          </div>
        </div>

        <div className="admin-sb-section">Navigation</div>
        <nav className="admin-sb-nav">
          {([
            { id: "overview", icon: "⊞", label: "Overview" },
            { id: "approvals", icon: "✅", label: "Approvals", badge: pending },
            { id: "qr_management", icon: "📱", label: "QR Management" },
            { id: "disaster_monitoring", icon: "🌀", label: "Disaster Monitor" },
            { id: "early_warning", icon: "📡", label: "Early Warning" },
            { id: "system_health", icon: "💻", label: "System Health" },
          ] as { id: AdminPage; icon: string; label: string; badge?: number }[]).map((item) => (
            <button
              key={item.id}
              className={`admin-nav-item ${page === item.id ? "active" : ""}`}
              onClick={() => setPage(item.id)}
            >
              <span className="admin-nav-icon">{item.icon}</span>
              {item.label}
              {item.badge != null && item.badge > 0 && (
                <span className="admin-nav-badge">{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        <div className="admin-sb-footer">
          <div className="admin-sb-user" onClick={() => setPage("profile")}>
            <div className="admin-sb-avatar">{profile.initials}</div>
            <div>
              <span className="admin-sb-uname">{profile.name}</span>
              <span className="admin-sb-urole">Administrator</span>
            </div>
          </div>
        </div>
      </div>

      {/* ── SHELL ── */}
      <div className="admin-shell">
        {/* Topbar */}
        <div className="admin-topbar">
          <div>
            <span className="admin-topbar-title">{pt.title}</span>
            <span className="admin-topbar-sub">{pt.sub}</span>
          </div>
          <div className="admin-topbar-right">
            <button className="admin-btn admin-btn-broadcast admin-btn-sm" onClick={() => setBroadcastModal(true)}>
              📣 Broadcast Alert
            </button>

            {/* Notifications */}
            <div ref={notifRef} style={{ position: "relative" }}>
              <button className="admin-topbar-icon-btn" onClick={() => { setNotifOpen((p) => !p); setProfileOpen(false); }}>
                🔔
                {unreadNotifs > 0 && <span className="admin-notif-dot" />}
              </button>
              {notifOpen && (
                <div className="admin-notif-dropdown">
                  <div style={{ padding: "0.75rem 1rem", borderBottom: "1px solid var(--admin-outline)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                    <span style={{ fontWeight: 800, fontSize: "0.85rem" }}>Notifications</span>
                    <button className="admin-btn admin-btn-ghost admin-btn-xs" onClick={() => setNotifications((p) => p.map((n) => ({ ...n, read: true })))}>Mark all read</button>
                  </div>
                  {notifications.map((n) => (
                    <div key={n.id} className={`admin-notif-item ${!n.read ? "unread" : ""}`} onClick={() => setNotifications((p) => p.map((x) => x.id === n.id ? { ...x, read: true } : x))}>
                      <div className="admin-notif-dot-ind" style={{ background: n.type === "red" ? "var(--admin-red)" : n.type === "amber" ? "var(--admin-amber)" : n.type === "green" ? "var(--admin-green)" : "var(--admin-blue)" }} />
                      <div>
                        <div className="admin-notif-text">{n.title}</div>
                        <div className="admin-notif-sub">{n.sub}</div>
                        <div className="admin-notif-time">{n.time}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Profile dropdown */}
            <div ref={profileRef} style={{ position: "relative" }}>
              <div className="admin-topbar-avatar" onClick={() => { setProfileOpen((p) => !p); setNotifOpen(false); }}>
                {profile.initials}
              </div>
              {profileOpen && (
                <div className="admin-profile-dropdown">
                  <div className="admin-profile-dropdown-head">
                    <div className="admin-profile-dropdown-avatar">{profile.initials}</div>
                    <div>
                      <div className="admin-profile-dropdown-name">{profile.name}</div>
                      <div className="admin-profile-dropdown-role">Admin · {profile.badge}</div>
                    </div>
                  </div>
                  <button className="admin-profile-dropdown-item" onClick={() => { setPage("profile"); setProfileOpen(false); }}>👤 View Profile</button>
                  <button className="admin-profile-dropdown-item" onClick={() => { setPage("profile"); setProfileOpen(false); }}>✏️ Edit Profile</button>
                  <div style={{ height: "1px", background: "var(--admin-outline)" }} />
                  <button className="admin-profile-dropdown-item danger" onClick={() => { window.location.href = "/admin/login"; }}>
                    ⏻ Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="admin-content">
          {page === "overview" && (
            <OverviewPage accounts={accounts} qrRecords={qrRecords} disasters={disasters} activityLog={activityLog} setPage={setPage} />
          )}
          {page === "approvals" && (
            <ApprovalsPage accounts={accounts} onApprove={handleApprove} onReject={handleReject} addLog={addLog} showToast={showToast} />
          )}
          {page === "qr_management" && (
            <QRManagementPage qrRecords={qrRecords} onAddQR={(qr) => setQRRecords((p) => [...p, qr])} accounts={accounts} showToast={showToast} addLog={addLog} />
          )}
          {page === "disaster_monitoring" && (
            <DisasterMonitoringPage disasters={disasters} setDisasters={setDisasters} showToast={showToast} />
          )}
          {page === "early_warning" && (
            <EarlyWarningPage showToast={showToast} addLog={addLog} />
          )}
          {page === "system_health" && (
            <SystemHealthPage showToast={showToast} />
          )}
          {page === "profile" && (
            <ProfilePage profile={profile} onSave={setProfile} showToast={showToast} />
          )}
        </div>
      </div>

      {/* Broadcast Modal */}
      {broadcastModal && (
        <Modal
          title="📣 System-Wide Broadcast Alert"
          narrow
          onClose={() => { setBroadcastModal(false); setBroadcastMsg(""); }}
          footer={
            <>
              <button className="admin-btn admin-btn-ghost" onClick={() => { setBroadcastModal(false); setBroadcastMsg(""); }}>Cancel</button>
              <button className="admin-btn admin-btn-broadcast" onClick={sendBroadcast} disabled={!broadcastMsg.trim()}>
                Send Broadcast Now
              </button>
            </>
          }
        >
          <div className="admin-alert warning" style={{ marginBottom: "1rem" }}>
            <span className="admin-alert-icon">⚠️</span>
            <div>This broadcast will be sent to all registered citizens, dispatchers, and field units.</div>
          </div>
          <div className="admin-form-group">
            <label className="admin-form-label">Broadcast Message</label>
            <textarea className="admin-form-textarea" rows={5} placeholder="Enter your emergency broadcast message…" value={broadcastMsg} onChange={(e) => setBroadcastMsg(e.target.value)} />
            <span className="admin-form-hint">{broadcastMsg.length}/500 characters</span>
          </div>
        </Modal>
      )}

      <ToastContainer toasts={toasts} />
    </div>
  );
}
