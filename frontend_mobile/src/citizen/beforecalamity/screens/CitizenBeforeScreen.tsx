import React, { useState } from "react";
import { Pressable, Text, View, Modal, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen, Pill, SectionCard } from "../../../components/UI";
import { theme, fonts } from "../../../theme";
import {
  CitizenPreparednessTopBar,
  citizenStyles,
} from "../../shared";

export function CitizenBeforeScreen({
  onBack,
  onOpenResponse,
  onRegisterIndividual,
  onRegisterHousehold,
  initialStep = "dashboard",
}: {
  onBack: () => void;
  onOpenResponse: () => void;
  onRegisterIndividual?: () => void;
  onRegisterHousehold?: () => void;
  initialStep?: string;
}) {
  const [step, setStep] = React.useState(initialStep);
  const [showNotificationPrompt, setShowNotificationPrompt] = React.useState(true);
  const [activeAlert, setActiveAlert] = React.useState<string | null>("FLASH FLOOD WARNING: Sector 4 expects 20cm surge within 120mins.");

  return (
    <Screen>
      {/* Push Notification Modal */}
      <Modal visible={showNotificationPrompt} transparent animationType="fade">
        <View style={localStyles.modalOverlay}>
          <View style={localStyles.modalContent}>
            <View style={localStyles.modalIconCircle}>
              <Ionicons name="notifications" size={36} color={theme.primary} />
            </View>
            <Text style={localStyles.modalTitle}>Enable Alerts?</Text>
            <Text style={localStyles.modalText}>
              Stay informed with real-time push notifications for critical updates and evacuation orders in your sector.
            </Text>
            <TouchableOpacity onPress={() => setShowNotificationPrompt(false)} style={localStyles.modalPrimaryBtn}>
              <Text style={localStyles.modalPrimaryBtnText}>Allow Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => setShowNotificationPrompt(false)}>
              <Text style={localStyles.modalSecondaryBtnText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Critical Alert Banner */}
      {activeAlert && (
        <View style={localStyles.alertBanner}>
          <View style={localStyles.alertContent}>
             <View style={localStyles.alertBadge}>
                <Text style={localStyles.alertBadgeText}>CRITICAL ALERT</Text>
             </View>
             <Text style={localStyles.alertText} numberOfLines={2}>{activeAlert}</Text>
          </View>
          <TouchableOpacity 
            onPress={() => setActiveAlert(null)}
            style={localStyles.alertAckBtn}
          >
            <Text style={localStyles.alertAckText}>OK</Text>
          </TouchableOpacity>
        </View>
      )}

      <CitizenPreparednessTopBar onBack={onBack} />
      
      {/* Digital ID Registration */}
      <View style={localStyles.section}>
        <View style={localStyles.sectionHeader}>
          <Text style={citizenStyles.sectionTitle}>Digital ID Registration</Text>
          <Text style={localStyles.sectionSub}>Complete this to receive aid allocations and verify your residency.</Text>
        </View>

        <View style={citizenStyles.selectionGrid}>
          <Pressable
            onPress={() => onRegisterIndividual?.()}
            style={citizenStyles.selectionCard}
          >
            <View>
              <View style={citizenStyles.selectionIconBox}>
                <Ionicons name="person" size={28} color={theme.primary} />
              </View>
              <Text style={citizenStyles.selectionTitle}>Register Myself</Text>
              <Text style={citizenStyles.selectionCopy}>Fastest for personal tracking and individual aid packets.</Text>
            </View>
            <View style={citizenStyles.selectionFooter}>
              <Text style={citizenStyles.selectionFooterText}>START NOW</Text>
              <Ionicons name="arrow-forward" size={16} color={theme.primary} />
            </View>
          </Pressable>

          <Pressable
            onPress={() => onRegisterHousehold?.()}
            style={citizenStyles.selectionCardPrimary}
          >
            <View style={citizenStyles.selectionGlow} />
            <View>
              <View style={citizenStyles.selectionIconBoxPrimary}>
                <Ionicons name="people" size={28} color="#fff" />
              </View>
              <Text style={citizenStyles.selectionTitlePrimary}>Register My Family</Text>
              <Text style={citizenStyles.selectionCopyPrimary}>Unified aid for your household cluster and dependents.</Text>
            </View>
            <View style={citizenStyles.selectionFooter}>
              <View style={citizenStyles.recommendedBadge}>
                <Text style={citizenStyles.recommendedText}>RECOMMENDED</Text>
              </View>
            </View>
          </Pressable>
        </View>
      </View>

      <SectionCard style={citizenStyles.greenHero}>
        <View style={localStyles.heroHeader}>
          <View style={localStyles.heroStatusBadge}>
            <Text style={localStyles.heroStatusText}>ACTIVE PLAN: STABLE</Text>
          </View>
          <Text style={localStyles.heroZoneText}>ZONE 4-A</Text>
        </View>
        <Text style={citizenStyles.heroTitle}>Low-Risk {"\n"}Condition.</Text>
        <Text style={citizenStyles.heroBody}>
          No immediate environmental threats detected in your primary sector. Current phase: Routine Maintenance.
        </Text>
      </SectionCard>

      <View style={localStyles.bottomActions}>
        <SectionCard>
          <View style={localStyles.checkHeader}>
            <View>
              <Text style={localStyles.checkTitle}>Ready-Check</Text>
              <Text style={localStyles.checkSub}>Monthly Preparedness Audit</Text>
            </View>
            <Pill label="01/03" tone="primary" />
          </View>

          <View style={localStyles.checkList}>
             <View style={localStyles.checkItemActive}>
                <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
                <View style={localStyles.checkItemContent}>
                   <Text style={localStyles.checkItemTitle}>Emergency Contact List</Text>
                   <Text style={localStyles.checkItemDesc}>Verified & Synced: 2 days ago</Text>
                </View>
             </View>
             <View style={localStyles.checkItem}>
                <Ionicons name="ellipse-outline" size={24} color={theme.lineMedium} />
                <View style={localStyles.checkItemContent}>
                   <Text style={localStyles.checkItemTitle}>72-Hour Survival Kit</Text>
                   <Text style={localStyles.checkItemDesc}>Refresh water supply & check batteries</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color={theme.lineMedium} />
             </View>
          </View>
        </SectionCard>

        <TouchableOpacity 
          onPress={onOpenResponse}
          style={localStyles.responseBtn}
        >
          <Text style={localStyles.responseBtnText}>Open Response Mode</Text>
          <Text style={localStyles.responseBtnSub}>Access shelter maps and report incidents</Text>
        </TouchableOpacity>
      </View>
    </Screen>
  );
}

const localStyles = StyleSheet.create({
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.3)", justifyContent: "center", alignItems: "center", padding: 24 },
  modalContent: { backgroundColor: "#fff", padding: 40, borderRadius: 40, width: "100%", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 30, elevation: 10 },
  modalIconCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: theme.primarySoft, alignItems: "center", justifyContent: "center", marginBottom: 24 },
  modalTitle: { fontSize: 28, ...fonts.black, color: theme.text, textAlign: "center", marginBottom: 12, letterSpacing: -1 },
  modalText: { fontSize: 16, color: theme.textMuted, textAlign: "center", lineHeight: 24, marginBottom: 32, ...fonts.medium },
  modalPrimaryBtn: { backgroundColor: theme.primary, width: "100%", height: 64, borderRadius: 22, alignItems: "center", justifyContent: "center", marginBottom: 16, shadowColor: theme.primary, shadowOpacity: 0.3, shadowRadius: 15, shadowOffset: { width: 0, height: 8 } },
  modalPrimaryBtnText: { color: "#fff", ...fonts.black, fontSize: 16, textTransform: "uppercase", letterSpacing: 2 },
  modalSecondaryBtnText: { color: theme.textLight, ...fonts.bold, fontSize: 14, textTransform: "uppercase", letterSpacing: 1 },
  
  alertBanner: { backgroundColor: theme.danger, padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginHorizontal: 24, marginTop: 16, borderRadius: 28, shadowColor: theme.danger, shadowOffset: { width: 0, height: 10 }, shadowOpacity: 0.25, shadowRadius: 20, elevation: 8 },
  alertContent: { flex: 1, marginRight: 16 },
  alertBadge: { backgroundColor: "rgba(255,255,255,0.25)", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 4, borderRadius: 8, marginBottom: 8 },
  alertBadgeText: { color: "#fff", fontSize: 10, ...fonts.black, letterSpacing: 1.5 },
  alertText: { color: "#fff", ...fonts.bold, fontSize: 15, lineHeight: 22 },
  alertAckBtn: { backgroundColor: "#fff", width: 48, height: 48, borderRadius: 16, alignItems: "center", justifyContent: "center" },
  alertAckText: { color: theme.danger, ...fonts.black, fontSize: 12 },

  section: { paddingBottom: 32 },
  sectionHeader: { paddingHorizontal: 24, marginBottom: 16 },
  sectionSub: { fontSize: 14, color: theme.textLight, ...fonts.medium, lineHeight: 20 },
  
  heroHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 16 },
  heroStatusBadge: { backgroundColor: theme.secondary, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8 },
  heroStatusText: { color: theme.text, ...fonts.black, fontSize: 11, letterSpacing: 1 },
  heroZoneText: { color: "rgba(255,255,255,0.6)", ...fonts.bold, fontSize: 12, letterSpacing: 1 },

  bottomActions: { paddingHorizontal: 24, paddingVertical: 32, gap: 24 },
  checkHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24 },
  checkTitle: { fontSize: 22, ...fonts.black, color: theme.text, letterSpacing: -0.5 },
  checkSub: { fontSize: 13, color: theme.textMuted, ...fonts.medium },
  checkList: { gap: 16 },
  checkItemActive: { flexDirection: "row", alignItems: "center", gap: 16, backgroundColor: theme.primarySoft, padding: 18, borderRadius: 20, borderLeftWidth: 6, borderLeftColor: theme.primary },
  checkItem: { flexDirection: "row", alignItems: "center", gap: 16, padding: 18, borderRadius: 20, borderWidth: 1.5, borderColor: theme.line },
  checkItemContent: { flex: 1 },
  checkItemTitle: { ...fonts.bold, color: theme.text, fontSize: 16 },
  checkItemDesc: { fontSize: 13, color: theme.textMuted, marginTop: 2, ...fonts.medium },

  responseBtn: { backgroundColor: theme.primary, padding: 28, borderRadius: 32, alignItems: "center", shadowColor: theme.primary, shadowOffset: { width: 0, height: 12 }, shadowOpacity: 0.3, shadowRadius: 20, elevation: 12 },
  responseBtnText: { color: "#fff", ...fonts.black, fontSize: 20, textTransform: "uppercase", letterSpacing: 2 },
  responseBtnSub: { color: "rgba(255,255,255,0.7)", ...fonts.bold, fontSize: 13, marginTop: 4 },
});
