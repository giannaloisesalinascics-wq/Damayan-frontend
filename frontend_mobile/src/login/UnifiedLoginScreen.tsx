import React, { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { ApiError, getProfile, login } from "../api";
import { saveSession } from "../session";
import { AppRole } from "../types";
import { fonts, theme } from "../theme";

export type MobileLoginRole = "citizen" | "site-manager";

export function UnifiedLoginScreen({
  onCreateAccount,
  onLoginSuccess,
}: {
  onCreateAccount: () => void;
  onLoginSuccess: (role: MobileLoginRole) => void;
}) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleLogin() {
    if (!email.trim() || !password.trim()) {
      Alert.alert("Missing credentials", "Please enter both email and password.");
      return;
    }

    try {
      setLoading(true);
      const result = await login({
        email: email.trim(),
        password: password.trim(),
      });

      const accessToken = result.access_token?.trim();
      if (!accessToken) {
        Alert.alert("Login failed", "No access token was returned.");
        return;
      }

      const profile = await getProfile(accessToken);
      const role = profile.user.role ?? result.user.role;
      const destination =
        role === AppRole.CITIZEN
          ? "citizen"
          : role === AppRole.LINE_MANAGER
            ? "site-manager"
            : null;

      if (!destination) {
        Alert.alert(
          "Unsupported mobile role",
          "Only Affected Citizen and Site Manager accounts can use this mobile app.",
        );
        return;
      }

      await saveSession({
        accessToken,
        expiresIn: result.expiresIn,
        user: profile.user,
      });

      onLoginSuccess(destination);
    } catch (caughtError) {
      const message =
        caughtError instanceof ApiError
          ? caughtError.message
          : "Unable to sign in. Please try again.";
      Alert.alert("Login failed", message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      style={styles.screen}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.heroOrb} />

        <View style={styles.header}>
          <View style={styles.mark}>
            <Text style={styles.markText}>D</Text>
          </View>
          <View style={styles.headerCopy}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.8}
              style={styles.brand}
            >
              DAMAYAN
            </Text>
            <Text style={styles.subtitle}>Mobile Relief Access</Text>
          </View>
        </View>

        <View style={styles.hero}>
          <Text style={styles.eyebrow}>SECURE LOGIN</Text>
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.copy}>
            Sign in once. Damayan will open the correct mobile workspace for your account role.
          </Text>
        </View>

        <ImageBackground
          source={{
            uri: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?auto=format&fit=crop&w=1000&q=80",
          }}
          imageStyle={styles.imageRadius}
          style={styles.imagePanel}
        >
          <View style={styles.imageShade} />
          <Text style={styles.imageText}>DAMAYAN FIELD ACCESS</Text>
        </ImageBackground>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Sign in</Text>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email or Username</Text>
            <View style={styles.fieldWrap}>
              <Ionicons name="mail-outline" size={20} color={theme.textLight} />
              <TextInput
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your account"
                placeholderTextColor="#9aa39a"
                autoCapitalize="none"
                keyboardType="email-address"
                style={styles.fieldInput}
              />
            </View>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Password</Text>
            <View style={styles.fieldWrap}>
              <Ionicons name="lock-closed-outline" size={20} color={theme.textLight} />
              <TextInput
                value={password}
                onChangeText={setPassword}
                placeholder="Enter password"
                placeholderTextColor="#9aa39a"
                secureTextEntry={!passwordVisible}
                style={styles.fieldInput}
              />
              <Pressable onPress={() => setPasswordVisible((visible) => !visible)}>
                <Ionicons
                  name={passwordVisible ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color={theme.textLight}
                />
              </Pressable>
            </View>
          </View>

          <Pressable
            onPress={handleLogin}
            disabled={loading}
            style={[styles.primaryButton, { opacity: loading ? 0.65 : 1 }]}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <>
                <Text
                  numberOfLines={2}
                  adjustsFontSizeToFit
                  minimumFontScale={0.75}
                  style={styles.primaryButtonText}
                >
                  LOGIN
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </>
            )}
          </Pressable>

          <Pressable
            onPress={onCreateAccount}
            style={styles.secondaryButton}
          >
            <Text
              numberOfLines={2}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
              style={styles.secondaryButtonText}
            >
              CREATE AFFECTED CITIZEN ACCOUNT
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: theme.bg,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: 64,
    paddingBottom: 80,
  },
  heroOrb: {
    position: "absolute",
    width: 300,
    height: 300,
    borderRadius: 150,
    backgroundColor: theme.primary,
    opacity: 0.08,
    right: -120,
    top: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    marginBottom: 36,
  },
  mark: {
    width: 54,
    height: 54,
    borderRadius: 18,
    backgroundColor: theme.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  markText: {
    color: "#fff",
    fontSize: 24,
    ...fonts.black,
  },
  headerCopy: {
    flex: 1,
    minWidth: 0,
  },
  brand: {
    color: theme.text,
    fontSize: 24,
    ...fonts.black,
  },
  subtitle: {
    color: theme.textMuted,
    fontSize: 13,
    ...fonts.bold,
    marginTop: 2,
  },
  hero: {
    marginBottom: 24,
  },
  eyebrow: {
    color: theme.primary,
    fontSize: 11,
    ...fonts.black,
    letterSpacing: 1,
    marginBottom: 12,
  },
  title: {
    color: theme.text,
    fontSize: 42,
    lineHeight: 46,
    ...fonts.black,
  },
  copy: {
    color: theme.textMuted,
    fontSize: 16,
    lineHeight: 24,
    ...fonts.medium,
    marginTop: 12,
  },
  imagePanel: {
    height: 150,
    borderRadius: 28,
    overflow: "hidden",
    justifyContent: "flex-end",
    marginBottom: -34,
  },
  imageRadius: {
    borderRadius: 28,
  },
  imageShade: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.22)",
  },
  imageText: {
    color: "#fff",
    fontSize: 11,
    ...fonts.black,
    letterSpacing: 1,
    padding: 18,
  },
  card: {
    backgroundColor: theme.surface,
    borderRadius: 32,
    padding: 22,
    paddingTop: 34,
    borderWidth: 1,
    borderColor: theme.line,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 10,
  },
  cardTitle: {
    color: theme.text,
    fontSize: 18,
    ...fonts.black,
    marginBottom: 14,
  },
  fieldGroup: {
    gap: 8,
    marginBottom: 16,
  },
  fieldLabel: {
    color: theme.text,
    fontSize: 11,
    ...fonts.bold,
    textTransform: "uppercase",
    letterSpacing: 0.8,
    paddingHorizontal: 4,
  },
  fieldWrap: {
    minHeight: 60,
    borderRadius: 20,
    backgroundColor: theme.surfaceAlt,
    borderWidth: 1.5,
    borderColor: theme.line,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
  },
  fieldInput: {
    flex: 1,
    minWidth: 0,
    color: theme.text,
    fontSize: 16,
    ...fonts.semibold,
  },
  primaryButton: {
    minHeight: 60,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 10,
    paddingHorizontal: 18,
    paddingVertical: 12,
    marginTop: 8,
    backgroundColor: theme.primary,
  },
  primaryButtonText: {
    color: "#fff",
    fontSize: 15,
    ...fonts.black,
    letterSpacing: 0.8,
    textAlign: "center",
  },
  secondaryButton: {
    minHeight: 56,
    borderRadius: 20,
    borderWidth: 1.5,
    borderColor: theme.primary + "55",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginTop: 12,
  },
  secondaryButtonText: {
    color: theme.primary,
    fontSize: 12,
    ...fonts.black,
    letterSpacing: 0.5,
    textAlign: "center",
    lineHeight: 16,
  },
});
