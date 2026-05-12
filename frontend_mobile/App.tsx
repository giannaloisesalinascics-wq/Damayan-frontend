import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import { ApiError, login, signup } from "./src/api";
import { AdminDashboardScreen } from "./src/admin";
import {
  CitizenBeforeScreen,
  CitizenHouseholdMembersScreen,
  CitizenDuringScreen,
  CitizenHouseholdRegistrationScreen,
  CitizenIndividualRegistrationScreen,
  CitizenSignupScreen,
  CitizenDashboardScreen,
  CitizenLoginScreen,
} from "./src/citizen";
import { DispatcherBeforeScreen, DispatcherDuringScreen, DispatcherLoginScreen } from "./src/dispatcher";
import { RoleSelectorScreen } from "./src/loginportal";
import { SiteManagerBeforeScreen, SiteManagerDuringScreen, SiteManagerSignupScreen, SiteManagerLoginScreen, SiteManagerDashboardScreen } from "./src/site-manager";
import { AdminDashboardScreen, AdminLoginScreen } from "./src/admin";
import type { AppRoute, AuthSession } from "./src/types";

export default function App() {
  const [route, setRoute] = useState<AppRoute>("role-selector");
  const [fontsReady, setFontsReady] = useState(true);
  const [session, setSession] = useState<AuthSession | null>(null);
  const [authError, setAuthError] = useState<string | null>(null);
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    // Load Google Fonts for web via dynamic link
    if (typeof document !== "undefined") {
      const link = document.createElement("link");
      link.href = "https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700;800;900&display=swap";
      link.rel = "stylesheet";
      document.head.appendChild(link);
    }
  }, []);

  if (!fontsReady) {
    return <View style={{ flex: 1, backgroundColor: "#f8f9f8" }} />;
  }

  async function handleLogin(
    payload: { email: string; password: string },
    expectedRole: "admin" | "line_manager",
    nextRoute: AppRoute,
  ) {
    try {
      setAuthLoading(true);
      setAuthError(null);
      const result = await login({ ...payload, rememberMe: true });
      if (result.user.role !== expectedRole) {
        setAuthError("This account does not match the selected portal.");
        return;
      }

      setSession({
        accessToken: result.access_token,
        expiresIn: result.expiresIn,
        user: result.user,
      });
      setRoute(nextRoute);
    } catch (caughtError) {
      setAuthError(caughtError instanceof ApiError ? caughtError.message : "Unable to sign in.");
    } finally {
      setAuthLoading(false);
    }
  }

  async function handleSiteManagerSignup(payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) {
    try {
      setAuthLoading(true);
      setAuthError(null);
      const result = await signup({ ...payload, role: "line_manager" });
      setSession({ accessToken: result.access_token, user: result.user });
      setRoute("site-manager-before");
    } catch (caughtError) {
      setAuthError(caughtError instanceof ApiError ? caughtError.message : "Unable to create the account.");
    } finally {
      setAuthLoading(false);
    }
  }

  function signOut() {
    setSession(null);
    setAuthError(null);
    setRoute("role-selector");
  }

  switch (route) {
    case "admin-login":
      return (
        <>
          <StatusBar style="dark" />
          <AdminLoginScreen
            onBack={() => setRoute("role-selector")}
            onSubmit={(payload) => void handleLogin(payload, "admin", "admin-dashboard")}
            loading={authLoading}
            error={authError}
          />
        </>
      );
    case "admin-dashboard":
      if (!session) {
        setRoute("admin-login");
        return null;
      }
      return (
        <>
          <StatusBar style="dark" />
          <AdminDashboardScreen onBack={() => setRoute("role-selector")} onSignOut={signOut} session={session} />
        </>
      );
    case "dispatcher-login":
      return (
        <>
          <StatusBar style="dark" />
          <DispatcherLoginScreen
            onBack={() => setRoute("role-selector")}
            onSubmit={() => setRoute("dispatcher-before")}
          />
        </>
      );
    case "dispatcher-before":
      return (
        <>
          <StatusBar style="dark" />
          <DispatcherBeforeScreen
            onBack={() => setRoute("role-selector")}
            onOpenDuring={() => setRoute("dispatcher-during")}
          />
        </>
      );
    case "dispatcher-during":
      return (
        <>
          <StatusBar style="dark" />
          <DispatcherDuringScreen onBack={() => setRoute("dispatcher-before")} />
        </>
      );
    case "site-manager-login":
      return (
        <>
          <StatusBar style="dark" />
          <SiteManagerLoginScreen
            onBack={() => setRoute("role-selector")}
            onSubmit={(payload) => void handleLogin(payload, "line_manager", "site-manager-before")}
            onSecondary={() => setRoute("site-manager-signup")}
            secondaryLabel="Create An Account"
            loading={authLoading}
            error={authError}
          />
        </>
      );
    case "site-manager-signup":
      return (
        <>
          <StatusBar style="dark" />
          <SiteManagerSignupScreen
            onBack={() => setRoute("site-manager-login")}
            onSubmit={(payload) => void handleSiteManagerSignup(payload)}
            loading={authLoading}
            error={authError}
          />
        </>
      );
    case "site-manager-before":
      if (!session) {
        setRoute("site-manager-login");
        return null;
      }
      return (
        <>
          <StatusBar style="dark" />
          <SiteManagerBeforeScreen
            onBack={() => setRoute("site-manager-login")}
            onOpenResponse={() => setRoute("site-manager-during")}
            onSignOut={signOut}
            session={session}
          />
        </>
      );
    case "site-manager-during":
      if (!session) {
        setRoute("site-manager-login");
        return null;
      }
      return (
        <>
          <StatusBar style="dark" />
          <SiteManagerDashboardScreen
            onSignOut={() => setRoute("site-manager-login")}
          onSignOut={signOut} session={session} />
        </>
      );
    case "citizen-login":
      return (
        <>
          <StatusBar style="dark" />
          <CitizenLoginScreen
            onBack={() => setRoute("role-selector")}
            onSubmit={() => setRoute("citizen-dashboard")}
            onSecondary={() => setRoute("citizen-signup")}
            secondaryLabel="Create An Account"
          />
        </>
      );
    case "citizen-signup":
      return (
        <>
          <StatusBar style="dark" />
          <CitizenSignupScreen
            onBack={() => setRoute("citizen-login")}
            onSubmit={() => setRoute("citizen-dashboard")}
          />
        </>
      );
    case "citizen-dashboard":
      return (
        <>
          <StatusBar style="dark" />
          <CitizenDashboardScreen
            onSignOut={() => setRoute("citizen-login")}
          />
        </>
      );
    case "role-selector":
    default:
      return (
        <>
          <StatusBar style="dark" />
          <RoleSelectorScreen onNavigate={setRoute} />
        </>
      );
  }
}
