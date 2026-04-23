import React from "react";
import { Pressable, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../components/UI";
import { roleColors, theme } from "../theme";
import { AppRoute, PortalRole } from "../types";
import { styles } from "./RoleSelectorScreen.styles";

const roles: { 
  id: PortalRole; 
  label: string; 
  sub: string; 
  desc: string; 
  color: string;
  bg: string;
}[] = [
  { 
    id: "citizen", 
    label: "Affected Citizen", 
    sub: "Public Portal",
    desc: "Register, receive alerts, access your QR ID, and track relief aid.",
    color: "#2E7D32",
    bg: "rgba(46,125,50,0.08)",
  },
  { 
    id: "site_manager", 
    label: "Site Manager", 
    sub: "Operations Portal",
    desc: "Manage shelter capacity, supplies, and evacuee intake at your site.",
    color: "#FFB300",
    bg: "rgba(255,179,0,0.08)",
  },
  { 
    id: "dispatcher", 
    label: "Dispatcher", 
    sub: "Command Portal",
    desc: "Coordinate rescue teams, manage incident tickets, and dispatch resources.",
    color: "#81C784",
    bg: "rgba(129,199,132,0.1)",
  },
  { 
    id: "admin", 
    label: "Administrator", 
    sub: "System Portal",
    desc: "System-wide monitoring, user approvals, and platform reporting.",
    color: "#4E342E",
    bg: "rgba(78,52,46,0.08)",
  },
];

const routeMap: Record<PortalRole, AppRoute> = {
  admin: "admin-login",
  dispatcher: "dispatcher-login",
  site_manager: "site-manager-login",
  citizen: "citizen-login",
};

export function RoleSelectorScreen({ onNavigate }: { onNavigate: (route: AppRoute) => void }) {
  return (
    <Screen style={{ backgroundColor: theme.bg }}>
      <View style={styles.hero}>
        <View style={styles.heroGradient} />
        
        {/* Animated Orbs Simulation */}
        <View style={[styles.orb, styles.orb1]} />
        <View style={[styles.orb, styles.orb2]} />
        
        <View style={{ paddingHorizontal: 24, zIndex: 2 }}>
          <View style={styles.mark}>
            <Text style={styles.markText}>D</Text>
          </View>
          <Text style={styles.brand}>DAMAYAN</Text>
          <Text style={styles.headline}>One Platform.{"\n"}Every Role.{"\n"}<Text style={{color: "#FFB300"}}>Zero Delay.</Text></Text>
          <Text style={styles.copy}>
            Philippines Disaster Response connecting everyone during every phase of a calamity.
          </Text>

          {/* Stats Section */}
          <View style={styles.statsRow}>
            <View style={styles.statItem}>
              <Text style={styles.statValue}>4</Text>
              <Text style={styles.statLabel}>Portals</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Real-time</Text>
              <Text style={styles.statLabel}>Sync</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statValue}>Offline</Text>
              <Text style={styles.statLabel}>Ready</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={{ paddingBottom: 40 }}>
        <View style={{ paddingHorizontal: 24, marginBottom: 16 }}>
          <Text style={styles.selectorHeadText}>SELECT YOUR ROLE TO CONTINUE</Text>
        </View>
        
        {roles.map((role) => (
          <Pressable
            key={role.id}
            onPress={() => onNavigate(routeMap[role.id])}
            style={({ pressed }) => [
              styles.roleCard,
              { backgroundColor: theme.surface, borderColor: theme.line },
              pressed && { transform: [{ scale: 0.98 }], opacity: 0.9 }
            ]}
          >
            <View style={[styles.roleDot, { backgroundColor: role.color }]} />
            <View style={styles.roleCopy}>
              <Text style={[styles.roleSub, { color: role.color }]}>{role.sub}</Text>
              <Text style={styles.roleLabel}>{role.label}</Text>
              <Text style={styles.roleDesc} numberOfLines={2}>{role.desc}</Text>
            </View>
            <Ionicons name="arrow-forward" size={18} color={role.color} />
          </Pressable>
        ))}
      </View>
    </Screen>
  );
}


