import { StyleSheet } from "react-native";
import { theme } from "../theme";

export const dispatcherStyles = StyleSheet.create({
  title: {
    fontSize: 30,
    lineHeight: 32,
    fontWeight: "900",
    color: theme.text,
    marginTop: 10,
  },
  copy: {
    color: theme.textMuted,
    lineHeight: 22,
    marginTop: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: "900",
    color: theme.text,
    marginBottom: 14,
  },
  ticketRow: {
    padding: 14,
    borderRadius: 18,
    backgroundColor: "#f8faf7",
    borderWidth: 1,
    borderColor: theme.line,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 12,
  },
  rowTitle: {
    fontWeight: "800",
    color: theme.text,
  },
  rowCopy: {
    marginTop: 4,
    color: theme.textMuted,
  },
});
