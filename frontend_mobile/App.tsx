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
} from "./src/citizen";
import { DispatcherBeforeScreen, DispatcherDuringScreen } from "./src/dispatcher";
import { PortalLoginScreen, RoleSelectorScreen } from "./src/loginportal";
import { SiteManagerBeforeScreen, SiteManagerDuringScreen, SiteManagerSignupScreen } from "./src/site-manager";
import { AppRoute, AuthSession } from "./src/types";

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
          <PortalLoginScreen
            role="admin"
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
          <PortalLoginScreen
            role="dispatcher"
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
          <PortalLoginScreen
            role="site_manager"
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
          <SiteManagerDuringScreen onBack={() => setRoute("site-manager-before")} onSignOut={signOut} session={session} />
        </>
      );
    case "citizen-login":
      return (
        <>
          <StatusBar style="dark" />
          <PortalLoginScreen
            role="citizen"
            onBack={() => setRoute("role-selector")}
            onSubmit={() => setRoute("citizen-before")}
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
            onSubmit={() => setRoute("citizen-before")}
          />
        </>
      );
    case "citizen-before":
      return (
        <>
          <StatusBar style="dark" />
          <CitizenBeforeScreen
            onBack={() => setRoute("citizen-login")}
            onOpenResponse={() => setRoute("citizen-during")}
            onRegisterIndividual={() => setRoute("citizen-before-self")}
            onRegisterHousehold={() => setRoute("citizen-before-household")}
          />
        </>
      );
    case "citizen-before-self":
      return (
        <>
          <StatusBar style="dark" />
          <CitizenIndividualRegistrationScreen
            onBack={() => setRoute("citizen-before")}
            onContinue={() => setRoute("citizen-before")}
          />
        </>
      );
    case "citizen-before-household":
      return (
        <>
          <StatusBar style="dark" />
          <CitizenHouseholdRegistrationScreen
            onBack={() => setRoute("citizen-before")}
            onContinue={() => setRoute("citizen-before-household-members")}
          />
        </>
      );
    case "citizen-before-household-members":
      return (
        <>
          <StatusBar style="dark" />
          <CitizenHouseholdMembersScreen
            onBack={() => setRoute("citizen-before-household")}
            onContinue={() => setRoute("citizen-before")}
          />
        </>
      );
    case "citizen-during":
      return (
        <>
          <StatusBar style="dark" />
          <CitizenDuringScreen onBack={() => setRoute("citizen-before")} />
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
