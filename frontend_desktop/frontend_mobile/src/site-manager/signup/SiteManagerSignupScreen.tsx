import React, { useState, useRef } from "react";
import { Text, View, Pressable } from "react-native";
import * as DocumentPicker from "expo-document-picker";
import { MobileHeader } from "../../components/MobileShell";
import { Button, Input, Pill, Screen, SectionCard } from "../../components/UI";
import { siteManagerStyles } from "../shared";
import { theme } from "../../theme";

export function SiteManagerSignupScreen({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: () => void;
}) {
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const uploadBoxRef = useRef<View>(null);

  const validateAndSetFile = (file: { name: string; type?: string }) => {
    const fileName = file.name.toLowerCase();
    const isAllowedType = file.type === "image/jpeg" || file.type === "image/png";
    const isAllowedExt = fileName.endsWith(".jpg") || fileName.endsWith(".jpeg") || fileName.endsWith(".png");
    
    if (isAllowedType || isAllowedExt) {
      setSelectedFileName(file.name);
      return true;
    } else {
      alert("Invalid file type. Please upload a JPG or PNG image.");
      return false;
    }
  };

  async function handlePickDocument() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: ["image/jpeg", "image/png"],
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        validateAndSetFile(result.assets[0]);
      }
    } catch (err) {
      console.error("Error picking document:", err);
    }
  }

  // Improved for Web: Attach native event listeners to prevent browser defaults
  React.useEffect(() => {
    const el = uploadBoxRef.current as any;
    if (!el || typeof window === "undefined") return;

    // React Native for Web refs usually point to the DOM node
    const node = el.getScrollableNode ? el.getScrollableNode() : el;

    const onDragOver = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(true);
    };

    const onDragLeave = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
    };

    const onDrop = (e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragging(false);
      if (e.dataTransfer?.files) {
        handleFileFromDrop(e.dataTransfer.files);
      }
    };

    node.addEventListener("dragover", onDragOver);
    node.addEventListener("dragenter", onDragOver);
    node.addEventListener("dragleave", onDragLeave);
    node.addEventListener("drop", onDrop);

    return () => {
      node.removeEventListener("dragover", onDragOver);
      node.removeEventListener("dragenter", onDragOver);
      node.removeEventListener("dragleave", onDragLeave);
      node.removeEventListener("drop", onDrop);
    };
  }, []);

  function handleFileFromDrop(files: FileList) {
    if (files && files.length > 0) {
      validateAndSetFile(files[0]);
    }
  }

  return (
    <Screen>
      <MobileHeader title="Site Manager Registration" subtitle="Create account" onBack={onBack} />
      <SectionCard style={siteManagerStyles.primaryHero}>
        <Pill label="Register" tone="secondary" />
        <Text style={siteManagerStyles.heroTitle}>Create A Site Manager Account</Text>
        <Text style={siteManagerStyles.heroText}>
          Register to validate your credentials to access site operations, supplies tracking, and rescue logs.
        </Text>
      </SectionCard>
      
      <SectionCard>
        <View style={{ gap: 20 }}>
          <View style={{ gap: 16 }}>
            <Input label="FULL NAME" placeholder="e.g. Juan De La Cruz" />
            <Input label="CREATE USERNAME" placeholder="site.manager.01" />
            <Input label="PASSWORD" placeholder="********" secureTextEntry />
          </View>
          
          <View style={{ gap: 8 }}>
            <Text style={{ color: theme.textMuted, fontSize: 13, fontWeight: "800", letterSpacing: 1.2, textTransform: "uppercase" }}>
              UPLOAD GOVERNMENT ID
            </Text>
            <View 
              ref={uploadBoxRef}
              style={[
                {
                  minHeight: 140,
                  borderRadius: 16,
                  borderWidth: 2,
                  borderColor: theme.tertiary,
                  borderStyle: "dashed",
                  backgroundColor: theme.surfaceSoft,
                  overflow: "hidden",
                },
                isDragging && {
                  borderColor: theme.primary,
                  backgroundColor: theme.primaryLight,
                  borderWidth: 2.5,
                }
              ]}
            >
              <Pressable 
                onPress={handlePickDocument} 
                style={{ 
                  flex: 1, 
                  alignItems: "center", 
                  justifyContent: "center", 
                  padding: 20,
                  gap: 8,
                }}
              >
                <Text style={{ fontSize: 36, opacity: 0.8 }}>📄</Text>
                <View style={{ alignItems: "center", gap: 6, marginTop: 4 }}>
                  <Text style={{ color: theme.primary, fontWeight: "900", fontSize: 16, letterSpacing: 0.5 }}>
                    {selectedFileName ? "FILE SELECTED" : isDragging ? "DROP FILE HERE" : "UPLOAD FILE OR DRAG HERE"}
                  </Text>
                  
                  {!selectedFileName ? (
                    <Text style={{ color: theme.textLight, fontSize: 12, fontWeight: "600", textTransform: "uppercase" }}>
                      JPG OR PNG • MAX 5MB
                    </Text>
                  ) : (
                    <View style={{ alignItems: "center", gap: 8 }}>
                      <Text style={{ color: theme.textLight, fontSize: 13, fontWeight: "700", textTransform: "uppercase", letterSpacing: 0.8 }}>
                        {selectedFileName}
                      </Text>
                      <View style={{
                        paddingHorizontal: 14,
                        paddingVertical: 6,
                        backgroundColor: "#ecfdf5",
                        borderRadius: 12,
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 6,
                        borderWidth: 1,
                        borderColor: "#d1fae5",
                      }}>
                        <Text style={{ color: "#059669", fontSize: 13, fontWeight: "800" }}>✓ Verified</Text>
                      </View>
                    </View>
                  )}
                </View>
              </Pressable>
            </View>
          </View>
          
          <Button label="Submit Registration" onPress={onSubmit} tone="primary" />

          <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
            <Text style={{ color: theme.textMuted, fontSize: 14, fontWeight: "400" }}>
              Already have an account?{" "}
            </Text>
            <Pressable onPress={onBack}>
              <Text style={{ color: theme.primary, fontSize: 14, fontWeight: "800" }}>
                Log in here.
              </Text>
            </Pressable>
          </View>
        </View>
      </SectionCard>
    </Screen>
  );
}
