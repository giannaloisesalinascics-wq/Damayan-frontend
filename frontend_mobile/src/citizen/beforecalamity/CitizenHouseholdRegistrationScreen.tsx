import React, { useState } from "react";
import { ImageBackground, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";
import { CitizenBottomNav } from "../shared";

const backgroundUri =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuC--5f9c3_GRfzlSPjisj7YAsAyhZwu63BDlzdjwfjjAqWG4v1Hy5a8NnY5TDUoVugC2ldLKxupmgehjjXUscnnmu2spH1UBsXN90N-5-1bms_G2Z1MwkjLaiIlEFRk3fLuIhsTLLS5yAWQvO4DWauAQARcP8_Bf3H8Tub_I_y0VluHWEU3GVQ9Z9DmuaZXBzdpacrMglmtyvymi-YsYmCwk_36lFPKCex5OZmaHlr0g4UVH8IHv8p7Kpy0aadbPnfpfYgjpg0Vu1IW";

const bloodTypes = ["A+", "A-", "B+", "O+"];
const genderOptions = ["Select", "Female", "Male", "Non-binary", "Prefer not to say"];

export function CitizenHouseholdRegistrationScreen({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  const [active] = useState<"home" | "relief" | "qr" | "profile">("home");
  const [gender, setGender] = useState("Select");
  const [bloodType, setBloodType] = useState("A+");
  const [consent, setConsent] = useState(false);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <Pressable onPress={onBack} style={styles.iconButton}>
            <Text style={styles.iconText}>{"<"}</Text>
          </Pressable>
          <Text style={styles.topTitle}>Citizen Registration</Text>
        </View>
        <Text style={styles.brand}>Verdant Relief</Text>
      </View>

      <View style={styles.heroSection}>
        <Text style={styles.stepLabel}>Step 01 / Registration</Text>
        <Text style={styles.heroTitle}>Personal Identity Profile</Text>
        <Text style={styles.heroCopy}>
          Your health and identity are vital for coordinating relief. Please
          provide accurate details to ensure medical responders have the context
          they need.
        </Text>
      </View>

      <View style={styles.formSection}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Full Legal Name</Text>
          <TextInput
            placeholder="As shown on official ID"
            placeholderTextColor="#7d867b"
            style={styles.textField}
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.fieldGroup, styles.rowLarge]}>
            <Text style={styles.fieldLabel}>Date of Birth</Text>
            <TextInput placeholder="YYYY-MM-DD" placeholderTextColor="#7d867b" style={styles.textField} />
          </View>
          <View style={[styles.fieldGroup, styles.rowSmall]}>
            <Text style={styles.fieldLabel}>Gender Identity</Text>
            <View style={styles.selectField}>
              <Text style={[styles.selectText, gender === "Select" && styles.placeholderText]}>{gender}</Text>
            </View>
            <View style={styles.optionRow}>
              {genderOptions.slice(1).map((option) => (
                <Pressable key={option} onPress={() => setGender(option)} style={styles.optionChip}>
                  <Text style={styles.optionChipText}>{option}</Text>
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </View>

      <View style={styles.medicalCard}>
        <View style={styles.medicalHeader}>
          <View style={styles.medicalIconWrap}>
            <Text style={styles.medicalIcon}>+</Text>
          </View>
          <View style={styles.medicalHeaderCopy}>
            <Text style={styles.medicalTitle}>Critical Medical Data</Text>
            <Text style={styles.medicalSubtitle}>
              Used exclusively by medical triage teams during emergencies.
            </Text>
          </View>
        </View>

        <View style={styles.medicalGrid}>
          <View style={styles.bloodTypeSection}>
            <Text style={styles.fieldLabel}>Blood Type</Text>
            <View style={styles.bloodGrid}>
              {bloodTypes.map((type) => {
                const selected = type === bloodType;
                return (
                  <Pressable
                    key={type}
                    onPress={() => setBloodType(type)}
                    style={[styles.bloodButton, selected && styles.bloodButtonActive]}
                  >
                    <Text style={[styles.bloodButtonText, selected && styles.bloodButtonTextActive]}>
                      {type}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.conditionsSection}>
            <Text style={styles.fieldLabel}>Conditions & Allergies</Text>
            <TextInput
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              placeholder="List any chronic conditions (e.g., Diabetes, Asthma) or severe allergies (e.g., Penicillin, Peanuts)..."
              placeholderTextColor="#7d867b"
              style={styles.textArea}
            />
          </View>
        </View>
      </View>

      <Pressable onPress={() => setConsent((value) => !value)} style={styles.consentRow}>
        <View style={[styles.checkbox, consent && styles.checkboxActive]}>
          {consent ? <Text style={styles.checkboxMark}>✓</Text> : null}
        </View>
        <Text style={styles.consentText}>
          I certify that the information provided is accurate. I understand this data
          is used for humanitarian coordination under the{" "}
          <Text style={styles.consentLink}>Privacy Protection Protocol</Text>.
        </Text>
      </Pressable>

      <View style={styles.actionSection}>
        <Pressable onPress={onContinue} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Continue Registration</Text>
          <Text style={styles.primaryButtonArrow}>-&gt;</Text>
        </Pressable>
      </View>

      <CitizenBottomNav active={active} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#fafaf5",
  },
  content: {
    padding: 24,
    paddingBottom: 32,
    gap: 24,
  },
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    minHeight: 48,
    gap: 12,
  },
  topLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(218,218,213,0.45)",
  },
  iconText: {
    color: "#1a1c19",
    fontWeight: "800",
    fontSize: 16,
  },
  topTitle: {
    color: "#1a1c19",
    fontSize: 18,
    fontWeight: "800",
  },
  brand: {
    color: "#0d631b",
    fontSize: 20,
    fontWeight: "900",
    letterSpacing: -0.6,
  },
  heroSection: {
    gap: 10,
  },
  stepLabel: {
    color: "#7e5700",
    fontSize: 11,
    fontWeight: "700",
    letterSpacing: 1.8,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#1a1c19",
    fontSize: 40,
    lineHeight: 44,
    fontWeight: "900",
    letterSpacing: -1.2,
  },
  heroCopy: {
    color: "#40493d",
    fontSize: 16,
    lineHeight: 26,
    maxWidth: 420,
  },
  formSection: {
    gap: 18,
    marginBottom: 8,
  },
  row: {
    gap: 16,
  },
  rowLarge: {
    flex: 1.4,
  },
  rowSmall: {
    flex: 1,
  },
  fieldGroup: {
    gap: 8,
  },
  fieldLabel: {
    color: "#40493d",
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 1.5,
    textTransform: "uppercase",
    paddingHorizontal: 2,
  },
  textField: {
    minHeight: 56,
    backgroundColor: "#f4f4ef",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(191,202,186,0.45)",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 16,
    color: "#1a1c19",
    fontSize: 18,
  },
  selectField: {
    minHeight: 56,
    backgroundColor: "#f4f4ef",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(191,202,186,0.45)",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  selectText: {
    color: "#1a1c19",
    fontSize: 18,
  },
  placeholderText: {
    color: "#7d867b",
  },
  optionRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    paddingTop: 4,
    paddingBottom: 10,
    alignItems: "flex-start",
  },
  optionChip: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(191,202,186,0.35)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
    minHeight: 32,
    justifyContent: "center",
  },
  optionChipText: {
    color: "#40493d",
    fontSize: 12,
    fontWeight: "600",
  },
  medicalCard: {
    backgroundColor: "#f4f4ef",
    borderRadius: 28,
    padding: 24,
    borderLeftWidth: 4,
    borderLeftColor: "#0d631b",
    gap: 22,
    marginTop: 4,
  },
  medicalHeader: {
    flexDirection: "row",
    gap: 14,
    alignItems: "flex-start",
  },
  medicalIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(13,99,27,0.1)",
  },
  medicalIcon: {
    color: "#0d631b",
    fontSize: 22,
    fontWeight: "900",
  },
  medicalHeaderCopy: {
    flex: 1,
    gap: 4,
  },
  medicalTitle: {
    color: "#1a1c19",
    fontSize: 22,
    fontWeight: "800",
  },
  medicalSubtitle: {
    color: "#40493d",
    fontSize: 13,
    lineHeight: 20,
  },
  medicalGrid: {
    gap: 20,
  },
  bloodTypeSection: {
    gap: 10,
  },
  bloodGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  bloodButton: {
    minWidth: 64,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 12,
    paddingHorizontal: 14,
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(191,202,186,0.35)",
    borderRadius: 14,
  },
  bloodButtonActive: {
    backgroundColor: "#0d631b",
    borderColor: "#0d631b",
  },
  bloodButtonText: {
    color: "#1a1c19",
    fontWeight: "800",
  },
  bloodButtonTextActive: {
    color: "#ffffff",
  },
  conditionsSection: {
    gap: 10,
  },
  textArea: {
    minHeight: 132,
    backgroundColor: "#ffffff",
    borderRadius: 18,
    padding: 16,
    color: "#1a1c19",
    fontSize: 16,
    lineHeight: 22,
  },
  consentRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingHorizontal: 2,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#bfcaba",
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxActive: {
    backgroundColor: "#0d631b",
    borderColor: "#0d631b",
  },
  checkboxMark: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "900",
  },
  consentText: {
    flex: 1,
    color: "#40493d",
    fontSize: 13,
    lineHeight: 20,
  },
  consentLink: {
    color: "#0d631b",
    fontWeight: "700",
    textDecorationLine: "underline",
  },
  actionSection: {
    paddingTop: 4,
  },
  primaryButton: {
    minHeight: 58,
    alignSelf: "stretch",
    borderRadius: 16,
    backgroundColor: "#0d631b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 18,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },
  primaryButtonArrow: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },
  imagePanel: {
    height: 256,
    borderRadius: 28,
    overflow: "hidden",
    justifyContent: "center",
  },
  imageBg: {
    borderRadius: 28,
  },
  imageOverlay: {
    flex: 1,
    backgroundColor: "rgba(13,99,27,0.24)",
    justifyContent: "center",
    paddingHorizontal: 28,
  },
  imageQuote: {
    color: "#ffffff",
    fontSize: 28,
    lineHeight: 34,
    fontWeight: "800",
    maxWidth: 260,
  },
});
