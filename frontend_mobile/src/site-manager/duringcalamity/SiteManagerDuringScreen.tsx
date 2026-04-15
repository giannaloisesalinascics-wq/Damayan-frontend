import React, { useState } from "react";
import { Text, View } from "react-native";
import { MobileHeader, NavPills } from "../../components/MobileShell";
import { Button, Input, Pill, Screen, SectionCard } from "../../components/UI";
import { siteManagerStyles } from "../shared";

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
        <Text style={siteManagerStyles.sectionTitle}>Check-In Scanner Station</Text>
        <View style={siteManagerStyles.scannerBox}>
          <Text style={siteManagerStyles.scannerText}>QR Intake Scanner Ready</Text>
        </View>
        <View style={siteManagerStyles.modeRow}>
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
          <View style={siteManagerStyles.manualWrap}>
            <Input label="Evacuee Name" placeholder="Enter full name" />
            <Input label="Temporary ID" placeholder="Assign or enter ID" />
            <Button label="Save Manual Entry" onPress={() => {}} />
          </View>
        ) : (
          <Text style={siteManagerStyles.helperText}>
            Manual intake stays hidden until the manager selects Manual Entry.
          </Text>
        )}
      </SectionCard>
    </Screen>
  );
}
