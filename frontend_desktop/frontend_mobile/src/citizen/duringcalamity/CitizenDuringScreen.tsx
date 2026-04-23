import React, { useState, useRef, useEffect } from "react";
import {
  Animated,
  Alert,
  Image,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { CitizenBottomNav } from "../shared";
import { theme, fonts } from "../../theme";
import { styles } from "./CitizenDuringScreen.styles";

// ─── Types ────────────────────────────────────────────────────────────────────
type DuringStep =
  | "rescue_decision"
  | "report_incident"
  | "self_evacuate"
  | "internet_decision"
  | "upload_photo"
  | "sms_code"
  | "delivery_confirmation"
  | "safe_zone_map"
  | "navigate_evacuation"
  | "arrive_site"
  | "credential_check"
  | "logged_in";

const STEP_ORDER: DuringStep[] = [
  "rescue_decision",
  "report_incident",   // or self_evacuate
  "internet_decision",
  "upload_photo",      // or sms_code
  "delivery_confirmation",
  "safe_zone_map",
  "navigate_evacuation",
  "arrive_site",
  "credential_check",
  "logged_in",
];

const QR_URI =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCrX9Nqu19-hAhpO8rM-9DherTik7ptpsbnrQch9rvtbUQAhyhNf6D82iXcimlfey1XA3K9KgtUzbPxxm-S6NOSLrPT2QbRg82ettvfR239M-w2yBxNuNvAzeNmsH8Z9eMuTpCZPxC00vxBqfNGsnYaX-q-X5i8K3GQ5NzGpBF0W3QdP16xUgAAoybfEuVWOiYqtxjrzlKjuijxK_qGRfvSnb2JDR-r7rMdsKlZxORTjU73kQrDnzs5PeBpIPiP-k6oUhY45_7jXYxy";

// ─── Pulsating Dot ────────────────────────────────────────────────────────────
function PulsatingDot({ color = theme.danger }: { color?: string }) {
  const scale = useRef(new Animated.Value(1)).current;
  const opacity = useRef(new Animated.Value(0.7)).current;

  useEffect(() => {
    Animated.loop(
      Animated.parallel([
        Animated.sequence([
          Animated.timing(scale, { toValue: 3.5, duration: 1400, useNativeDriver: true }),
          Animated.timing(scale, { toValue: 1, duration: 0, useNativeDriver: true }),
        ]),
        Animated.sequence([
          Animated.timing(opacity, { toValue: 0, duration: 1400, useNativeDriver: true }),
          Animated.timing(opacity, { toValue: 0.7, duration: 0, useNativeDriver: true }),
        ]),
      ])
    ).start();
  }, []);

  return (
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <Animated.View
        style={[styles.radarRing, { backgroundColor: color, transform: [{ scale }], opacity }]}
      />
      <View style={[styles.coreDot, { backgroundColor: color }]} />
    </View>
  );
}

// ─── Progress Bar ─────────────────────────────────────────────────────────────
function ProgressBar({ step }: { step: number }) {
  const progress = Math.min((step / 9) * 100, 100);
  return (
    <View style={styles.progressWrap}>
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </View>
  );
}

// ─── Main Screen ──────────────────────────────────────────────────────────────
export function CitizenDuringScreen({ onBack }: { onBack: () => void }) {
  const [step, setStep] = useState<DuringStep>("rescue_decision");
  const [rescueNeeded, setRescueNeeded] = useState<boolean | null>(null);
  const [internetAvailable, setInternetAvailable] = useState<boolean | null>(null);
  const [isIndividual, setIsIndividual] = useState<boolean | null>(null);
  const [photoUri, setPhotoUri] = useState<string | null>(null);
  const [active] = useState<"home" | "relief" | "qr" | "profile">("relief");

  async function handlePickPhoto() {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow access to your photo library to attach evidence.");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  async function handleTakePhoto() {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permission required", "Please allow camera access to take a photo.");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.8,
    });
    if (!result.canceled && result.assets.length > 0) {
      setPhotoUri(result.assets[0].uri);
    }
  }

  const stepIndex = STEP_ORDER.indexOf(step);

  function go(next: DuringStep) {
    setStep(next);
  }

  return (
    <View
      style={[
        styles.shell,
        Platform.OS === "web" ? ({ height: "100vh" } as any) : null,
      ]}
    >
      {/* Top Bar */}
      <View style={styles.topBar}>
        <Pressable style={styles.backButton} onPress={onBack}>
          <Ionicons name="arrow-back" size={22} color={theme.text} />
        </Pressable>
        <View style={styles.topBarCenter}>
          <Text style={[styles.topBarTitle, fonts.black]}>DAMAYAN</Text>
          <Text style={[styles.topBarPhase, fonts.bold]}>During Calamity</Text>
        </View>
        <View style={styles.alertBadge}>
          <Ionicons name="warning" size={22} color={theme.danger} />
        </View>
      </View>

      {/* Progress */}
      <ProgressBar step={stepIndex} />

      <ScrollView
        style={[
          styles.scrollView,
          Platform.OS === "web"
            ? ({ maxHeight: "100%", overflowY: "scroll" } as any)
            : null,
        ]}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator
      >

        {/* ── STEP 0: Rescue Decision ───────────────────────────────────────── */}
        {step === "rescue_decision" && (
          <View style={styles.decisionCard}>
            <View style={[styles.decisionIconWrap, { backgroundColor: "rgba(186,26,26,0.1)" }]}>
              <Ionicons name="alert-circle" size={36} color={theme.danger} />
            </View>
            <Text style={[styles.decisionLabel, { color: theme.danger }, fonts.black]}>
              SITUATION ASSESSMENT
            </Text>
            <Text style={[styles.decisionTitle, { color: theme.text }, fonts.black]}>
              Are you in need of{"  \n"}Immediate Rescue?
            </Text>
            <Text style={[styles.decisionCopy, fonts.regular]}>
              Select your current situation so we can route you to the correct emergency protocol immediately.
            </Text>
            <View style={styles.decisionOptions}>
              <Pressable
                style={[styles.optionButtonYes, { backgroundColor: theme.danger, shadowColor: theme.danger }]}
                onPress={() => { setRescueNeeded(true); go("report_incident"); }}
              >
                <Ionicons name="hand-left" size={22} color="#fff" />
                <Text style={[styles.optionButtonText, fonts.black]}>YES — I need rescue</Text>
              </Pressable>
              <Pressable
                style={styles.optionButtonNo}
                onPress={() => { setRescueNeeded(false); go("self_evacuate"); }}
              >
                <Ionicons name="walk" size={22} color={theme.text} />
                <Text style={[styles.optionButtonTextDark, fonts.bold]}>NO — I can self evacuate</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* ── STEP 1a: Report Incident ──────────────────────────────────────── */}
        {step === "report_incident" && (
          <View style={styles.stepCard}>
            <View style={[styles.stepIconWrap, { backgroundColor: "rgba(186,26,26,0.1)" }]}>
              <Ionicons name="megaphone" size={34} color={theme.danger} />
            </View>
            <Text style={[styles.stepTag, { color: theme.danger }, fonts.black]}>RESCUE REQUESTED</Text>
            <Text style={[styles.stepTitle, fonts.black]}>Report Your Incident</Text>
            <Text style={[styles.stepCopy, fonts.regular]}>
              Provide your current situation so dispatchers can prioritize and route a rescue team to you.
            </Text>

            <View style={[styles.infoRow, { borderLeftColor: theme.danger }]}>
              <Ionicons name="location" size={22} color={theme.danger} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoRowText, fonts.bold]}>Current Location Detected</Text>
                <Text style={[styles.infoRowSub, fonts.regular]}>Brgy. 102, District 4 — Zone Red</Text>
              </View>
              <Ionicons name="checkmark-circle" size={18} color={theme.primary} />
            </View>

            <View style={[styles.infoRow, { borderLeftColor: theme.warning }]}>
              <Ionicons name="people" size={22} color={theme.warning} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoRowText, fonts.bold]}>Persons Affected: 4</Text>
                <Text style={[styles.infoRowSub, fonts.regular]}>2 adults, 1 child, 1 senior</Text>
              </View>
            </View>

            <View style={[styles.infoRow, { borderLeftColor: theme.info }]}>
              <Ionicons name="medical" size={22} color={theme.info} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoRowText, fonts.bold]}>Medical Needs Flagged</Text>
                <Text style={[styles.infoRowSub, fonts.regular]}>Senior requires medication assistance</Text>
              </View>
            </View>

            {/* Photo Upload */}
            {photoUri ? (
              <View style={{ borderRadius: 20, overflow: "hidden", position: "relative" }}>
                <Image
                  source={{ uri: photoUri }}
                  style={{ width: "100%", height: 200, borderRadius: 20 }}
                  resizeMode="cover"
                />
                <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.18)", borderRadius: 20 }} />
                <Pressable
                  onPress={() => setPhotoUri(null)}
                  style={{ position: "absolute", top: 12, right: 12, backgroundColor: "rgba(0,0,0,0.6)", width: 36, height: 36, borderRadius: 18, alignItems: "center", justifyContent: "center" }}
                >
                  <Ionicons name="close" size={18} color="#fff" />
                </Pressable>
                <View style={{ position: "absolute", bottom: 12, left: 12, backgroundColor: "rgba(46,125,50,0.9)", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <Ionicons name="checkmark-circle" size={14} color="#fff" />
                  <Text style={{ color: "#fff", fontSize: 12, fontWeight: "700" }}>Photo Attached</Text>
                </View>
              </View>
            ) : (
              <View style={{ gap: 10 }}>
                <Text style={[{ fontSize: 11, fontWeight: "800", textTransform: "uppercase", letterSpacing: 1.2, color: theme.textMuted }, fonts.black]}>
                  Attach Photo Evidence
                </Text>
                <View style={{ flexDirection: "row", gap: 10 }}>
                  <Pressable
                    onPress={handleTakePhoto}
                    style={{ flex: 1, height: 90, borderRadius: 16, borderWidth: 1.5, borderColor: "rgba(112,122,108,0.2)", borderStyle: "dashed", backgroundColor: "#f9f9f6", alignItems: "center", justifyContent: "center", gap: 6 }}
                  >
                    <Ionicons name="camera" size={26} color={theme.primary} />
                    <Text style={{ fontSize: 13, fontWeight: "700", color: theme.primary }}>Take Photo</Text>
                  </Pressable>
                  <Pressable
                    onPress={handlePickPhoto}
                    style={{ flex: 1, height: 90, borderRadius: 16, borderWidth: 1.5, borderColor: "rgba(112,122,108,0.2)", borderStyle: "dashed", backgroundColor: "#f9f9f6", alignItems: "center", justifyContent: "center", gap: 6 }}
                  >
                    <Ionicons name="image" size={26} color={theme.info} />
                    <Text style={{ fontSize: 13, fontWeight: "700", color: theme.info }}>From Gallery</Text>
                  </Pressable>
                </View>
              </View>
            )}

            <View style={{ gap: 10 }}>
              <Pressable
                style={[styles.ctaButton, { backgroundColor: theme.danger, shadowColor: theme.danger }]}
                onPress={() => go("internet_decision")}
              >
                <Text style={[styles.ctaButtonText, fonts.black]}>Submit Incident Report</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </Pressable>
              <View style={{ alignItems: "center", paddingVertical: 6 }}>
                <Text style={[styles.ghostButtonText, fonts.regular]}>
                  🚨 A dispatcher will be notified immediately
                </Text>
              </View>
            </View>
          </View>
        )}

        {/* ── STEP 1b: Self Evacuate ────────────────────────────────────────── */}
        {step === "self_evacuate" && (
          <View style={styles.stepCard}>
            <View style={[styles.stepIconWrap, { backgroundColor: "rgba(46,125,50,0.1)" }]}>
              <Ionicons name="walk" size={34} color={theme.primary} />
            </View>
            <Text style={[styles.stepTag, { color: theme.primary }, fonts.black]}>SELF EVACUATION</Text>
            <Text style={[styles.stepTitle, fonts.black]}>Evacuate to Safety</Text>
            <Text style={[styles.stepCopy, fonts.regular]}>
              Follow the evacuation route to the nearest designated safe zone. Bring your Digital ID for check-in.
            </Text>

            <View style={[styles.infoRow, { borderLeftColor: theme.primary }]}>
              <Ionicons name="navigate" size={22} color={theme.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoRowText, fonts.bold]}>Nearest Safe Zone</Text>
                <Text style={[styles.infoRowSub, fonts.regular]}>Brgy. Hall — 1.2 km northeast</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={theme.primary} />
            </View>

            <View style={[styles.infoRow, { borderLeftColor: theme.warning }]}>
              <Ionicons name="time" size={22} color={theme.warning} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoRowText, fonts.bold]}>Estimated Travel</Text>
                <Text style={[styles.infoRowSub, fonts.regular]}>~18 min on foot via safe route</Text>
              </View>
            </View>

            <View style={styles.mapMock}>
              <PulsatingDot color={theme.primary} />
              <View style={styles.mapEtaBadge}>
                <Ionicons name="footsteps" size={14} color={theme.primary} />
                <Text style={[styles.mapEtaText, fonts.bold]}>1.2 km away</Text>
              </View>
            </View>

            <Pressable
              style={[styles.ctaButton, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
              onPress={() => go("internet_decision")}
            >
              <Text style={[styles.ctaButtonText, fonts.black]}>Begin Evacuation</Text>
              <Ionicons name="arrow-forward" size={20} color="#fff" />
            </Pressable>
          </View>
        )}

        {/* ── STEP 2: Internet Decision ─────────────────────────────────────── */}
        {step === "internet_decision" && (
          <View style={styles.decisionCard}>
            <View style={[styles.decisionIconWrap, { backgroundColor: "rgba(0,97,164,0.1)" }]}>
              <Ionicons name="wifi" size={36} color={theme.info} />
            </View>
            <Text style={[styles.decisionLabel, { color: theme.info }, fonts.black]}>
              CONNECTIVITY CHECK
            </Text>
            <Text style={[styles.decisionTitle, { color: theme.text }, fonts.black]}>
              Is Internet{"  \n"}Available?
            </Text>
            <Text style={[styles.decisionCopy, fonts.regular]}>
              Choose your current connectivity. If offline, we'll generate an SMS fallback code for you.
            </Text>
            <View style={styles.decisionOptions}>
              <Pressable
                style={[styles.optionButtonYes, { backgroundColor: theme.info, shadowColor: theme.info }]}
                onPress={() => { setInternetAvailable(true); go("upload_photo"); }}
              >
                <Ionicons name="wifi" size={22} color="#fff" />
                <Text style={[styles.optionButtonText, fonts.black]}>YES — Internet Available</Text>
              </Pressable>
              <Pressable
                style={styles.optionButtonNo}
                onPress={() => { setInternetAvailable(false); go("sms_code"); }}
              >
                <Ionicons name="cellular-outline" size={22} color={theme.text} />
                <Text style={[styles.optionButtonTextDark, fonts.bold]}>NO — Use SMS Fallback</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* ── STEP 3a: Upload Photo & Location ─────────────────────────────── */}
        {step === "upload_photo" && (
          <View style={styles.stepCard}>
            <View style={[styles.stepIconWrap, { backgroundColor: "rgba(0,97,164,0.1)" }]}>
              <Ionicons name="cloud-upload" size={34} color={theme.info} />
            </View>
            <Text style={[styles.stepTag, { color: theme.info }, fonts.black]}>INTERNET — ONLINE MODE</Text>
            <Text style={[styles.stepTitle, fonts.black]}>Upload Photo &{"  \n"}Location</Text>
            <Text style={[styles.stepCopy, fonts.regular]}>
              Upload a photo of your situation and confirm your GPS location. This data is sent directly to your assigned dispatcher.
            </Text>

            <View style={styles.uploadBox}>
              <Ionicons name="image" size={36} color={theme.info} />
              <Text style={[styles.uploadBoxTitle, { color: theme.info }, fonts.bold]}>Attach Photo</Text>
              <Text style={[styles.uploadBoxHint, fonts.regular]}>
                Tap to open camera or choose from gallery. Max 10MB.
              </Text>
            </View>

            <View style={[styles.infoRow, { borderLeftColor: theme.primary }]}>
              <Ionicons name="location" size={22} color={theme.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoRowText, fonts.bold]}>GPS Location Locked</Text>
                <Text style={[styles.infoRowSub, fonts.regular]}>14.5991° N, 120.9842° E — Accurate to 5m</Text>
              </View>
              <Ionicons name="checkmark-circle" size={18} color={theme.primary} />
            </View>

            <Pressable
              style={[styles.ctaButton, { backgroundColor: theme.info, shadowColor: theme.info }]}
              onPress={() => go("delivery_confirmation")}
            >
              <Ionicons name="cloud-upload" size={20} color="#fff" />
              <Text style={[styles.ctaButtonText, fonts.black]}>Upload & Send Report</Text>
            </Pressable>
          </View>
        )}

        {/* ── STEP 3b: SMS Code ─────────────────────────────────────────────── */}
        {step === "sms_code" && (
          <View style={styles.stepCard}>
            <View style={[styles.stepIconWrap, { backgroundColor: "rgba(245,158,11,0.1)" }]}>
              <Ionicons name="chatbubble-ellipses" size={34} color={theme.warning} />
            </View>
            <Text style={[styles.stepTag, { color: theme.warning }, fonts.black]}>OFFLINE — SMS MODE</Text>
            <Text style={[styles.stepTitle, fonts.black]}>SMS Fallback Code</Text>
            <Text style={[styles.stepCopy, fonts.regular]}>
              No internet? No problem. Use this code to report your situation via SMS to the emergency hotline.
            </Text>

            <View style={styles.smsCodeBox}>
              <Text style={[styles.smsCodeLabel, fonts.black]}>Your Emergency Code</Text>
              <Text style={[styles.smsCode, fonts.black]}>DAM-7821</Text>
              <Text style={[styles.smsCodeHint, fonts.regular]}>
                Send this code to{" "}
                <Text style={{ color: "#fff", fontWeight: "700" }}>143</Text>
                {" "}via SMS. Valid for 30 minutes.
              </Text>
            </View>

            <View style={[styles.infoRow, { borderLeftColor: theme.warning }]}>
              <Ionicons name="call" size={22} color={theme.warning} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoRowText, fonts.bold]}>Emergency Hotline</Text>
                <Text style={[styles.infoRowSub, fonts.regular]}>SMS "DAM-7821" to 143</Text>
              </View>
            </View>

            <Pressable
              style={[styles.ctaButton, { backgroundColor: theme.warning, shadowColor: theme.warning }]}
              onPress={() => go("delivery_confirmation")}
            >
              <Ionicons name="send" size={20} color="#fff" />
              <Text style={[styles.ctaButtonText, fonts.black]}>I've Sent the SMS</Text>
            </Pressable>
          </View>
        )}

        {/* ── STEP 4: Delivery Confirmation ────────────────────────────────── */}
        {step === "delivery_confirmation" && (
          <View style={styles.stepCard}>
            <View style={styles.confirmHero}>
              <View style={[styles.confirmIconRing, { backgroundColor: "rgba(46,125,50,0.12)" }]}>
                <Ionicons name="checkmark-circle" size={52} color={theme.primary} />
              </View>
              <Text style={[styles.confirmTitle, fonts.black]}>Report Delivered!</Text>
              <Text style={[styles.confirmCopy, fonts.regular]}>
                Your incident report has been received. A dispatcher has been notified and is reviewing your case.
              </Text>
            </View>

            <View style={[styles.infoRow, { borderLeftColor: theme.primary }]}>
              <Ionicons name="person" size={22} color={theme.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoRowText, fonts.bold]}>Dispatcher Assigned</Text>
                <Text style={[styles.infoRowSub, fonts.regular]}>Officer Reyes — Response Unit 4</Text>
              </View>
            </View>

            <View style={[styles.infoRow, { borderLeftColor: theme.info }]}>
              <Ionicons name="time" size={22} color={theme.info} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoRowText, fonts.bold]}>Estimated Response Time</Text>
                <Text style={[styles.infoRowSub, fonts.regular]}>12–18 minutes</Text>
              </View>
            </View>

            <View style={{ gap: 10 }}>
              <Pressable
                style={[styles.ctaButton, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
                onPress={() => go("safe_zone_map")}
              >
                <Ionicons name="map" size={20} color="#fff" />
                <Text style={[styles.ctaButtonText, fonts.black]}>View Safe Zone Map</Text>
              </Pressable>

              {rescueNeeded && (
                <Pressable style={styles.ghostButton} onPress={() => go("navigate_evacuation")}>
                  <Text style={[styles.ghostButtonText, fonts.bold]}>View Status / Wait for Rescue</Text>
                  <Ionicons name="chevron-forward" size={16} color={theme.textMuted} />
                </Pressable>
              )}
            </View>
          </View>
        )}

        {/* ── STEP 5: Safe Zone Map ─────────────────────────────────────────── */}
        {step === "safe_zone_map" && (
          <View style={styles.stepCard}>
            <View style={[styles.stepIconWrap, { backgroundColor: "rgba(46,125,50,0.1)" }]}>
              <Ionicons name="map" size={34} color={theme.primary} />
            </View>
            <Text style={[styles.stepTag, { color: theme.primary }, fonts.black]}>SAFE ZONE MAP</Text>
            <Text style={[styles.stepTitle, fonts.black]}>Nearest Safe Zones</Text>
            <Text style={[styles.stepCopy, fonts.regular]}>
              Tap a safe zone to get walking directions. Green zones are confirmed operational and accepting evacuees.
            </Text>

            <View style={styles.mapMock}>
              <PulsatingDot color={theme.primary} />
              <View style={styles.mapEtaBadge}>
                <Ionicons name="shield-checkmark" size={14} color={theme.primary} />
                <Text style={[styles.mapEtaText, fonts.bold]}>Zone A: ACTIVE</Text>
              </View>
            </View>

            {[
              { name: "Brgy. Hall Safe Zone", distance: "1.2 km", status: "Open", cap: "320 / 500" },
              { name: "San Miguel Elementary", distance: "2.4 km", status: "Open", cap: "180 / 400" },
            ].map((zone) => (
              <View key={zone.name} style={[styles.infoRow, { borderLeftColor: theme.primary }]}>
                <Ionicons name="home" size={22} color={theme.primary} />
                <View style={{ flex: 1 }}>
                  <Text style={[styles.infoRowText, fonts.bold]}>{zone.name}</Text>
                  <Text style={[styles.infoRowSub, fonts.regular]}>{zone.distance} · Capacity: {zone.cap}</Text>
                </View>
                <View style={{ backgroundColor: "rgba(46,125,50,0.12)", paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 }}>
                  <Text style={{ color: theme.primary, fontSize: 10, fontWeight: "800" }}>{zone.status}</Text>
                </View>
              </View>
            ))}

            <Pressable
              style={[styles.ctaButton, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
              onPress={() => go("navigate_evacuation")}
            >
              <Ionicons name="navigate" size={20} color="#fff" />
              <Text style={[styles.ctaButtonText, fonts.black]}>Navigate to Safe Zone</Text>
            </Pressable>
          </View>
        )}

        {/* ── STEP 6: Navigate to Evacuation Site ──────────────────────────── */}
        {step === "navigate_evacuation" && (
          <View style={styles.stepCard}>
            <View style={[styles.stepIconWrap, { backgroundColor: "rgba(0,97,164,0.1)" }]}>
              <Ionicons name="navigate" size={34} color={theme.info} />
            </View>
            <Text style={[styles.stepTag, { color: theme.info }, fonts.black]}>NAVIGATION</Text>
            <Text style={[styles.stepTitle, fonts.black]}>Navigate to{"  \n"}Evacuation Site</Text>

            <View style={styles.mapMock}>
              <PulsatingDot color={theme.info} />
              <View style={styles.mapEtaBadge}>
                <Ionicons name="car" size={14} color={theme.info} />
                <Text style={[styles.mapEtaText, { color: theme.info }, fonts.bold]}>ETA 12 min</Text>
              </View>
            </View>

            <View style={[styles.infoRow, { borderLeftColor: theme.info }]}>
              <Ionicons name="flag" size={22} color={theme.info} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoRowText, fonts.bold]}>Destination</Text>
                <Text style={[styles.infoRowSub, fonts.regular]}>Brgy. Hall Safe Zone — 1.2 km</Text>
              </View>
            </View>

            <View style={[styles.infoRow, { borderLeftColor: theme.warning }]}>
              <Ionicons name="warning" size={22} color={theme.warning} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoRowText, fonts.bold]}>Avoid Flood Zone A</Text>
                <Text style={[styles.infoRowSub, fonts.regular]}>Water level: 40cm — use alternate route</Text>
              </View>
            </View>

            <Pressable
              style={[styles.ctaButton, { backgroundColor: theme.info, shadowColor: theme.info }]}
              onPress={() => go("arrive_site")}
            >
              <Ionicons name="checkmark-circle" size={20} color="#fff" />
              <Text style={[styles.ctaButtonText, fonts.black]}>I've Arrived at the Site</Text>
            </Pressable>
          </View>
        )}

        {/* ── STEP 7: Arrive at Site ────────────────────────────────────────── */}
        {step === "arrive_site" && (
          <View style={styles.stepCard}>
            <View style={styles.confirmHero}>
              <View style={[styles.confirmIconRing, { backgroundColor: "rgba(46,125,50,0.12)" }]}>
                <Ionicons name="home" size={48} color={theme.primary} />
              </View>
              <Text style={[styles.confirmTitle, fonts.black]}>Welcome to the Site</Text>
              <Text style={[styles.confirmCopy, fonts.regular]}>
                You've arrived at the evacuation site. Present your Digital QR ID to the site staff to check in.
              </Text>
            </View>

            <View style={styles.qrWrap}>
              <View style={styles.qrFrame}>
                <Image source={{ uri: QR_URI }} style={styles.qrImage} />
              </View>
              <View style={styles.qrIdBadge}>
                <Text style={[styles.qrIdText, fonts.black]}>284-991-001</Text>
              </View>
            </View>

            <View style={[styles.infoRow, { borderLeftColor: theme.primary }]}>
              <Ionicons name="person" size={22} color={theme.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoRowText, fonts.bold]}>Elena S. Villacruz</Text>
                <Text style={[styles.infoRowSub, fonts.regular]}>Individual / Bicol Region, District 2</Text>
              </View>
            </View>

            <Pressable
              style={[styles.ctaButton, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
              onPress={() => go("credential_check")}
            >
              <Ionicons name="qr-code" size={20} color="#fff" />
              <Text style={[styles.ctaButtonText, fonts.black]}>Present Credentials</Text>
            </Pressable>
          </View>
        )}

        {/* ── STEP 8: Credential Check ──────────────────────────────────────── */}
        {step === "credential_check" && (
          <View style={styles.decisionCard}>
            <View style={[styles.decisionIconWrap, { backgroundColor: "rgba(46,125,50,0.1)" }]}>
              <Ionicons name="qr-code" size={36} color={theme.primary} />
            </View>
            <Text style={[styles.decisionLabel, { color: theme.primary }, fonts.black]}>
              CREDENTIAL VERIFICATION
            </Text>
            <Text style={[styles.decisionTitle, { color: theme.text }, fonts.black]}>
              Is this QR for an{"  \n"}Individual?
            </Text>
            <Text style={[styles.decisionCopy, fonts.regular]}>
              The site staff will confirm whether this QR belongs to a single registrant or an entire household cluster.
            </Text>
            <View style={styles.decisionOptions}>
              <Pressable
                style={[styles.optionButtonYes, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
                onPress={() => { setIsIndividual(true); go("logged_in"); }}
              >
                <Ionicons name="person" size={22} color="#fff" />
                <Text style={[styles.optionButtonText, fonts.black]}>YES — Individual</Text>
              </Pressable>
              <Pressable
                style={styles.optionButtonNo}
                onPress={() => { setIsIndividual(false); go("logged_in"); }}
              >
                <Ionicons name="people" size={22} color={theme.text} />
                <Text style={[styles.optionButtonTextDark, fonts.bold]}>NO — Family / Household</Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* ── STEP 9: Logged In ─────────────────────────────────────────────── */}
        {step === "logged_in" && (
          <View style={styles.stepCard}>
            <View style={styles.confirmHero}>
              <View style={[styles.confirmIconRing, { backgroundColor: "rgba(46,125,50,0.15)" }]}>
                <Ionicons name="shield-checkmark" size={52} color={theme.primary} />
              </View>
              <Text style={[styles.confirmTitle, fonts.black]}>
                {isIndividual ? "Individual Logged In!" : "Family Logged In!"}
              </Text>
              <Text style={[styles.confirmCopy, fonts.regular]}>
                {isIndividual
                  ? "Elena S. Villacruz has been successfully checked in at Brgy. Hall Safe Zone."
                  : "The Dela Cruz household cluster has been successfully registered at Brgy. Hall Safe Zone."}
              </Text>
            </View>

            <View style={[styles.infoRow, { borderLeftColor: theme.primary }]}>
              <Ionicons name="bed" size={22} color={theme.primary} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoRowText, fonts.bold]}>
                  Assigned: {isIndividual ? "Shelter Bay 4B" : "Family Suite F-12"}
                </Text>
                <Text style={[styles.infoRowSub, fonts.regular]}>Building A, Ground Floor</Text>
              </View>
            </View>

            <View style={[styles.infoRow, { borderLeftColor: theme.info }]}>
              <Ionicons name="restaurant" size={22} color={theme.info} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoRowText, fonts.bold]}>Meal Schedule</Text>
                <Text style={[styles.infoRowSub, fonts.regular]}>Breakfast: 7AM · Lunch: 12PM · Dinner: 6PM</Text>
              </View>
            </View>

            <View style={[styles.infoRow, { borderLeftColor: theme.warning }]}>
              <Ionicons name="medkit" size={22} color={theme.warning} />
              <View style={{ flex: 1 }}>
                <Text style={[styles.infoRowText, fonts.bold]}>Medical Station Available</Text>
                <Text style={[styles.infoRowSub, fonts.regular]}>Ground Floor, Room 101 — 24/7</Text>
              </View>
            </View>

            <Pressable
              style={[styles.ctaButton, { backgroundColor: theme.primary, shadowColor: theme.primary }]}
              onPress={onBack}
            >
              <Ionicons name="home" size={20} color="#fff" />
              <Text style={[styles.ctaButtonText, fonts.black]}>Return to Dashboard</Text>
            </Pressable>
          </View>
        )}

        <View style={{ height: 20 }} />
      </ScrollView>

      <CitizenBottomNav active={active} />
    </View>
  );
}
