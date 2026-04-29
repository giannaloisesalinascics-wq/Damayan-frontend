import React, { useState } from "react";
import { View, StyleSheet, ScrollView, SafeAreaView, Dimensions, Pressable, Text, Modal, Platform } from "react-native";
import { StatusBar } from "expo-status-bar";
import { Ionicons } from "@expo/vector-icons";
import { theme, fonts, roleColors } from "../theme";
import { SiteManagerBeforeScreen } from "./beforecalamity/SiteManagerBeforeScreen";
import { SiteManagerDuringScreen } from "./duringcalamity/SiteManagerDuringScreen";
import { SiteManagerAfterScreen } from "./aftercalamity/SiteManagerAfterScreen";

export type Phase = "before" | "during" | "after";
export type NavDestination = "Overview" | "Operations" | "Resources" | "Reporting";

interface SiteManagerDashboardScreenProps {
  onSignOut: () => void;
}

export default function SiteManagerDashboardScreen({ onSignOut }: SiteManagerDashboardScreenProps) {
  const [phase, setPhase] = useState<Phase>("before");
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [activeNav, setActiveNav] = useState<NavDestination>("Overview");
  const [targetStep, setTargetStep] = useState<string | null>(null);

  const accent = roleColors.site_manager;
  const styles = getStyles(isDarkMode ? darkTheme : lightTheme);
  const theme = isDarkMode ? darkTheme : lightTheme;

  return (
    <View style={styles.container}>
      <StatusBar style={isDarkMode ? "light" : "dark"} />
      
      {/* Background Decoration */}
      <View style={[styles.orb, styles.orb1, { backgroundColor: accent }]} />
      <View style={[styles.orb, styles.orb2]} />

      {/* Header */}
      <SafeAreaView style={styles.headerSafe}>
        <View style={styles.headerInner}>
          <View style={styles.headerCenter}>
            <Text style={[styles.brandText, { color: theme.text }]}>DAMAYAN</Text>
            <View style={[
              styles.phaseIndicator, 
              { backgroundColor: phase === 'before' ? (isDarkMode ? theme.surfaceAlt : '#fff9eb') : phase === 'during' ? (isDarkMode ? theme.surfaceAlt : '#fff4e5') : (isDarkMode ? theme.surfaceAlt : '#eef2ff') }
            ]}>
               <Ionicons 
                 name={phase === 'before' ? 'shield-checkmark' : phase === 'during' ? 'warning' : 'checkmark-done-circle'} 
                 size={10} 
                 color={phase === 'before' ? accent : phase === 'during' ? theme.warning : theme.info} 
               />
               <Text style={[
                 styles.phaseText, 
                 { color: phase === 'before' ? accent : phase === 'during' ? theme.warning : theme.info }
               ]}>
                 {phase === 'before' ? 'OPERATIONAL READINESS' : phase === 'during' ? 'EMERGENCY RESPONSE' : 'RECOVERY OPS'}
               </Text>
            </View>
          </View>

          <Pressable onPress={() => setIsProfileOpen(true)} style={styles.avatarContainer}>
            <View style={[styles.avatar, { borderColor: accent + "40", backgroundColor: theme.surface }]}>
               <Ionicons name="business" size={20} color={accent} />
            </View>
          </Pressable>
        </View>
      </SafeAreaView>

      {/* Main Content */}
      <View style={styles.content}>
        {phase === "before" && (
           <SiteManagerBeforeScreen 
             onBack={onSignOut} 
             onOpenResponse={() => setPhase("during")} 
             isDarkMode={isDarkMode}
           />
        )}
        {phase === "during" && (
           <SiteManagerDuringScreen 
             onBack={() => setPhase("before")} 
             isDarkMode={isDarkMode}
           />
        )}
        {phase === "after" && (
           <SiteManagerAfterScreen 
             onBack={() => setPhase("before")} 
             isDarkMode={isDarkMode}
           />
        )}
      </View>

      {/* Bottom Navigation */}
      <View style={styles.bottomNavWrapper}>
        <View style={styles.bottomNavInner}>
          {[
            { id: "Overview", icon: "grid", label: "Dashboard" },
            { id: "Operations", icon: "flash", label: "Operations" },
            { id: "Resources", icon: "cube", label: "Inventory" },
            { id: "Reporting", icon: "stats-chart", label: "Reports" },
          ].map((item) => {
            const isActive = activeNav === item.id;
            return (
              <Pressable
                key={item.id}
                onPress={() => {
                  setActiveNav(item.id as NavDestination);
                  if (item.id === "Operations") setPhase("during");
                  else if (item.id === "Reporting") setPhase("after");
                  else setPhase("before");
                }}
                style={styles.navTab}
              >
                <View style={[styles.tabIconWrap, isActive && { backgroundColor: accent + "15" }]}>
                  <Ionicons 
                    name={(isActive ? item.icon : item.icon + "-outline") as any} 
                    size={24} 
                    color={isActive ? accent : theme.textLight} 
                  />
                </View>
                <Text style={[styles.tabLabel, isActive && { color: accent }]}>{item.label}</Text>
              </Pressable>
            );
          })}
        </View>
      </View>

      {/* Profile Modal */}
      <Modal visible={isProfileOpen} transparent animationType="fade">
        <Pressable style={styles.modalOverlay} onPress={() => setIsProfileOpen(false)}>
          <View style={styles.profileDropdown}>
            <View style={styles.profileHeader}>
              <Text style={[styles.profileName, { color: theme.text }]}>Director Marcus</Text>
              <Text style={styles.profileSub}>Regional Operations Lead</Text>
            </View>
            <View style={styles.profileActions}>
              <Pressable style={styles.profileActionItem} onPress={() => setIsDarkMode(!isDarkMode)}>
                <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: isDarkMode ? '#2196F3' + '15' : '#FFB300' + '15', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={isDarkMode ? "sunny-outline" : "moon-outline"} size={20} color={isDarkMode ? '#2196F3' : '#FFB300'} />
                </View>
                <Text style={styles.profileActionText}>{isDarkMode ? "Light Mode" : "Dark Mode"}</Text>
              </Pressable>

              <Pressable style={styles.profileActionItem} onPress={() => setIsProfileOpen(false)}>
                <Ionicons name="settings-outline" size={20} color={accent} />
                <Text style={styles.profileActionText}>System Settings</Text>
              </Pressable>
              <View style={styles.divider} />
              <Pressable style={styles.profileActionItem} onPress={() => { setIsProfileOpen(false); onSignOut(); }}>
                <Ionicons name="log-out-outline" size={20} color={theme.danger} />
                <Text style={[styles.profileActionText, { color: theme.danger }]}>Sign Out</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  headerSafe: {
    backgroundColor: theme.surface + "CC",
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  headerInner: {
    height: 72,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 24,
  },
  headerCenter: {
    flex: 1,
    alignItems: "center",
    paddingLeft: 40,
  },
  brandText: {
    ...fonts.black,
    fontSize: 22,
    letterSpacing: -1.2,
  },
  phaseIndicator: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginTop: 2,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.03)",
  },
  phaseText: {
    ...fonts.black,
    fontSize: 9,
    textTransform: "uppercase",
    letterSpacing: 2,
  },
  orb: {
    position: "absolute",
    borderRadius: 999,
    opacity: 0.08,
  },
  orb1: {
    width: 350,
    height: 350,
    top: -100,
    right: -100,
  },
  orb2: {
    width: 250,
    height: 250,
    bottom: 100,
    left: -100,
    backgroundColor: "#FFB300",
  },
  avatarContainer: {
    paddingLeft: 12,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 16,
    borderWidth: 1.5,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flex: 1,
  },
  bottomNavWrapper: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    paddingTop: 10,
  },
  bottomNavInner: {
    flexDirection: "row",
    backgroundColor: theme.surface + "F2",
    borderRadius: 32,
    height: 80,
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 12,
    borderWidth: 1,
    borderColor: "rgba(255, 255, 255, 0.2)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.08,
    shadowRadius: 20,
    elevation: 10,
  },
  navTab: {
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
    flex: 1,
  },
  tabIconWrap: {
    width: 48,
    height: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  tabLabel: {
    fontSize: 10,
    ...fonts.bold,
    color: theme.textLight,
    letterSpacing: 0.5,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.15)",
    justifyContent: "flex-start",
    alignItems: "flex-end",
    paddingTop: 80,
    paddingRight: 24,
  },
  profileDropdown: {
    width: 260,
    backgroundColor: theme.surface,
    borderRadius: 32,
    paddingVertical: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 15 },
    shadowOpacity: 0.12,
    shadowRadius: 30,
    elevation: 12,
    borderWidth: 1,
    borderColor: theme.line,
  },
  profileHeader: {
    paddingHorizontal: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  profileName: {
    ...fonts.black,
    fontSize: 18,
    letterSpacing: -0.5,
  },
  profileSub: {
    ...fonts.bold,
    fontSize: 11,
    color: theme.textLight,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginTop: 4,
  },
  profileActions: {
    padding: 12,
  },
  profileActionItem: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    padding: 14,
    borderRadius: 16,
  },
  profileActionText: {
    ...fonts.bold,
    fontSize: 15,
    color: theme.textMuted,
  },
  divider: {
    height: 1,
    backgroundColor: theme.line,
    marginVertical: 12,
    marginHorizontal: 16,
  },
});
