import React, { useState } from "react";
import { Text, View } from "react-native";
import { MobileHeader } from "../../components/MobileShell";
import { Pill, Screen, SectionCard } from "../../components/UI";
import { CitizenBottomNav, citizenStyles } from "../shared";

export function CitizenDuringScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  const [active] = useState<"home" | "relief" | "qr" | "profile">("qr");

  return (
    <Screen>
      <MobileHeader title="Citizen Portal" subtitle="Emergency response dashboard" onBack={onBack} />

      <SectionCard style={citizenStyles.mapCard}>
        <Pill label="Phase 2: Active Response" tone="danger" />
        <Text style={citizenStyles.sectionTitle}>Rescue Map</Text>
        <Text style={citizenStyles.rowCopy}>Current Location: Brgy. 102, District 4</Text>
        <View style={citizenStyles.fakeMap}>
          <View style={citizenStyles.hotspot} />
        </View>
      </SectionCard>

      <SectionCard>
        <Text style={citizenStyles.sectionTitle}>Active Tickets</Text>
        {[
          ["Medical Kit", "Distribution Point A", "Ready"],
          ["Potable Water", "ETA 45 mins", "Queued"],
        ].map(([title, meta, status]) => (
          <View key={title} style={citizenStyles.ticketCard}>
            <View>
              <Text style={citizenStyles.rowTitle}>{title}</Text>
              <Text style={citizenStyles.rowCopy}>{meta}</Text>
            </View>
            <Pill label={status} tone={status === "Ready" ? "success" : "warning"} />
          </View>
        ))}
      </SectionCard>

      <CitizenBottomNav active={active} />
    </Screen>
  );
}
