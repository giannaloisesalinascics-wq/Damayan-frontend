import React, { useState } from "react";
import { Pressable, ScrollView, Text, TextInput, View, StyleSheet, TouchableOpacity, Modal, KeyboardAvoidingView, Platform } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { theme, fonts, lightTheme, darkTheme } from "../../../theme";

interface Member {
  id: string;
  name: string;
  age: string;
  relationship: string;
  isRegistered: boolean;
}

export function CitizenHouseholdRegistrationScreen({
  onBack,
  onContinue,
  isDarkMode,
}: {
  onBack: () => void;
  onContinue: () => void;
  isDarkMode?: boolean;
}) {
  const currentTheme = isDarkMode ? darkTheme : lightTheme;
  const localStyles = getStyles(currentTheme);

  const [members, setMembers] = useState<Member[]>([
    { id: "1", name: "Elena Villacruz", age: "34", relationship: "Head of Household", isRegistered: true },
    { id: "2", name: "Marco Villacruz", age: "36", relationship: "Spouse", isRegistered: false },
    { id: "3", name: "Sofia Villacruz", age: "8", relationship: "Daughter", isRegistered: false },
  ]);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [newRelationship, setNewRelationship] = useState("");

  const handleAddMember = () => {
    if (newName && newAge && newRelationship) {
      const newMember: Member = {
        id: Math.random().toString(36).substr(2, 9),
        name: newName,
        age: newAge,
        relationship: newRelationship,
        isRegistered: false,
      };
      setMembers([...members, newMember]);
      setNewName("");
      setNewAge("");
      setNewRelationship("");
      setIsAddModalOpen(false);
    }
  };

  const [hasAnimals, setHasAnimals] = useState(false);

  return (
    <View style={{ flex: 1 }}>
      <ScrollView style={localStyles.screen} contentContainerStyle={localStyles.content} showsVerticalScrollIndicator={false}>
        {/* Top Bar */}
        <View style={localStyles.topBar}>
          <TouchableOpacity onPress={onBack} style={localStyles.iconButton}>
            <Ionicons name="arrow-back" size={24} color={currentTheme.text} />
          </TouchableOpacity>
          <Text style={localStyles.topTitle}>Household Registry</Text>
          <View style={{ width: 44 }} />
        </View>

        {/* Hero Section */}
        <View style={localStyles.heroSection}>
          <View style={localStyles.stepBadge}>
             <Text style={localStyles.stepText}>UNIT REGISTRATION • STEP 01</Text>
          </View>
          <Text style={localStyles.heroTitle}>Household & Family Units</Text>
          <Text style={localStyles.heroSub}>
            Register your whole household for unified aid distribution, emergency tracking, and rapid family reunification.
          </Text>
        </View>

        {/* Family Members List */}
        <View style={localStyles.section}>
           <View style={localStyles.sectionHeaderRow}>
              <Text style={localStyles.sectionTitle}>Family Members</Text>
              <TouchableOpacity 
                style={localStyles.addMemberBtn}
                onPress={() => setIsAddModalOpen(true)}
              >
                 <Ionicons name="add" size={16} color="#fff" />
                 <Text style={localStyles.addMemberText}>ADD MEMBER</Text>
              </TouchableOpacity>
           </View>

           <View style={localStyles.memberList}>
              {members.map((member) => (
                <View key={member.id} style={localStyles.memberCard}>
                   <View style={localStyles.memberIconBox}>
                      <Ionicons name="person" size={20} color="#2E7D32" />
                   </View>
                   <View style={{ flex: 1 }}>
                      <Text style={localStyles.memberName}>{member.name}</Text>
                      <Text style={localStyles.memberSub}>{member.relationship} • Age {member.age}</Text>
                   </View>
                   <View style={[localStyles.statusBadge, { backgroundColor: member.isRegistered ? "#E8F5E9" : "#FFF3E0" }]}>
                      <Text style={[localStyles.statusText, { color: member.isRegistered ? "#2E7D32" : "#E65100" }]}>
                         {member.isRegistered ? "VERIFIED" : "PENDING"}
                      </Text>
                   </View>
                   <TouchableOpacity 
                     style={localStyles.editBtn}
                     onPress={() => setMembers(members.filter(m => m.id !== member.id))}
                   >
                      <Ionicons name="trash-outline" size={18} color={theme.danger} />
                   </TouchableOpacity>
                </View>
              ))}
           </View>
        </View>

        {/* Animal Registry Toggle */}
        <View style={localStyles.animalSection}>
           <View style={localStyles.animalCard}>
              <View style={localStyles.animalIconBox}>
                 <Ionicons name="paw" size={24} color="#8D6E63" />
              </View>
              <View style={{ flex: 1 }}>
                 <Text style={localStyles.animalTitle}>Animal Registry</Text>
                 <Text style={localStyles.animalSub}>Do you have household pets or livestock?</Text>
              </View>
              <Pressable 
                onPress={() => setHasAnimals(!hasAnimals)}
                style={[localStyles.toggleOuter, hasAnimals && localStyles.toggleOuterActive]}
              >
                 <View style={[localStyles.toggleInner, hasAnimals && localStyles.toggleInnerActive]} />
              </Pressable>
           </View>
        </View>

        {/* Action Footer */}
        <TouchableOpacity 
          style={localStyles.submitBtn}
          onPress={onContinue}
        >
           <Text style={localStyles.submitBtnText}>CONTINUE TO VALIDATION</Text>
           <Ionicons name="arrow-forward" size={20} color="#fff" />
        </TouchableOpacity>
      </ScrollView>

      {/* Add Member Modal */}
      <Modal visible={isAddModalOpen} transparent animationType="slide">
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={localStyles.modalOverlay}
        >
          <View style={localStyles.modalContent}>
            <View style={localStyles.modalHeader}>
              <Text style={localStyles.modalTitleText}>Add Family Member</Text>
              <TouchableOpacity onPress={() => setIsAddModalOpen(false)}>
                <Ionicons name="close" size={24} color={currentTheme.textLight} />
              </TouchableOpacity>
            </View>

            <View style={localStyles.inputGroup}>
              <Text style={localStyles.inputLabel}>Full Name</Text>
              <TextInput 
                style={localStyles.input}
                placeholder="Enter name"
                placeholderTextColor={currentTheme.textLight}
                value={newName}
                onChangeText={setNewName}
              />
            </View>

            <View style={{ flexDirection: "row", gap: 16 }}>
              <View style={[localStyles.inputGroup, { flex: 1 }]}>
                <Text style={localStyles.inputLabel}>Age</Text>
                <TextInput 
                  style={localStyles.input}
                  placeholder="Age"
                  placeholderTextColor={currentTheme.textLight}
                  keyboardType="numeric"
                  value={newAge}
                  onChangeText={setNewAge}
                />
              </View>
              <View style={[localStyles.inputGroup, { flex: 2 }]}>
                <Text style={localStyles.inputLabel}>Relationship</Text>
                <TextInput 
                  style={localStyles.input}
                  placeholder="e.g. Son, Parent"
                  placeholderTextColor={currentTheme.textLight}
                  value={newRelationship}
                  onChangeText={setNewRelationship}
                />
              </View>
            </View>

            <TouchableOpacity 
              style={[localStyles.modalAddBtn, (!newName || !newAge || !newRelationship) && { opacity: 0.5 }]}
              onPress={handleAddMember}
              disabled={!newName || !newAge || !newRelationship}
            >
              <Text style={localStyles.modalAddBtnText}>REGISTER MEMBER</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </View>
  );
}

const getStyles = (theme: any) => StyleSheet.create({
  screen: { flex: 1, backgroundColor: theme.bg },
  content: { padding: 24, paddingBottom: 120 },
  
  topBar: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32 },
  iconButton: { width: 44, height: 44, borderRadius: 12, backgroundColor: theme.surfaceAlt, alignItems: "center", justifyContent: "center", borderWidth: 1, borderColor: theme.line },
  topTitle: { fontSize: 16, ...fonts.black, color: theme.text },

  heroSection: { backgroundColor: "#2E7D32", borderRadius: 40, padding: 32, marginBottom: 32 },
  stepBadge: { backgroundColor: "rgba(0,0,0,0.2)", alignSelf: "flex-start", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginBottom: 16 },
  stepText: { color: "#fff", fontSize: 9, ...fonts.black, letterSpacing: 1 },
  heroTitle: { fontSize: 32, ...fonts.black, color: "#fff", letterSpacing: -1 },
  heroSub: { fontSize: 14, ...fonts.medium, color: "rgba(255,255,255,0.8)", marginTop: 12, lineHeight: 20 },

  section: { marginBottom: 32 },
  sectionHeaderRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 20 },
  sectionTitle: { fontSize: 22, ...fonts.black, color: theme.text },
  addMemberBtn: { backgroundColor: "#2E7D32", flexDirection: "row", alignItems: "center", paddingHorizontal: 12, paddingVertical: 8, borderRadius: 12, gap: 6 },
  addMemberText: { color: "#fff", fontSize: 10, ...fonts.black, letterSpacing: 0.5 },

  memberList: { gap: 12 },
  memberCard: { flexDirection: "row", alignItems: "center", backgroundColor: theme.surface, borderRadius: 24, padding: 16, borderWidth: 1, borderColor: theme.line, gap: 12 },
  memberIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: "#F1F8E9", alignItems: "center", justifyContent: "center" },
  memberName: { fontSize: 15, ...fonts.black, color: theme.text },
  memberSub: { fontSize: 11, ...fonts.medium, color: theme.textMuted, marginTop: 2 },
  statusBadge: { paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  statusText: { fontSize: 8, ...fonts.black, letterSpacing: 0.5 },
  editBtn: { padding: 8 },

  animalSection: { marginBottom: 40 },
  animalCard: { flexDirection: "row", alignItems: "center", backgroundColor: theme.surface, borderRadius: 32, padding: 24, borderWidth: 1, borderColor: theme.line, gap: 16 },
  animalIconBox: { width: 56, height: 56, borderRadius: 16, backgroundColor: "#EFEBE9", alignItems: "center", justifyContent: "center" },
  animalTitle: { fontSize: 18, ...fonts.black, color: theme.text },
  animalSub: { fontSize: 12, ...fonts.medium, color: theme.textMuted, marginTop: 2 },
  toggleOuter: { width: 48, height: 28, borderRadius: 14, backgroundColor: theme.line, padding: 4 },
  toggleOuterActive: { backgroundColor: "#8D6E63" },
  toggleInner: { width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff" },
  toggleInnerActive: { marginLeft: 20 },

  submitBtn: { backgroundColor: "#1A1C1A", height: 72, borderRadius: 24, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 12, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 20 },
  submitBtnText: { color: "#fff", fontSize: 14, ...fonts.black, letterSpacing: 1.5 },

  // Modal Styles
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "flex-end" },
  modalContent: { backgroundColor: theme.surface, borderTopLeftRadius: 40, borderTopRightRadius: 40, padding: 32, paddingBottom: 48 },
  modalHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 32 },
  modalTitleText: { fontSize: 24, ...fonts.black, color: theme.text },
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 12, ...fonts.bold, color: theme.textLight, marginBottom: 8, textTransform: "uppercase", letterSpacing: 1 },
  input: { backgroundColor: theme.surfaceAlt, borderRadius: 16, height: 56, paddingHorizontal: 20, ...fonts.medium, color: theme.text, borderWidth: 1, borderColor: theme.line },
  modalAddBtn: { backgroundColor: "#2E7D32", height: 64, borderRadius: 20, alignItems: "center", justifyContent: "center", marginTop: 12 },
  modalAddBtnText: { color: "#fff", fontSize: 14, ...fonts.black, letterSpacing: 1 },
});
