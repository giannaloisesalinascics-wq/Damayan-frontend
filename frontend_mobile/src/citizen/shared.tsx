import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { theme, fonts } from "../theme";

const heroImageUri =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuB7mK6Wlk5tpcz_jg-y_FNS8PaNwyml1WkYUcFxvzRckiijTcFHZ86PvgEvRj5z91SeFpO35w95Xf15h9Te72zdNO_c_pH-SUPMX4S6vwvPbl8QmMKDbrRL0QEyIjDbUkei6wxoM5mR4tV1mIUpd3l_eiEyNBIID90mRxapOumpUbprXPaH5UFcCDYK9tjGxos2cuTC8Enx25m3LklOoLtJ3_jBY0PMnIW53zyJbubc1XMeyAhFTjngNmNce8IUw9kWG3_Iw1rge8vN";

export function CitizenPreparednessTopBar({ onBack }: { onBack: () => void }) {
  return (
    <View style={citizenStyles.beforeTopBar}>
      <View style={citizenStyles.beforeTopBarRow}>
        <View style={citizenStyles.beforeTitleBlock}>
          <Pressable onPress={onBack} style={citizenStyles.topIconButton}>
            <Text style={citizenStyles.topIcon}>|||</Text>
          </Pressable>
          <Text style={citizenStyles.beforeTitle}>Citizen Preparedness</Text>
        </View>
        <Pressable style={citizenStyles.topIconButton}>
          <Text style={citizenStyles.topIcon}>O</Text>
        </Pressable>
      </View>
      <View style={citizenStyles.topDivider} />
    </View>
  );
}

export function PreparednessHero({
  stepLabel,
  title,
  copy,
}: {
  stepLabel: string;
  title: string;
  copy: string;
}) {
  return (
    <View style={citizenStyles.beforeHeroSection}>
      <Text style={citizenStyles.stepLabel}>{stepLabel}</Text>
      <Text style={citizenStyles.beforeHeroTitle}>{title}</Text>
      <Text style={citizenStyles.beforeHeroCopy}>{copy}</Text>

      <View style={citizenStyles.heroImageWrap}>
        <Image source={{ uri: heroImageUri }} style={citizenStyles.heroImage} />
        <View style={citizenStyles.heroImageTint} />
      </View>
    </View>
  );
}

export function CitizenBottomNav({
  active,
}: {
  active: "home" | "relief" | "qr" | "profile";
}) {
  const items: Array<{
    id: "home" | "relief" | "qr" | "profile";
    icon: string;
    label: string;
  }> = [
    { id: "home", icon: "H", label: "Home" },
    { id: "relief", icon: "R", label: "Relief" },
    { id: "qr", icon: "QR", label: "QR ID" },
    { id: "profile", icon: "P", label: "Profile" },
  ];

  return (
    <View style={citizenStyles.bottomNav}>
      {items.map((item) => {
        const isActive = item.id === active;

        return (
          <Pressable
            key={item.id}
            style={[
              citizenStyles.bottomNavItem,
              isActive && citizenStyles.bottomNavItemActive,
            ]}
          >
            <Text
              style={[
                citizenStyles.bottomNavIcon,
                isActive && citizenStyles.bottomNavIconActive,
              ]}
            >
              {item.icon}
            </Text>
            <Text
              style={[
                citizenStyles.bottomNavLabel,
                isActive && citizenStyles.bottomNavLabelActive,
              ]}
            >
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

export const citizenStyles = StyleSheet.create({
  greenHero: {
    backgroundColor: theme.primary,
    gap: 14,
    paddingBottom: 8,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 34,
    lineHeight: 40,
    ...fonts.black,
  },
  heroBody: {
    color: "rgba(255,255,255,0.9)",
    lineHeight: 24,
    fontSize: 15,
    ...fonts.regular,
  },
  uploadBox: {
    minHeight: 120,
    borderRadius: 16,
    borderWidth: 2,
    borderColor: "#c8d9c0",
    borderStyle: "dashed",
    backgroundColor: "#f5faf4",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  uploadTitle: {
    color: theme.primary,
    ...fonts.bold,
    fontSize: 15,
  },
  uploadHint: {
    color: theme.textMuted,
    fontSize: 13,
    ...fonts.regular,
  },
  beforeTopBar: {
    backgroundColor: "#fafaf9",
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: theme.line,
    marginBottom: 8,
  },
  beforeTopBarRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  beforeTitleBlock: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  topIconButton: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.surfaceSoft,
    borderWidth: 1,
    borderColor: theme.line,
  },
  topIcon: {
    color: theme.primary,
    fontSize: 18,
    ...fonts.bold,
  },
  beforeTitle: {
    flex: 1,
    color: theme.primary,
    fontSize: 18,
    ...fonts.bold,
    letterSpacing: -0.3,
  },
  topDivider: {
    height: 1,
    backgroundColor: theme.line,
    marginTop: 10,
  },
  beforeHeroSection: {
    gap: 16,
    marginBottom: 8,
  },
  stepLabel: {
    color: theme.warning,
    fontSize: 11,
    ...fonts.semibold,
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  beforeHeroTitle: {
    color: theme.text,
    fontSize: 38,
    lineHeight: 42,
    ...fonts.black,
    letterSpacing: -1,
  },
  beforeHeroCopy: {
    color: theme.textMuted,
    fontSize: 16,
    lineHeight: 26,
    ...fonts.regular,
  },
  heroImageWrap: {
    position: "relative",
    height: 240,
    borderRadius: 20,
    overflow: "hidden",
    backgroundColor: theme.surfaceAlt,
    marginTop: 8,
  },
  heroImage: {
    width: "100%",
    height: "100%",
    opacity: 0.85,
  },
  heroImageTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(29, 123, 58, 0.06)",
  },
  selectionGrid: {
    gap: 16,
  },
  selectionCard: {
    minHeight: 300,
    borderRadius: 20,
    padding: 24,
    justifyContent: "space-between",
    backgroundColor: theme.surface,
    borderWidth: 1.5,
    borderColor: theme.line,
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 4 },
    elevation: 1,
  },
  selectionCardSelected: {
    minHeight: 300,
    borderRadius: 20,
    padding: 24,
    justifyContent: "space-between",
    backgroundColor: theme.surface,
    borderWidth: 2.5,
    borderColor: theme.primary,
    shadowColor: theme.primary,
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  selectionCardPrimary: {
    minHeight: 300,
    borderRadius: 20,
    padding: 24,
    justifyContent: "space-between",
    backgroundColor: theme.primary,
    overflow: "hidden",
    shadowColor: theme.primary,
    shadowOpacity: 0.25,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 10 },
    elevation: 5,
  },
  selectionGlow: {
    position: "absolute",
    right: -40,
    top: -50,
    width: 160,
    height: 160,
    borderRadius: 80,
    backgroundColor: "rgba(255,255,255,0.1)",
  },
  selectionPrimaryContent: {
    gap: 0,
  },
  selectionIconBox: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "#d4f1cc",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  selectionIconBoxPrimary: {
    width: 60,
    height: 60,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.2)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  selectionIcon: {
    color: theme.primary,
    fontSize: 24,
    ...fonts.black,
  },
  selectionIconPrimary: {
    color: "#ffffff",
    fontSize: 22,
    ...fonts.black,
  },
  selectionTitle: {
    color: theme.text,
    fontSize: 26,
    lineHeight: 30,
    ...fonts.bold,
    marginBottom: 12,
  },
  selectionTitlePrimary: {
    color: "#ffffff",
    fontSize: 26,
    lineHeight: 30,
    ...fonts.bold,
    marginBottom: 12,
  },
  selectionCopy: {
    color: theme.textMuted,
    fontSize: 15,
    lineHeight: 24,
    ...fonts.regular,
  },
  selectionCopyPrimary: {
    color: "rgba(255,255,255,0.92)",
    fontSize: 15,
    lineHeight: 24,
    ...fonts.regular,
  },
  selectionFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginTop: 20,
  },
  selectionFooterText: {
    color: theme.primary,
    fontSize: 14,
    ...fonts.semibold,
  },
  selectionFooterTextPrimary: {
    color: "#ffffff",
    fontSize: 14,
    ...fonts.semibold,
  },
  selectionArrow: {
    color: theme.primary,
    fontSize: 16,
    ...fonts.bold,
  },
  selectionArrowPrimary: {
    color: "#ffffff",
    fontSize: 16,
    ...fonts.bold,
  },
  selectionPrimaryFooter: {
    gap: 14,
  },
  recommendedBadge: {
    alignSelf: "flex-start",
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
    backgroundColor: theme.secondary,
  },
  recommendedStar: {
    color: "#8f5d00",
    fontSize: 12,
    ...fonts.black,
  },
  recommendedText: {
    color: "#8f5d00",
    fontSize: 11,
    ...fonts.bold,
    textTransform: "uppercase",
    letterSpacing: 0.8,
  },
  familyAdvantageCard: {
    borderRadius: 20,
    padding: 24,
    backgroundColor: theme.surfaceSoft,
    gap: 24,
    borderWidth: 1,
    borderColor: theme.line,
  },
  advantageLabel: {
    color: theme.warning,
    fontSize: 11,
    ...fonts.bold,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  advantageList: {
    gap: 20,
  },
  advantageItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  advantageIconBox: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: theme.surface,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: theme.line,
  },
  advantageIcon: {
    color: theme.primary,
    fontSize: 14,
    ...fonts.bold,
  },
  advantageTextBlock: {
    flex: 1,
  },
  advantageTitle: {
    color: theme.text,
    fontSize: 16,
    ...fonts.bold,
    marginBottom: 6,
  },
  advantageCopy: {
    color: theme.textMuted,
    fontSize: 14,
    lineHeight: 22,
    ...fonts.regular,
  },
  personalBenefitCard: {
    gap: 18,
    backgroundColor: theme.surfaceSoft,
    borderRadius: 20,
    padding: 24,
    borderWidth: 1,
    borderColor: theme.line,
  },
  personalBenefitLabel: {
    color: theme.warning,
    fontSize: 11,
    ...fonts.bold,
    textTransform: "uppercase",
    letterSpacing: 1.4,
  },
  personalBenefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  individualActionCard: {
    gap: 14,
    backgroundColor: theme.primaryLight,
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(29, 123, 58, 0.2)",
  },
  individualActionTitle: {
    color: theme.text,
    fontSize: 24,
    lineHeight: 28,
    ...fonts.bold,
  },
  individualActionCopy: {
    color: theme.textMuted,
    lineHeight: 22,
    fontSize: 15,
    ...fonts.regular,
  },
  helpSection: {
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  helpText: {
    color: theme.textMuted,
    fontSize: 15,
    ...fonts.regular,
  },
  helpLink: {
    color: theme.primary,
    fontSize: 15,
    ...fonts.bold,
    textDecorationLine: "underline",
  },
  sectionTitle: {
    color: theme.text,
    fontSize: 24,
    ...fonts.bold,
    marginBottom: 14,
  },
  rowTitle: {
    fontSize: 16,
    ...fonts.semibold,
    color: theme.text,
  },
  rowCopy: {
    color: theme.textMuted,
    marginTop: 4,
    lineHeight: 20,
    fontSize: 14,
    ...fonts.regular,
  },
  mapCard: {
    gap: 12,
  },
  fakeMap: {
    height: 260,
    borderRadius: 20,
    backgroundColor: theme.surfaceAlt,
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: theme.line,
  },
  hotspot: {
    width: 28,
    height: 28,
    borderRadius: 999,
    backgroundColor: theme.danger,
    shadowColor: theme.danger,
    shadowOpacity: 0.3,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  ticketCard: {
    backgroundColor: theme.surface,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.line,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
    shadowColor: "#000000",
    shadowOpacity: 0.03,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    backgroundColor: "rgba(248, 249, 248, 0.95)",
    shadowColor: "#000000",
    shadowOpacity: 0.08,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: -4 },
    elevation: 5,
    borderTopWidth: 1,
    borderTopColor: theme.line,
  },
  bottomNavItem: {
    minWidth: 70,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 14,
    opacity: 0.6,
  },
  bottomNavItemActive: {
    backgroundColor: "rgba(29, 123, 58, 0.12)",
    opacity: 1,
  },
  bottomNavIcon: {
    color: theme.text,
    fontSize: 16,
    ...fonts.bold,
  },
  bottomNavIconActive: {
    color: theme.primary,
  },
  bottomNavLabel: {
    marginTop: 6,
    color: theme.text,
    fontSize: 11,
    ...fonts.semibold,
    letterSpacing: 0.4,
    textTransform: "uppercase",
  },
  bottomNavLabelActive: {
    color: theme.primary,
  },
});
