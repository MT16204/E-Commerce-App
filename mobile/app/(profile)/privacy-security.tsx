import React, { useState, ComponentProps } from "react";
import {
  ScrollView,
  Switch,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import theme, { scale, verticalScale } from "@/theme";
import SafeScreen from "@/components/SafeScreen";
import { FocusAwareStatusBar } from "@/components/StatusBar";

type SecurityOption = {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string; 
  description: string;
  type: "navigation" | "toggle";
  value?: boolean;
};

const PrivacyAndSecurityScreen = () => {
  const router = useRouter();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(true);
  const [pushNotifications, setPushNotifications] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [marketingEmails, setMarketingEmails] = useState(false);
  const [shareData, setShareData] = useState(false);

  const securitySettings: SecurityOption[] = [
    {
      id: "password",
      icon: "lock-closed-outline",
      title: "Change Password",
      description: "Update your account password",
      type: "navigation",
    },
    {
      id: "two-factor",
      icon: "shield-checkmark-outline",
      title: "Two-Factor Authentication",
      description: "Add an extra layer of security",
      type: "toggle",
      value: twoFactorEnabled,
    },
    {
      id: "biometric",
      icon: "finger-print-outline",
      title: "Biometric Login",
      description: "Use Face ID or Touch ID",
      type: "toggle",
      value: biometricEnabled,
    },
  ];

  const privacySettings: SecurityOption[] = [
    {
      id: "push",
      icon: "notifications-outline",
      title: "Push Notifications",
      description: "Receive push notifications",
      type: "toggle",
      value: pushNotifications,
    },
    {
      id: "email",
      icon: "mail-outline",
      title: "Email Notifications",
      description: "Receive order updates via email",
      type: "toggle",
      value: emailNotifications,
    },
    {
      id: "marketing",
      icon: "megaphone-outline",
      title: "Marketing Emails",
      description: "Receive promotional emails",
      type: "toggle",
      value: marketingEmails,
    },
    {
      id: "data",
      icon: "analytics-outline",
      title: "Share Usage Data",
      description: "Help us improve the app",
      type: "toggle",
      value: shareData,
    },
  ];

  const handleToggle = (id: string, value: boolean) => {
    switch (id) {
      case "two-factor":
        setTwoFactorEnabled(value);
        break;
      case "biometric":
        setBiometricEnabled(value);
        break;
      case "push":
        setPushNotifications(value);
        break;
      case "email":
        setEmailNotifications(value);
        break;
      case "marketing":
        setMarketingEmails(value);
        break;
      case "data":
        setShareData(value);
        break;
    }
  };

  const renderSettingItem = (setting: SecurityOption) => (
    <TouchableOpacity
      key={setting.id}
      style={styles.settingCard}
      activeOpacity={setting.type === "toggle" ? 1 : 0.7}
      disabled={setting.type === "toggle"}
    >
      <View style={styles.cardContent}>
        <View style={styles.iconContainer}>
          <Ionicons
            name={setting.icon}
            size={scale(22)}
            color={theme.colors.primary}
          />
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.settingTitle}>{setting.title}</Text>
          <Text style={styles.settingDescription}>{setting.description}</Text>
        </View>

        {setting.type === "toggle" ? (
          <Switch
            value={setting.value}
            onValueChange={(value) => handleToggle(setting.id, value)}
            trackColor={{
              false: theme.colors.grayMedium,
              true: theme.colors.primary,
            }}
            thumbColor={theme.colors.white}
          />
        ) : (
          <Ionicons
            name="chevron-forward"
            size={scale(20)}
            color={theme.colors.grayMedium}
          />
        )}
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeScreen
      style={{ flex: 1, backgroundColor: theme.colors.backgroundhome }}
    >
      <FocusAwareStatusBar style="dark" />

      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Privacy & Security</Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <Text style={styles.sectionLabel}>Security</Text>
        {securitySettings.map(renderSettingItem)}

        <Text style={styles.sectionLabel}>Privacy</Text>
        {privacySettings.map(renderSettingItem)}

        <TouchableOpacity
          style={[styles.settingCard, styles.dangerCard]}
          activeOpacity={0.7}
        >
          <View style={styles.cardContent}>
            <View
              style={[styles.iconContainer]}
            >
              <Feather
                name="trash-2"
                size={scale(22)}
                color={theme.colors.red}
              />
            </View>
            <View style={styles.textContainer}>
              <Text style={[styles.settingTitle, { color: theme.colors.red }]}>
                Delete Account
              </Text>
              <Text style={styles.settingDescription}>
                Permanently delete your account
              </Text>
            </View>
            <Ionicons
              name="chevron-forward"
              size={scale(20)}
              color={theme.colors.red}
            />
          </View>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Ionicons
            name="information-circle-outline"
            size={scale(24)}
            color={theme.colors.primary}
          />
          <Text style={styles.infoText}>
            We take your privacy seriously. Your data is encrypted and stored
            securely.
          </Text>
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(20),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
  },
  backButton: {
    padding: 5,
    marginRight: scale(10),
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.heading,
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(40),
  },
  sectionLabel: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.black,
    marginTop: verticalScale(20),
    marginBottom: verticalScale(8),
  },
  settingCard: {
    backgroundColor: theme.colors.white,
    borderRadius: scale(16),
    padding: scale(16),
    marginBottom: verticalScale(12),
  },
  dangerCard: {
    borderWidth: 1,
    borderColor: theme.colors.red,
    marginTop: verticalScale(10),
  },
  cardContent: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconContainer: {
    width: scale(46),
    height: scale(35),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(15),
  },
  textContainer: {
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.fontSize.FONT_14Px,
    fontFamily: theme.fonts.medium,
    color: theme.colors.heading,
  },
  settingDescription: {
    fontSize: theme.fontSize.FONT_13Px,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  infoBox: {
    flexDirection: "row",
    backgroundColor: "#F0F3FF",
    borderRadius: scale(16),
    padding: scale(16),
    marginTop: verticalScale(25),
    alignItems: "center",
  },
  infoText: {
    flex: 1,
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.primary,
    marginLeft: scale(12),
    lineHeight: 18,
  },
});

export default PrivacyAndSecurityScreen;
