import React, { useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme, fonts, lightTheme, darkTheme, AppTheme } from "../../theme";

export function SiteManagerAfterScreen({ 
  onBack,
  onBackToResponse,
  isDarkMode,
  onFinalize
}: { 
  onBack: () => void;
  onBackToResponse: () => void;
  isDarkMode?: boolean;
  onFinalize: () => void;
}) {
  const currentTheme = isDarkMode ? darkTheme : lightTheme;
  const localStyles = getStyles(currentTheme);

  return (
    <ScrollView 
      style={localStyles.container}
      contentContainerStyle={localStyles.scrollContent}
      showsVerticalScrollIndicator={false}
    >
      <View style={localStyles.headerRow}>
        <TouchableOpacity onPress={onBackToResponse} style={localStyles.backBtn}>
           <Ionicons name="arrow-back" size={24} color={currentTheme.text} />
        </TouchableOpacity>
        <View style={{ flex: 1 }}>
          <View style={localStyles.statusBadge}>
            <View style={localStyles.statusDot} />
            <Text style={localStyles.statusBadgeText}>RECOVERY & LOGISTICS MODE</Text>
          </View>
          <Text style={localStyles.dashboardTitle}>Central Relief Hub{"\n"}& Demobilization</Text>
          <Text style={localStyles.dashboardSub}>
            Managing site closure, citizen check-out, and resource demobilization. Site is currently 94% demobilized.
          </Text>
        </View>
        <View style={localStyles.scoreCard}>
          <Text style={localStyles.scoreValue}>94%</Text>
          <Text style={localStyles.scoreLabel}>DEMOB STATUS</Text>
        </View>
      </View>

      <View style={localStyles.mainSection}>
        {/* Citizen Check-out Station */}
        <View style={localStyles.checklistSection}>
          <View style={localStyles.sectionHeaderRow}>
            <View>
              <Text style={localStyles.sectionTitle}>Citizen Check-out Station</Text>
              <Text style={localStyles.sectionSub}>Active intake point for departures. Finalize aid dispensing and registry update.</Text>
            </View>
            <View style={localStyles.priorityBadge}>
               <Ionicons name="shield-checkmark" size={14} color={currentTheme.primary} />
               <Text style={localStyles.priorityText}>Priority Status</Text>
            </View>
          </View>

          <View style={localStyles.checklistGrid}>
            <View style={localStyles.readinessCheckCard}>
               <View style={localStyles.checkIconWrap}>
                  <Ionicons name="gift-outline" size={32} color={currentTheme.primary} />
               </View>
               <Text style={localStyles.checkTitle}>Final Aid Dispensing</Text>
               <Text style={localStyles.checkDesc}>Verify citizen relief ID for recovery kit distribution.</Text>
               <TouchableOpacity style={localStyles.logStatusBtn}>
                  <Text style={localStyles.logStatusText}>Verify & Log Aid</Text>
               </TouchableOpacity>
            </View>

            <View style={localStyles.essentialTasksCard}>
               <View style={localStyles.tasksHeader}>
                  <Ionicons name="walk" size={20} color={currentTheme.primary} />
                  <Text style={localStyles.tasksTitle}>Departure Tracker</Text>
               </View>
               
               <View style={{ marginBottom: 20 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                     <Text style={localStyles.taskLabel}>Check-out Progress</Text>
                     <Text style={[localStyles.taskLabel, { ...fonts.black }]}>182 / 206</Text>
                  </View>
                  <View style={{ height: 8, backgroundColor: theme.line, borderRadius: 4, overflow: 'hidden' }}>
                     <View style={{ height: '100%', width: '88%', backgroundColor: '#81C784' }} />
                  </View>
               </View>

               <View style={localStyles.taskRow}>
                  <Text style={localStyles.taskLabel}>Registry Sync</Text>
                  <View style={[localStyles.taskPill, { backgroundColor: '#E8F5E9' }]}><Text style={[localStyles.taskPillText, { color: '#2E7D32' }]}>COMPLETE</Text></View>
               </View>
               <View style={localStyles.taskRow}>
                  <Text style={localStyles.taskLabel}>Logistics Update</Text>
                  <View style={[localStyles.taskPill, { backgroundColor: '#E3F2FD' }]}><Text style={[localStyles.taskPillText, { color: '#1976D2' }]}>ACTIVE</Text></View>
               </View>

               <View style={localStyles.divider} />
               <Text style={localStyles.protocolLabel}>PROTOCOL NOTE</Text>
               <Text style={localStyles.protocolText}>"Ensure all family groups are checked out together to maintain registry integrity."</Text>
            </View>
          </View>
        </View>

        {/* Side Content */}
        <View style={localStyles.sideContent}>
           <View style={localStyles.liveActivityCard}>
              <View style={localStyles.liveHeader}>
                 <Ionicons name="stats-chart" size={18} color="#81C784" />
                 <Text style={localStyles.liveTitle}>Live Activity</Text>
              </View>
              <View style={localStyles.activityItem}>
                 <View style={localStyles.activityDot} />
                 <View style={{ flex: 1 }}>
                    <Text style={localStyles.activityTime}>08:45 AM</Text>
                    <Text style={localStyles.activityDesc}>Convoy Gamma arrived at Northern Staging.</Text>
                 </View>
              </View>
              <View style={localStyles.activityItem}>
                 <View style={localStyles.activityDot} />
                 <View style={{ flex: 1 }}>
                    <Text style={localStyles.activityTime}>07:12 AM</Text>
                    <Text style={localStyles.activityDesc}>Satellite uplink stabilized at Sector 4.</Text>
                 </View>
              </View>
              <View style={localStyles.activityItem}>
                 <View style={[localStyles.activityDot, { backgroundColor: '#7D867B' }]} />
                 <View style={{ flex: 1 }}>
                    <Text style={localStyles.activityTime}>YESTERDAY</Text>
                    <Text style={localStyles.activityDesc}>Evacuation initiated for Cluster B.</Text>
                 </View>
              </View>
           </View>

           <View style={localStyles.siteMapCard}>
              <View style={localStyles.siteMapContent}>
                 <Text style={localStyles.siteMapTitle}>Interactive Site Map</Text>
                 <Text style={localStyles.siteMapSub}>REAL-TIME ZONE ACTIVITY MONITOR</Text>
              </View>
              <Image 
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuB3K_4K9H0L_9E_9N_K7L9B8v8V-p_H_p7h-v8r-B7v-v8r-B7v-v8r-B7v-v8r-B7v-v8r-B7v-v8r-B7v-v8r-B7v-v8r-B7v-v8r-B7v-v8r-B7v-v8r-B7v-v8r-B7v-v8r-B7v-v8r-B7v" }} 
                style={localStyles.siteMapImage} 
                resizeMode="cover"
              />
           </View>

           <View style={[localStyles.liveActivityCard, { backgroundColor: '#111' }]}>
              <View style={localStyles.liveHeader}>
                 <Ionicons name="exit-outline" size={18} color="#fff" />
                 <Text style={localStyles.liveTitle}>Closing Operations</Text>
              </View>
              <Text style={{ fontSize: 11, ...fonts.medium, color: 'rgba(255,255,255,0.5)', marginBottom: 20 }}>Finalize day-of operations and prepare site handover documentation.</Text>
              
              <TouchableOpacity style={localStyles.closingBtn}>
                 <View style={localStyles.closingIcon}>
                    <Ionicons name="lock-closed" size={18} color="#fff" />
                 </View>
                 <View>
                    <Text style={localStyles.closingTitle}>Initiate Check-out</Text>
                    <Text style={localStyles.closingSub}>SITE LOCKDOWN</Text>
                 </View>
              </TouchableOpacity>

              <TouchableOpacity style={[localStyles.closingBtn, { marginTop: 12 }]}>
                 <View style={[localStyles.closingIcon, { backgroundColor: 'rgba(255,179,0,0.1)' }]}>
                    <Ionicons name="stats-chart" size={18} color="#FFB300" />
                 </View>
                 <View>
                    <Text style={localStyles.closingTitle}>Site Summary Report</Text>
                    <Text style={localStyles.closingSub}>GENERATE PDF & SYNC</Text>
                 </View>
              </TouchableOpacity>

              <TouchableOpacity style={[localStyles.closingBtn, { marginTop: 12, backgroundColor: '#FFF3E020', borderColor: '#FFB300' }]} onPress={onBackToResponse}>
                 <View style={[localStyles.closingIcon, { backgroundColor: '#FFF3E040' }]}>
                    <Ionicons name="warning" size={18} color="#FFB300" />
                 </View>
                 <View>
                    <Text style={[localStyles.closingTitle, { color: '#FFB300' }]}>Re-Open Active Response</Text>
                    <Text style={localStyles.closingSub}>RETURN TO INCIDENT MODE</Text>
                 </View>
              </TouchableOpacity>

              <TouchableOpacity style={[localStyles.closingBtn, { marginTop: 12, backgroundColor: currentTheme.primary + '20', borderColor: currentTheme.primary }]} onPress={onFinalize}>
                 <View style={[localStyles.closingIcon, { backgroundColor: currentTheme.primary + '20' }]}>
                    <Ionicons name="flag" size={18} color={currentTheme.primary} />
                 </View>
                 <View>
                    <Text style={[localStyles.closingTitle, { color: currentTheme.primary }]}>Complete Site Mission</Text>
                    <Text style={localStyles.closingSub}>ARCHIVE & DEMOBILIZE</Text>
                 </View>
              </TouchableOpacity>
           </View>
        </View>
      </View>

      <View style={localStyles.inventorySection}>
         <View style={localStyles.sectionHeaderRow}>
            <View style={{ flex: 1 }}>
              <Text style={localStyles.sectionTitle}>Inventory Recovery & Intake</Text>
              <Text style={localStyles.sectionSub}>Managing physical relief goods arriving from regional terminals.</Text>
            </View>
            <TouchableOpacity style={localStyles.receiveBtn}>
               <Ionicons name="cube" size={14} color="#fff" />
               <Text style={localStyles.receiveBtnText}>Receive Goods</Text>
            </TouchableOpacity>
         </View>

         <View style={localStyles.inventoryList}>
            {[
               { icon: "medkit", name: "First Aid Refill-A", stock: "450 Units", progress: 0.15, incoming: "450 Units", eta: "02:30h", status: "IN TRANSIT", color: "#D32F2F" },
               { icon: "restaurant", name: "Self-Heating Meals", stock: "82%", progress: 0.82, incoming: "--", eta: "--", status: "STABLE", color: "#2E7D32" },
               { icon: "sunny", name: "Solar Lanterns", stock: "120 Units", progress: 0.45, incoming: "120 Units", eta: "Tomorrow", status: "SCHEDULED", color: "#FFB300" },
            ].map((item) => (
              <View key={`inventory-${item.name.replace(/\s+/g, '-').toLowerCase()}`} style={localStyles.inventoryCard}>
                 <View style={localStyles.cardHeader}>
                    <View style={localStyles.categoryInfo}>
                       <View style={[localStyles.iconBox, { backgroundColor: item.color + '15' }]}>
                          <Ionicons name={item.icon as any} size={20} color={item.color} />
                       </View>
                       <Text style={localStyles.itemName}>{item.name}</Text>
                    </View>
                    <View style={[localStyles.statusPill, { backgroundColor: item.color + '10' }]}>
                       <Text style={[localStyles.statusPillText, { color: item.color }]}>{item.status}</Text>
                    </View>
                 </View>

                 <View style={localStyles.stockProgressContainer}>
                    <View style={localStyles.progressLabelRow}>
                       <Text style={localStyles.progressLabel}>Current Stock</Text>
                       <Text style={[localStyles.progressVal, { color: item.color }]}>{item.stock}</Text>
                    </View>
                    <View style={localStyles.progressBarTrack}>
                       <View style={[localStyles.progressBarFill, { width: `${item.progress * 100}%`, backgroundColor: item.color }]} />
                    </View>
                 </View>

                 <View style={localStyles.cardFooter}>
                    <View style={localStyles.footerInfo}>
                       <Text style={localStyles.footerLabel}>INCOMING</Text>
                       <Text style={localStyles.footerVal}>{item.incoming}</Text>
                    </View>
                    <View style={localStyles.footerInfo}>
                       <Text style={localStyles.footerLabel}>ETA</Text>
                       <Text style={localStyles.footerVal}>{item.eta}</Text>
                    </View>
                    <TouchableOpacity style={localStyles.actionDots}>
                       <Ionicons name="ellipsis-horizontal" size={20} color={currentTheme.textLight} />
                    </TouchableOpacity>
                 </View>
              </View>
            ))}
         </View>
      </View>
    </ScrollView>
  );
}

const getStyles = (theme: AppTheme) => StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.bg },
  scrollContent: { padding: 24, paddingBottom: 160 },
  headerRow: { flexDirection: "row", alignItems: "flex-start", gap: 16, marginBottom: 32 },
  backBtn: { width: 44, height: 44, borderRadius: 12, backgroundColor: theme.surfaceAlt, alignItems: "center", justifyContent: "center", marginTop: 4 },
  statusBadge: { flexDirection: "row", alignItems: "center", gap: 6, marginBottom: 8 },
  statusDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: theme.primary },
  statusBadgeText: { fontSize: 10, ...fonts.black, color: theme.textLight, letterSpacing: 1 },
  dashboardTitle: { fontSize: 36, ...fonts.black, color: theme.text, letterSpacing: -1.5, lineHeight: 42 },
  dashboardSub: { fontSize: 14, ...fonts.medium, color: theme.textMuted, marginTop: 8, lineHeight: 20 },
  scoreCard: { backgroundColor: "#fff", padding: 16, borderRadius: 24, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: theme.line, width: 110 },
  scoreValue: { fontSize: 28, ...fonts.black, color: theme.primary },
  scoreLabel: { fontSize: 8, ...fonts.black, color: theme.textLight, letterSpacing: 1, textAlign: "center" },

  mainSection: { gap: 24, marginBottom: 40 },
  checklistSection: { backgroundColor: theme.surface, borderRadius: 40, padding: 32, borderWidth: 1, borderColor: theme.line },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 24 },
  sectionTitle: { fontSize: 22, ...fonts.black, color: theme.text },
  sectionSub: { fontSize: 13, ...fonts.medium, color: theme.textMuted, marginTop: 4 },
  priorityBadge: { flexDirection: "row", alignItems: "center", gap: 8, backgroundColor: theme.surfaceAlt, paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12 },
  priorityText: { fontSize: 10, ...fonts.black, color: theme.text, letterSpacing: 0.5 },

  checklistGrid: { flexDirection: "column", gap: 16 },
  readinessCheckCard: { backgroundColor: theme.surfaceAlt, borderRadius: 32, padding: 24, alignItems: "center", gap: 12 },
  checkIconWrap: { width: 64, height: 64, borderRadius: 24, backgroundColor: "rgba(46, 125, 50, 0.05)", alignItems: "center", justifyContent: "center" },
  checkTitle: { fontSize: 18, ...fonts.black, color: theme.text },
  checkDesc: { fontSize: 12, ...fonts.medium, color: theme.textMuted, textAlign: "center", lineHeight: 18 },
  logStatusBtn: { backgroundColor: "#2E7D32", paddingHorizontal: 20, paddingVertical: 14, borderRadius: 16, width: "100%", alignItems: "center", marginTop: 12 },
  logStatusText: { color: "#fff", ...fonts.black, fontSize: 12, letterSpacing: 0.5 },

  essentialTasksCard: { backgroundColor: theme.surfaceAlt, borderRadius: 32, padding: 24, marginTop: 12 },
  tasksHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 20 },
  tasksTitle: { fontSize: 16, ...fonts.black, color: theme.text },
  taskRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12, gap: 12 },
  taskLabel: { fontSize: 13, ...fonts.medium, color: theme.text, flex: 1 },
  taskPill: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 8 },
  taskPillText: { fontSize: 9, ...fonts.black },
  divider: { height: 1, backgroundColor: theme.line, marginVertical: 16 },
  protocolLabel: { fontSize: 10, ...fonts.black, color: theme.textLight, letterSpacing: 1, marginBottom: 8 },
  protocolText: { fontSize: 11, ...fonts.medium, color: theme.textMuted, fontStyle: "italic", lineHeight: 16 },

  sideContent: { gap: 24 },
  liveActivityCard: { backgroundColor: "#1A1C1A", borderRadius: 40, padding: 32 },
  liveHeader: { flexDirection: "row", alignItems: "center", gap: 12, marginBottom: 24 },
  liveTitle: { fontSize: 18, ...fonts.black, color: "#fff" },
  activityItem: { flexDirection: "row", gap: 16, marginBottom: 20 },
  activityDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#81C784", marginTop: 6 },
  activityTime: { fontSize: 12, ...fonts.black, color: "#fff" },
  activityDesc: { fontSize: 13, color: "rgba(255,255,255,0.7)", ...fonts.medium, marginTop: 2 },

  siteMapCard: { borderRadius: 40, overflow: "hidden", height: 200, backgroundColor: theme.surfaceAlt },
  siteMapContent: { position: "absolute", zIndex: 1, top: 24, left: 24, backgroundColor: "rgba(255,255,255,0.9)", padding: 16, borderRadius: 16 },
  siteMapTitle: { fontSize: 15, ...fonts.black, color: theme.text },
  siteMapSub: { fontSize: 9, ...fonts.black, color: theme.textLight, letterSpacing: 1, marginTop: 4 },
  siteMapImage: { width: "100%", height: "100%", opacity: 0.8 },

  closingBtn: { flexDirection: 'row', alignItems: 'center', gap: 16, backgroundColor: 'rgba(255,255,255,0.05)', padding: 16, borderRadius: 20, borderWidth: 1, borderColor: 'rgba(255,255,255,0.1)' },
  closingIcon: { width: 44, height: 44, borderRadius: 12, backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center' },
  closingTitle: { fontSize: 15, ...fonts.black, color: '#fff' },
  closingSub: { fontSize: 9, ...fonts.black, color: 'rgba(255,255,255,0.4)', letterSpacing: 1 },

  inventorySection: { backgroundColor: theme.surface, borderRadius: 40, padding: 32, borderWidth: 1, borderColor: theme.line },
  receiveBtn: { backgroundColor: "#2E7D32", paddingHorizontal: 16, paddingVertical: 10, borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 8 },
  receiveBtnText: { color: "#fff", ...fonts.black, fontSize: 11 },

  inventoryList: { marginTop: 32, gap: 16 },
  inventoryCard: { backgroundColor: theme.surfaceAlt, borderRadius: 24, padding: 24, borderWidth: 1, borderColor: theme.line },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  categoryInfo: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  iconBox: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  itemName: { fontSize: 16, ...fonts.black, color: theme.text },
  statusPill: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10 },
  statusPillText: { fontSize: 9, ...fonts.black, letterSpacing: 0.5 },
  stockProgressContainer: { marginBottom: 24 },
  progressLabelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  progressLabel: { fontSize: 10, ...fonts.bold, color: theme.textLight, textTransform: 'uppercase', letterSpacing: 1 },
  progressVal: { fontSize: 13, ...fonts.black },
  progressBarTrack: { height: 8, backgroundColor: theme.line, borderRadius: 4, overflow: 'hidden' },
  progressBarFill: { height: '100%', borderRadius: 4 },
  cardFooter: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', borderTopWidth: 1, borderTopColor: theme.line, paddingTop: 20 },
  footerInfo: { flex: 1 },
  footerLabel: { fontSize: 9, ...fonts.black, color: theme.textLight, letterSpacing: 1.2 },
  footerVal: { fontSize: 14, ...fonts.bold, color: theme.text, marginTop: 4 },
  actionDots: { padding: 6 },
});
