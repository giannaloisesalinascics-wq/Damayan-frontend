import { StyleSheet } from "react-native";
import { theme, fonts } from "../theme";

export const styles = StyleSheet.create({
  kpiGrid: {
    gap: 12,
  },
  kpiCard: {
    gap: 6,
  },
  kpiLabel: {
    color: theme.textMuted,
    textTransform: "uppercase",
    fontSize: 11,
    ...fonts.extrabold,
    letterSpacing: 1,
  },
  kpiValue: {
    color: theme.primary,
    fontSize: 30,
    ...fonts.black,
  },
  sectionTitle: {
    fontSize: 22,
    ...fonts.black,
    color: theme.text,
    marginBottom: 14,
  },
  listCard: {
    backgroundColor: "#f8faf7",
    borderWidth: 1,
    borderColor: theme.line,
    borderRadius: 18,
    padding: 14,
    gap: 12,
    marginBottom: 12,
  },
  rowTitle: {
    ...fonts.extrabold,
    color: theme.text,
  },
  rowCopy: {
    marginTop: 4,
    color: theme.textMuted,
  },
  actionGroup: {
    gap: 8,
  },
  healthRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
  },
});
