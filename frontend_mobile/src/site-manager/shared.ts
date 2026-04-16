import { StyleSheet } from "react-native";
import { theme, fonts } from "../theme";

export const siteManagerStyles = StyleSheet.create({
  primaryHero: {
    backgroundColor: theme.primary,
    gap: 12,
  },
  heroTitle: {
    color: "#fff",
    fontSize: 30,
    lineHeight: 32,
    ...fonts.black,
  },
  heroText: {
    color: "rgba(255,255,255,0.88)",
    lineHeight: 22,
  },
  sectionTitle: {
    fontSize: 22,
    ...fonts.black,
    color: theme.text,
    marginBottom: 12,
  },
  checkRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    gap: 10,
  },
  checkLabel: {
    flex: 1,
    ...fonts.extrabold,
    color: theme.text,
  },
  scannerBox: {
    height: 180,
    borderRadius: 22,
    backgroundColor: "#11311a",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 14,
  },
  scannerText: {
    color: "#d8ffd8",
    ...fonts.extrabold,
  },
  modeRow: {
    gap: 10,
  },
  manualWrap: {
    marginTop: 14,
    gap: 12,
  },
  helperText: {
    marginTop: 12,
    color: theme.textMuted,
    lineHeight: 20,
  },
});
