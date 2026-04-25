import React, { useEffect, useState } from "react";
import { Text, TextInput, View } from "react-native";
import { MobileHeader, NavPills } from "../../components/MobileShell";
import { Button, Pill, Screen, SectionCard } from "../../components/UI";
import {
  ApiError,
  createIncidentReport,
  createManualCheckIn,
  getCapacity,
  getDisasterEvents,
  getIncidentReports,
  getInventory,
  getRecentCheckIns,
} from "../../api";
import { theme } from "../../theme";
import { siteManagerStyles } from "../shared";
import {
  AuthSession,
  CapacityCenter,
  CheckInRecord,
  DisasterEvent,
  IncidentReport,
  InventoryItem,
} from "../../types";

export function SiteManagerDuringScreen({
  onBack,
  onSignOut,
  session,
}: {
  onBack: () => void;
  onSignOut: () => void;
  session: AuthSession;
}) {
  const [active, setActive] = useState("Dashboard");
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [centers, setCenters] = useState<CapacityCenter[]>([]);
  const [checkIns, setCheckIns] = useState<CheckInRecord[]>([]);
  const [incidents, setIncidents] = useState<IncidentReport[]>([]);
  const [disasters, setDisasters] = useState<DisasterEvent[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [checkInForm, setCheckInForm] = useState({
    evacueeNumber: "",
    firstName: "",
    lastName: "",
    zone: "",
    location: "",
  });
  const [incidentForm, setIncidentForm] = useState({
    title: "",
    content: "",
    severity: "high",
    location: "",
    disasterId: "",
  });

  async function hydrate() {
    try {
      const [inventoryRows, capacityRows, recentRows, incidentRows, eventRows] =
        await Promise.all([
          getInventory("site-manager", session.accessToken),
          getCapacity(session.accessToken),
          getRecentCheckIns(session.accessToken, 5),
          getIncidentReports(session.accessToken),
          getDisasterEvents("site-manager", session.accessToken),
        ]);
      setInventory(inventoryRows);
      setCenters(capacityRows);
      setCheckIns(recentRows);
      setIncidents(incidentRows);
      setDisasters(eventRows);
      setIncidentForm((current) => ({
        ...current,
        disasterId: current.disasterId || eventRows[0]?.id || "",
      }));
      setError(null);
    } catch (caughtError) {
      setError(
        caughtError instanceof ApiError
          ? caughtError.message
          : "Unable to load active response data.",
      );
    }
  }

  useEffect(() => {
    void hydrate();
  }, [session.accessToken]);

  const activeDisaster =
    disasters.find((item) => item.status === "active") ?? disasters[0];

  return (
    <View style={{ flex: 1, backgroundColor: theme.bg }}>
      <View
        style={{
          backgroundColor: theme.surface,
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.05,
          shadowRadius: 10,
          elevation: 4,
        }}
      >
        <MobileHeader
          title="Damayan Portal"
          subtitle="Active response"
          onBack={onBack}
        />
        <NavPills
          items={["Dashboard", "Assessment", "Distribution", "Recovery"]}
          active={active}
          onSelect={setActive}
        />
      </View>

      <Screen>
        <SectionCard style={siteManagerStyles.primaryHero}>
          <Pill label="Phase 2" tone="danger" />
          <Text style={siteManagerStyles.heroTitle}>Live Site Response</Text>
          <Text style={siteManagerStyles.heroText}>
            {activeDisaster
              ? `${activeDisaster.name} in ${activeDisaster.province}`
              : "No active disaster event currently loaded."}
          </Text>
          {error ? (
            <Text style={{ color: "#fee2e2", fontWeight: "700" }}>{error}</Text>
          ) : null}
          {success ? (
            <Text style={{ color: "#dcfce7", fontWeight: "700" }}>{success}</Text>
          ) : null}
          <Button label="Sign Out" tone="ghost" onPress={onSignOut} />
        </SectionCard>

        <SectionCard>
          <Text style={siteManagerStyles.sectionTitle}>Manual Check-In</Text>
          <View style={{ gap: 12 }}>
            {[
              ["Evacuee Number", "evacueeNumber"],
              ["First Name", "firstName"],
              ["Last Name", "lastName"],
              ["Zone", "zone"],
              ["Location", "location"],
            ].map(([label, key]) => (
              <View key={key}>
                <Text
                  style={{ color: theme.textMuted, fontWeight: "800", marginBottom: 8 }}
                >
                  {label}
                </Text>
                <TextInput
                  style={inputStyle}
                  value={checkInForm[key as keyof typeof checkInForm]}
                  onChangeText={(value) =>
                    setCheckInForm((current) => ({ ...current, [key]: value }))
                  }
                />
              </View>
            ))}
            <Button
              label="Save Manual Entry"
              onPress={async () => {
                try {
                  await createManualCheckIn(session.accessToken, checkInForm);
                  setCheckInForm({
                    evacueeNumber: "",
                    firstName: "",
                    lastName: "",
                    zone: "",
                    location: "",
                  });
                  setSuccess("Manual check-in saved.");
                  setError(null);
                  await hydrate();
                } catch (caughtError) {
                  setError(
                    caughtError instanceof ApiError
                      ? caughtError.message
                      : "Unable to save check-in.",
                  );
                }
              }}
            />
          </View>
        </SectionCard>

        <SectionCard>
          <Text style={siteManagerStyles.sectionTitle}>Report Incident</Text>
          <View style={{ gap: 12 }}>
            <View>
              <Text
                style={{ color: theme.textMuted, fontWeight: "800", marginBottom: 8 }}
              >
                Incident Title
              </Text>
              <TextInput
                style={inputStyle}
                value={incidentForm.title}
                onChangeText={(value) =>
                  setIncidentForm((current) => ({ ...current, title: value }))
                }
              />
            </View>
            <View>
              <Text
                style={{ color: theme.textMuted, fontWeight: "800", marginBottom: 8 }}
              >
                Description
              </Text>
              <TextInput
                multiline
                style={[inputStyle, { minHeight: 90, textAlignVertical: "top" }]}
                value={incidentForm.content}
                onChangeText={(value) =>
                  setIncidentForm((current) => ({ ...current, content: value }))
                }
              />
            </View>
            <View>
              <Text
                style={{ color: theme.textMuted, fontWeight: "800", marginBottom: 8 }}
              >
                Location
              </Text>
              <TextInput
                style={inputStyle}
                value={incidentForm.location}
                onChangeText={(value) =>
                  setIncidentForm((current) => ({ ...current, location: value }))
                }
              />
            </View>
            <Button
              label="Post Incident Report"
              tone="danger"
              onPress={async () => {
                try {
                  await createIncidentReport(session.accessToken, {
                    disasterId: incidentForm.disasterId || activeDisaster?.id || "",
                    reportedBy: session.user.authUserId ?? session.user.id,
                    title: incidentForm.title,
                    content: incidentForm.content,
                    severity: incidentForm.severity,
                    location: incidentForm.location,
                  });
                  setIncidentForm((current) => ({
                    ...current,
                    title: "",
                    content: "",
                    location: "",
                  }));
                  setSuccess("Incident report posted.");
                  setError(null);
                  await hydrate();
                } catch (caughtError) {
                  setError(
                    caughtError instanceof ApiError
                      ? caughtError.message
                      : "Unable to post incident.",
                  );
                }
              }}
            />
          </View>
        </SectionCard>

        <SectionCard>
          <Text style={siteManagerStyles.sectionTitle}>Shelter Load</Text>
          <View style={{ gap: 12 }}>
            {centers.slice(0, 3).map((center) => (
              <View key={center.id} style={{ paddingVertical: 8 }}>
                <View style={siteManagerStyles.progRow}>
                  <Text style={siteManagerStyles.progLabel}>{center.name}</Text>
                  <Text style={{ color: theme.textMuted }}>
                    {center.currentOccupancy} / {center.capacity}
                  </Text>
                </View>
                <View
                  style={{
                    height: 6,
                    backgroundColor: theme.surfaceSoft,
                    borderRadius: 3,
                    overflow: "hidden",
                  }}
                >
                  <View
                    style={{
                      width: `${center.utilizationRate}%` as `${number}%`,
                      height: "100%",
                      backgroundColor:
                        center.utilizationRate >= 90
                          ? theme.danger
                          : center.utilizationRate >= 75
                            ? theme.warning
                            : theme.primary,
                    }}
                  />
                </View>
              </View>
            ))}
          </View>
        </SectionCard>

        <SectionCard>
          <Text style={siteManagerStyles.sectionTitle}>Recent Activity</Text>
          <View style={{ gap: 14 }}>
            {checkIns.slice(0, 3).map((item) => (
              <View key={item.id}>
                <Text style={{ color: theme.text, fontWeight: "800" }}>
                  {item.fullName || `${item.firstName} ${item.lastName}`}
                </Text>
                <Text style={{ color: theme.textMuted }}>
                  {item.zone} • {item.location}
                </Text>
              </View>
            ))}
            {incidents.slice(0, 2).map((item) => (
              <View key={item.id}>
                <Text style={{ color: theme.text, fontWeight: "800" }}>
                  {item.title}
                </Text>
                <Text style={{ color: theme.textMuted }}>
                  {item.location} • {item.severity}
                </Text>
              </View>
            ))}
          </View>
        </SectionCard>

        <SectionCard>
          <Text style={siteManagerStyles.sectionTitle}>Supply Watchlist</Text>
          <View style={{ gap: 12 }}>
            {inventory.slice(0, 4).map((item) => (
              <View
                key={item.id}
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: theme.text, fontWeight: "800" }}>{item.name}</Text>
                <Pill
                  label={`${item.quantity} ${item.unit}`}
                  tone={item.status === "low" ? "warning" : "success"}
                />
              </View>
            ))}
          </View>
        </SectionCard>
      </Screen>
    </View>
  );
}

const inputStyle = {
  borderWidth: 1,
  borderColor: theme.line,
  borderRadius: 14,
  paddingHorizontal: 14,
  paddingVertical: 12,
  color: theme.text,
  backgroundColor: theme.surfaceSoft,
};