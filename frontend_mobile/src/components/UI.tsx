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
import { theme, fonts } from "../theme";

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
      style={({ pressed }) => [
        styles.button,
        tone === "primary" && styles.buttonPrimary,
        tone === "secondary" && styles.buttonSecondary,
        tone === "ghost" && styles.buttonGhost,
        tone === "danger" && styles.buttonDanger,
        pressed && styles.buttonPressed,
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
        placeholderTextColor={theme.textLight}
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
        tone === "success" && { backgroundColor: theme.successLight },
        tone === "warning" && { backgroundColor: theme.warningLight },
        tone === "danger" && { backgroundColor: theme.dangerLight },
        tone === "info" && { backgroundColor: theme.infoLight },
      ]}
    >
      <Text
        style={[
          styles.pillText,
          tone === "success" && { color: theme.success },
          tone === "warning" && { color: theme.warning },
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
    padding: 20,
    borderWidth: 1,
    borderColor: theme.line,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  button: {
    minHeight: 52,
    borderRadius: 14,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
    ...fonts.bold,
  },
  buttonPrimary: {
    backgroundColor: theme.primary,
  },
  buttonSecondary: {
    backgroundColor: theme.secondary,
  },
  buttonGhost: {
    backgroundColor: theme.surfaceSoft,
    borderWidth: 1.5,
    borderColor: theme.line,
  },
  buttonDanger: {
    backgroundColor: theme.danger,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    ...fonts.bold,
  },
  buttonTextGhost: {
    color: theme.text,
  },
  buttonTextSecondary: {
    color: theme.text,
  },
  inputWrap: {
    gap: 10,
  },
  inputLabel: {
    fontSize: 12,
    ...fonts.semibold,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    color: theme.textMuted,
  },
  input: {
    minHeight: 52,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: theme.line,
    backgroundColor: theme.surfaceSoft,
    paddingHorizontal: 16,
    paddingVertical: 14,
    color: theme.text,
    fontSize: 16,
    ...fonts.regular,
  },
  pill: {
    alignSelf: "flex-start",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: theme.surfaceSoft,
  },
  pillText: {
    color: theme.text,
    fontSize: 12,
    ...fonts.semibold,
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
});
