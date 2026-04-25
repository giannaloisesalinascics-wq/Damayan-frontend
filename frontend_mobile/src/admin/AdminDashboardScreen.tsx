import React, { useEffect, useState } from "react";
import { Text, View } from "react-native";
import { MobileHeader, NavPills } from "../components/MobileShell";
import { Button, Pill, Screen, SectionCard } from "../components/UI";
import { ApiError, getDashboard, getDisasterEvents, getOrganizations } from "../api";
import { theme } from "../theme";
import { styles } from "./AdminDashboardScreen.styles";
import { AuthSession, DashboardOverview, DisasterEvent, Organization } from "../types";

export function AdminDashboardScreen({
  onBack,
  onSignOut,
  session,
}: {
  onBack: () => void;
  onSignOut: () => void;
  session: AuthSession;
}) {
  const [active, setActive] = useState("Overview");
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [disasters, setDisasters] = useState<DisasterEvent[]>([]);
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function hydrate() {
      try {
        const [dashboard, disasterList, orgs] = await Promise.all([
          getDashboard("admin", session.accessToken),
          getDisasterEvents("admin", session.accessToken),
          getOrganizations(session.accessToken),
        ]);
        setOverview(dashboard);
        setDisasters(disasterList);
        setOrganizations(orgs);
      } catch (caughtError) {
        setError(
          caughtError instanceof ApiError
            ? caughtError.message
            : "Unable to load admin data.",
        );
      }
    }

    void hydrate();
  }, [session.accessToken]);

  return (
    <Screen>
      <MobileHeader title="DAMAYAN Admin Console" subtitle={session.user.email} onBack={onBack} />
      <NavPills
        items={["Overview", "Approvals", "System Health"]}
        active={active}
        onSelect={setActive}
      />

      {error ? (
        <SectionCard>
          <Text style={{ color: theme.danger, fontWeight: "800" }}>{error}</Text>
        </SectionCard>
      ) : null}

      <View style={styles.kpiGrid}>
        {[
          ["Active Disasters", `${overview?.disasterEvents.activeEvents ?? 0}`],
          ["Incident Queue", `${overview?.incidentReports.pendingReports ?? 0}`],
          ["Inventory Units", `${overview?.inventory.totalItems ?? 0}`],
          ["Organizations", `${overview?.organizations.totalOrganizations ?? 0}`],
        ].map(([label, value]) => (
          <SectionCard key={label} style={styles.kpiCard}>
            <Text style={styles.kpiLabel}>{label}</Text>
            <Text style={styles.kpiValue}>{value}</Text>
          </SectionCard>
        ))}
      </View>

      <SectionCard>
        <Text style={styles.sectionTitle}>Active Disaster Feed</Text>
        {disasters.slice(0, 3).map((item) => (
          <View key={item.id} style={styles.listCard}>
            <View style={{ flex: 1 }}>
              <Text style={styles.rowTitle}>{item.name}</Text>
              <Text style={styles.rowCopy}>{item.type} • {item.province}</Text>
            </View>
            <View style={styles.actionGroup}>
              <Pill label={item.status} tone={item.status === "active" ? "danger" : "info"} />
            </View>
          </View>
        ))}
      </SectionCard>

      <SectionCard>
        <Text style={styles.sectionTitle}>System Reachability</Text>
        {[
          ["Gateway/Auth", error ? "Needs attention" : "Operational", error ? "warning" : "success"],
          ["Operations Dashboard", overview ? "Operational" : "Waiting", overview ? "success" : "warning"],
          ["Organizations Feed", organizations.length ? "Operational" : "Waiting", organizations.length ? "success" : "warning"],
        ].map(([name, status, tone]) => (
          <View key={name} style={styles.healthRow}>
            <Text style={styles.rowTitle}>{name}</Text>
            <Pill label={status} tone={tone === "success" ? "success" : "warning"} />
          </View>
        ))}
      </SectionCard>

      <Button label="Sign Out" tone="secondary" onPress={onSignOut} />
    </Screen>
  );
}


