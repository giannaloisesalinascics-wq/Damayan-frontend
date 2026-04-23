import React, { useState, useEffect, useRef } from "react";
import { Animated, Text, View, StyleSheet, ScrollView, Pressable, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { MobileHeader, NavPills } from "../../components/MobileShell";
import { Button, Input, Pill, Screen, SectionCard } from "../../components/UI";
import { siteManagerStyles } from "../shared";
import { theme, fonts } from "../../theme";
import { styles } from "./SiteManagerDuringScreen.styles";

export function SiteManagerDuringScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  const [active, setActive] = useState("Dashboard");
  const [checkInMode, setCheckInMode] = useState<"scan" | "manual">("scan");
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("high");
  const [incidentType, setIncidentType] = useState("Medical Emergency");
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [description, setDescription] = useState("");

  const incidentTypes = [
    "Medical Emergency",
    "Fire Incident",
    "Structural Damage",
    "Supply Shortage",
    "Security Concern",
    "Other",
  ];
  
  // Operations State
  const [capacity, setCapacity] = useState(500);
  const [occupancy, setOccupancy] = useState(420);
  
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (checkInMode === "scan") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, {
            toValue: 1,
            duration: 2500,
            useNativeDriver: true,
          }),
          Animated.timing(scanAnim, {
            toValue: 0,
            duration: 2500,
            useNativeDriver: true,
          }),
        ])
      ).start();
    } else {
      scanAnim.setValue(0);
      scanAnim.stopAnimation();
    }
  }, [checkInMode, scanAnim]);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [10, 150], 
  });

  const percentOccupied = Math.min((occupancy / capacity) * 100, 100);

  function renderContent() {
    switch(active) {
      case "Assessment":
        return (
          <View style={{ gap: 16 }}>
            <SectionCard>
              <Text style={siteManagerStyles.sectionTitle}>Site Capacity Update</Text>
              <Text style={siteManagerStyles.rowCopy}>Configure total shelter volume and current intake.</Text>
              
              <View style={siteManagerStyles.gaugeContainer}>
                <View style={[siteManagerStyles.gaugeFill, { width: `${percentOccupied}%`, backgroundColor: percentOccupied > 90 ? theme.danger : theme.primary }]} />
              </View>
              
              <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 20 }}>
                <Text style={{ fontSize: 24, ...fonts.black, color: theme.text }}>{occupancy} / {capacity}</Text>
                <Text style={{ color: percentOccupied > 90 ? theme.danger : theme.textLight, fontWeight: "700" }}>
                  {percentOccupied.toFixed(0)}% FULL
                </Text>
              </View>

              <View style={{ gap: 16 }}>
                <View style={{ gap: 8 }}>
                  <Text style={siteManagerStyles.swimLabel}>Current Occupancy</Text>
                  <View style={siteManagerStyles.stepperRow}>
                    <Pressable onPress={() => setOccupancy(o => Math.max(0, o - 1))} style={siteManagerStyles.stepperBtn}>
                      <Text style={{ fontSize: 24, fontWeight: "900", color: theme.primary }}>-</Text>
                    </Pressable>
                    <Text style={siteManagerStyles.stepperValue}>{occupancy}</Text>
                    <Pressable onPress={() => setOccupancy(o => Math.min(capacity, o + 1))} style={siteManagerStyles.stepperBtn}>
                      <Text style={{ fontSize: 24, fontWeight: "900", color: theme.primary }}>+</Text>
                    </Pressable>
                  </View>
                </View>

                <View style={{ gap: 8 }}>
                  <Text style={siteManagerStyles.swimLabel}>Total Capacity</Text>
                  <Input 
                    label="" 
                    placeholder={capacity.toString()} 
                    onChangeText={(val) => setCapacity(parseInt(val) || capacity)}
                  />
                </View>
              </View>
            </SectionCard>

            <SectionCard>
              <Text style={siteManagerStyles.sectionTitle}>Facility Status</Text>
              <View style={{ gap: 12, marginTop: 12 }}>
                {[
                  { label: "Power Supply", status: "STABLE", color: theme.success },
                  { label: "Water Access", status: "RUNNING", color: theme.success },
                  { label: "Sanitation", status: "CRITICAL", color: theme.danger },
                ].map(item => (
                  <View key={item.label} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderColor: theme.line }}>
                    <Text style={{ color: theme.text, fontWeight: "700" }}>{item.label}</Text>
                    <View style={{ backgroundColor: item.color + "22", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                      <Text style={{ color: item.color, fontWeight: "900", fontSize: 10 }}>{item.status}</Text>
                    </View>
                  </View>
                ))}
              </View>
            </SectionCard>
          </View>
        );

      case "Distribution":
        return (
          <View style={{ gap: 16 }}>
            <SectionCard>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View>
                  <Text style={siteManagerStyles.sectionTitle}>Relief Distribution</Text>
                  <Text style={siteManagerStyles.rowCopy}>Issue supplies to registered evacuees.</Text>
                </View>
                <Ionicons name="cube-outline" size={32} color={theme.primary} />
              </View>

              <View style={siteManagerStyles.distroGrid}>
                {[
                  { name: "Water (1L)", stock: 120, icon: "water" },
                  { name: "Med Kit", stock: 14, icon: "medkit" },
                  { name: "Family Pack", stock: 45, icon: "gift" },
                  { name: "Blankets", stock: 88, icon: "bed" },
                ].map(item => (
                  <View key={item.name} style={siteManagerStyles.distroCard}>
                    <View style={siteManagerStyles.distroIcon}>
                      <Ionicons name={item.icon as any} size={20} color={theme.primary} />
                    </View>
                    <View>
                      <Text style={{ fontWeight: "800", fontSize: 13, color: theme.text }}>{item.name}</Text>
                      <Text style={{ fontSize: 11, color: theme.textLight }}>{item.stock} in stock</Text>
                    </View>
                    <Pressable style={{ backgroundColor: theme.primary, borderRadius: 10, paddingVertical: 8, alignItems: "center" }}>
                      <Text style={{ color: "#fff", fontWeight: "900", fontSize: 11 }}>DISBURSE</Text>
                    </Pressable>
                  </View>
                ))}
              </View>
            </SectionCard>

            <SectionCard>
              <Text style={siteManagerStyles.sectionTitle}>Recent Activity</Text>
              <View style={{ gap: 16, marginTop: 16 }}>
                {[
                  { user: "Samuel A.", item: "1x Med Kit", time: "2m ago" },
                  { user: "Maria R.", item: "3x Water", time: "15m ago" },
                ].map((log, i) => (
                  <View key={i} style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                    <View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
                      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: theme.primary }} />
                      <View>
                        <Text style={{ fontWeight: "800", color: theme.text }}>{log.user}</Text>
                        <Text style={{ fontSize: 12, color: theme.textMuted }}>{log.item}</Text>
                      </View>
                    </View>
                    <Text style={{ fontSize: 12, color: theme.textLight }}>{log.time}</Text>
                  </View>
                ))}
              </View>
            </SectionCard>
          </View>
        );

      case "Dashboard":
      default:
        return (
          <View style={{ gap: 16 }}>
            <SectionCard>
              <View style={styles.incidentHeader}>
                <View>
                  <Text style={siteManagerStyles.sectionTitle}>Intake Scanner</Text>
                  <Text style={siteManagerStyles.rowCopy}>Validate citizen QR IDs for entrance.</Text>
                </View>
                <View style={{ backgroundColor: theme.primaryLight, borderRadius: 12, padding: 8 }}>
                  <Text style={{ color: theme.primary, fontWeight: "900", fontSize: 12 }}>ID READY</Text>
                </View>
              </View>

              {checkInMode === "scan" ? (
                <View style={siteManagerStyles.scannerBox}>
                  <View style={[styles.corner, styles.tl]} />
                  <View style={[styles.corner, styles.tr]} />
                  <View style={[styles.corner, styles.bl]} />
                  <View style={[styles.corner, styles.br]} />
                  <Ionicons name="qr-code-outline" size={80} color="rgba(255,255,255,0.2)" />
                  <Animated.View style={[styles.laser, { transform: [{ translateY }] }]} />
                  <Text style={[siteManagerStyles.scannerText, { position: "absolute", bottom: 16 }]}>
                    Position QR within frame
                  </Text>
                </View>
              ) : (
                <View style={[siteManagerStyles.scannerBox, { backgroundColor: theme.surfaceSoft, borderWidth: 1, borderColor: theme.line }]}>
                  <Ionicons name="create-outline" size={48} color={theme.textLight} />
                  <Text style={{ color: theme.textMuted, marginTop: 8, fontWeight: "600" }}>Manual Entry Mode</Text>
                </View>
              )}

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
                  Manual intake is hidden. Tap "Manual Entry" above to manually register evacuees without IDs.
                </Text>
              )}
            </SectionCard>

            <SectionCard>
              <View style={styles.incidentHeader}>
                <View>
                  <Text style={siteManagerStyles.sectionTitle}>Report Site Incident</Text>
                  <Text style={{ color: theme.textMuted, fontSize: 13 }}>Log critical events immediately</Text>
                </View>
                <View style={{ backgroundColor: theme.dangerLight, borderRadius: 999, paddingHorizontal: 10, paddingVertical: 4 }}>
                  <Text style={{ color: theme.danger, fontWeight: "800", fontSize: 10 }}>3 ACTIVE</Text>
                </View>
              </View>

              <View style={{ gap: 16 }}>
                <View style={styles.manualWrap}>
                  <Text style={{ fontSize: 12, fontWeight: "800", color: theme.textMuted, textTransform: "uppercase", letterSpacing: 0.8 }}>
                    Incident Type
                  </Text>
                  <Pressable style={styles.typePicker} onPress={() => setShowTypePicker(true)}>
                    <Text style={{ color: theme.text }}>{incidentType}</Text>
                    <Ionicons name="chevron-down" size={20} color={theme.textLight} />
                  </Pressable>
                </View>
                <Input 
                  label="Detailed Description" 
                  placeholder="Briefly describe the situation..." 
                  onChangeText={setDescription}
                />
                <View style={styles.severityRow}>
                  {["low", "medium", "high"].map(s => (
                    <Pressable 
                      key={s} 
                      onPress={() => setSeverity(s as any)}
                      style={[
                        styles.severityBtn, 
                        severity === s && { 
                          backgroundColor: s === "high" ? theme.dangerLight : s === "medium" ? theme.warningLight : theme.primaryLight, 
                          borderColor: s === "high" ? theme.danger : s === "medium" ? theme.warning : theme.primary 
                        }
                      ]}
                    >
                      <Text style={[
                        styles.severityLabel, 
                        severity === s && { 
                          color: s === "high" ? theme.danger : s === "medium" ? theme.warning : theme.primary 
                        }
                      ]}>{s}</Text>
                    </Pressable>
                  ))}
                </View>
                <Button 
                  label="Post Incident Report" 
                  onPress={() => {
                    console.log("Reporting:", { incidentType, description, severity });
                    alert(`Reported: ${incidentType} (${severity})`);
                  }} 
                  tone="danger" 
                />
              </View>

              {/* Type Picker Modal */}
              <Modal visible={showTypePicker} transparent animationType="slide">
                <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
                  <View style={{ backgroundColor: "#fff", borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 }}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                      <Text style={{ fontSize: 20, fontWeight: "900", color: theme.text }}>Select Incident Type</Text>
                      <Pressable onPress={() => setShowTypePicker(false)}>
                        <Ionicons name="close-circle" size={28} color={theme.textLight} />
                      </Pressable>
                    </View>
                    <View style={{ gap: 12 }}>
                      {incidentTypes.map(type => (
                        <Pressable 
                          key={type} 
                          onPress={() => {
                            setIncidentType(type);
                            setShowTypePicker(false);
                          }}
                          style={{ 
                            padding: 18, 
                            borderRadius: 16, 
                            backgroundColor: incidentType === type ? theme.primaryLight : theme.surfaceSoft,
                            borderWidth: 1,
                            borderColor: incidentType === type ? theme.primary : theme.line,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            alignItems: "center"
                          }}
                        >
                          <Text style={{ color: incidentType === type ? theme.primary : theme.text, fontWeight: "700" }}>{type}</Text>
                          {incidentType === type && <Ionicons name="checkmark-circle" size={20} color={theme.primary} />}
                        </Pressable>
                      ))}
                    </View>
                  </View>
                </View>
              </Modal>
            </SectionCard>
          </View>
        );
    }
  }

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <View style={{ backgroundColor: theme.surface, shadowColor: "#000", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.05, shadowRadius: 10, elevation: 4 }}>
        <MobileHeader title="Damayan Portal" subtitle="Site Manager" onBack={onBack} />
        <NavPills
          items={["Dashboard", "Assessment", "Distribution", "Recovery"]}
          active={active}
          onSelect={setActive}
        />

      {/* Swimlane Metrics */}
      <View style={siteManagerStyles.swimlane}>
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={siteManagerStyles.swimScroll}
        >
          <View style={siteManagerStyles.swimItem}>
            <View style={siteManagerStyles.swimDot} />
            <Text style={siteManagerStyles.swimLabel}>SHELTER LOAD</Text>
            <Text style={siteManagerStyles.swimValue}>84%</Text>
          </View>
          <View style={{ width: 1, height: 14, backgroundColor: theme.line }} />
          <View style={siteManagerStyles.swimItem}>
            <Text style={siteManagerStyles.swimLabel}>SUPPLIES</Text>
            <Text style={siteManagerStyles.swimValue}>SECURE</Text>
          </View>
          <View style={{ width: 1, height: 14, backgroundColor: theme.line }} />
          <View style={siteManagerStyles.swimItem}>
            <Text style={siteManagerStyles.swimLabel}>TEAMS</Text>
            <Text style={siteManagerStyles.swimValue}>12 ACTIVE</Text>
          </View>
          <View style={{ width: 1, height: 14, backgroundColor: theme.line }} />
          <View style={siteManagerStyles.swimItem}>
            <Text style={siteManagerStyles.swimLabel}>ZONE</Text>
            <Text style={siteManagerStyles.swimValue}>SECTOR 4</Text>
          </View>
        </ScrollView>
      </View>
    </View>

      <Screen>
        {renderContent()}
      </Screen>

      {/* FAB */}
      <Pressable 
        style={{
          position: "absolute",
          right: 20,
          bottom: 20,
          backgroundColor: theme.primary,
          paddingHorizontal: 20,
          paddingVertical: 14,
          borderRadius: 999,
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          shadowColor: theme.primary,
          shadowOffset: { width: 0, height: 10 },
          shadowOpacity: 0.3,
          shadowRadius: 15,
          elevation: 8,
        }}
      >
        <View style={{ width: 22, height: 22, backgroundColor: "rgba(255,255,255,0.2)", borderRadius: 11, alignItems: "center", justifyContent: "center" }}>
          <Text style={{ color: "#fff", fontWeight: "900", fontSize: 13 }}>!</Text>
        </View>
        <Text style={{ color: "#fff", fontWeight: "800", fontSize: 14 }}>Broadcast Alert</Text>
      </Pressable>
    </View>
  );
}


