import React from "react";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { theme } from "../theme";

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
    gap: 12,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 32,
    lineHeight: 34,
    fontWeight: "900",
  },
  heroBody: {
    color: "rgba(255,255,255,0.88)",
    lineHeight: 22,
  },
  uploadBox: {
    minHeight: 108,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: "#cfe0d1",
    borderStyle: "dashed",
    backgroundColor: "#f7faf7",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  uploadTitle: {
    color: theme.primary,
    fontWeight: "800",
  },
  uploadHint: {
    color: theme.textMuted,
  },
  beforeTopBar: {
    backgroundColor: "#fafaf5",
    borderRadius: 26,
    paddingHorizontal: 18,
    paddingTop: 14,
    paddingBottom: 10,
    borderWidth: 1,
    borderColor: "rgba(112,122,108,0.12)",
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
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eef1ea",
  },
  topIcon: {
    color: "#0d631b",
    fontSize: 18,
    fontWeight: "800",
  },
  beforeTitle: {
    flex: 1,
    color: "#0d631b",
    fontSize: 20,
    fontWeight: "800",
    letterSpacing: -0.4,
  },
  topDivider: {
    height: 1,
    backgroundColor: "#dadad5",
    opacity: 0.3,
    marginTop: 12,
  },
  beforeHeroSection: {
    gap: 16,
  },
  stepLabel: {
    color: "#7e5700",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  beforeHeroTitle: {
    color: "#0d631b",
    fontSize: 42,
    lineHeight: 44,
    fontWeight: "900",
    letterSpacing: -1.8,
  },
  beforeHeroCopy: {
    color: "#40493d",
    fontSize: 17,
    lineHeight: 28,
  },
  heroImageWrap: {
    position: "relative",
    height: 220,
    borderRadius: 32,
    overflow: "hidden",
    backgroundColor: "#f4f4ef",
  },
  heroImage: {
    width: "100%",
    height: "100%",
    opacity: 0.84,
  },
  heroImageTint: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(13,99,27,0.08)",
  },
  selectionGrid: {
    gap: 16,
  },
  selectionCard: {
    minHeight: 280,
    borderRadius: 32,
    padding: 24,
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(191,202,186,0.24)",
    shadowColor: "#000000",
    shadowOpacity: 0.04,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 10 },
    elevation: 2,
  },
  selectionCardSelected: {
    minHeight: 280,
    borderRadius: 32,
    padding: 24,
    justifyContent: "space-between",
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "#0d631b",
    shadowColor: "#0d631b",
    shadowOpacity: 0.08,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 3,
  },
  selectionCardPrimary: {
    minHeight: 280,
    borderRadius: 32,
    padding: 24,
    justifyContent: "space-between",
    backgroundColor: "#0d631b",
    overflow: "hidden",
    shadowColor: "#0d631b",
    shadowOpacity: 0.22,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  selectionGlow: {
    position: "absolute",
    right: -48,
    top: -44,
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: "rgba(255,255,255,0.07)",
  },
  selectionPrimaryContent: {
    gap: 0,
  },
  selectionIconBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#a3f69c",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  selectionIconBoxPrimary: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "rgba(255,255,255,0.18)",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 24,
  },
  selectionIcon: {
    color: "#0d631b",
    fontSize: 26,
    fontWeight: "900",
  },
  selectionIconPrimary: {
    color: "#ffffff",
    fontSize: 24,
    fontWeight: "900",
  },
  selectionTitle: {
    color: "#1a1c19",
    fontSize: 28,
    lineHeight: 31,
    fontWeight: "800",
    marginBottom: 10,
  },
  selectionTitlePrimary: {
    color: "#ffffff",
    fontSize: 28,
    lineHeight: 31,
    fontWeight: "800",
    marginBottom: 10,
  },
  selectionCopy: {
    color: "#40493d",
    fontSize: 15,
    lineHeight: 24,
  },
  selectionCopyPrimary: {
    color: "#cbffc2",
    fontSize: 15,
    lineHeight: 24,
  },
  selectionFooter: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 20,
  },
  selectionFooterText: {
    color: "#0d631b",
    fontSize: 15,
    fontWeight: "800",
  },
  selectionFooterTextPrimary: {
    color: "#ffffff",
    fontSize: 15,
    fontWeight: "800",
  },
  selectionArrow: {
    color: "#0d631b",
    fontSize: 18,
    fontWeight: "800",
  },
  selectionArrowPrimary: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
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
    backgroundColor: "#feb300",
  },
  recommendedStar: {
    color: "#6a4800",
    fontSize: 12,
    fontWeight: "900",
  },
  recommendedText: {
    color: "#6a4800",
    fontSize: 11,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.1,
  },
  familyAdvantageCard: {
    borderRadius: 36,
    padding: 24,
    backgroundColor: "#f4f4ef",
    gap: 24,
  },
  advantageLabel: {
    color: "#7e5700",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 2.2,
  },
  advantageList: {
    gap: 22,
  },
  advantageItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  advantageIconBox: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
  },
  advantageIcon: {
    color: "#0d631b",
    fontSize: 14,
    fontWeight: "900",
  },
  advantageTextBlock: {
    flex: 1,
  },
  advantageTitle: {
    color: "#1a1c19",
    fontSize: 18,
    fontWeight: "800",
    marginBottom: 6,
  },
  advantageCopy: {
    color: "#40493d",
    fontSize: 14,
    lineHeight: 22,
  },
  personalBenefitCard: {
    gap: 18,
    backgroundColor: "#f4f4ef",
  },
  personalBenefitLabel: {
    color: "#7e5700",
    fontSize: 12,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.8,
  },
  personalBenefitItem: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
  },
  individualActionCard: {
    gap: 12,
    backgroundColor: "#f7fbf6",
  },
  individualActionTitle: {
    color: theme.text,
    fontSize: 24,
    lineHeight: 28,
    fontWeight: "900",
  },
  individualActionCopy: {
    color: theme.textMuted,
    lineHeight: 22,
  },
  helpSection: {
    alignItems: "center",
    gap: 8,
    marginBottom: 4,
  },
  helpText: {
    color: "#40493d",
    fontSize: 15,
  },
  helpLink: {
    color: "#0d631b",
    fontSize: 15,
    fontWeight: "800",
    textDecorationLine: "underline",
  },
  sectionTitle: {
    color: theme.text,
    fontSize: 22,
    fontWeight: "900",
    marginBottom: 14,
  },
  rowTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: theme.text,
  },
  rowCopy: {
    color: theme.textMuted,
    marginTop: 4,
    lineHeight: 20,
  },
  mapCard: {
    gap: 12,
  },
  fakeMap: {
    height: 240,
    borderRadius: 20,
    backgroundColor: "#dfe6dc",
    overflow: "hidden",
    justifyContent: "center",
    alignItems: "center",
  },
  hotspot: {
    width: 26,
    height: 26,
    borderRadius: 999,
    backgroundColor: theme.danger,
  },
  ticketCard: {
    backgroundColor: "#f7faf7",
    borderRadius: 18,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.line,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    gap: 12,
  },
  bottomNav: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 24,
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    backgroundColor: "rgba(250,250,245,0.96)",
    shadowColor: "#1a1c19",
    shadowOpacity: 0.06,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: -4 },
    elevation: 6,
  },
  bottomNavItem: {
    minWidth: 66,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 8,
    borderRadius: 18,
    opacity: 0.5,
  },
  bottomNavItemActive: {
    backgroundColor: "rgba(46,125,50,0.12)",
    opacity: 1,
  },
  bottomNavIcon: {
    color: "#1a1c19",
    fontSize: 14,
    fontWeight: "900",
  },
  bottomNavIconActive: {
    color: "#0d631b",
  },
  bottomNavLabel: {
    marginTop: 4,
    color: "#1a1c19",
    fontSize: 10,
    fontWeight: "600",
    letterSpacing: 0.6,
    textTransform: "uppercase",
  },
  bottomNavLabelActive: {
    color: "#0d631b",
    fontWeight: "800",
  },
});
