import React from "react";
import { Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

export function MobileHeader({
  title,
  subtitle,
  onBack,
}: {
  title: string;
  subtitle?: string;
  onBack?: () => void;
}) {
  return (
    <View style={styles.header}>
      <View style={styles.headerLeft}>
        {onBack ? (
          <Pressable onPress={onBack} style={styles.backButton}>
            <Text style={styles.backText}>{"<"}</Text>
          </Pressable>
        ) : null}
        <View>
          <Text style={styles.title}>{title}</Text>
          {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
        </View>
      </View>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>D</Text>
      </View>
    </View>
  );
}

export function NavPills({
  items,
  active,
  onSelect,
}: {
  items: string[];
  active: string;
  onSelect: (item: string) => void;
}) {
  return (
    <View style={styles.navRow}>
      {items.map((item) => (
        <Pressable
          key={item}
          onPress={() => onSelect(item)}
          style={[styles.navPill, active === item && styles.navPillActive]}
        >
          <Text
            style={[styles.navPillText, active === item && styles.navPillTextActive]}
          >
            {item}
          </Text>
        </Pressable>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 12,
    backgroundColor: theme.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.line,
  },
  backText: {
    fontWeight: "800",
    color: theme.text,
  },
  title: {
    fontSize: 24,
    fontWeight: "900",
    color: theme.text,
  },
  subtitle: {
    marginTop: 2,
    color: theme.textMuted,
    fontSize: 13,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 14,
    backgroundColor: theme.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    color: "#fff",
    fontWeight: "900",
  },
  navRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  navPill: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 999,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
  },
  navPillActive: {
    backgroundColor: theme.successSoft,
    borderColor: "#bad8bf",
  },
  navPillText: {
    color: theme.textMuted,
    fontWeight: "700",
    fontSize: 13,
  },
  navPillTextActive: {
    color: theme.primary,
  },
});
