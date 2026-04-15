import React, { useState } from "react";
import { Image, Pressable, StyleSheet, Switch, Text, View } from "react-native";
import { Button, Screen } from "../../components/UI";
import { CitizenBottomNav } from "../shared";

const avatarUri =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuDmjENrAB5IQ3c2Xo9CHxLTG1Zx_wgP7ExXJmB7Kmj71CYaOiI0t7iQF9ibo6i1cY9WmMIHjRJCv_OhCLyiUH5Eml5d2lTOImfkIKJHeLVUIWIuVb1csgOiXIcvCezQF77Cfu-HJg4eUnCjMQMvjZhbUia0NTelqhZTDjEUY992V_wxjgsl2rHbXTQPkDG1lQEyRLoDyAJNLCd2J0550CN_KivV_VtOiFchDlvQLlJ9PgN6a7lsmlgO--ZHDGsz_hJfyQ7qJyk9GGoV";

const qrUri =
  "https://lh3.googleusercontent.com/aida-public/AB6AXuCrX9Nqu19-hAhpO8rM-9DherTik7ptpsbnrQch9rvtbUQAhyhNf6D82iXcimlfey1XA3K9KgtUzbPxxm-S6NOSLrPT2QbRg82ettvfR239M-w2yBxNuNvAzeNmsH8Z9eMuTpCZPxC00vxBqfNGsnYaX-q-X5i8K3GQ5NzGpBF0W3QdP16xUgAAoybfEuVWOiYqtxjrzlKjuijxK_qGRfvSnb2JDR-r7rMdsKlZxORTjU73kQrDnzs5PeBpIPiP-k6oUhY45_7jXYxy";

export function CitizenIndividualRegistrationScreen({
  onBack,
  onContinue,
}: {
  onBack: () => void;
  onContinue: () => void;
}) {
  const [alertsEnabled, setAlertsEnabled] = useState(true);

  return (
    <Screen>
      <View style={styles.topBar}>
        <View style={styles.topBarLeft}>
          <Pressable onPress={onBack} style={styles.topButton}>
            <Text style={styles.topButtonIcon}>|||</Text>
          </Pressable>
          <Text style={styles.topBarTitle}>Citizen Hub</Text>
        </View>

        <View style={styles.avatarWrap}>
          <Image source={{ uri: avatarUri }} style={styles.avatarImage} />
        </View>
      </View>
      <View style={styles.topDivider} />

      <View style={styles.heroSection}>
        <View style={styles.successBadge}>
          <Text style={styles.successBadgeIcon}>OK</Text>
        </View>
        <Text style={styles.heroTitle}>Your Personal ID is Ready</Text>
        <Text style={styles.heroCopy}>
          Registration complete. This QR ID serves as your digital key for relief
          goods, medical assistance, and emergency shelter access.
        </Text>
      </View>

      <View style={styles.cardShell}>
        <View style={styles.cardGlow} />
        <View style={styles.idCard}>
          <View style={styles.idHeader}>
            <View>
              <Text style={styles.idHeaderLabel}>Damayan Relief Network</Text>
              <Text style={styles.idHeaderTitle}>OFFICIAL CITIZEN ID</Text>
            </View>
            <Text style={styles.idHeaderMark}>SH</Text>
          </View>

          <View style={styles.idContent}>
            <View style={styles.qrSection}>
              <View style={styles.qrFrame}>
                <Image source={{ uri: qrUri }} style={styles.qrImage} />
              </View>
              <View style={styles.idCodeBadge}>
                <Text style={styles.idCodeText}>284-991-001</Text>
              </View>
            </View>

            <View style={styles.detailsSection}>
              <View style={styles.detailBlock}>
                <Text style={styles.detailLabel}>Full Name</Text>
                <Text style={styles.detailValue}>Elena S. Villacruz</Text>
              </View>

              <View style={styles.detailGrid}>
                <View style={styles.detailMiniBlock}>
                  <Text style={styles.detailLabel}>Status</Text>
                  <View style={styles.verifiedRow}>
                    <Text style={styles.verifiedIcon}>V</Text>
                    <Text style={styles.verifiedText}>Verified</Text>
                  </View>
                </View>

                <View style={styles.detailMiniBlock}>
                  <Text style={styles.detailLabel}>Expiry</Text>
                  <Text style={styles.detailSmallValue}>12 / 2025</Text>
                </View>
              </View>

              <View style={styles.regionBlock}>
                <View style={styles.regionIconWrap}>
                  <Text style={styles.regionIcon}>L</Text>
                </View>
                <View>
                  <Text style={styles.detailLabel}>Registered Region</Text>
                  <Text style={styles.regionText}>Bicol Region, District 2</Text>
                </View>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.actionsSection}>
        <View style={styles.toggleCard}>
          <View style={styles.toggleLeft}>
            <View style={styles.toggleIconWrap}>
              <Text style={styles.toggleIcon}>!</Text>
            </View>
            <View>
              <Text style={styles.toggleTitle}>Enable Alerts</Text>
              <Text style={styles.toggleCopy}>Real-time SMS and push updates</Text>
            </View>
          </View>

          <Switch
            value={alertsEnabled}
            onValueChange={setAlertsEnabled}
            trackColor={{ false: "#e2e3de", true: "#0d631b" }}
            thumbColor="#ffffff"
          />
        </View>

        <Pressable style={styles.primaryAction}>
          <Text style={styles.primaryActionIcon}>DL</Text>
          <Text style={styles.primaryActionText}>Save to Device</Text>
        </Pressable>

        <Button label="Go To Dashboard" onPress={onContinue} tone="ghost" />
      </View>

      <CitizenBottomNav active="qr" />
    </Screen>
  );
}

const styles = StyleSheet.create({
  topBar: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 6,
  },
  topBarLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  topButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#eef1ea",
  },
  topButtonIcon: {
    color: "#0d631b",
    fontWeight: "900",
    fontSize: 16,
  },
  topBarTitle: {
    color: "#0d631b",
    fontSize: 24,
    fontWeight: "900",
    letterSpacing: -0.5,
  },
  avatarWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#e2e3de",
  },
  avatarImage: {
    width: "100%",
    height: "100%",
  },
  topDivider: {
    height: 1,
    backgroundColor: "rgba(112,122,108,0.2)",
  },
  heroSection: {
    alignItems: "center",
    gap: 14,
    paddingTop: 8,
    paddingBottom: 6,
  },
  successBadge: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(13,99,27,0.1)",
  },
  successBadgeIcon: {
    color: "#0d631b",
    fontSize: 24,
    fontWeight: "900",
  },
  heroTitle: {
    color: "#1a1c19",
    fontSize: 38,
    lineHeight: 42,
    fontWeight: "900",
    textAlign: "center",
    letterSpacing: -1.2,
  },
  heroCopy: {
    color: "#40493d",
    fontSize: 16,
    lineHeight: 26,
    textAlign: "center",
    maxWidth: 340,
  },
  cardShell: {
    position: "relative",
  },
  cardGlow: {
    position: "absolute",
    top: -12,
    right: -8,
    left: -8,
    bottom: -12,
    borderRadius: 28,
    backgroundColor: "rgba(13,99,27,0.05)",
  },
  idCard: {
    position: "relative",
    backgroundColor: "#ffffff",
    borderRadius: 28,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(191,202,186,0.22)",
    shadowColor: "#000000",
    shadowOpacity: 0.07,
    shadowRadius: 24,
    shadowOffset: { width: 0, height: 12 },
    elevation: 4,
  },
  idHeader: {
    backgroundColor: "#0d631b",
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  idHeaderLabel: {
    color: "rgba(203,255,194,0.85)",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  idHeaderTitle: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 4,
  },
  idHeaderMark: {
    color: "rgba(255,255,255,0.22)",
    fontSize: 34,
    fontWeight: "900",
  },
  idContent: {
    padding: 24,
    gap: 24,
  },
  qrSection: {
    alignItems: "center",
    gap: 16,
  },
  qrFrame: {
    padding: 14,
    borderRadius: 20,
    backgroundColor: "#ffffff",
    borderWidth: 2,
    borderColor: "rgba(13,99,27,0.1)",
  },
  qrImage: {
    width: 208,
    height: 208,
  },
  idCodeBadge: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: "rgba(13,99,27,0.05)",
  },
  idCodeText: {
    color: "#0d631b",
    fontSize: 14,
    fontWeight: "900",
    letterSpacing: 2,
  },
  detailsSection: {
    gap: 20,
  },
  detailBlock: {
    gap: 6,
  },
  detailLabel: {
    color: "rgba(64,73,61,0.6)",
    fontSize: 10,
    fontWeight: "800",
    textTransform: "uppercase",
    letterSpacing: 1.2,
  },
  detailValue: {
    color: "#1a1c19",
    fontSize: 28,
    lineHeight: 32,
    fontWeight: "900",
  },
  detailGrid: {
    flexDirection: "row",
    gap: 16,
  },
  detailMiniBlock: {
    flex: 1,
    gap: 6,
  },
  verifiedRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  verifiedIcon: {
    color: "#0d631b",
    fontSize: 12,
    fontWeight: "900",
  },
  verifiedText: {
    color: "#0d631b",
    fontSize: 14,
    fontWeight: "800",
  },
  detailSmallValue: {
    color: "#1a1c19",
    fontSize: 14,
    fontWeight: "700",
  },
  regionBlock: {
    paddingTop: 18,
    borderTopWidth: 1,
    borderTopColor: "rgba(191,202,186,0.24)",
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  regionIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: "rgba(254,179,0,0.16)",
    alignItems: "center",
    justifyContent: "center",
  },
  regionIcon: {
    color: "#7e5700",
    fontSize: 16,
    fontWeight: "900",
  },
  regionText: {
    color: "#1a1c19",
    fontSize: 14,
    fontWeight: "600",
  },
  actionsSection: {
    gap: 14,
  },
  toggleCard: {
    backgroundColor: "#f4f4ef",
    borderRadius: 20,
    padding: 18,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 12,
  },
  toggleLeft: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    flex: 1,
  },
  toggleIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 14,
    backgroundColor: "rgba(254,179,0,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  toggleIcon: {
    color: "#7e5700",
    fontSize: 18,
    fontWeight: "900",
  },
  toggleTitle: {
    color: "#1a1c19",
    fontSize: 16,
    fontWeight: "800",
  },
  toggleCopy: {
    color: "#40493d",
    fontSize: 12,
    marginTop: 2,
  },
  primaryAction: {
    minHeight: 60,
    borderRadius: 24,
    backgroundColor: "#0d631b",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    shadowColor: "#0d631b",
    shadowOpacity: 0.12,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 8 },
    elevation: 3,
  },
  primaryActionIcon: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "900",
  },
  primaryActionText: {
    color: "#ffffff",
    fontSize: 18,
    fontWeight: "800",
  },
});
