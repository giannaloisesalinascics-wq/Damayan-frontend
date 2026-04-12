import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MobileHeader, NavPills } from "../components/MobileShell";
import { Button, Pill, Screen, SectionCard, Input } from "../components/UI";
import { theme } from "../theme";

export function SiteManagerBeforeScreen({
  onBack,
  onOpenResponse,
}: {
  onBack: () => void;
  onOpenResponse: () => void;
}) {
  const [active, setActive] = useState("Dashboard");
  return (
    <Screen>
      <MobileHeader title="Damayan Portal" subtitle="Site Manager" onBack={onBack} />
      <NavPills
        items={["Dashboard", "Assessment", "Distribution", "Recovery"]}
        active={active}
        onSelect={setActive}
      />
      <SectionCard style={styles.primaryHero}>
        <Pill label="Phase 1" tone="warning" />
        <Text style={styles.heroTitle}>Regional Preparedness Dashboard</Text>
        <Text style={styles.heroText}>
          Monitor shelter readiness, inventory, and intake scanner preparation.
        </Text>
        <Button label="Open Active Response" onPress={onOpenResponse} />
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>Before Calamity Checklist</Text>
        {[
          "Verify Inventory & Capacity",
          "Enable Check-In Scanner",
          "Confirm Responder Coverage",
        ].map((item) => (
          <View key={item} style={styles.checkRow}>
            <Text style={styles.checkLabel}>{item}</Text>
            <Pill label="Ready" tone="success" />
          </View>
        ))}
      </SectionCard>
    </Screen>
  );
}

export function SiteManagerDuringScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  const [active, setActive] = useState("Dashboard");
  const [checkInMode, setCheckInMode] = useState<"scan" | "manual">("scan");

  return (
    <Screen>
      <MobileHeader title="Damayan Portal" subtitle="Site Manager" onBack={onBack} />
      <NavPills
        items={["Dashboard", "Assessment", "Distribution", "Recovery"]}
        active={active}
        onSelect={setActive}
      />

      <SectionCard>
        <Pill label="Phase 2: Active Response" tone="danger" />
        <Text style={styles.sectionTitle}>Check-In Scanner Station</Text>
        <View style={styles.scannerBox}>
          <Text style={styles.scannerText}>QR Intake Scanner Ready</Text>
        </View>
        <View style={styles.modeRow}>
          <Button
            label="Scan QR Code"
            onPress={() => setCheckInMode("scan")}
            tone={checkInMode === "scan" ? "primary" : "ghost"}
          />
          <Button
            label="Manual Entry"
            onPress={() => setCheckInMode("manual")}
            tone={checkInMode === "manual" ? "primary" : "ghost"}
          />
        </View>
        {checkInMode === "manual" ? (
          <View style={styles.manualWrap}>
            <Input label="Evacuee Name" placeholder="Enter full name" />
            <Input label="Temporary ID" placeholder="Assign or enter ID" />
            <Button label="Save Manual Entry" onPress={() => {}} />
          </View>
        ) : (
          <Text style={styles.helperText}>
            Manual intake stays hidden until the manager selects Manual Entry.
          </Text>
        )}
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  primaryHero: {
    backgroundColor: theme.primary,
    gap: 12,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "900",
  },
  heroText: {
    color: "rgba(255,255,255,0.88)",
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: theme.text,
    marginBottom: 12,
  },
  checkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
  checkLabel: {
    flex: 1,
    fontWeight: "800",
    color: theme.text,
  },
  scannerBox: {
    height: 180,
    borderRadius: 22,
    backgroundColor: "#11311a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  scannerText: {
    color: "#d8ffd8",
    fontWeight: "800",
  },
  modeRow: {
    gap: 10,
  },
  manualWrap: {
    marginTop: 14,
    gap: 12,
  },
  helperText: {
    marginTop: 12,
    color: theme.textMuted,
    lineHeight: 20,
  },
});
