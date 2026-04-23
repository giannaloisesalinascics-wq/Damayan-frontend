import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CitizenBottomNav } from "../../shared";
import { theme, fonts } from "../../../theme";
import { styles } from "../styles/CitizenHouseholdRegistrationScreen.styles";

const bloodTypes = ["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"];
const genderOptions = ["Female", "Male", "Non-binary", "Prefer not to say"];

export function CitizenHouseholdRegistrationScreen({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  const [active] = useState<"home" | "relief" | "qr" | "profile">("home");
  const [gender, setGender] = useState("");
  const [bloodType, setBloodType] = useState("O+");
  const [consent, setConsent] = useState(false);

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <View style={styles.topLeft}>
          <Pressable onPress={onBack} style={styles.iconButton}>
            <Ionicons name="arrow-back" size={22} color={theme.text} />
          </Pressable>
          <Text style={styles.topTitle}>Citizen Registration</Text>
        </View>
        <Text style={styles.brand}>DAMAYAN</Text>
      </View>

      {/* Hero */}
      <View style={styles.heroSection}>
        <View style={styles.stepBadgeWrap}>
          <Text style={styles.stepLabel}>Step 01 / Registration</Text>
        </View>
        <Text style={styles.heroTitle}>Personal Identity{"\n"}Profile</Text>
        <Text style={styles.heroCopy}>
          Your health and identity are vital for coordinating relief. Please
          provide accurate details to ensure medical responders have the context
          they need.
        </Text>
      </View>

      {/* Personal Info Form */}
      <View style={styles.formSection}>
        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Full Legal Name</Text>
          <TextInput
            placeholder="As shown on official ID"
            placeholderTextColor="#7d867b"
            style={styles.textField}
          />
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Date of Birth</Text>
          <View style={styles.fieldWithIcon}>
            <TextInput
              placeholder="YYYY-MM-DD"
              placeholderTextColor="#7d867b"
              style={styles.fieldInputFlex}
            />
            <Ionicons name="calendar-outline" size={20} color={theme.textLight} />
          </View>
        </View>

        <View style={styles.fieldGroup}>
          <Text style={styles.fieldLabel}>Gender Identity</Text>
          <View style={styles.optionRow}>
            {genderOptions.map((option) => (
              <Pressable
                key={option}
                onPress={() => setGender(option)}
                style={[styles.optionChip, gender === option && styles.optionChipActive]}
              >
                <Text style={[styles.optionChipText, gender === option && styles.optionChipTextActive]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* Medical Card */}
      <View style={styles.medicalCard}>
        <View style={styles.medicalHeader}>
          <View style={styles.medicalIconWrap}>
            <Ionicons name="medkit" size={24} color={theme.primary} />
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
              placeholder="List any chronic conditions (e.g., Diabetes, Asthma) or severe allergies..."
              placeholderTextColor="#7d867b"
              style={styles.textArea}
            />
          </View>
        </View>
      </View>

      {/* Consent */}
      <Pressable onPress={() => setConsent((v) => !v)} style={styles.consentRow}>
        <View style={[styles.checkbox, consent && styles.checkboxActive]}>
          {consent ? <Ionicons name="checkmark" size={14} color="#fff" /> : null}
        </View>
        <Text style={styles.consentText}>
          I certify that the information provided is accurate. I understand this data
          is used for humanitarian coordination under the{" "}
          <Text style={styles.consentLink}>Privacy Protection Protocol</Text>.
        </Text>
      </Pressable>

      {/* Action */}
      <View style={styles.actionSection}>
        <Pressable onPress={onContinue} style={[styles.primaryButton, !consent && styles.primaryButtonDisabled]}>
          <Text style={styles.primaryButtonText}>Continue Registration</Text>
          <Ionicons name="arrow-forward" size={20} color="#fff" />
        </Pressable>
      </View>

      <CitizenBottomNav active={active} />
    </ScrollView>
  );
}
