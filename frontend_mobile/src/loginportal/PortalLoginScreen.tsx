import React, { useState } from "react";
import {
  Image,
  ImageBackground,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { MobileHeader } from "../components/MobileShell";
import { Button, Input, Pill, Screen, SectionCard } from "../components/UI";
import { roleColors, theme, fonts } from "../theme";
import { PortalRole } from "../types";

const roleContent: Record<
  PortalRole,
  { title: string; subtitle: string; loginLabel: string; accent: string; action: string }
> = {
  admin: {
    title: "Admin Access",
    subtitle: "Oversee approvals, system health, and platform coordination.",
    loginLabel: "Admin",
    accent: roleColors.admin,
    action: "Log In To Admin Dashboard",
  },
  dispatcher: {
    title: "Dispatcher Access",
    subtitle: "Manage tickets, teams, and active field response operations.",
    loginLabel: "Dispatcher",
    accent: roleColors.dispatcher,
    action: "Continue To Dispatcher Dashboard",
  },
  site_manager: {
    title: "Site Manager Access",
    subtitle: "Manage shelter readiness, intake, and local distribution.",
    loginLabel: "Site Manager",
    accent: roleColors.site_manager,
    action: "Log In To Site Manager Dashboard",
  },
  citizen: {
    title: "Citizen Access",
    subtitle: "Sign in for alerts, preparedness info, and relief access.",
    loginLabel: "Citizen",
    accent: roleColors.citizen,
    action: "Continue To Citizen Dashboard",
  },
};

export function PortalLoginScreen({
  role,
  onBack,
  onSubmit,
  onSecondary,
  secondaryLabel,
}: {
  role: PortalRole;
  onBack: () => void;
  onSubmit: () => void;
  onSecondary?: () => void;
  secondaryLabel?: string;
}) {
  const content = roleContent[role];
  const [citizenId, setCitizenId] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  if (role === "citizen") {
    return (
      <Screen>
        <View style={styles.citizenShell}>
          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <Pressable onPress={onBack} style={styles.menuButton}>
                <Text style={styles.menuButtonText}>≡</Text>
              </Pressable>
              <Text style={styles.brandText}>DAMAYAN</Text>
            </View>

            <View style={styles.roleBadgeRow}>
              <Text style={styles.roleTag}>Affected Citizen</Text>
              <Image
                source={{
                  uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDsxxZ7tWtiorEdOPyE36FXiP8jypRF29-cQQeoNHjDFpKcSmU_HJU8kIr38p5OREBlTSX7Fjf8BBMNqbdr2qr6NRCyKVpJF26FEMhQdT1HkI-aAvHpbbr7U3i6ItcIcXPfqzT7FzCtGmcaTjNwE8_g2NomplnTsnKkoCdJXxRfRydYP6-yJYJ4fJnNncurScunRm1v3h2McrYwGcjwwyPiQIIvW8XdpdEA9rxrgfeJ_RNHhNpNTg3531RpQYXCvfnOprQiFGnuqaG8",
                }}
                style={styles.avatarImage}
              />
            </View>
          </View>

          <View style={styles.editorialPanel}>
            <Text style={styles.gatewayLabel}>Secure Access Gateway</Text>
            <Text style={styles.editorialTitle}>
              The Resilient{"\n"}
              <Text style={styles.editorialAccent}>Sanctuary</Text>
            </Text>
            <Text style={styles.editorialText}>
              Access humanitarian relief protocols, emergency status updates, and
              personal identification records within our secure environment.
            </Text>

            <ImageBackground
              source={{
                uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDUeDgaq6XCJNBqX0uYoHRejovD-YsgRj9XE5F62qvcrVmANmWRhPjGJdgTgag5gYg96TXaegniq89lq04L0wXvg92nzJmruiEnOyI5oGwyTJzc1503PTnFrS3awvyIO9d95iNTsSSrhrgEqGFrBrR-FuVdXiiqR3Nam6VzDypJIhvd4WOqXhGk_AJtsZpPol5lAkW0P5xFhTUrrykrvIrbQq5cSzalGjM0TO7Y_or_zzhXBQ-9zEQWV2QatioCFDhS4cotqpRETjxM",
              }}
              imageStyle={styles.editorialImage}
              style={styles.imageCard}
            >
              <View style={styles.imageOverlay} />
              <View style={styles.imageFooter}>
                <Text style={styles.verifiedIcon}>✓</Text>
                <Text style={styles.imageFooterText}>Identity Protected System</Text>
              </View>
            </ImageBackground>
          </View>

          <View style={styles.loginCard}>
            <View style={styles.glowOrb} />
            <View style={styles.loginCardInner}>
              <View style={styles.loginIntro}>
                <Text style={styles.loginTitle}>Welcome Back</Text>
                <Text style={styles.loginSubtitle}>
                  Please authenticate to access your relief dashboard.
                </Text>
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Username or Digital ID</Text>
                <View style={styles.fieldWrap}>
                  <Text style={styles.fieldIcon}>▣</Text>
                  <TextInput
                    value={citizenId}
                    onChangeText={setCitizenId}
                    placeholder="DAM-XXXX-XXXX"
                    placeholderTextColor="#8f978f"
                    style={styles.fieldInput}
                    autoCapitalize="characters"
                  />
                </View>
              </View>

              <View style={styles.fieldGroup}>
                <View style={styles.labelRow}>
                  <Text style={styles.fieldLabel}>Access Key</Text>
                  <Pressable>
                    <Text style={styles.helpLink}>Forgot Password?</Text>
                  </Pressable>
                </View>

                <View style={styles.fieldWrap}>
                  <Text style={styles.fieldIcon}>◌</Text>
                  <TextInput
                    value={password}
                    onChangeText={setPassword}
                    placeholder="••••••••••••"
                    placeholderTextColor="#8f978f"
                    style={styles.fieldInput}
                    secureTextEntry={!passwordVisible}
                  />
                  <Pressable onPress={() => setPasswordVisible((value) => !value)}>
                    <Text style={styles.visibilityToggle}>
                      {passwordVisible ? "Hide" : "Show"}
                    </Text>
                  </Pressable>
                </View>
              </View>

              <View style={styles.actionStack}>
                <Pressable onPress={onSubmit} style={styles.primaryAction}>
                  <View style={styles.primaryGradient}>
                    <Text style={styles.primaryActionText}>Secure Login</Text>
                    <Text style={styles.primaryActionArrow}>→</Text>
                  </View>
                </Pressable>

                {onSecondary && secondaryLabel ? (
                  <>
                    <View style={styles.dividerRow}>
                      <View style={styles.dividerLine} />
                      <Text style={styles.dividerText}>OR</Text>
                      <View style={styles.dividerLine} />
                    </View>

                    <Pressable onPress={onSecondary} style={styles.secondaryAction}>
                      <Text style={styles.secondaryActionText}>{secondaryLabel}</Text>
                    </Pressable>
                  </>
                ) : null}
              </View>

              <View style={styles.altAccessSection}>
                <Text style={styles.altAccessLabel}>Alternative Access</Text>
                <View style={styles.altButtons}>
                  <Pressable style={styles.altButton}>
                    <Text style={styles.altButtonIcon}>◐</Text>
                  </Pressable>
                  <Pressable style={styles.altButton}>
                    <Text style={styles.altButtonIcon}>◉</Text>
                  </Pressable>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerLinks}>
              <Pressable>
                <Text style={styles.footerLink}>Privacy Policy</Text>
              </Pressable>
              <Pressable>
                <Text style={styles.footerLink}>Crisis Support</Text>
              </Pressable>
              <Pressable>
                <Text style={styles.footerLink}>Accessibility</Text>
              </Pressable>
            </View>
            <Text style={styles.footerNote}>
              © 2024 RELIANCE Humanitarian Network. All Rights Reserved.
            </Text>
          </View>
        </View>
      </Screen>
    );
  }

  return (
    <Screen>
      <MobileHeader title={content.title} subtitle={content.loginLabel} onBack={onBack} />

      <SectionCard style={{ ...styles.hero, backgroundColor: content.accent }}>
        <Pill label={content.loginLabel} />
        <Text style={styles.heroTitle}>{content.title}</Text>
        <Text style={styles.heroText}>{content.subtitle}</Text>
      </SectionCard>

      <SectionCard>
        <Input label="Username" placeholder="Enter username" />
        <Input label="Password" placeholder="********" secureTextEntry />
        <View style={styles.actions}>
          <Button label={content.action} onPress={onSubmit} />
          {onSecondary && secondaryLabel ? (
            <Button label={secondaryLabel} tone="ghost" onPress={onSecondary} />
          ) : null}
        </View>
      </SectionCard>
    </Screen>
  );
}

const styles = StyleSheet.create({
  hero: {
    gap: 12,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 32,
    lineHeight: 34,
    ...fonts.black,
  },
  heroText: {
    color: "rgba(255,255,255,0.88)",
    lineHeight: 22,
  },
  actions: {
    gap: 10,
    marginTop: 16,
  },
  citizenShell: {
    gap: 18,
  },
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "rgba(250,250,245,0.92)",
    borderRadius: 24,
    paddingHorizontal: 18,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: "rgba(112,122,108,0.14)",
  },
  brandRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  menuButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#edf1e8",
  },
  menuButtonText: {
    color: "#0d631b",
    fontSize: 22,
    ...fonts.bold,
  },
  brandText: {
    color: "#0d631b",
    fontSize: 22,
    ...fonts.black,
    letterSpacing: -0.8,
  },
  roleBadgeRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  roleTag: {
    color: "#0d631b",
    fontSize: 10,
    ...fonts.extrabold,
    letterSpacing: 1.4,
    textTransform: "uppercase",
    maxWidth: 86,
    textAlign: "right",
  },
  avatarImage: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#e8e8e4",
  },
  editorialPanel: {
    gap: 14,
  },
  gatewayLabel: {
    color: "#7e5700",
    textTransform: "uppercase",
    letterSpacing: 2.4,
    ...fonts.extrabold,
    fontSize: 11,
  },
  editorialTitle: {
    color: "#1a1c19",
    fontSize: 38,
    lineHeight: 40,
    ...fonts.black,
    letterSpacing: -1.4,
  },
  editorialAccent: {
    color: "#0d631b",
    fontStyle: "italic",
  },
  editorialText: {
    color: "#40493d",
    fontSize: 15,
    lineHeight: 24,
  },
  imageCard: {
    height: 220,
    borderRadius: 28,
    overflow: "hidden",
    justifyContent: "flex-end",
  },
  editorialImage: {
    borderRadius: 28,
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.18)",
  },
  imageFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    padding: 18,
  },
  verifiedIcon: {
    color: "#ffdeac",
    fontSize: 18,
    ...fonts.black,
  },
  imageFooterText: {
    color: "#ffffff",
    fontSize: 11,
    ...fonts.extrabold,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  loginCard: {
    position: "relative",
    overflow: "hidden",
    backgroundColor: "#ffffff",
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "rgba(112,122,108,0.12)",
    shadowColor: "#1a1c19",
    shadowOpacity: 0.08,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  glowOrb: {
    position: "absolute",
    top: -36,
    right: -18,
    width: 132,
    height: 132,
    borderRadius: 66,
    backgroundColor: "rgba(13,99,27,0.08)",
  },
  loginCardInner: {
    gap: 22,
    padding: 24,
  },
  loginIntro: {
    gap: 6,
  },
  loginTitle: {
    color: "#1a1c19",
    fontSize: 28,
    ...fonts.black,
  },
  loginSubtitle: {
    color: "#40493d",
    fontSize: 14,
    lineHeight: 21,
  },
  fieldGroup: {
    gap: 10,
  },
  labelRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  fieldLabel: {
    color: "#40493d",
    fontSize: 11,
    ...fonts.extrabold,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  helpLink: {
    color: "#0d631b",
    fontSize: 10,
    ...fonts.extrabold,
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  fieldWrap: {
    minHeight: 54,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(112,122,108,0.18)",
    backgroundColor: "#f4f4ef",
    paddingHorizontal: 4,
  },
  fieldIcon: {
    width: 28,
    color: "#707a6c",
    textAlign: "center",
    fontSize: 15,
    ...fonts.bold,
  },
  fieldInput: {
    flex: 1,
    minHeight: 54,
    color: "#1a1c19",
    fontSize: 15,
    paddingVertical: 12,
  },
  visibilityToggle: {
    color: "#707a6c",
    fontSize: 12,
    ...fonts.bold,
  },
  actionStack: {
    gap: 14,
    paddingTop: 4,
  },
  primaryAction: {
    borderRadius: 22,
    overflow: "hidden",
  },
  primaryGradient: {
    minHeight: 58,
    borderRadius: 22,
    backgroundColor: theme.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 20,
  },
  primaryActionText: {
    color: "#ffffff",
    fontSize: 14,
    ...fonts.black,
    letterSpacing: 1.3,
    textTransform: "uppercase",
  },
  primaryActionArrow: {
    color: "#ffffff",
    fontSize: 18,
    ...fonts.black,
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: "rgba(112,122,108,0.16)",
  },
  dividerText: {
    color: "#707a6c",
    fontSize: 11,
    ...fonts.extrabold,
    letterSpacing: 1.2,
  },
  secondaryAction: {
    minHeight: 56,
    borderRadius: 22,
    backgroundColor: "#e2e3de",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  secondaryActionText: {
    color: "#1a1c19",
    fontSize: 14,
    ...fonts.black,
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  altAccessSection: {
    alignItems: "center",
    gap: 14,
    paddingTop: 20,
    borderTopWidth: 1,
    borderTopColor: "rgba(112,122,108,0.12)",
  },
  altAccessLabel: {
    color: "rgba(64,73,61,0.7)",
    fontSize: 11,
    ...fonts.extrabold,
    letterSpacing: 1.5,
    textTransform: "uppercase",
  },
  altButtons: {
    flexDirection: "row",
    gap: 14,
  },
  altButton: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#f4f4ef",
    alignItems: "center",
    justifyContent: "center",
  },
  altButtonIcon: {
    color: "#1a1c19",
    fontSize: 20,
    fontWeight: "700",
  },
  footer: {
    gap: 12,
    paddingHorizontal: 4,
    paddingBottom: 8,
  },
  footerLinks: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 14,
  },
  footerLink: {
    color: "#40493d",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.1,
    textTransform: "uppercase",
  },
  footerNote: {
    color: "rgba(64,73,61,0.58)",
    fontSize: 11,
    lineHeight: 16,
  },
});
