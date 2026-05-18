import { StyleSheet } from "react-native";
import { theme, fonts } from "../theme";

export const dispatcherStyles = StyleSheet.create({
  title: {
    fontSize: 30,
    lineHeight: 32,
    ...fonts.black,
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
    ...fonts.black,
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
    ...fonts.extrabold,
    color: theme.text,
  },
  rowCopy: {
    marginTop: 4,
    color: theme.textMuted,
  },
});
