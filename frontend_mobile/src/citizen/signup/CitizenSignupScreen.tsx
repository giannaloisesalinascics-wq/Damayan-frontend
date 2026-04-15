import React from "react";
import { Text, View } from "react-native";
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
        <View style={citizenStyles.uploadBox}>
          <Text style={citizenStyles.uploadTitle}>Upload Government ID</Text>
          <Text style={citizenStyles.uploadHint}>JPG, PNG, or PDF</Text>
        </View>
        <Button label="Submit Registration" onPress={onSubmit} />
      </SectionCard>
    </Screen>
  );
}
