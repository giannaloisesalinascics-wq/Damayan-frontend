import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Screen } from "../../components/UI";
import {
  CitizenBottomNav,
  CitizenPreparednessTopBar,
  PreparednessHero,
  citizenStyles,
} from "../shared";

export function CitizenBeforeScreen({
  onBack,
  onRegisterSelf,
  onRegisterHousehold,
}: {
  onBack: () => void;
  onRegisterSelf: () => void;
  onRegisterHousehold: () => void;
}) {
  const [active] = useState<"home" | "relief" | "qr" | "profile">("home");

  return (
    <Screen>
      <CitizenPreparednessTopBar onBack={onBack} />
      <PreparednessHero
        stepLabel="Step 1: Identity Selection"
        title="Begin Your Preparedness."
        copy="Securing your safety starts with visibility. Registering allows authorities to provide targeted aid and critical updates when every second counts."
      />

      <View style={citizenStyles.selectionGrid}>
        <Pressable style={citizenStyles.selectionCard} onPress={onRegisterSelf}>
          <View>
            <View style={citizenStyles.selectionIconBox}>
              <Text style={citizenStyles.selectionIcon}>P</Text>
            </View>
            <Text style={citizenStyles.selectionTitle}>Register for myself</Text>
            <Text style={citizenStyles.selectionCopy}>
              Create a personal preparedness profile to receive individual alerts
              and evacuation instructions.
            </Text>
          </View>
          <View style={citizenStyles.selectionFooter}>
            <Text style={citizenStyles.selectionFooterText}>Individual Enrollment</Text>
            <Text style={citizenStyles.selectionArrow}>-&gt;</Text>
          </View>
        </Pressable>

        <Pressable style={citizenStyles.selectionCardPrimary} onPress={onRegisterHousehold}>
          <View style={citizenStyles.selectionGlow} />
          <View style={citizenStyles.selectionPrimaryContent}>
            <View style={citizenStyles.selectionIconBoxPrimary}>
              <Text style={citizenStyles.selectionIconPrimary}>F</Text>
            </View>
            <Text style={citizenStyles.selectionTitlePrimary}>Register for my Household</Text>
            <Text style={citizenStyles.selectionCopyPrimary}>
              Manage your entire family's safety from one dashboard. Best for
              households with children or elderly members.
            </Text>
          </View>
          <View style={citizenStyles.selectionPrimaryFooter}>
            <View style={citizenStyles.selectionFooter}>
              <Text style={citizenStyles.selectionFooterTextPrimary}>Family Enrollment</Text>
              <Text style={citizenStyles.selectionArrowPrimary}>-&gt;</Text>
            </View>
            <View style={citizenStyles.recommendedBadge}>
              <Text style={citizenStyles.recommendedStar}>*</Text>
              <Text style={citizenStyles.recommendedText}>Recommended</Text>
            </View>
          </View>
        </Pressable>
      </View>

      <View style={citizenStyles.familyAdvantageCard}>
        <Text style={citizenStyles.advantageLabel}>The Family Advantage</Text>

        <View style={citizenStyles.advantageList}>
          <View style={citizenStyles.advantageItem}>
            <View style={citizenStyles.advantageIconBox}>
              <Text style={citizenStyles.advantageIcon}>QR</Text>
            </View>
            <View style={citizenStyles.advantageTextBlock}>
              <Text style={citizenStyles.advantageTitle}>Shared Digital ID</Text>
              <Text style={citizenStyles.advantageCopy}>
                A unified QR code for the entire household, simplifying check-ins at
                safety shelters and relief centers.
              </Text>
            </View>
          </View>

          <View style={citizenStyles.advantageItem}>
            <View style={citizenStyles.advantageIconBox}>
              <Text style={citizenStyles.advantageIcon}>!</Text>
            </View>
            <View style={citizenStyles.advantageTextBlock}>
              <Text style={citizenStyles.advantageTitle}>Synchronized Alerts</Text>
              <Text style={citizenStyles.advantageCopy}>
                When one member receives an evacuation order, the entire family
                group is instantly notified to help ensure no one is left behind.
              </Text>
            </View>
          </View>
        </View>
      </View>

      <View style={citizenStyles.helpSection}>
        <Text style={citizenStyles.helpText}>Not sure which one to pick?</Text>
        <Pressable>
          <Text style={citizenStyles.helpLink}>Speak with a preparedness officer</Text>
        </Pressable>
      </View>

      <CitizenBottomNav active={active} />
    </Screen>
  );
}
