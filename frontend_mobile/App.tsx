import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
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
import { AppRoute } from "./src/types";

export default function App() {
  const [route, setRoute] = useState<AppRoute>("role-selector");
  const [fontsReady, setFontsReady] = useState(true);

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
            onSecondary={() => setRoute("site-manager-signup")}
            secondaryLabel="Create An Account"
          />
        </>
      );
    case "site-manager-signup":
      return (
        <>
          <StatusBar style="dark" />
          <SiteManagerSignupScreen
            onBack={() => setRoute("site-manager-login")}
            onSubmit={() => setRoute("site-manager-login")}
          />
        </>
      );
    case "site-manager-before":
      return (
        <>
          <StatusBar style="dark" />
          <SiteManagerBeforeScreen
            onBack={() => setRoute("site-manager-login")}
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
