import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MobileHeader, NavPills } from "../components/MobileShell";
import { Button, Input, Pill, Screen, SectionCard } from "../components/UI";
import { theme } from "../theme";

export function CitizenSignupScreen({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: () => void;
}) {
  return (
    <Screen>
      <MobileHeader title="Citizen Registration" subtitle="Create account" onBack={onBack} />
      <SectionCard style={styles.greenHero}>
        <Pill label="Register" tone="warning" />
        <Text style={styles.heroTitle}>Create A Citizen Account</Text>
        <Text style={styles.heroBody}>
          Register to validate your identity and access alerts, preparedness, and
          relief tracking from mobile.
        </Text>
      </SectionCard>
      <SectionCard>
        <Input label="Create Username" placeholder="family.cluster.04" />
        <Input label="Create Password" placeholder="********" secureTextEntry />
        <View style={styles.uploadBox}>
          <Text style={styles.uploadTitle}>Upload Government ID</Text>
          <Text style={styles.uploadHint}>JPG, PNG, or PDF</Text>
        </View>
        <Button label="Submit Registration" onPress={onSubmit} />
      </SectionCard>
    </Screen>
  );
}

export function CitizenBeforeScreen({
  onBack,
  onEmergency,
}: {
  onBack: () => void;
  onEmergency: () => void;
}) {
  const [active, setActive] = useState("Home");

  return (
    <Screen>
      <MobileHeader title="Citizen Portal" subtitle="Preparedness dashboard" onBack={onBack} />
      <NavPills
        items={["Home", "Risk Map", "Checklists", "Reporting", "Support"]}
        active={active}
        onSelect={setActive}
      />

      <SectionCard style={styles.heroCard}>
        <Pill label="Active Status: Stable" tone="success" />
        <Text style={styles.heroHeadline}>Low-Risk Condition.</Text>
        <Text style={styles.heroSubcopy}>
          No immediate environmental threats detected in your primary zone.
        </Text>
        <Button label="Open Active Response" onPress={onEmergency} />
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>Ready-Check</Text>
        {[
          "Update Emergency Contact List",
          "Restock 72-Hour Survival Kit",
          "Verify Evacuation Route",
        ].map((item, index) => (
          <View key={item} style={styles.listRow}>
            <View style={[styles.statusCircle, index === 0 && styles.statusCircleDone]} />
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item}</Text>
              <Text style={styles.rowCopy}>Preparedness action for household readiness.</Text>
            </View>
            <Pill label={index === 0 ? "Done" : "Pending"} tone={index === 0 ? "success" : "warning"} />
          </View>
        ))}
      </SectionCard>
    </Screen>
  );
}

export function CitizenDuringScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  const [active, setActive] = useState("Risk Map");

  return (
    <Screen>
      <MobileHeader title="Citizen Portal" subtitle="Emergency response dashboard" onBack={onBack} />
      <NavPills
        items={["Home", "Risk Map", "Checklists", "Reporting", "Support"]}
        active={active}
        onSelect={setActive}
      />

      <SectionCard style={styles.mapCard}>
        <Pill label="Phase 2: Active Response" tone="danger" />
        <Text style={styles.sectionTitle}>Rescue Map</Text>
        <Text style={styles.rowCopy}>Current Location: Brgy. 102, District 4</Text>
        <View style={styles.fakeMap}>
          <View style={styles.hotspot} />
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>Active Tickets</Text>
        {[
          ["Medical Kit", "Distribution Point A", "Ready"],
          ["Potable Water", "ETA 45 mins", "Queued"],
        ].map(([title, meta, status]) => (
          <View key={title} style={styles.ticketCard}>
            <View>
              <Text style={styles.rowTitle}>{title}</Text>
              <Text style={styles.rowCopy}>{meta}</Text>
            </View>
            <Pill label={status} tone={status === "Ready" ? "success" : "warning"} />
          </View>
        ))}
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  greenHero: {
    backgroundColor: theme.primary,
    gap: 12,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 32,
    lineHeight: 34,
    fontWeight: "900",
  },
  heroBody: {
    color: "rgba(255,255,255,0.88)",
    lineHeight: 22,
  },
  uploadBox: {
    minHeight: 108,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#cfe0d1",
    borderStyle: "dashed",
    backgroundColor: "#f7faf7",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  uploadTitle: {
    color: theme.primary,
    fontWeight: "800",
  },
  uploadHint: {
    color: theme.textMuted,
  },
  heroCard: {
    gap: 12,
    backgroundColor: "#f7fbf6",
  },
  heroHeadline: {
    color: theme.text,
    fontSize: 36,
    lineHeight: 38,
    fontWeight: "900",
  },
  heroSubcopy: {
    color: theme.textMuted,
    lineHeight: 22,
  },
  sectionTitle: {
    color: theme.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 14,
  },
  listRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
  },
  statusCircle: {
    width: 16,
    height: 16,
    borderRadius: 999,
    backgroundColor: "#d8ddd6",
  },
  statusCircleDone: {
    backgroundColor: theme.primary,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.text,
  },
  rowCopy: {
    color: theme.textMuted,
    marginTop: 4,
    lineHeight: 20,
  },
  mapCard: {
    gap: 12,
  },
  fakeMap: {
    height: 240,
    borderRadius: 20,
    backgroundColor: "#dfe6dc",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  hotspot: {
    width: 26,
    height: 26,
    borderRadius: 999,
    backgroundColor: theme.danger,
  },
  ticketCard: {
    backgroundColor: "#f7faf7",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.line,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
});
