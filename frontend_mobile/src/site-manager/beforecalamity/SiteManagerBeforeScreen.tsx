import React, { useState } from "react";
import { Text, View } from "react-native";
import { MobileHeader, NavPills } from "../../components/MobileShell";
import { Button, Pill, Screen, SectionCard } from "../../components/UI";
import { siteManagerStyles } from "../shared";

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
      <SectionCard style={siteManagerStyles.primaryHero}>
        <Pill label="Phase 1" tone="warning" />
        <Text style={siteManagerStyles.heroTitle}>Regional Preparedness Dashboard</Text>
        <Text style={siteManagerStyles.heroText}>
          Monitor shelter readiness, inventory, and intake scanner preparation.
        </Text>
        <Button label="Open Active Response" onPress={onOpenResponse} />
      </SectionCard>

      <SectionCard>
        <Text style={siteManagerStyles.sectionTitle}>Before Calamity Checklist</Text>
        {[
          "Verify Inventory & Capacity",
          "Enable Check-In Scanner",
          "Confirm Responder Coverage",
        ].map((item) => (
          <View key={item} style={siteManagerStyles.checkRow}>
            <Text style={siteManagerStyles.checkLabel}>{item}</Text>
            <Pill label="Ready" tone="success" />
          </View>
        ))}
      </SectionCard>
    </Screen>
  );
}
