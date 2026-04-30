import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { fonts, lightTheme, darkTheme } from "../../theme";

interface InventoryItem {
  id: string;
  name: string;
  units: string;
  status: "SECURE" | "CRITICALLY LOW" | "REALLOCATING";
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
}

const MOCK_INVENTORY: InventoryItem[] = [
  { id: "1", name: "Family Relief Pack A", units: "450 UNITS", status: "SECURE", icon: "cube", color: "#81C784" },
  { id: "2", name: "Medical Kit - Level 2", units: "12 UNITS", status: "CRITICALLY LOW", icon: "medical", color: "#EF9A9A" },
  { id: "3", name: "Sanitary Bundles", units: "1,200 UNITS", status: "SECURE", icon: "water", color: "#81C784" },
  { id: "4", name: "Portable Generators", units: "05 UNITS", status: "REALLOCATING", icon: "flash", color: "#FFE082" },
];

export function SiteManagerInventoryScreen({ isDarkMode }: { isDarkMode?: boolean }) {
  const theme = isDarkMode ? darkTheme : lightTheme;
  const styles = getStyles(theme);

  return (
    <ScrollView 
      style={styles.container} 
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.header}>
        <Text style={styles.title}>Logistics & Inventory</Text>
        <Text style={styles.subtitle}>Manage incoming and outgoing relief assets.</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.metricsContainer} contentContainerStyle={styles.metricsContent}>
        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>TOTAL ASSETS</Text>
            <Text style={[styles.metricTrend, { color: "#81C784" }]}>+12%</Text>
          </View>
          <Text style={styles.metricValue}>24.8k</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: "70%", backgroundColor: "#2196F3" }]} />
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>CRITICAL LOWS</Text>
            <Text style={[styles.metricTrend, { color: "#EF9A9A" }]}>-2</Text>
          </View>
          <Text style={styles.metricValue}>03</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: "40%", backgroundColor: "#D32F2F" }]} />
          </View>
        </View>

        <View style={styles.metricCard}>
          <View style={styles.metricHeader}>
            <Text style={styles.metricLabel}>IN TRANSIT</Text>
            <Text style={styles.metricTrend}>0</Text>
          </View>
          <Text style={styles.metricValue}>1.2k</Text>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: "85%", backgroundColor: "#FFB300" }]} />
          </View>
        </View>
      </ScrollView>

      <View style={styles.ledgerSection}>
        <View style={styles.ledgerHeader}>
          <Text style={styles.ledgerTitle}>Stock Ledger</Text>
          <View style={styles.ledgerActions}>
            <TouchableOpacity style={styles.actionBtnGhost}>
              <Text style={styles.actionBtnTextGhost}>Export CSV</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtnSolid}>
              <Ionicons name="add" size={16} color="#fff" style={{ marginRight: 4 }} />
              <Text style={styles.actionBtnTextSolid}>New Batch</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.ledgerList}>
          {MOCK_INVENTORY.map((item) => (
            <View key={item.id} style={styles.inventoryCard}>
              <View style={[styles.iconBox, { backgroundColor: item.color + "15" }]}>
                <Ionicons name={item.icon} size={20} color={item.color} />
              </View>
              <View style={styles.itemInfo}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemUnits}>{item.units}</Text>
              </View>
              <View style={[
                styles.statusBadge, 
                { backgroundColor: item.status === 'SECURE' ? '#E8F5E9' : item.status === 'CRITICALLY LOW' ? '#FFEBEE' : '#FFF8E1' }
              ]}>
                <Text style={[
                  styles.statusText, 
                  { color: item.status === 'SECURE' ? '#2E7D32' : item.status === 'CRITICALLY LOW' ? '#D32F2F' : '#FFB300' }
                ]}>{item.status}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  scrollContent: { padding: 24, paddingBottom: 120 },
  header: { marginBottom: 32 },
  title: { fontSize: 32, ...fonts.black, color: theme.text, letterSpacing: -1 },
  subtitle: { fontSize: 14, ...fonts.medium, color: theme.textMuted, marginTop: 4 },

  metricsContainer: { marginBottom: 32, marginHorizontal: -24 },
  metricsContent: { paddingHorizontal: 24, gap: 16 },
  metricCard: { backgroundColor: theme.surface, borderRadius: 24, padding: 20, borderWidth: 1, borderColor: theme.line, width: 220 },
  metricHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 8 },
  metricLabel: { fontSize: 10, ...fonts.black, color: theme.textLight, letterSpacing: 1 },
  metricTrend: { fontSize: 10, ...fonts.black },
  metricValue: { fontSize: 32, ...fonts.black, color: theme.text, marginBottom: 12 },
  progressTrack: { height: 6, backgroundColor: theme.line, borderRadius: 3, overflow: "hidden" },
  progressFill: { height: "100%", borderRadius: 3 },

  ledgerSection: { backgroundColor: theme.surface, borderRadius: 32, padding: 24, borderWidth: 1, borderColor: theme.line },
  ledgerHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 24, flexWrap: "wrap", gap: 16 },
  ledgerTitle: { fontSize: 22, ...fonts.black, color: theme.text },
  ledgerActions: { flexDirection: "row", gap: 12 },
  actionBtnGhost: { paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: theme.line },
  actionBtnTextGhost: { fontSize: 12, ...fonts.black, color: theme.textLight },
  actionBtnSolid: { backgroundColor: "#81C784", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, flexDirection: "row", alignItems: "center" },
  actionBtnTextSolid: { fontSize: 12, ...fonts.black, color: "#fff" },

  ledgerList: { gap: 12 },
  inventoryCard: { backgroundColor: theme.surfaceAlt, borderRadius: 20, padding: 16, flexDirection: "row", alignItems: "center", gap: 12, borderWidth: 1, borderColor: theme.line },
  iconBox: { width: 44, height: 44, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 15, ...fonts.black, color: theme.text },
  itemUnits: { fontSize: 11, ...fonts.medium, color: theme.textMuted, marginTop: 2 },
  statusBadge: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  statusText: { fontSize: 9, ...fonts.black },
});
