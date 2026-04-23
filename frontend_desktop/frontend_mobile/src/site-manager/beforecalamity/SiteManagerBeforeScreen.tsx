import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MobileHeader, NavPills } from "../../components/MobileShell";
import { Button, Pill, Screen, SectionCard } from "../../components/UI";
import { siteManagerStyles } from "../shared";
import { theme } from "../../theme";

export function SiteManagerBeforeScreen({
  onBack,
  onOpenResponse,
}: {
  onBack: () => void;
  onOpenResponse: () => void;
}) {
  const [active, setActive] = useState("Dashboard");
  
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
          Monitor shelter readiness, inventory, and intake scanner preparation.
        </Text>
        
        {/* Metric Row */}
        <View style={siteManagerStyles.metricRow}>
          <View style={siteManagerStyles.metricCard}>
            <Text style={siteManagerStyles.metricValue}>88%</Text>
            <Text style={siteManagerStyles.metricLabel}>Readiness</Text>
          </View>
          <View style={siteManagerStyles.metricCard}>
            <Text style={siteManagerStyles.metricValue}>72h</Text>
            <Text style={siteManagerStyles.metricLabel}>Window</Text>
          </View>
        </View>

        <Button label="Open Active Response" tone="secondary" onPress={onOpenResponse} />
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
          {[
            { icon: "water", name: "Potable Water", level: "92%", color: theme.primary },
            { icon: "medical", name: "Medical Kits", level: "84%", color: theme.primary },
            { icon: "leaf", name: "Dry Rations", level: "95%", color: theme.primary },
            { icon: "bed", name: "Blankets", level: "61%", color: theme.warning },
          ].map((item, idx) => (
            <View key={idx} style={siteManagerStyles.inventoryItem}>
              <View style={[siteManagerStyles.inventoryIcon, { backgroundColor: item.color + "15" }]}>
                <Ionicons name={item.icon as any} size={18} color={item.color} />
              </View>
              <Text style={{ fontSize: 14, fontWeight: "800", color: theme.text }}>{item.level}</Text>
              <Text style={{ fontSize: 11, color: theme.textMuted }}>{item.name}</Text>
            </View>
          ))}
        </View>
      </SectionCard>

      {/* Deployment Tracker */}
      <SectionCard>
        <Text style={[siteManagerStyles.sectionTitle, { marginBottom: 16 }]}>Team Deployment</Text>
        
        {[
          { label: "Medical Responders", current: 24, total: 30, percent: "80%" },
          { label: "Logistics Personnel", current: 12, total: 12, percent: "100%" },
          { label: "Community Volunteers", current: 145, total: 200, percent: "72%" },
        ].map((item, idx) => (
          <View key={idx} style={{ marginBottom: 16 }}>
            <View style={siteManagerStyles.progRow}>
              <Text style={siteManagerStyles.progLabel}>{item.label}</Text>
              <Text style={{ fontSize: 12, color: theme.textMuted }}>{item.current} / {item.total}</Text>
            </View>
            <View style={{ height: 6, backgroundColor: theme.surfaceSoft, borderRadius: 3, overflow: "hidden" }}>
              <View
                style={{
                  height: "100%",
                  width: item.percent as `${number}%`,
                  backgroundColor: item.percent === "100%" ? theme.success : theme.primary,
                }}
              />
            </View>
          </View>
        ))}
      </SectionCard>

      {/* Timeline */}
      <SectionCard>
        <Text style={[siteManagerStyles.sectionTitle, { marginBottom: 20 }]}>Recent Activities</Text>
        {[
          { time: "08:45 AM", title: "Convoy Gamma Arrived", desc: "10 Responders safely staged at Sector 4." },
          { time: "07:12 AM", title: "Sector 4 Comms Live", desc: "Satellite uplink established (92% signal)." },
        ].map((item, idx, arr) => (
          <View key={idx} style={siteManagerStyles.timelineItem}>
            <View>
              <View style={siteManagerStyles.timelineDot} />
              {idx < arr.length - 1 && <View style={siteManagerStyles.timelineLine} />}
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 10, fontWeight: "800", color: theme.textLight }}>{item.time}</Text>
              <Text style={{ fontSize: 15, fontWeight: "800", color: theme.text, marginTop: 2 }}>{item.title}</Text>
              <Text style={{ fontSize: 13, color: theme.textMuted, marginTop: 4, lineHeight: 18 }}>{item.desc}</Text>
            </View>
          </View>
        ))}
      </SectionCard>
    </Screen>
    </View>
  );
}
