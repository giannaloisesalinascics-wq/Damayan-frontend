import React, { useState } from "react";
import { StatusBar } from "expo-status-bar";
import { PortalLoginScreen } from "./src/screens/PortalLoginScreen";
import { RoleSelectorScreen } from "./src/screens/RoleSelectorScreen";
import {
  CitizenBeforeScreen,
  CitizenDuringScreen,
  CitizenSignupScreen,
} from "./src/screens/CitizenScreens";
import {
  SiteManagerBeforeScreen,
  SiteManagerDuringScreen,
} from "./src/screens/SiteManagerScreens";
import { AdminDashboardScreen } from "./src/screens/AdminDashboardScreen";
import {
  DispatcherBeforeScreen,
  DispatcherDuringScreen,
} from "./src/screens/DispatcherScreens";
import { AppRoute } from "./src/types";

export default function App() {
  const [route, setRoute] = useState<AppRoute>("role-selector");

  switch (route) {
    case "admin-login":
      return (
        <>
          <StatusBar style="dark" />
          <PortalLoginScreen
            role="admin"
            onBack={() => setRoute("role-selector")}
            onSubmit={() => setRoute("admin-dashboard")}
          />
        </>
      );
    case "admin-dashboard":
      return (
        <>
          <StatusBar style="dark" />
          <AdminDashboardScreen onBack={() => setRoute("role-selector")} />
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
            onSubmit={() => setRoute("site-manager-before")}
          />
        </>
      );
    case "site-manager-before":
      return (
        <>
          <StatusBar style="dark" />
          <SiteManagerBeforeScreen
            onBack={() => setRoute("role-selector")}
            onOpenResponse={() => setRoute("site-manager-during")}
          />
        </>
      );
    case "site-manager-during":
      return (
        <>
          <StatusBar style="dark" />
          <SiteManagerDuringScreen onBack={() => setRoute("site-manager-before")} />
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
            onSubmit={() => setRoute("citizen-login")}
          />
        </>
      );
    case "citizen-before":
      return (
        <>
          <StatusBar style="dark" />
          <CitizenBeforeScreen
            onBack={() => setRoute("role-selector")}
            onEmergency={() => setRoute("citizen-during")}
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
