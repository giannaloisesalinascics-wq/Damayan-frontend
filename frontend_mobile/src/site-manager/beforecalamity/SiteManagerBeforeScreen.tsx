import React, { useState, useEffect } from "react";
import { Pressable, Text, View, ScrollView, TouchableOpacity, Animated } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Pill, SectionCard } from "../../components/UI";
import { siteManagerStyles } from "../shared";
import { theme, fonts } from "../../theme";

export function SiteManagerBeforeScreen({
  onBack,
  onOpenResponse,
}: {
  onBack: () => void;
  onOpenResponse: () => void;
}) {
  const [activeTab, setActiveTab] = useState("Dashboard");
  
  const [checklist, setChecklist] = useState([
    { id: "1", label: "Verify Shelter Inventory", status: "Pending", icon: "cube" },
    { id: "2", label: "Scanner Hardware Sync", status: "Pending", icon: "qr-code" },
    { id: "3", label: "Coverage Confirmation", status: "Pending", icon: "people" },
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
    <View style={siteManagerStyles.shell}>
      <ScrollView contentContainerStyle={siteManagerStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={{ height: 24 }} />
        {/* Hero Dashboard */}
        <View style={siteManagerStyles.primaryHero}>
          <View style={siteManagerStyles.heroGradient} />
          <View style={{ alignSelf: "flex-start", backgroundColor: "rgba(255,255,255,0.2)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 }}>
            <Text style={{ color: "#fff", fontSize: 10, ...fonts.black, letterSpacing: 1.5 }}>PREPAREDNESS MODE</Text>
          </View>
          <Text style={siteManagerStyles.heroTitle}>Regional Readiness Dashboard</Text>
          <Text style={siteManagerStyles.heroText}>
            Monitoring shelter capacity, critical supplies, and intake system preparation.
          </Text>
          
          <View style={siteManagerStyles.metricRow}>
            <View style={siteManagerStyles.metricCard}>
              <Text style={siteManagerStyles.metricValue}>94%</Text>
              <Text style={siteManagerStyles.metricLabel}>Capacity</Text>
            </View>
            <View style={siteManagerStyles.metricCard}>
              <Text style={siteManagerStyles.metricValue}>12h</Text>
              <Text style={siteManagerStyles.metricLabel}>Sync Age</Text>
            </View>
            <View style={siteManagerStyles.metricCard}>
              <Text style={siteManagerStyles.metricValue}>8/10</Text>
              <Text style={siteManagerStyles.metricLabel}>Zones</Text>
            </View>
          </View>

          <TouchableOpacity 
            onPress={onOpenResponse}
            style={{ 
              backgroundColor: "#fff", 
              height: 64, 
              borderRadius: 22, 
              flexDirection: "row", 
              alignItems: "center", 
              justifyContent: "center", 
              gap: 12, 
              marginTop: 8,
              shadowColor: "#000",
              shadowOpacity: 0.1,
              shadowRadius: 10
            }}
          >
            <Text style={{ color: theme.primary, fontSize: 16, ...fonts.black, letterSpacing: 1 }}>OPEN ACTIVE RESPONSE</Text>
            <Ionicons name="flash" size={18} color={theme.primary} />
          </TouchableOpacity>
        </View>

        {/* Readiness Checklist */}
        <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 20 }}>
            <View>
              <Text style={siteManagerStyles.sectionTitle}>Operational Tasks</Text>
              <Text style={siteManagerStyles.sectionSub}>Critical Steps to Response</Text>
            </View>
            <Text style={{ fontSize: 14, ...fonts.black, color: theme.primary }}>{completedCount}/{checklist.length}</Text>
          </View>

          <View style={siteManagerStyles.checkCard}>
            <View style={{ height: 6, backgroundColor: theme.surfaceAlt, borderRadius: 3, marginBottom: 24, overflow: "hidden" }}>
              <View style={{ height: "100%", width: `${progressPercent}%`, backgroundColor: theme.primary }} />
            </View>

            {checklist.map((item, idx) => {
              const isReady = item.status === "Ready";
              return (
                <TouchableOpacity 
                  key={item.id} 
                  onPress={() => toggleItem(item.id)}
                  style={[
                    siteManagerStyles.checkRow,
                    idx < checklist.length - 1 && { borderBottomWidth: 1, borderBottomColor: theme.line, paddingBottom: 16, marginBottom: 16 }
                  ]}
                >
                  <View style={[siteManagerStyles.checkIconWrap, isReady && { backgroundColor: theme.primarySoft, borderColor: theme.primary }]}>
                    <Ionicons 
                      name={isReady ? "checkmark-circle" : (item.icon as any)} 
                      size={20} 
                      color={isReady ? theme.primary : theme.textLight} 
                    />
                  </View>
                  <Text style={[siteManagerStyles.checkLabel, isReady && { color: theme.textLight, textDecorationLine: "line-through" }]}>
                    {item.label}
                  </Text>
                  <Pill label={item.status} tone={isReady ? "primary" : "default"} />
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Supply Inventory Grid */}
        <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
            <View>
              <Text style={siteManagerStyles.sectionTitle}>Global Inventory</Text>
              <Text style={siteManagerStyles.sectionSub}>Resource Distribution</Text>
            </View>
            <TouchableOpacity>
              <Text style={{ fontSize: 12, ...fonts.black, color: theme.primary, letterSpacing: 1 }}>VIEW ALL</Text>
            </TouchableOpacity>
          </View>

          <View style={siteManagerStyles.inventoryGrid}>
            {[
              { icon: "water", name: "Potable Water", level: "92%", color: theme.info },
              { icon: "medkit", name: "Medical Kits", level: "84%", color: theme.danger },
              { icon: "fast-food", name: "Dry Rations", level: "95%", color: theme.warning },
              { icon: "bed", name: "Blankets", level: "61%", color: theme.primary },
            ].map((item, idx) => (
              <View key={idx} style={siteManagerStyles.inventoryCard}>
                <View style={[siteManagerStyles.inventoryIconBox, { backgroundColor: item.color + "15" }]}>
                  <Ionicons name={item.icon as any} size={22} color={item.color} />
                </View>
                <View>
                  <Text style={siteManagerStyles.inventoryLevel}>{item.level}</Text>
                  <Text style={siteManagerStyles.inventoryName}>{item.name}</Text>
                </View>
                <View style={{ height: 4, backgroundColor: theme.line, borderRadius: 2, overflow: "hidden" }}>
                  <View style={{ height: "100%", width: item.level, backgroundColor: item.color }} />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Activity Log */}
        <View style={{ paddingHorizontal: 24, marginTop: 32 }}>
          <Text style={siteManagerStyles.sectionTitle}>Live Activity Feed</Text>
          <Text style={[siteManagerStyles.sectionSub, { marginBottom: 24 }]}>Real-time updates</Text>

          {[
            { time: "08:45 AM", title: "Convoy Delta Arrival", desc: "15 Medical responders safely staged at Sector 7.", type: "success" },
            { time: "07:12 AM", title: "Comms Uplink Stable", desc: "Satellite signal confirmed at 94% efficiency.", type: "info" },
            { time: "06:30 AM", title: "Inventory Audit", desc: "Potable water supply verified at main cluster.", type: "primary" },
          ].map((item, idx, arr) => (
            <View key={idx} style={siteManagerStyles.activityItem}>
              <Text style={siteManagerStyles.activityTime}>{item.time}</Text>
              <View style={siteManagerStyles.activityIndicator}>
                <View style={[siteManagerStyles.activityDot, { backgroundColor: item.type === 'success' ? theme.success : item.type === 'info' ? theme.info : theme.primary }]} />
                {idx < arr.length - 1 && <View style={siteManagerStyles.activityLine} />}
              </View>
              <View style={siteManagerStyles.activityContent}>
                <Text style={siteManagerStyles.activityTitle}>{item.title}</Text>
                <Text style={siteManagerStyles.activityDesc}>{item.desc}</Text>
              </View>
            </View>
          ))}
        </View>
        <View style={{ height: 120 }} />
      </ScrollView>
    </View>
  );
}
