import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { MobileHeader } from "../components/MobileShell";
import { Button, Input, Pill, Screen, SectionCard } from "../components/UI";
import { roleColors } from "../theme";
import { PortalRole } from "../types";

const roleContent: Record<
  PortalRole,
  { title: string; subtitle: string; loginLabel: string; accent: string; action: string }
> = {
  admin: {
    title: "Admin Access",
    subtitle: "Oversee approvals, system health, and platform coordination.",
    loginLabel: "Admin",
    accent: roleColors.admin,
    action: "Log In To Admin Dashboard",
  },
  dispatcher: {
    title: "Dispatcher Access",
    subtitle: "Manage tickets, teams, and active field response operations.",
    loginLabel: "Dispatcher",
    accent: roleColors.dispatcher,
    action: "Continue To Dispatcher Dashboard",
  },
  site_manager: {
    title: "Site Manager Access",
    subtitle: "Manage shelter readiness, intake, and local distribution.",
    loginLabel: "Site Manager",
    accent: roleColors.site_manager,
    action: "Log In To Site Manager Dashboard",
  },
  citizen: {
    title: "Citizen Access",
    subtitle: "Sign in for alerts, preparedness info, and relief access.",
    loginLabel: "Citizen",
    accent: roleColors.citizen,
    action: "Continue To Citizen Dashboard",
  },
};

export function PortalLoginScreen({
  role,
  onBack,
  onSubmit,
  onSecondary,
  secondaryLabel,
}: {
  role: PortalRole;
  onBack: () => void;
  onSubmit: () => void;
  onSecondary?: () => void;
  secondaryLabel?: string;
}) {
  const content = roleContent[role];

  return (
    <Screen>
      <MobileHeader title={content.title} subtitle={content.loginLabel} onBack={onBack} />

      <SectionCard style={[styles.hero, { backgroundColor: content.accent }]}>
        <Pill label={content.loginLabel} />
        <Text style={styles.heroTitle}>{content.title}</Text>
        <Text style={styles.heroText}>{content.subtitle}</Text>
      </SectionCard>

      <SectionCard>
        <Input label="Username" placeholder="Enter username" />
        <Input label="Password" placeholder="********" secureTextEntry />
        <View style={styles.actions}>
          <Button label={content.action} onPress={onSubmit} />
          {onSecondary && secondaryLabel ? (
            <Button label={secondaryLabel} tone="ghost" onPress={onSecondary} />
          ) : null}
        </View>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 12,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 32,
    lineHeight: 34,
    fontWeight: "900",
  },
  heroText: {
    color: "rgba(255,255,255,0.88)",
    lineHeight: 22,
  },
  actions: {
    gap: 10,
    marginTop: 16,
  },
});
