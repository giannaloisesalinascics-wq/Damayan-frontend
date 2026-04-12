import React from "react";
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
  ViewStyle,
} from "react-native";
import { theme } from "../theme";

export function Screen({
  children,
  scroll = true,
}: {
  children: React.ReactNode;
  scroll?: boolean;
}) {
  const content = <View style={styles.screenInner}>{children}</View>;

  if (!scroll) {
    return <View style={styles.screen}>{content}</View>;
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.scrollContent}>
      {content}
    </ScrollView>
  );
}

export function SectionCard({
  children,
  style,
}: {
  children: React.ReactNode;
  style?: ViewStyle;
}) {
  return <View style={[styles.card, style]}>{children}</View>;
}

export function Button({
  label,
  onPress,
  tone = "primary",
}: {
  label: string;
  onPress: () => void;
  tone?: "primary" | "secondary" | "ghost" | "danger";
}) {
  return (
    <Pressable
      onPress={onPress}
      style={[
        styles.button,
        tone === "primary" && styles.buttonPrimary,
        tone === "secondary" && styles.buttonSecondary,
        tone === "ghost" && styles.buttonGhost,
        tone === "danger" && styles.buttonDanger,
      ]}
    >
      <Text
        style={[
          styles.buttonText,
          tone === "ghost" && styles.buttonTextGhost,
          tone === "secondary" && styles.buttonTextSecondary,
        ]}
      >
        {label}
      </Text>
    </Pressable>
  );
}

export function Input({
  label,
  placeholder,
  secureTextEntry,
}: {
  label: string;
  placeholder: string;
  secureTextEntry?: boolean;
}) {
  return (
    <View style={styles.inputWrap}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#8a968f"
        secureTextEntry={secureTextEntry}
        style={styles.input}
      />
    </View>
  );
}

export function Pill({
  label,
  tone = "default",
}: {
  label: string;
  tone?: "default" | "success" | "warning" | "danger" | "info";
}) {
  return (
    <View
      style={[
        styles.pill,
        tone === "success" && { backgroundColor: theme.successSoft },
        tone === "warning" && { backgroundColor: theme.warningSoft },
        tone === "danger" && { backgroundColor: theme.dangerSoft },
        tone === "info" && { backgroundColor: "#dfeafb" },
      ]}
    >
      <Text
        style={[
          styles.pillText,
          tone === "success" && { color: theme.primary },
          tone === "warning" && { color: "#8f5d00" },
          tone === "danger" && { color: theme.danger },
          tone === "info" && { color: theme.info },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  scrollContent: {
    paddingBottom: 32,
  },
  screenInner: {
    padding: 20,
    gap: 16,
  },
  card: {
    backgroundColor: theme.surface,
    borderRadius: 24,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.line,
    shadowColor: "#1a1c19",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 3,
  },
  button: {
    minHeight: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  buttonPrimary: {
    backgroundColor: theme.primary,
  },
  buttonSecondary: {
    backgroundColor: theme.secondary,
  },
  buttonGhost: {
    backgroundColor: theme.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.line,
  },
  buttonDanger: {
    backgroundColor: theme.danger,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "800",
    fontSize: 15,
  },
  buttonTextGhost: {
    color: theme.text,
  },
  buttonTextSecondary: {
    color: theme.text,
  },
  inputWrap: {
    gap: 8,
  },
  inputLabel: {
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.1,
    textTransform: "uppercase",
    color: theme.textMuted,
  },
  input: {
    minHeight: 50,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: theme.line,
    backgroundColor: "#f8faf7",
    paddingHorizontal: 14,
    color: theme.text,
  },
  pill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: theme.surfaceSoft,
  },
  pillText: {
    color: theme.text,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 0.8,
    textTransform: "uppercase",
  },
});
