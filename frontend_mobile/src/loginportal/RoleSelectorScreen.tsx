import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { SectionCard, Screen } from "../components/UI";
import { roleColors, theme, fonts } from "../theme";
import { AppRoute, PortalRole } from "../types";

const roles: { id: PortalRole; label: string; desc: string }[] = [
  { id: "admin", label: "Admin", desc: "System monitoring, approvals, and reports" },
  { id: "dispatcher", label: "Dispatcher", desc: "Incident assignment and field coordination" },
  { id: "site_manager", label: "Site Manager", desc: "Shelter readiness and intake operations" },
  { id: "citizen", label: "Affected Citizen", desc: "Registration, alerts, and relief tracking" },
];

const routeMap: Record<PortalRole, AppRoute> = {
  admin: "admin-login",
  dispatcher: "dispatcher-login",
  site_manager: "site-manager-login",
  citizen: "citizen-login",
};

export function RoleSelectorScreen({ onNavigate }: { onNavigate: (route: AppRoute) => void }) {
  return (
    <Screen>
      <SectionCard style={styles.hero}>
        <View style={styles.mark}>
          <Text style={styles.markText}>D</Text>
        </View>
        <Text style={styles.brand}>DAMAYAN</Text>
        <Text style={styles.headline}>Choose Your Portal</Text>
        <Text style={styles.copy}>
          Open the right operational view for your role. This mobile app mirrors the
          main desktop flows in a phone-friendly format.
        </Text>
      </SectionCard>

      {roles.map((role) => (
        <Pressable
          key={role.id}
          onPress={() => onNavigate(routeMap[role.id])}
          style={styles.roleCard}
        >
          <View style={[styles.roleDot, { backgroundColor: roleColors[role.id] }]} />
          <View style={styles.roleCopy}>
            <Text style={styles.roleLabel}>{role.label}</Text>
            <Text style={styles.roleDesc}>{role.desc}</Text>
          </View>
          <Text style={[styles.openText, { color: roleColors[role.id] }]}>Open</Text>
        </Pressable>
      ))}
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    backgroundColor: theme.primary,
  },
  mark: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.16)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 12,
  },
  markText: {
    color: "#fff",
    ...fonts.black,
  },
  brand: {
    color: "#fff",
    fontSize: 20,
    ...fonts.extrabold,
    marginBottom: 16,
  },
  headline: {
    color: "#fff",
    fontSize: 34,
    lineHeight: 36,
    ...fonts.black,
    marginBottom: 12,
  },
  copy: {
    color: "rgba(255,255,255,0.84)",
    lineHeight: 22,
  },
  roleCard: {
    backgroundColor: theme.surface,
    borderRadius: 22,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.line,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  roleDot: {
    width: 12,
    height: 12,
    borderRadius: 999,
  },
  roleCopy: {
    flex: 1,
    gap: 4,
  },
  roleLabel: {
    color: theme.text,
    fontSize: 16,
    ...fonts.extrabold,
  },
  roleDesc: {
    color: theme.textMuted,
    lineHeight: 20,
  },
  openText: {
    ...fonts.extrabold,
  },
});
