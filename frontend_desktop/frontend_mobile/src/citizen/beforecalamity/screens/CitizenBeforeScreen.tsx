import React, { useState } from "react";
import { Pressable, Text, View, Modal, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Pill, SectionCard } from "../../../components/UI";
import { theme, fonts } from "../../../theme";
import {
  CitizenBottomNav,
  CitizenPreparednessTopBar,
  citizenStyles,
} from "../../shared";

export function CitizenBeforeScreen({
  onBack,
  onOpenResponse,
  onRegisterIndividual,
  onRegisterHousehold,
}: {
  onBack: () => void;
  onOpenResponse: () => void;
  onRegisterIndividual?: () => void;
  onRegisterHousehold?: () => void;
}) {
  const [active] = useState<"home" | "relief" | "qr" | "profile">("home");
  const [showNotificationPrompt, setShowNotificationPrompt] = useState(true);
  const [activeAlert, setActiveAlert] = useState<string | null>("FLASH FLOOD WARNING: Sector 4 expects 20cm surge within 120mins. Acknowledge to receive evacuation route.");

  return (
    <Screen>
      {/* Push Notification Modal */}
      <Modal visible={showNotificationPrompt} transparent animationType="fade">
        <View style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center", padding: 20 }}>
          <View style={{ backgroundColor: "#fff", padding: 32, borderRadius: 24, width: "100%", alignItems: "center" }}>
            <View style={{ width: 64, height: 64, borderRadius: 32, backgroundColor: theme.primaryLight, alignItems: "center", justifyContent: "center", marginBottom: 20 }}>
              <Ionicons name="notifications" size={32} color={theme.primary} />
            </View>
            <Text style={{ fontSize: 22, fontWeight: "900", color: theme.text, textAlign: "center", marginBottom: 8 }}>Enable Alert Notifications?</Text>
            <Text style={{ fontSize: 14, color: theme.textMuted, textAlign: "center", lineHeight: 20, marginBottom: 24 }}>
              Stay informed with real-time push notifications for critical weather updates and evacuation orders in your sector.
            </Text>
            <TouchableOpacity onPress={() => setShowNotificationPrompt(false)} style={{ backgroundColor: theme.primary, width: "100%", padding: 18, borderRadius: 16, alignItems: "center", marginBottom: 12 }}>
              <Text style={{ color: "#fff", fontWeight: "800", fontSize: 16 }}>Allow Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowNotificationPrompt(false)}>
              <Text style={{ color: theme.textMuted, fontWeight: "700" }}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Critical Alert Banner */}
      {activeAlert && (
        <View style={{ backgroundColor: theme.danger, padding: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 20, marginTop: 12, borderRadius: 20, shadowColor: theme.danger, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.2, shadowRadius: 10 }}>
          <View style={{ flex: 1, marginRight: 12 }}>
             <View style={{ backgroundColor: "rgba(255,255,255,0.25)", alignSelf: "flex-start", paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6, marginBottom: 6 }}>
                <Text style={{ color: "#fff", fontSize: 10, ...fonts.black, letterSpacing: 1 }}>CRITICAL ALERT</Text>
             </View>
             <Text style={{ color: "#fff", ...fonts.bold, fontSize: 14, lineHeight: 20 }} numberOfLines={2}>{activeAlert}</Text>
          </View>
          <TouchableOpacity 
            onPress={() => setActiveAlert(null)}
            style={{ backgroundColor: "#fff", paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 }}
          >
            <Text style={{ color: theme.danger, ...fonts.black, fontSize: 11 }}>ACKNOWLEDGE</Text>
          </TouchableOpacity>
        </View>
      )}

      <CitizenPreparednessTopBar onBack={onBack} />
      
      {/* Flowchart Step: Registration of Users with QR */}
      <View style={{ paddingHorizontal: 20, marginBottom: 20 }}>
        <View style={{ marginBottom: 16 }}>
          <Text style={citizenStyles.sectionTitle}>Digital ID Registration</Text>
          <Text style={{ fontSize: 14, color: theme.textLight, ...fonts.regular }}>Complete this to receive aid allocations and verify your residency.</Text>
        </View>

        <View style={citizenStyles.choiceGrid}>
          <Pressable
            onPress={() => onRegisterIndividual?.()}
            style={citizenStyles.choiceCard}
          >
            <View style={citizenStyles.choiceIcon}>
              <Ionicons name="person" size={32} color={theme.primary} />
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={citizenStyles.choiceTitle}>Register Myself</Text>
              <Text style={citizenStyles.choiceBody}>Fastest for personal tracking and individual aid packets.</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
              <Text style={{ color: theme.primary, ...fonts.bold, fontSize: 12 }}>START NOW</Text>
              <Ionicons name="arrow-forward" size={14} color={theme.primary} />
            </View>
          </Pressable>

          <Pressable
            onPress={() => onRegisterHousehold?.()}
            style={[citizenStyles.choiceCard, { backgroundColor: theme.secondaryLight, borderColor: "rgba(255, 179, 0, 0.3)" }]}
          >
            <View style={[citizenStyles.choiceIcon, { backgroundColor: "rgba(255, 179, 0, 0.15)" }]}>
              <Ionicons name="people" size={32} color={theme.warning} />
            </View>
            <View style={{ alignItems: "center" }}>
              <Text style={citizenStyles.choiceTitle}>Register My Family</Text>
              <Text style={citizenStyles.choiceBody}>Unified aid for your household cluster and dependents.</Text>
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 6, marginTop: 4 }}>
              <Text style={{ color: theme.warning, ...fonts.bold, fontSize: 12 }}>RECOMMENDED</Text>
              <Ionicons name="arrow-forward" size={14} color={theme.warning} />
            </View>
          </Pressable>
        </View>
      </View>

      <SectionCard style={[citizenStyles.greenHero, { marginHorizontal: 20, marginBottom: 24 }]}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <View style={{ backgroundColor: theme.secondary, paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 }}>
            <Text style={{ color: "#8f5d00", ...fonts.black, fontSize: 10, letterSpacing: 1 }}>ACTIVE PLAN: STABLE</Text>
          </View>
          <Text style={{ color: "rgba(255,255,255,0.6)", ...fonts.bold, fontSize: 12 }}>ZONE 4-A</Text>
        </View>
        <Text style={citizenStyles.heroTitle}>Low-Risk {"\n"}Condition.</Text>
        <Text style={citizenStyles.heroBody}>
          No immediate environmental threats detected in your primary sector. Current preparedness phase: Routine Maintenance.
        </Text>
      </SectionCard>

      <View style={{ paddingHorizontal: 20 }}>
        <SectionCard>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <View>
              <Text style={{ fontSize: 18, fontWeight: "900", color: theme.text }}>Ready-Check</Text>
              <Text style={{ fontSize: 13, color: theme.textMuted }}>Monthly Preparedness Audit</Text>
            </View>
            <Pill label="01/03" tone="primary" />
          </View>

          <View style={{ gap: 16 }}>
             <View style={{ flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: "rgba(46, 125, 50, 0.05)", padding: 14, borderRadius: 16, borderLeftWidth: 4, borderLeftColor: theme.primary }}>
                <Ionicons name="checkmark-circle" size={26} color={theme.primary} />
                <View style={{ flex: 1 }}>
                   <Text style={{ ...fonts.bold, color: theme.text, fontSize: 15 }}>Emergency Contact List</Text>
                   <Text style={{ fontSize: 12, color: theme.textMuted, opacity: 0.8 }}>Verified & Synced: 2 days ago</Text>
                </View>
             </View>
             <View style={{ flexDirection: "row", alignItems: "center", gap: 14, padding: 14, borderRadius: 16, borderWidth: 1, borderColor: theme.line }}>
                <Ionicons name="ellipse-outline" size={26} color={theme.line} />
                <View style={{ flex: 1 }}>
                   <Text style={{ ...fonts.bold, color: theme.text, fontSize: 15 }}>72-Hour Survival Kit</Text>
                   <Text style={{ fontSize: 12, color: theme.textMuted }}>Refresh water supply & check batteries</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.line} />
             </View>
          </View>
        </SectionCard>

        <SectionCard>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
            <View>
              <Text style={citizenStyles.sectionTitle}>Sector Map</Text>
              <Text style={{ fontSize: 13, color: theme.textMuted }}>Your registered primary zone</Text>
            </View>
            <View style={{ backgroundColor: theme.primaryLight, padding: 8, borderRadius: 12 }}>
               <Ionicons name="locate" size={18} color={theme.primary} />
            </View>
          </View>
          
          <View style={[citizenStyles.fakeMap, { height: 160, borderRadius: 20 }]}>
              <View style={{ backgroundColor: theme.success, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, flexDirection: "row", alignItems: "center", gap: 6 }}>
                <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: "#fff" }} />
                <Text style={{ color: "#fff", ...fonts.black, fontSize: 10 }}>ZONE 4: CLEAR</Text>
              </View>
          </View>
        </SectionCard>

        <TouchableOpacity 
          onPress={onOpenResponse}
          style={{ backgroundColor: theme.primary, padding: 22, borderRadius: 24, alignItems: "center", marginTop: 12, marginBottom: 50, shadowColor: theme.primary, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.25, shadowRadius: 16, elevation: 8 }}
        >
          <Text style={{ color: "#fff", ...fonts.black, fontSize: 18 }}>Open Response Mode</Text>
          <Text style={{ color: "rgba(255,255,255,0.7)", ...fonts.bold, fontSize: 12, marginTop: 4 }}>Access shelter maps and report incidents</Text>
        </TouchableOpacity>
      </View>

      <CitizenBottomNav active={active} />
    </Screen>
  );
}
