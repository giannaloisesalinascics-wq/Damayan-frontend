import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MobileHeader, NavPills } from "../../components/MobileShell";
import { Button, Pill, Screen, SectionCard } from "../../components/UI";
import { siteManagerStyles } from "../shared";
import { theme } from "../../theme";
import { ApiError, getCapacity, getDashboard, getInventory, getRecentCheckIns } from "../../api";
import { AuthSession, CapacityCenter, CheckInRecord, DashboardOverview, InventoryItem } from "../../types";

export function SiteManagerBeforeScreen({
  onBack,
  onOpenResponse,
  onSignOut,
  session,
}: {
  onBack: () => void;
  onOpenResponse: () => void;
  onSignOut: () => void;
  session: AuthSession;
}) {
  const [active, setActive] = useState("Dashboard");
  const [overview, setOverview] = useState<DashboardOverview | null>(null);
  const [inventoryRows, setInventoryRows] = useState<InventoryItem[]>([]);
  const [centers, setCenters] = useState<CapacityCenter[]>([]);
  const [recent, setRecent] = useState<CheckInRecord[]>([]);
  const [error, setError] = useState<string | null>(null);
  
  const [checklist, setChecklist] = useState([
    { id: "1", label: "Verify Inventory & Capacity", status: "Pending" },
    { id: "2", label: "Enable Check-In Scanner", status: "Pending" },
    { id: "3", label: "Confirm Responder Coverage", status: "Pending" },
  ]);

  const toggleItem = (id: string) => {
    setChecklist(prev =>
      prev.map(item =>
        item.id === id
          ? { ...item, status: item.status === "Pending" ? "Ready" : "Pending" }
          : item
      )
    );
  };

  const completedCount = checklist.filter(i => i.status === "Ready").length;
  const progressPercent = (completedCount / checklist.length) * 100;

  useEffect(() => {
    async function hydrate() {
      try {
        const [dashboard, inventory, capacity, checkIns] = await Promise.all([
          getDashboard("site-manager", session.accessToken),
          getInventory("site-manager", session.accessToken),
          getCapacity(session.accessToken),
          getRecentCheckIns(session.accessToken, 4),
        ]);
        setOverview(dashboard);
        setInventoryRows(inventory);
        setCenters(capacity);
        setRecent(checkIns);
      } catch (caughtError) {
        setError(
          caughtError instanceof ApiError
            ? caughtError.message
            : "Unable to load site-manager data.",
        );
      }
    }

    void hydrate();
  }, [session.accessToken]);

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ backgroundColor: theme.surface, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4 }}>
        <MobileHeader title="Damayan Portal" subtitle="Site Manager" onBack={onBack} />
        <NavPills
          items={["Dashboard", "Assessment", "Distribution", "Recovery"]}
          active={active}
          onSelect={setActive}
        />
      </View>

      <Screen>
      <SectionCard style={siteManagerStyles.primaryHero}>
        <Pill label="Phase 1" tone="warning" />
        <Text style={siteManagerStyles.heroTitle}>Regional Preparedness Dashboard</Text>
        <Text style={siteManagerStyles.heroText}>
          Monitor shelter readiness, inventory, and intake scanner preparation for {session.user.email}.
        </Text>
        {error ? <Text style={{ color: "#fee2e2", fontWeight: "700" }}>{error}</Text> : null}
        
        {/* Metric Row */}
        <View style={siteManagerStyles.metricRow}>
          <View style={siteManagerStyles.metricCard}>
            <Text style={siteManagerStyles.metricValue}>{overview?.capacity.totalCenters ?? 0}</Text>
            <Text style={siteManagerStyles.metricLabel}>Centers</Text>
          </View>
          <View style={siteManagerStyles.metricCard}>
            <Text style={siteManagerStyles.metricValue}>{overview?.checkIns.totalCheckedIn ?? 0}</Text>
            <Text style={siteManagerStyles.metricLabel}>Checked In</Text>
          </View>
        </View>

        <Button label="Open Active Response" tone="secondary" onPress={onOpenResponse} />
        <Button label="Sign Out" tone="ghost" onPress={onSignOut} />
      </SectionCard>

      {/* Before Calamity Tasks */}
      <SectionCard>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "baseline", marginBottom: 16 }}>
          <Text style={siteManagerStyles.sectionTitle}>Before Calamity</Text>
          <Text style={{ fontWeight: "800", color: theme.textLight }}>{completedCount} / {checklist.length}</Text>
        </View>
        
          <View style={{ height: 8, backgroundColor: theme.surfaceSoft, borderRadius: 4, marginBottom: 20, overflow: "hidden" }}>
          <View style={{ height: "100%", width: `${progressPercent}%` as const, backgroundColor: theme.primary }} />
          </View>

        {checklist.map((item) => {
          const isReady = item.status === "Ready";
          return (
            <Pressable 
              key={item.id} 
              style={[siteManagerStyles.checkRow, { opacity: isReady ? 0.6 : 1 }]}
              onPress={() => toggleItem(item.id)}
            >
              <Ionicons 
                name={isReady ? "checkmark-circle" : "ellipse-outline"} 
                size={24} 
                color={isReady ? theme.success : theme.textLight} 
              />
              <Text style={[siteManagerStyles.checkLabel, isReady && { textDecorationLine: "line-through", color: theme.textLight }]}>
                {item.label}
              </Text>
              <Pill label={item.status} tone={isReady ? "success" : "default"} />
            </Pressable>
          );
        })}
      </SectionCard>

      {/* Supply Inventory Grid */}
      <SectionCard>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <Text style={siteManagerStyles.sectionTitle}>Supply Inventory</Text>
          <Text style={{ fontSize: 12, color: theme.primary, fontWeight: "800" }}>VIEW ALL</Text>
        </View>
        
        <View style={siteManagerStyles.inventoryGrid}>
          {inventoryRows.slice(0, 4).map((item, idx) => (
            <View key={idx} style={siteManagerStyles.inventoryItem}>
              <View style={[siteManagerStyles.inventoryIcon, { backgroundColor: (item.status === "low" ? theme.warning : theme.primary) + "15" }]}>
                <Ionicons name="cube-outline" size={18} color={item.status === "low" ? theme.warning : theme.primary} />
              </View>
              <Text style={{ fontSize: 14, fontWeight: "800", color: theme.text }}>{item.quantity}</Text>
              <Text style={{ fontSize: 11, color: theme.textMuted }}>{item.name}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      {/* Deployment Tracker */}
      <SectionCard>
        <Text style={[siteManagerStyles.sectionTitle, { marginBottom: 16 }]}>Team Deployment</Text>
        
        {centers.slice(0, 3).map((item, idx) => (
          <View key={idx} style={{ marginBottom: 16 }}>
            <View style={siteManagerStyles.progRow}>
              <Text style={siteManagerStyles.progLabel}>{item.name}</Text>
              <Text style={{ fontSize: 12, color: theme.textMuted }}>{item.currentOccupancy} / {item.capacity}</Text>
            </View>
            <View style={{ height: 6, backgroundColor: theme.surfaceSoft, borderRadius: 3, overflow: "hidden" }}>
              <View
                style={{
                  height: "100%",
                  width: `${item.utilizationRate}%` as `${number}%`,
                  backgroundColor: item.utilizationRate >= 90 ? theme.danger : item.utilizationRate >= 75 ? theme.warning : theme.primary,
                }}
              />
            </View>
          </View>
        ))}
      </SectionCard>

      {/* Timeline */}
      <SectionCard>
        <Text style={[siteManagerStyles.sectionTitle, { marginBottom: 20 }]}>Recent Activities</Text>
        {recent.map((item, idx, arr) => (
          <View key={idx} style={siteManagerStyles.timelineItem}>
            <View>
              <View style={siteManagerStyles.timelineDot} />
              {idx < arr.length - 1 && <View style={siteManagerStyles.timelineLine} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 10, fontWeight: "800", color: theme.textLight }}>{item.status.toUpperCase()}</Text>
              <Text style={{ fontSize: 15, fontWeight: "800", color: theme.text, marginTop: 2 }}>{item.fullName || `${item.firstName} ${item.lastName}`}</Text>
              <Text style={{ fontSize: 13, color: theme.textMuted, marginTop: 4, lineHeight: 18 }}>{item.zone} • {item.location}</Text>
            </View>
          </View>
        ))}
      </SectionCard>
    </Screen>
    </View>
  );
}
