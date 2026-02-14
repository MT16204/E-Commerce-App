import React, { useCallback } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons, Feather } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";

import theme, { scale, verticalScale } from "@/theme";
import SafeScreen from "@/components/SafeScreen";
import { FocusAwareStatusBar } from "@/components/StatusBar";

interface MenuItem {
  id: string;
  icon: string;
  title: string;
  action: any; 
}

const MENU_GROUPS: MenuItem[] = [
  {
    id: "edit",
    icon: "user",
    title: "Edit Profile",
    action: "/(auth)/edit-profile",
  },
  { id: "address", icon: "map-pin", title: "Address", action: "/addresses" },
  { id: "orders", icon: "shopping-bag", title: "My Orders", action: "/orders" },
  { id: "wishlist", icon: "heart", title: "Wishlist", action: "/wishList" },
  {
    id: "notif",
    icon: "bell",
    title: "Notification",
    action: "/notifications",
  },
  { id: "privacy-security", icon: "lock", title: "Privacy&Security", action: "/privacy-security" },
  { id: "help", icon: "info", title: "Help Center", action: "/help" },
];

const ProfileScreen = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  const { user } = useUser();

  const handleMenuPress = useCallback(
    (action: any) => {
      if (!action) return;

      if (action === "/help") {
        Alert.alert("Coming Soon", "This feature is under development.");
        return;
      }

      router.push(action);
    },
    [router],
  );

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to log out?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        style: "destructive",
        onPress: () => signOut(),
      },
    ]);
  };

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
                activeOpacity={0.6}
                onPress={() => handleMenuPress(item.action)}
              >
                <View style={styles.menuLeft}>
                  <View style={styles.iconContainer}>
                    <Feather
                      name={item.icon as any}
                      size={20}
                      color={theme.colors.black}
                    />
                  </View>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                </View>
                <Feather
                  name="chevron-right"
                  size={18}
                  color={theme.colors.grayMedium}
                />
              </TouchableOpacity>
            ))}

            {/* LOGOUT BUTTON */}
            <TouchableOpacity
              style={[styles.menuItem, { borderBottomWidth: 0 }]}
              activeOpacity={0.6}
              onPress={handleLogout}
            >
              <View style={styles.menuLeft}>
                <View
                  style={[styles.iconContainer, { backgroundColor: "#FFF1F1" }]}
                >
                  <Feather name="log-out" size={20} color={theme.colors.red} />
                </View>
                <Text style={[styles.menuTitle, { color: theme.colors.red }]}>
                  Logout
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <Text style={styles.versionText}>Version 1.0.2 (2026)</Text>
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
    paddingBottom: verticalScale(30),
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
    color: theme.colors.black,
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
  iconContainer: {
    width: scale(40),
    height: scale(25),
    borderRadius: scale(12),
    justifyContent: "center",
    alignItems: "center",
  },
  versionText: {
    textAlign: "center",
    color: theme.colors.grayMedium,
    fontSize: 12,
    marginTop: verticalScale(30),
    fontFamily: theme.fonts.regular,
  },
});

export default ProfileScreen;
