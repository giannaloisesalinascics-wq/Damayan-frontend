import React, { useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { CitizenBottomNav } from "../shared";

const familyImageUri =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuACb6xMcSZzNzJTsIvbQnebYQbMcbXWDuBeXFUicBSe1YEjdaoD0q6pfSt_O-v4ihIk-yiS5rs_3rmhCVRjor3VHvc0v5mZ4is348YC4b-Q_DeFuLCqvTsPadkPnRSmNNL0onPc7gzVkhgAfpA-SY9N3wPgeWQHvpVRWvCyvIZXf7qSrbHu23aIGQu459C7d2wvapdb6DOvrBaWk_d3ATAxlGuPhkdBBVk6Fi4_GAAxPdrczA2QiD5A6FL3MS3HBnkK0CZMdS-Mlr4n";

const relationshipOptions = ["Spouse", "Child", "Parent", "Sibling", "Other"];
const quickNeeds = [
  { id: "wheelchair", icon: "A", label: "Requires Wheelchair" },
  { id: "medication", icon: "M", label: "Needs Medication" },
  { id: "infant", icon: "I", label: "Infant Care" },
];

export function CitizenHouseholdMembersScreen({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  const [active] = useState<"home" | "relief" | "qr" | "profile">("home");
  const [relationship, setRelationship] = useState("Select relationship");
  const [selectedNeeds, setSelectedNeeds] = useState<string[]>([]);

  function toggleNeed(needId: string) {
    setSelectedNeeds((current) =>
      current.includes(needId)
        ? current.filter((id) => id !== needId)
        : [...current, needId],
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content}>
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Pressable onPress={onBack} style={styles.iconButton}>
            <Text style={styles.iconText}>{"<"}</Text>
          </Pressable>
          <Text style={styles.topTitle}>Citizen Registration</Text>
        </View>
        <Text style={styles.brand}>Verdant</Text>
      </View>

      <View style={styles.heroSection}>
        <View style={styles.stepBadge}>
          <Text style={styles.stepBadgeText}>Step 2 of 4</Text>
        </View>
        <Text style={styles.heroTitle}>
          Register for my{"\n"}
          <Text style={styles.heroAccent}>Household</Text>
        </Text>
        <Text style={styles.heroCopy}>
          Provide details for each person currently residing with you. This
          ensures appropriate aid distribution and medical prioritization during
          recovery efforts.
        </Text>
      </View>

      <View style={styles.memberCard}>
        <View style={styles.memberHeader}>
          <View>
            <Text style={styles.memberLabel}>Member 01</Text>
            <Text style={styles.memberTitle}>Household Representative</Text>
          </View>
          <Text style={styles.memberStatus}>OK</Text>
        </View>

        <View style={styles.memberGrid}>
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <View style={styles.staticField}>
              <Text style={styles.staticFieldText}>Samuel Aristha</Text>
            </View>
          </View>
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Relationship</Text>
            <View style={styles.staticField}>
              <Text style={styles.staticFieldText}>Self (Head)</Text>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.newMemberCard}>
        <View style={styles.newMemberHeader}>
          <View style={styles.memberNumber}>
            <Text style={styles.memberNumberText}>2</Text>
          </View>
          <Text style={styles.newMemberTitle}>New Family Member</Text>
        </View>

        <View style={styles.formGrid}>
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Full Legal Name</Text>
            <TextInput
              placeholder="e.g. Maria Aristha"
              placeholderTextColor="#7d867b"
              style={styles.inputField}
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Relationship</Text>
            <View style={styles.selectField}>
              <Text
                style={[
                  styles.selectText,
                  relationship === "Select relationship" && styles.placeholderText,
                ]}
              >
                {relationship}
              </Text>
            </View>
            <View style={styles.relationshipRow}>
              {relationshipOptions.map((option) => (
                <Pressable
                  key={option}
                  onPress={() => setRelationship(option)}
                  style={styles.relationshipChip}
                >
                  <Text style={styles.relationshipChipText}>{option}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Age</Text>
            <TextInput
              placeholder="Years"
              placeholderTextColor="#7d867b"
              keyboardType="number-pad"
              style={styles.inputField}
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>Specific Needs</Text>
            <View style={styles.inputWithIcon}>
              <TextInput
                placeholder="e.g. Requires Wheelchair"
                placeholderTextColor="#7d867b"
                style={styles.iconInputField}
              />
              <Text style={styles.inputIcon}>+</Text>
            </View>
          </View>
        </View>

        <View style={styles.quickSelectSection}>
          <Text style={styles.fieldLabel}>Quick Select Accessibility</Text>
          <View style={styles.quickSelectRow}>
            {quickNeeds.map((need) => {
              const selected = selectedNeeds.includes(need.id);
              return (
                <Pressable
                  key={need.id}
                  onPress={() => toggleNeed(need.id)}
                  style={[
                    styles.needChip,
                    selected && styles.needChipActive,
                  ]}
                >
                  <Text
                    style={[
                      styles.needChipIcon,
                      selected && styles.needChipIconActive,
                    ]}
                  >
                    {need.icon}
                  </Text>
                  <Text
                    style={[
                      styles.needChipText,
                      selected && styles.needChipTextActive,
                    ]}
                  >
                    {need.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>
      </View>

      <View style={styles.actionRow}>
        <Pressable style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonIcon}>+</Text>
          <Text style={styles.secondaryButtonText}>Add Another Member</Text>
        </Pressable>

        <Pressable onPress={onContinue} style={styles.primaryButton}>
          <Text style={styles.primaryButtonText}>Complete Household</Text>
          <Text style={styles.primaryButtonArrow}>-&gt;</Text>
        </Pressable>
      </View>

      <View style={styles.sidebarCard}>
        <Text style={styles.sidebarIcon}>i</Text>
        <Text style={styles.sidebarTitle}>Why this matters</Text>
        <Text style={styles.sidebarCopy}>
          Accurate household data helps emergency responders calculate food
          ratios, medical supply distribution, and specialized transport needs
          for your specific location.
        </Text>
      </View>

      <View style={styles.privacyCard}>
        <View style={styles.privacyHeader}>
          <Text style={styles.privacyIcon}>S</Text>
          <Text style={styles.privacyTitle}>Privacy Policy</Text>
        </View>
        <Text style={styles.privacyCopy}>
          Your family data is encrypted and only shared with verified
          humanitarian response organizations. We never share sensitive medical
          data with third parties.
        </Text>
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
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  topBarLeft: {
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
  },
  iconText: {
    color: "#0d631b",
    fontSize: 16,
    fontWeight: "900",
  },
  topTitle: {
    color: "#0d631b",
    fontSize: 18,
    fontWeight: "800",
  },
  brand: {
    color: "#0d631b",
    fontSize: 22,
    fontWeight: "900",
    letterSpacing: -0.8,
  },
  heroSection: {
    gap: 12,
  },
  stepBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#feb300",
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  stepBadgeText: {
    color: "#6a4800",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.2,
    textTransform: "uppercase",
  },
  heroTitle: {
    color: "#1a1c19",
    fontSize: 40,
    lineHeight: 42,
    fontWeight: "900",
    letterSpacing: -1.2,
  },
  heroAccent: {
    color: "#0d631b",
  },
  heroCopy: {
    color: "#40493d",
    fontSize: 16,
    lineHeight: 26,
    maxWidth: 520,
  },
  memberCard: {
    backgroundColor: "#f4f4ef",
    borderRadius: 18,
    padding: 24,
    gap: 20,
  },
  memberHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: 12,
  },
  memberLabel: {
    color: "#0d631b",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
    textTransform: "uppercase",
  },
  memberTitle: {
    color: "#1a1c19",
    fontSize: 22,
    fontWeight: "800",
    marginTop: 4,
  },
  memberStatus: {
    color: "#2e7d32",
    fontSize: 16,
    fontWeight: "900",
  },
  memberGrid: {
    gap: 16,
  },
  fieldWrap: {
    gap: 8,
  },
  fieldLabel: {
    color: "#40493d",
    fontSize: 10,
    fontWeight: "900",
    letterSpacing: 1.4,
    textTransform: "uppercase",
    paddingHorizontal: 2,
  },
  staticField: {
    minHeight: 54,
    borderRadius: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(191,202,186,0.28)",
    paddingHorizontal: 14,
    justifyContent: "center",
  },
  staticFieldText: {
    color: "#1a1c19",
    fontSize: 18,
    fontWeight: "600",
  },
  newMemberCard: {
    backgroundColor: "#e2e3de",
    borderRadius: 18,
    padding: 24,
    borderWidth: 2,
    borderStyle: "dashed",
    borderColor: "rgba(191,202,186,0.45)",
    gap: 22,
  },
  newMemberHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  memberNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#0d631b",
    alignItems: "center",
    justifyContent: "center",
  },
  memberNumberText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },
  newMemberTitle: {
    color: "#1a1c19",
    fontSize: 22,
    fontWeight: "800",
  },
  formGrid: {
    gap: 18,
  },
  inputField: {
    minHeight: 56,
    backgroundColor: "#f4f4ef",
    borderBottomWidth: 2,
    borderBottomColor: "rgba(191,202,186,0.28)",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 16,
    color: "#1a1c19",
    fontSize: 16,
  },
  selectField: {
    minHeight: 56,
    backgroundColor: "#f4f4ef",
    borderBottomWidth: 2,
    borderBottomColor: "rgba(191,202,186,0.28)",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 16,
  },
  selectText: {
    color: "#1a1c19",
    fontSize: 16,
  },
  placeholderText: {
    color: "#7d867b",
  },
  relationshipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  relationshipChip: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "rgba(191,202,186,0.35)",
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  relationshipChipText: {
    color: "#40493d",
    fontSize: 12,
    fontWeight: "600",
  },
  inputWithIcon: {
    minHeight: 56,
    backgroundColor: "#f4f4ef",
    borderBottomWidth: 2,
    borderBottomColor: "rgba(191,202,186,0.28)",
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    paddingHorizontal: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  iconInputField: {
    flex: 1,
    color: "#1a1c19",
    fontSize: 16,
  },
  inputIcon: {
    color: "rgba(64,73,61,0.5)",
    fontSize: 18,
    fontWeight: "800",
  },
  quickSelectSection: {
    gap: 12,
    paddingTop: 6,
  },
  quickSelectRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  needChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderWidth: 1,
    borderColor: "rgba(191,202,186,0.4)",
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: "#fafaf5",
  },
  needChipActive: {
    backgroundColor: "#0d631b",
    borderColor: "#0d631b",
  },
  needChipIcon: {
    color: "#1a1c19",
    fontSize: 14,
    fontWeight: "900",
  },
  needChipIconActive: {
    color: "#ffffff",
  },
  needChipText: {
    color: "#1a1c19",
    fontSize: 13,
    fontWeight: "600",
  },
  needChipTextActive: {
    color: "#ffffff",
  },
  actionRow: {
    gap: 12,
    paddingTop: 4,
  },
  secondaryButton: {
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: "#e2e3de",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
  },
  secondaryButtonIcon: {
    color: "#1a1c19",
    fontSize: 18,
    fontWeight: "900",
  },
  secondaryButtonText: {
    color: "#1a1c19",
    fontSize: 16,
    fontWeight: "800",
  },
  primaryButton: {
    minHeight: 56,
    borderRadius: 16,
    backgroundColor: "#0d631b",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    shadowColor: "#0d631b",
    shadowOpacity: 0.18,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  primaryButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  primaryButtonArrow: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "900",
  },
  sidebarCard: {
    backgroundColor: "rgba(46,125,50,0.1)",
    borderRadius: 18,
    padding: 20,
    borderWidth: 1,
    borderColor: "rgba(46,125,50,0.12)",
    gap: 10,
  },
  sidebarIcon: {
    color: "#0d631b",
    fontSize: 18,
    fontWeight: "900",
  },
  sidebarTitle: {
    color: "#0d631b",
    fontSize: 18,
    fontWeight: "800",
  },
  sidebarCopy: {
    color: "#40493d",
    fontSize: 13,
    lineHeight: 21,
  },
  imageCard: {
    height: 256,
    borderRadius: 18,
    overflow: "hidden",
    position: "relative",
  },
  imageCardPhoto: {
    width: "100%",
    height: "100%",
  },
  imageCardOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(13,99,27,0.42)",
    justifyContent: "flex-end",
    padding: 20,
  },
  imageCardQuote: {
    color: "#ffffff",
    fontSize: 14,
    lineHeight: 20,
    fontWeight: "600",
  },
  privacyCard: {
    backgroundColor: "#e8e8e4",
    borderRadius: 18,
    padding: 20,
    gap: 10,
  },
  privacyHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  privacyIcon: {
    color: "#7e5700",
    fontSize: 16,
    fontWeight: "900",
  },
  privacyTitle: {
    color: "#40493d",
    fontSize: 18,
    fontWeight: "800",
  },
  privacyCopy: {
    color: "rgba(64,73,61,0.78)",
    fontSize: 12,
    lineHeight: 20,
  },
});
