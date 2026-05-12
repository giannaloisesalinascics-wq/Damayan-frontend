import React, { useState } from "react";
import {
  ImageBackground,
  ScrollView,
  Text,
  TextInput,
  View,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Screen } from "../../components/UI";
import { roleColors, theme, fonts } from "../../theme";
import { styles } from "./DispatcherLoginScreen.styles";

export function DispatcherLoginScreen({
  onBack,
  onSubmit,
}: {
  onBack: () => void;
  onSubmit: () => void;
}) {
  const accent = roleColors.dispatcher;
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false);

  return (
    <Screen style={{ backgroundColor: theme.bg }}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.citizenShell}>
          {/* Background Blobs */}
          <View style={[styles.orb, styles.orb1, { backgroundColor: accent }]} />
          <View style={[styles.orb, styles.orb2]} />

          <View style={styles.topBar}>
            <View style={styles.brandRow}>
              <TouchableOpacity onPress={onBack} style={styles.menuButton}>
                <Ionicons name="arrow-back" size={24} color={theme.primary} />
              </TouchableOpacity>
              <Text style={styles.brandText}>DAMAYAN</Text>
            </View>

            <View style={styles.roleBadgeRow}>
              <Text style={styles.roleTag}>DISPATCHER</Text>
              <View style={styles.avatarIcon}>
                <Ionicons name="radio" size={22} color={accent} />
              </View>
            </View>
          </View>

          <View style={styles.editorialPanel}>
            <Text style={[styles.gatewayLabel, { color: accent }]}>COMMAND & CONTROL</Text>
            <Text style={styles.editorialTitle}>
              Incident{"\n"}
              <Text style={[styles.editorialAccent, { color: accent }]}>Dispatch</Text>
            </Text>
            <Text style={styles.editorialText}>
              Synchronize field resource allocation, monitor active mission status, and manage ticket distribution.
            </Text>

            <View style={styles.imageCardContainer}>
              <ImageBackground
                source={{ uri: "https://lh3.googleusercontent.com/aida-public/AB6AXuDt8S8WvV5nZ4zI7nZ0W9q9Q-J1A1Z1E1G1I1K1M1O1Q1S1U1W1Y1a1c1e1g1i1k1m1o1q1s1u1w1y1" }}
                imageStyle={{ borderRadius: 32 }}
                style={styles.imageCard}
              >
                <View style={styles.imageOverlay} />
              </ImageBackground>
              <View style={styles.imageFooter}>
                <Ionicons name="checkmark-circle" size={20} color={accent} />
                <Text style={styles.imageFooterText}>
                  Operational Authority Verified
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.loginCard}>
            <View style={styles.loginIntro}>
              <Text style={styles.loginTitle}>Welcome back</Text>
              <Text style={styles.loginSubtitle}>
                Authenticate your credentials to enter the dispatcher terminal.
              </Text>
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.fieldLabel}>Username</Text>
              <View style={styles.fieldWrap}>
                <Ionicons name="mail-outline" size={20} color={theme.textLight} style={{ marginRight: 12 }} />
                <TextInput
                  value={username}
                  onChangeText={setUsername}
                  placeholder="Enter username"
                  placeholderTextColor="#a0a7a0"
                  style={styles.fieldInput}
                  autoCapitalize="none"
                />
              </View>
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.fieldLabel}>Password</Text>
                <TouchableOpacity>
                  <Text style={[styles.helpLink, { color: accent }]}>Forgot?</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.fieldWrap}>
                <Ionicons name="lock-closed-outline" size={20} color={theme.textLight} style={{ marginRight: 12 }} />
                <TextInput
                  value={password}
                  onChangeText={setPassword}
                  placeholder="••••••••••••"
                  placeholderTextColor="#a0a7a0"
                  style={styles.fieldInput}
                  secureTextEntry={!passwordVisible}
                />
                <TouchableOpacity onPress={() => setPasswordVisible((v) => !v)}>
                  <Ionicons 
                    name={passwordVisible ? "eye-off-outline" : "eye-outline"} 
                    size={20} 
                    color={theme.textLight} 
                  />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.actionStack}>
              <TouchableOpacity 
                onPress={onSubmit} 
                style={[styles.primaryAction, { backgroundColor: accent }]}
              >
                <Text style={styles.primaryActionText}>ENTER DISPATCH TERMINAL</Text>
                <Ionicons name="arrow-forward" size={20} color="#fff" />
              </TouchableOpacity>

              <View style={styles.dividerRow}>
                <View style={styles.dividerLine} />
                <Text style={styles.dividerText}>Portal Control</Text>
                <View style={styles.dividerLine} />
              </View>

              <TouchableOpacity onPress={onBack} style={styles.tertiaryAction}>
                <Text style={styles.tertiaryActionText}>SWITCH PORTAL ACCESS</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.footer}>
            <View style={styles.footerLinks}>
              {["Privacy", "Support", "Terms"].map(link => (
                <TouchableOpacity key={link}>
                  <Text style={styles.footerLink}>{link}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <Text style={styles.footerNote}>
              © 2024 DAMAYAN Platform. Crisis response and humanitarian coordination systems.
            </Text>
          </View>
        </View>
      </ScrollView>
    </Screen>
  );
}
