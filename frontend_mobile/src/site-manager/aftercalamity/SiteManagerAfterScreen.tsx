import React from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen, SectionCard, Pill } from "../../components/UI";
import { theme, fonts, roleColors } from "../../theme";

export function SiteManagerAfterScreen({ onBack }: { onBack: () => void }) {
  const accent = roleColors.site_manager;

  return (
    <Screen>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Recovery Operations</Text>
          <Text style={styles.subtitle}>Strategic Rebuilding & Analysis</Text>
        </View>

        <SectionCard style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: accent }]}>82%</Text>
            <Text style={styles.statLabel}>Rebuilt</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.info }]}>1.2k</Text>
            <Text style={styles.statLabel}>Aided</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.statItem}>
            <Text style={[styles.statValue, { color: theme.success }]}>$45k</Text>
            <Text style={styles.statLabel}>Funded</Text>
          </View>
        </SectionCard>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Final Reports</Text>
          <View style={styles.reportList}>
            {[
              { id: "1", title: "Impact Assessment Q2", size: "4.2 MB", date: "2 days ago" },
              { id: "2", title: "Resource Allocation Log", size: "1.8 MB", date: "5 days ago" },
              { id: "3", title: "Incident Response Summary", size: "2.5 MB", date: "1 week ago" },
            ].map(report => (
              <TouchableOpacity key={report.id} style={styles.reportCard}>
                <View style={styles.reportIcon}>
                  <Ionicons name="document-text" size={24} color={accent} />
                </View>
                <View style={styles.reportInfo}>
                  <Text style={styles.reportTitle}>{report.title}</Text>
                  <Text style={styles.reportMeta}>{report.date} • {report.size}</Text>
                </View>
                <Ionicons name="download-outline" size={20} color={theme.textLight} />
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Rebuilding Progress</Text>
          <SectionCard>
            <View style={styles.progressRow}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Housing Sector 7</Text>
                <Text style={styles.progressPercent}>75%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "75%", backgroundColor: accent }]} />
              </View>
            </View>
            <View style={styles.progressRow}>
              <View style={styles.progressHeader}>
                <Text style={styles.progressLabel}>Critical Infrastructure</Text>
                <Text style={styles.progressPercent}>90%</Text>
              </View>
              <View style={styles.progressBar}>
                <View style={[styles.progressFill, { width: "90%", backgroundColor: theme.info }]} />
              </View>
            </View>
          </SectionCard>
        </View>
        
        <View style={{ height: 100 }} />
      </ScrollView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    padding: 24,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 32,
    ...fonts.black,
    color: theme.text,
    letterSpacing: -1.5,
  },
  subtitle: {
    fontSize: 16,
    ...fonts.medium,
    color: theme.textMuted,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingVertical: 24,
    marginBottom: 32,
  },
  statItem: {
    alignItems: "center",
  },
  statValue: {
    fontSize: 24,
    ...fonts.black,
    letterSpacing: -1,
  },
  statLabel: {
    fontSize: 12,
    ...fonts.bold,
    color: theme.textLight,
    textTransform: "uppercase",
    letterSpacing: 1,
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 40,
    backgroundColor: theme.line,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 22,
    ...fonts.black,
    color: theme.text,
    marginBottom: 20,
    letterSpacing: -0.5,
  },
  reportList: {
    gap: 16,
  },
  reportCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.surface,
    padding: 16,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: theme.line,
  },
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: theme.surfaceAlt,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 16,
  },
  reportInfo: {
    flex: 1,
  },
  reportTitle: {
    fontSize: 16,
    ...fonts.bold,
    color: theme.text,
  },
  reportMeta: {
    fontSize: 13,
    ...fonts.medium,
    color: theme.textLight,
    marginTop: 2,
  },
  progressRow: {
    marginBottom: 20,
  },
  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  progressLabel: {
    fontSize: 14,
    ...fonts.bold,
    color: theme.text,
  },
  progressPercent: {
    fontSize: 14,
    ...fonts.black,
    color: theme.text,
  },
  progressBar: {
    height: 8,
    backgroundColor: theme.surfaceAlt,
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
  },
});
