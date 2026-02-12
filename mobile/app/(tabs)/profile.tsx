import React from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";

import theme, { scale, verticalScale } from "@/theme";
import SafeScreen from "@/components/SafeScreen";
import { FocusAwareStatusBar } from "@/components/StatusBar";

const MENU_GROUPS = [
  { id: "edit", icon: "user", title: "Edit Profile", action: "/profile" },
  { id: "address", icon: "map-pin", title: "Address", action: "/addresses" },
  {
    id: "notif",
    icon: "bell",
    title: "Notification",
    action: "/notifications",
  },
  { id: "security", icon: "shield", title: "Security", action: "/security" },
  { id: "privacy", icon: "lock", title: "Privacy Policy", action: "/privacy" },
  { id: "help", icon: "info", title: "Help Center", action: "/help" },
];

const ProfileScreen = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  const { user } = useUser();

  return (
    <SafeScreen
      style={{ flex: 1, backgroundColor: theme.colors.backgroundhome }}
    >
      <FocusAwareStatusBar style="dark" />
      <View style={styles.mainContainer}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* HEADER */}
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
            <Text style={styles.headerTitle}>Profile</Text>
          </View>

          {/* AVATAR */}
          <View style={styles.avatarSection}>
            <Image
              source={user?.imageUrl}
              style={styles.avatar}
              contentFit="cover"
            />
            <Text style={styles.userName}>
              {user?.firstName} {user?.lastName}
            </Text>
            <Text style={styles.userEmail}>
              {user?.emailAddresses?.[0]?.emailAddress || "No email"}
            </Text>
          </View>

          {/* MENU LIST */}
          <View style={styles.menuContainer}>
            {MENU_GROUPS.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => item.action && router.push(item.action as any)}
              >
                <View style={styles.menuLeft}>
                  <Feather
                    name={item.icon as any}
                    size={20}
                    color={theme.colors.black}
                  />
                  <Text style={styles.menuTitle}>{item.title}</Text>
                </View>
                <Feather
                  name="chevron-right"
                  size={18}
                  color={theme.colors.grayMedium}
                />
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.menuItem, { borderBottomWidth: 0 }]}
              onPress={() => signOut()}
            >
              <View style={styles.menuLeft}>
                <Feather name="log-out" size={20} color="#F75555" />
                <Text style={[styles.menuTitle, { color: "#F75555" }]}>
                  Logout
                </Text>
              </View>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: theme.colors.backgroundhome,
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(20),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(10),
    marginBottom: verticalScale(20),
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
  avatarSection: {
    alignItems: "center",
    marginVertical: verticalScale(20),
  },
  avatar: {
    width: scale(90),
    height: scale(90),
    borderRadius: scale(45),
    backgroundColor: "#F4F4F4",
  },
  userName: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    marginTop: verticalScale(12),
    color: "#000000",
  },
  userEmail: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  menuContainer: {
    marginTop: verticalScale(10),
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(18),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  menuTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.medium,
    marginLeft: scale(15),
    color: theme.colors.textPrimary,
  },
});

export default ProfileScreen;
