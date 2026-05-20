import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  Pressable,
  TouchableOpacity,
  SafeAreaView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme, fonts } from "../theme";
import { updateProfile, type CitizenProfile } from "../api";
import { loadSession } from "../session";
import type { AuthSession } from "../types";

interface CitizenProfileEditScreenProps {
  onBack: () => void;
  onSave: (data: any) => void;
  citizenProfile?: CitizenProfile | null;
  session?: AuthSession | null;
}

const GENDERS = ["Male", "Female", "Prefer not to say"];
const BLOOD_TYPES = ["A+", "A−", "B+", "B−", "AB+", "AB−", "O+", "O−", "Unknown"];

export function CitizenProfileEditScreen({
  onBack,
  onSave,
  citizenProfile,
  session,
}: CitizenProfileEditScreenProps) {
  const userProfile = session?.user as any;

  const [firstName, setFirstName] = useState(
    citizenProfile?.firstName ?? userProfile?.firstName ?? "",
  );
  const [lastName, setLastName] = useState(
    citizenProfile?.lastName ?? userProfile?.lastName ?? "",
  );
  const [email, setEmail] = useState(userProfile?.email ?? "");
  const [phone, setPhone] = useState(
    citizenProfile?.phone ?? userProfile?.phone ?? "",
  );

  // Address (from user_profiles)
  const [address, setAddress] = useState(userProfile?.address ?? "");
  const [barangay, setBarangay] = useState(userProfile?.barangay ?? "");
  const [municipality, setMunicipality] = useState(userProfile?.municipality ?? "");
  const [province, setProvince] = useState(userProfile?.province ?? "");

  // Personal (from user_profiles + register_citizens)
  const [gender, setGender] = useState(
    citizenProfile?.gender ?? userProfile?.gender ?? "",
  );
  const [bloodType, setBloodType] = useState(citizenProfile?.bloodType ?? "");
  const [medicalConditions, setMedicalConditions] = useState(
    citizenProfile?.medicalConditions ?? "",
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [activeSection, setActiveSection] = useState<"account" | "address" | "health">("account");

  async function handleSave() {
    setSaving(true);
    setError(null);
    setSuccess(false);
    try {
      const s = await loadSession();
      if (!s?.accessToken) throw new Error("Session expired. Please sign in again.");

      await updateProfile(s.accessToken, {
        firstName: firstName.trim() || undefined,
        lastName: lastName.trim() || undefined,
        phone: phone.trim() || undefined,
        gender: gender || undefined,
        address: address.trim() || undefined,
        barangay: barangay.trim() || undefined,
        municipality: municipality.trim() || undefined,
        province: province.trim() || undefined,
      });

      setSuccess(true);
      onSave({
        firstName,
        lastName,
        email,
        phone,
        address,
        barangay,
        municipality,
        province,
        gender,
        bloodType,
        medicalConditions,
      });

      setTimeout(() => {
        onBack();
      }, 800);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save profile.");
    } finally {
      setSaving(false);
    }
  }

  const sections = [
    { id: "account" as const, label: "Account", icon: "person-outline" },
    { id: "address" as const, label: "Address", icon: "location-outline" },
    { id: "health" as const, label: "Health", icon: "heart-outline" },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      {/* Header */}
      <View style={styles.header}>
        <Pressable onPress={onBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color={theme.text} />
        </Pressable>
        <Text style={styles.headerTitle}>Edit Profile</Text>
        <Pressable onPress={handleSave} style={styles.saveHeaderButton} disabled={saving}>
          {saving ? (
            <ActivityIndicator size="small" color={theme.primary} />
          ) : (
            <Text style={[styles.saveHeaderText, success && { color: "#2E7D32" }]}>
              {success ? "Saved!" : "Save"}
            </Text>
          )}
        </Pressable>
      </View>

      {/* Section tabs */}
      <View style={styles.tabRow}>
        {sections.map((sec) => (
          <Pressable
            key={sec.id}
            style={[styles.tab, activeSection === sec.id && styles.tabActive]}
            onPress={() => setActiveSection(sec.id)}
          >
            <Ionicons
              name={sec.icon as any}
              size={18}
              color={activeSection === sec.id ? theme.primary : theme.textLight}
            />
            <Text style={[styles.tabLabel, activeSection === sec.id && styles.tabLabelActive]}>
              {sec.label}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={styles.contentInner}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Account ── */}
        {activeSection === "account" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Personal Information</Text>

            <View style={styles.fieldRow}>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>First Name</Text>
                <TextInput
                  style={styles.input}
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="First name"
                  placeholderTextColor={theme.textLight}
                  autoCapitalize="words"
                />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.label}>Last Name</Text>
                <TextInput
                  style={styles.input}
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Last name"
                  placeholderTextColor={theme.textLight}
                  autoCapitalize="words"
                />
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                style={[styles.input, styles.disabledInput]}
                value={email}
                editable={false}
                placeholder="Email"
                placeholderTextColor={theme.textLight}
              />
              <Text style={styles.fieldHint}>Email cannot be changed here. Contact support.</Text>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Phone Number</Text>
              <TextInput
                style={styles.input}
                value={phone}
                onChangeText={setPhone}
                placeholder="09XX XXX XXXX"
                placeholderTextColor={theme.textLight}
                keyboardType="phone-pad"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Gender</Text>
              <View style={styles.chipRow}>
                {GENDERS.map((g) => (
                  <TouchableOpacity
                    key={g}
                    style={[styles.chip, gender === g && styles.chipActive]}
                    onPress={() => setGender(g === gender ? "" : g)}
                  >
                    <Text style={[styles.chipText, gender === g && styles.chipTextActive]}>
                      {g}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* ── Address ── */}
        {activeSection === "address" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Residential Address</Text>
            <Text style={styles.sectionDesc}>
              Your address is used to direct relief operations and locate your household during emergencies.
            </Text>

            <View style={styles.field}>
              <Text style={styles.label}>Street / House No. / Sitio</Text>
              <TextInput
                style={styles.input}
                value={address}
                onChangeText={setAddress}
                placeholder="e.g. 123 Sampaguita St."
                placeholderTextColor={theme.textLight}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Barangay</Text>
              <TextInput
                style={styles.input}
                value={barangay}
                onChangeText={setBarangay}
                placeholder="e.g. Barangay San Jose"
                placeholderTextColor={theme.textLight}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Municipality / City</Text>
              <TextInput
                style={styles.input}
                value={municipality}
                onChangeText={setMunicipality}
                placeholder="e.g. Legazpi City"
                placeholderTextColor={theme.textLight}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Province</Text>
              <TextInput
                style={styles.input}
                value={province}
                onChangeText={setProvince}
                placeholder="e.g. Albay"
                placeholderTextColor={theme.textLight}
                autoCapitalize="words"
              />
            </View>
          </View>
        )}

        {/* ── Health ── */}
        {activeSection === "health" && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Health Information</Text>
            <Text style={styles.sectionDesc}>
              This information helps site managers provide appropriate medical assistance during emergencies.
            </Text>

            <View style={styles.field}>
              <Text style={styles.label}>Blood Type</Text>
              <View style={styles.chipRow}>
                {BLOOD_TYPES.map((bt) => (
                  <TouchableOpacity
                    key={bt}
                    style={[styles.chip, bloodType === bt && styles.chipActive]}
                    onPress={() => setBloodType(bt === bloodType ? "" : bt)}
                  >
                    <Text style={[styles.chipText, bloodType === bt && styles.chipTextActive]}>
                      {bt}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Medical Conditions</Text>
              <TextInput
                style={[styles.input, styles.textArea]}
                value={medicalConditions}
                onChangeText={setMedicalConditions}
                placeholder="e.g. Diabetes, Hypertension, Asthma..."
                placeholderTextColor={theme.textLight}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Text style={styles.fieldHint}>
                Blood type and medical conditions are saved when you update your citizen registration.
              </Text>
            </View>
          </View>
        )}

        {error && (
          <View style={styles.errorBox}>
            <Ionicons name="warning" size={18} color="#C0392B" style={{ marginRight: 8 }} />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {success && (
          <View style={styles.successBox}>
            <Ionicons name="checkmark-circle" size={18} color="#2E7D32" style={{ marginRight: 8 }} />
            <Text style={styles.successText}>Profile saved successfully!</Text>
          </View>
        )}

        <Pressable
          style={[styles.saveButton, saving && { opacity: 0.6 }]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.saveButtonText}>CONFIRM CHANGES</Text>
          )}
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: theme.bg,
    paddingTop: Platform.OS === "android" ? 40 : 0,
  },
  header: {
    height: 64,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: theme.surface,
  },
  headerTitle: {
    ...fonts.black,
    fontSize: 18,
    color: theme.text,
  },
  saveHeaderButton: {
    paddingHorizontal: 12,
    minWidth: 52,
    alignItems: "center",
  },
  saveHeaderText: {
    ...fonts.black,
    fontSize: 16,
    color: theme.primary,
  },
  tabRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: theme.line,
    paddingHorizontal: 8,
  },
  tab: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
    paddingVertical: 14,
  },
  tabActive: {
    borderBottomWidth: 2,
    borderBottomColor: theme.primary,
  },
  tabLabel: {
    ...fonts.bold,
    fontSize: 13,
    color: theme.textLight,
  },
  tabLabelActive: {
    color: theme.primary,
  },
  content: { flex: 1 },
  contentInner: {
    padding: 24,
    paddingBottom: 60,
  },
  section: {
    gap: 20,
  },
  sectionTitle: {
    ...fonts.black,
    fontSize: 22,
    color: theme.text,
    letterSpacing: -0.5,
    marginBottom: 4,
  },
  sectionDesc: {
    ...fonts.medium,
    fontSize: 13,
    color: theme.textMuted,
    lineHeight: 20,
    marginBottom: 8,
  },
  field: {
    gap: 8,
  },
  fieldRow: {
    flexDirection: "row",
    gap: 12,
  },
  label: {
    ...fonts.bold,
    fontSize: 11,
    color: theme.textLight,
    textTransform: "uppercase",
    letterSpacing: 1.5,
    marginLeft: 4,
  },
  input: {
    backgroundColor: theme.surface,
    borderRadius: 20,
    paddingHorizontal: 20,
    height: 60,
    ...fonts.bold,
    fontSize: 16,
    color: theme.text,
    borderWidth: 1,
    borderColor: theme.line,
  },
  disabledInput: {
    opacity: 0.5,
  },
  textArea: {
    height: 110,
    paddingTop: 18,
    textAlignVertical: "top",
  },
  fieldHint: {
    ...fonts.medium,
    fontSize: 11,
    color: theme.textLight,
    marginLeft: 4,
    marginTop: 2,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    backgroundColor: theme.surface,
    borderWidth: 1,
    borderColor: theme.line,
  },
  chipActive: {
    backgroundColor: "#E8F5E9",
    borderColor: "#004D40",
  },
  chipText: {
    ...fonts.bold,
    fontSize: 14,
    color: theme.textMuted,
  },
  chipTextActive: {
    color: "#004D40",
  },
  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFF0F0",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#FFCCCC",
    marginTop: 8,
  },
  errorText: {
    ...fonts.bold,
    fontSize: 14,
    color: "#C0392B",
    flex: 1,
  },
  successBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F1F8E9",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#C8E6C9",
    marginTop: 8,
  },
  successText: {
    ...fonts.bold,
    fontSize: 14,
    color: "#2E7D32",
    flex: 1,
  },
  saveButton: {
    backgroundColor: theme.primary,
    height: 68,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 36,
    shadowColor: theme.primary,
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 8,
  },
  saveButtonText: {
    ...fonts.black,
    fontSize: 16,
    color: "#fff",
    textTransform: "uppercase",
    letterSpacing: 2,
  },
});
