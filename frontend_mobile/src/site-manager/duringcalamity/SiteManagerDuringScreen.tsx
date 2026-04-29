import React, { useState, useEffect, useRef } from "react";
import { Animated, Text, View, StyleSheet, ScrollView, Pressable, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Pill, SectionCard, Input } from "../../components/UI";
import { siteManagerStyles } from "../shared";
import { theme, fonts } from "../../theme";

export function SiteManagerDuringScreen({
  onBack,
}: {
  onBack: () => void;
}) {
  const [activeTab, setActiveTab] = useState("Dashboard");
  const [checkInMode, setCheckInMode] = useState<"scan" | "manual">("scan");
  const [severity, setSeverity] = useState<"low" | "medium" | "high">("high");
  const [incidentType, setIncidentType] = useState("Medical Emergency");
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [description, setDescription] = useState("");

  const incidentTypes = ["Medical Emergency", "Fire Incident", "Structural Damage", "Supply Shortage", "Security Concern", "Other"];
  
  const [capacity, setCapacity] = useState(500);
  const [occupancy, setOccupancy] = useState(420);
  
  const scanAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (checkInMode === "scan") {
      Animated.loop(
        Animated.sequence([
          Animated.timing(scanAnim, { toValue: 1, duration: 2000, useNativeDriver: true }),
          Animated.timing(scanAnim, { toValue: 0, duration: 2000, useNativeDriver: true }),
        ])
      ).start();
    }
  }, [checkInMode]);

  const translateY = scanAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 160], 
  });

  const percentOccupied = Math.min((occupancy / capacity) * 100, 100);

  function renderContent() {
    switch(activeTab) {
      case "Assessment":
        return (
          <View style={{ gap: 24, paddingHorizontal: 24 }}>
            <View>
              <Text style={siteManagerStyles.sectionTitle}>Site Capacity</Text>
              <Text style={siteManagerStyles.sectionSub}>Shelter Intake Monitoring</Text>
            </View>

            <View style={[siteManagerStyles.checkCard, { gap: 24 }]}>
               <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end" }}>
                  <View>
                    <Text style={{ fontSize: 42, ...fonts.black, color: theme.text, letterSpacing: -2 }}>{occupancy}</Text>
                    <Text style={{ fontSize: 13, ...fonts.bold, color: theme.textLight, textTransform: "uppercase" }}>Current Occupancy</Text>
                  </View>
                  <View style={{ alignItems: "flex-end" }}>
                    <Text style={{ fontSize: 18, ...fonts.black, color: percentOccupied > 90 ? theme.danger : theme.primary }}>{percentOccupied.toFixed(0)}%</Text>
                    <Text style={{ fontSize: 10, ...fonts.bold, color: theme.textLight }}>UTILIZATION</Text>
                  </View>
               </View>

               <View style={{ height: 12, backgroundColor: theme.surfaceAlt, borderRadius: 6, overflow: "hidden" }}>
                  <View style={{ height: "100%", width: `${percentOccupied}%`, backgroundColor: percentOccupied > 90 ? theme.danger : theme.primary }} />
               </View>

               <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity 
                    onPress={() => setOccupancy(o => Math.max(0, o - 1))}
                    style={{ flex: 1, height: 60, borderRadius: 18, backgroundColor: theme.surfaceAlt, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: theme.line }}
                  >
                    <Ionicons name="remove" size={24} color={theme.text} />
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setOccupancy(o => Math.min(capacity, o + 1))}
                    style={{ flex: 1, height: 60, borderRadius: 18, backgroundColor: theme.primary, alignItems: "center", justifyContent: "center" }}
                  >
                    <Ionicons name="add" size={24} color="#fff" />
                  </TouchableOpacity>
               </View>
            </View>

            <View>
              <Text style={siteManagerStyles.sectionTitle}>Facility Status</Text>
              <Text style={siteManagerStyles.sectionSub}>Resource Integrity</Text>
            </View>

            <View style={{ gap: 12 }}>
                {[
                  { label: "Power Supply", status: "STABLE", color: theme.success, icon: "flashlight" },
                  { label: "Water Access", status: "RUNNING", color: theme.success, icon: "water" },
                  { label: "Sanitation", status: "CRITICAL", color: theme.danger, icon: "trash" },
                ].map(item => (
                  <View key={item.label} style={[siteManagerStyles.distroCard, { marginBottom: 0 }]}>
                    <View style={[siteManagerStyles.distroIconBox, { backgroundColor: item.color + "15" }]}>
                      <Ionicons name={item.icon as any} size={24} color={item.color} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: theme.text, ...fonts.bold, fontSize: 16 }}>{item.label}</Text>
                      <Text style={{ color: theme.textLight, fontSize: 12 }}>Last checked: 14m ago</Text>
                    </View>
                    <View style={{ backgroundColor: item.color + "15", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 }}>
                      <Text style={{ color: item.color, ...fonts.black, fontSize: 10 }}>{item.status}</Text>
                    </View>
                  </View>
                ))}
            </View>
          </View>
        );

      case "Distribution":
        return (
          <View style={{ gap: 24, paddingHorizontal: 24 }}>
            <View>
              <Text style={siteManagerStyles.sectionTitle}>Relief Disbursal</Text>
              <Text style={siteManagerStyles.sectionSub}>Inventory & Allocation</Text>
            </View>

            <View style={siteManagerStyles.inventoryGrid}>
                {[
                  { name: "Water (1L)", stock: 120, icon: "water", color: theme.info },
                  { name: "Med Kit", stock: 14, icon: "medkit", color: theme.danger },
                  { name: "Family Pack", stock: 45, icon: "gift", color: theme.warning },
                  { name: "Blankets", stock: 88, icon: "bed", color: theme.primary },
                ].map(item => (
                  <View key={item.name} style={siteManagerStyles.inventoryCard}>
                    <View style={[siteManagerStyles.inventoryIconBox, { backgroundColor: item.color + "15" }]}>
                      <Ionicons name={item.icon as any} size={22} color={item.color} />
                    </View>
                    <View>
                      <Text style={siteManagerStyles.inventoryLevel}>{item.stock}</Text>
                      <Text style={siteManagerStyles.inventoryName}>{item.name}</Text>
                    </View>
                    <TouchableOpacity style={{ backgroundColor: theme.primary, borderRadius: 12, height: 44, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ color: "#fff", ...fonts.black, fontSize: 11, letterSpacing: 0.5 }}>DISBURSE</Text>
                    </TouchableOpacity>
                  </View>
                ))}
            </View>
          </View>
        );

      case "Dashboard":
      default:
        return (
          <View style={{ gap: 32, paddingHorizontal: 24 }}>
            <View>
              <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
                <View>
                  <Text style={siteManagerStyles.sectionTitle}>Intake Scanner</Text>
                  <Text style={siteManagerStyles.sectionSub}>QR Validation System</Text>
                </View>
                <Pill label="Scanner Live" tone="primary" />
              </View>

              <View style={{ marginTop: 20 }}>
                {checkInMode === "scan" ? (
                  <View style={siteManagerStyles.scannerHero}>
                    <View style={siteManagerStyles.scannerOverlay} />
                    <Animated.View style={[siteManagerStyles.scannerBeam, { transform: [{ translateY }] }]} />
                    <Ionicons name="qr-code-outline" size={80} color="rgba(255,255,255,0.1)" />
                    <View style={{ position: "absolute", bottom: 24, backgroundColor: "rgba(255,255,255,0.1)", paddingHorizontal: 16, paddingVertical: 8, borderRadius: 12 }}>
                       <Text style={{ color: "#fff", ...fonts.bold, fontSize: 12 }}>Align QR ID within frame</Text>
                    </View>
                  </View>
                ) : (
                  <View style={[siteManagerStyles.scannerHero, { backgroundColor: theme.surfaceAlt, borderWidth: 2, borderStyle: "dashed", borderColor: theme.line }]}>
                    <Ionicons name="create-outline" size={48} color={theme.textLight} />
                    <Text style={{ color: theme.textMuted, marginTop: 12, ...fonts.bold }}>Manual Entry Mode</Text>
                  </View>
                )}

                <View style={{ flexDirection: "row", gap: 12 }}>
                  <TouchableOpacity 
                    onPress={() => setCheckInMode("scan")}
                    style={{ flex: 1, height: 60, borderRadius: 20, backgroundColor: checkInMode === 'scan' ? theme.primary : theme.surfaceAlt, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: checkInMode === 'scan' ? theme.primary : theme.line }}
                  >
                    <Text style={{ color: checkInMode === 'scan' ? "#fff" : theme.textLight, ...fonts.black, fontSize: 14 }}>SCAN QR</Text>
                  </TouchableOpacity>
                  <TouchableOpacity 
                    onPress={() => setCheckInMode("manual")}
                    style={{ flex: 1, height: 60, borderRadius: 20, backgroundColor: checkInMode === 'manual' ? theme.primary : theme.surfaceAlt, alignItems: "center", justifyContent: "center", borderWidth: 1.5, borderColor: checkInMode === 'manual' ? theme.primary : theme.line }}
                  >
                    <Text style={{ color: checkInMode === 'manual' ? "#fff" : theme.textLight, ...fonts.black, fontSize: 14 }}>MANUAL</Text>
                  </TouchableOpacity>
                </View>

                {checkInMode === "manual" && (
                  <View style={{ marginTop: 20, gap: 16 }}>
                    <Input label="Full Name" placeholder="e.g. Elena Villacruz" />
                    <Input label="Temporary ID" placeholder="284-XXX-XXX" />
                    <TouchableOpacity style={{ height: 60, backgroundColor: theme.primary, borderRadius: 20, alignItems: "center", justifyContent: "center" }}>
                      <Text style={{ color: "#fff", ...fonts.black, fontSize: 15 }}>VALIDATE ENTRANCE</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            </View>

            <View>
              <Text style={siteManagerStyles.sectionTitle}>Report Site Incident</Text>
              <Text style={siteManagerStyles.sectionSub}>Log Critical Site Events</Text>
              
              <View style={{ marginTop: 20, gap: 16 }}>
                 <View style={{ gap: 8 }}>
                    <Text style={{ fontSize: 11, ...fonts.bold, color: theme.textLight, textTransform: "uppercase", letterSpacing: 1.5 }}>Incident Category</Text>
                    <TouchableOpacity onPress={() => setShowTypePicker(true)} style={{ height: 64, borderRadius: 20, backgroundColor: theme.surfaceAlt, borderWidth: 1.5, borderColor: theme.line, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 20 }}>
                       <Text style={{ fontSize: 16, ...fonts.semibold, color: theme.text }}>{incidentType}</Text>
                       <Ionicons name="chevron-down" size={20} color={theme.textLight} />
                    </TouchableOpacity>
                 </View>

                 <Input label="Situation Brief" placeholder="Briefly describe the emergency..." />

                 <View style={{ flexDirection: "row", gap: 12 }}>
                    {["low", "medium", "high"].map((s) => (
                      <TouchableOpacity 
                        key={s} 
                        onPress={() => setSeverity(s as any)}
                        style={{ 
                          flex: 1, height: 52, borderRadius: 16, alignItems: "center", justifyContent: "center", 
                          backgroundColor: severity === s ? (s === 'high' ? theme.danger : s === 'medium' ? theme.warning : theme.primary) : theme.surfaceAlt,
                          borderWidth: 1.5, borderColor: severity === s ? (s === 'high' ? theme.danger : s === 'medium' ? theme.warning : theme.primary) : theme.line
                        }}
                      >
                        <Text style={{ color: severity === s ? "#fff" : theme.textLight, ...fonts.black, fontSize: 11, textTransform: "uppercase", letterSpacing: 1 }}>{s}</Text>
                      </TouchableOpacity>
                    ))}
                 </View>

                 <TouchableOpacity style={{ height: 64, borderRadius: 22, backgroundColor: theme.danger, alignItems: "center", justifyContent: "center", shadowColor: theme.danger, shadowOpacity: 0.3, shadowRadius: 15, shadowOffset: { width: 0, height: 8 } }}>
                    <Text style={{ color: "#fff", ...fonts.black, fontSize: 16, letterSpacing: 1 }}>BROADCAST INCIDENT</Text>
                 </TouchableOpacity>
              </View>
            </View>
          </View>
        );
    }
  }

  return (
    <View style={siteManagerStyles.shell}>
      <ScrollView contentContainerStyle={siteManagerStyles.scrollContent} showsVerticalScrollIndicator={false}>
        <View style={{ height: 24 }} />
        {renderContent()}
        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Incident FAB */}
      <TouchableOpacity 
        style={{ position: "absolute", right: 24, bottom: 32, width: 72, height: 72, borderRadius: 24, backgroundColor: theme.danger, alignItems: "center", justifyContent: "center", shadowColor: theme.danger, shadowOpacity: 0.4, shadowRadius: 20, shadowOffset: { width: 0, height: 10 }, elevation: 12 }}
      >
        <Ionicons name=" megaphone" size={32} color="#fff" />
      </TouchableOpacity>

      {/* Type Picker Modal */}
      <Modal visible={showTypePicker} transparent animationType="slide">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" }}>
          <View style={{ backgroundColor: "#fff", borderTopLeftRadius: 32, borderTopRightRadius: 32, padding: 24, paddingBottom: 40 }}>
            <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
              <Text style={{ fontSize: 22, ...fonts.black, color: theme.text }}>Incident Type</Text>
              <TouchableOpacity onPress={() => setShowTypePicker(false)}>
                <Ionicons name="close-circle" size={32} color={theme.textLight} />
              </TouchableOpacity>
            </View>
            <View style={{ gap: 12 }}>
              {incidentTypes.map(type => (
                <TouchableOpacity 
                  key={type} 
                  onPress={() => { setIncidentType(type); setShowTypePicker(false); }}
                  style={{ 
                    padding: 20, borderRadius: 20, backgroundColor: incidentType === type ? theme.primarySoft : theme.surfaceAlt, 
                    borderWidth: 1.5, borderColor: incidentType === type ? theme.primary : theme.line,
                    flexDirection: "row", justifyContent: "space-between", alignItems: "center"
                  }}
                >
                  <Text style={{ color: incidentType === type ? theme.primary : theme.text, ...fonts.bold, fontSize: 16 }}>{type}</Text>
                  {incidentType === type && <Ionicons name="checkmark-circle" size={24} color={theme.primary} />}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
