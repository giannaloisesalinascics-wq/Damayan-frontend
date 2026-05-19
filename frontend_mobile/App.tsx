import React, { useEffect, useState } from "react";
import { StatusBar } from "expo-status-bar";
import { View } from "react-native";
import * as Font from "expo-font";
import { Ionicons } from "@expo/vector-icons";
import {
  CitizenSignupScreen,
  CitizenDashboardScreen,
} from "./src/citizen";
import { SiteManagerDashboardScreen } from "./src/site-manager";
import {
  MobileLoginRole,
  UnifiedLoginScreen,
} from "./src/login/UnifiedLoginScreen";
import { clearSession } from "./src/session";

type MobileRoute =
  | "login"
  | "citizen-signup"
  | "citizen-dashboard"
  | "site-manager-dashboard";

export default function App() {
  const [route, setRoute] = useState<MobileRoute>("login");
  const [fontsReady, setFontsReady] = useState(false);

  useEffect(() => {
    async function loadFonts() {
      try {
        await Font.loadAsync(Ionicons.font);
      } catch (e) {
        console.warn("Error loading fonts", e);
      } finally {
        setFontsReady(true);
      }
    }
    loadFonts();

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

  const returnToLogin = async () => {
    await clearSession().catch((error) => console.error("Failed to clear session", error));
    setRoute("login");
  };

  switch (route) {
    case "citizen-signup":
      return (
        <>
          <StatusBar style="dark" />
          <CitizenSignupScreen
            onBack={returnToLogin}
            onSubmit={() => setRoute("citizen-dashboard")}
          />
        </>
      );
    case "site-manager-dashboard":
      return (
        <>
          <StatusBar style="dark" />
          <SiteManagerDashboardScreen
            onSignOut={returnToLogin}
          />
        </>
      );
    case "citizen-dashboard":
      return (
        <>
          <StatusBar style="dark" />
          <CitizenDashboardScreen
            onSignOut={returnToLogin}
          />
        </>
      );
    case "login":
    default:
      return (
        <>
          <StatusBar style="dark" />
          <UnifiedLoginScreen
            onCreateAccount={() => setRoute("citizen-signup")}
            onLoginSuccess={(role) => {
              setRoute(role === "citizen" ? "citizen-dashboard" : "site-manager-dashboard");
            }}
          />
        </>
      );
  }
}
