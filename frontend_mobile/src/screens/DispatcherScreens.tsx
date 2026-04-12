import React, { useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { MobileHeader, NavPills } from "../components/MobileShell";
import { Button, Pill, Screen, SectionCard } from "../components/UI";
import { theme } from "../theme";

export function DispatcherBeforeScreen({
  onBack,
  onOpenDuring,
}: {
  onBack: () => void;
  onOpenDuring: () => void;
}) {
  const [active, setActive] = useState("Incidents");

  return (
    <Screen>
      <MobileHeader title="Damayan Portal" subtitle="Dispatcher" onBack={onBack} />
      <NavPills
        items={["Dashboard", "Incidents", "Resources", "Sites"]}
        active={active}
        onSelect={setActive}
      />

      <SectionCard>
        <Pill label="Phase 1" tone="warning" />
        <Text style={styles.title}>Dispatch Command Center</Text>
        <Text style={styles.copy}>
          Monitor incidents, pre-position resources, and coordinate teams ahead of
          response escalation.
        </Text>
        <Button label="Open Active Dispatch" onPress={onOpenDuring} />
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>Incoming Incidents</Text>
        {[
          ["Flood Warning", "Brgy. 102, District 4", "High"],
          ["Medical Emergency", "North Elementary", "Critical"],
        ].map(([type, area, severity]) => (
          <View key={type} style={styles.ticketRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{type}</Text>
              <Text style={styles.rowCopy}>{area}</Text>
            </View>
            <Pill label={severity} tone={severity === "Critical" ? "danger" : "warning"} />
          </View>
        ))}
      </SectionCard>
    </Screen>
  );
}

export function DispatcherDuringScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  const [active, setActive] = useState("Tickets");

  return (
    <Screen>
      <MobileHeader title="Damayan Portal" subtitle="Dispatcher Active Ops" onBack={onBack} />
      <NavPills
        items={["Dashboard", "Tickets", "Resources", "Broadcast"]}
        active={active}
        onSelect={setActive}
      />

      <SectionCard>
        <Pill label="Phase 2: Active Response" tone="danger" />
        <Text style={styles.title}>Active Dispatch Operations</Text>
        <Text style={styles.copy}>
          Assign tickets, coordinate relief sites, and track live field activity.
        </Text>
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>Relief Ticket Queue</Text>
        {[
          ["TKT-2201", "Medical", "Unassigned"],
          ["TKT-2202", "Food Relief", "Assigned"],
          ["TKT-2203", "Evacuation", "In Progress"],
        ].map(([id, type, status]) => (
          <View key={id} style={styles.ticketRow}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{type}</Text>
              <Text style={styles.rowCopy}>{id}</Text>
            </View>
            <Pill
              label={status}
              tone={
                status === "Unassigned"
                  ? "danger"
                  : status === "Assigned"
                    ? "info"
                    : "warning"
              }
            />
          </View>
        ))}
        <Button label="Broadcast Alert To All" tone="danger" onPress={() => {}} />
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "900",
    color: theme.text,
    marginTop: 10,
  },
  copy: {
    color: theme.textMuted,
    lineHeight: 22,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: theme.text,
    marginBottom: 14,
  },
  ticketRow: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#f8faf7",
    borderWidth: 1,
    borderColor: theme.line,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  rowTitle: {
    fontWeight: "800",
    color: theme.text,
  },
  rowCopy: {
    marginTop: 4,
    color: theme.textMuted,
  },
});
