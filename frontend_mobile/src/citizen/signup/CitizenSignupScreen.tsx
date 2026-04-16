import React, { useState, useRef } from "react";
import { Text, View, Pressable } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { MobileHeader } from "../../components/MobileShell";
import { Button, Input, Pill, Screen, SectionCard } from "../../components/UI";
import { citizenStyles } from "../shared";

export function CitizenSignupScreen({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: () => void;
}) {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const uploadBoxRef = useRef<View>(null);

  async function handlePickDocument() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png"],
      });

      if (result.assets && result.assets.length > 0) {
        setSelectedFileName(result.assets[0].name);
      }
    } catch (err) {
      console.error("Error picking document:", err);
    }
  }

  async function handleFileFromDrop(files: FileList) {
    if (files && files.length > 0) {
      const file = files[0];
      if (file.type === "image/jpeg" || file.type === "image/png") {
        setSelectedFileName(file.name);
      }
    }
  }

  function handleDragOver(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }

  function handleDragLeave(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }

  function handleDrop(e: any) {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    if (e.dataTransfer?.files) {
      handleFileFromDrop(e.dataTransfer.files);
    }
  }

  return (
    <Screen>
      <MobileHeader title="Citizen Registration" subtitle="Create account" onBack={onBack} />
      <SectionCard style={citizenStyles.greenHero}>
        <Pill label="Register" tone="warning" />
        <Text style={citizenStyles.heroTitle}>Create A Citizen Account</Text>
        <Text style={citizenStyles.heroBody}>
          Register to validate your identity and access alerts, preparedness, and
          relief tracking from mobile.
        </Text>
      </SectionCard>
      
      <SectionCard>
        <Input label="Create Username" placeholder="family.cluster.04" />
        <Input label="Create Password" placeholder="********" secureTextEntry />
        <View style={{ gap: 8 }}>
          <Text style={{ color: "#6b7469", fontSize: 11, fontWeight: "800", letterSpacing: 1.2, textTransform: "uppercase" }}>Upload Government ID</Text>
          <Pressable 
            ref={uploadBoxRef}
            onPress={handlePickDocument} 
            style={[
              citizenStyles.uploadBox,
              isDragging && {
                borderColor: "#1d7b3a",
                backgroundColor: "rgba(46, 125, 50, 0.06)",
                borderWidth: 2.5,
              }
            ]}
            onDragEnter={handleDragOver}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <Text style={{ fontSize: 28 }}>📄</Text>
            <View style={{ alignItems: "center", gap: 4 }}>
              <Text style={citizenStyles.uploadTitle}>
                {selectedFileName ? "File selected" : isDragging ? "Drop file here" : "Tap or drag to upload"}
              </Text>
              <Text style={citizenStyles.uploadHint}>JPG or PNG • Max 5MB</Text>
              {selectedFileName && (
                <Text style={{
                  marginTop: 4,
                  paddingHorizontal: 10,
                  paddingVertical: 6,
                  backgroundColor: "rgba(46, 125, 50, 0.12)",
                  borderRadius: 8,
                  color: "#1d7b3a",
                  fontSize: 12,
                  fontWeight: "700",
                  maxWidth: "90%",
                }}>
                  ✓ {selectedFileName}
                </Text>
              )}
            </View>
          </Pressable>
        </View>
        <Button label="Submit Registration" onPress={onSubmit} />
      </SectionCard>
    </Screen>
  );
}
