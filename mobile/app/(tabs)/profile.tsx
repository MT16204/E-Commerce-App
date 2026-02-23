import React, { useCallback, useState } from "react";
import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Modal,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons"; 
import { useRouter } from "expo-router";
import { useAuth, useUser } from "@clerk/clerk-expo";

import theme, { scale, verticalScale } from "@/theme";
import SafeScreen from "@/components/SafeScreen";
import { FocusAwareStatusBar } from "@/components/StatusBar";

interface MenuItem {
  id: string;
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  action: any;
}

const MENU_GROUPS: MenuItem[] = [
  {
    id: "edit",
    icon: "person",
    title: "Edit Profile",
    action: "/(profile)/edit-profile",
  },
  {
    id: "address",
    icon: "location",
    title: "Address",
    action: "/addresses",
  },
  {
    id: "orders",
    icon: "bag-handle",
    title: "My Orders",
    action: "/orders",
  },
  {
    id: "wishlist",
    icon: "heart",
    title: "Wishlist",
    action: "/wishList",
  },
  {
    id: "notif",
    icon: "notifications",
    title: "Notifications",
    action: "/notifications",
  },
  {
    id: "privacy",
    icon: "lock-closed",
    title: "Privacy & Security",
    action: "/privacy-security",
  },
  {
    id: "help",
    icon: "help-circle",
    title: "Help Center",
    action: "/help-center",
  },
];

const ProfileScreen = () => {
  const router = useRouter();
  const { signOut } = useAuth();
  const { user } = useUser();
  const [isLogoutVisible, setIsLogoutVisible] = useState(false);

  return (
    <SafeScreen
      style={{ flex: 1, backgroundColor: theme.colors.backgroundhome }}
    >
      <FocusAwareStatusBar style="dark" />

      {/* MODAL LOGOUT */}
      <Modal
        visible={isLogoutVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setIsLogoutVisible(false)}
      >
        <Pressable
          style={styles.modalOverlay}
          onPress={() => setIsLogoutVisible(false)}
        >
          <View style={styles.modalContent}>
            <View style={styles.dragHandle} />
            <Text style={styles.modalTitle}>Logout</Text>
            <View style={styles.modalDivider} />
            <Text style={styles.modalSubtitle}>
              Are you sure you want to log out?
            </Text>
            <View style={styles.modalButtons}>
              <TouchableOpacity
                style={[styles.btnAction, styles.btnCancel]}
                onPress={() => setIsLogoutVisible(false)}
              >
                <Text style={styles.btnCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.btnAction, styles.btnLogout]}
                onPress={() => {
                  setIsLogoutVisible(false);
                  signOut();
                }}
              >
                <Text style={styles.btnLogoutText}>Yes, Logout</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Pressable>
      </Modal>

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
              size={28}
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
              onPress={() => router.push(item.action)}
            >
              <View style={styles.menuLeft}>
                <View style={styles.iconContainer}>
                  <Ionicons
                    name={item.icon}
                    size={22}
                    color={theme.colors.primary}
                  />
                </View>
                <Text style={styles.menuTitle}>{item.title}</Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={20}
                color={theme.colors.textPlaceholder}
              />
            </TouchableOpacity>
          ))}

          <TouchableOpacity
            style={[styles.menuItem, { borderBottomWidth: 0 }]}
            onPress={() => setIsLogoutVisible(true)}
          >
            <View style={styles.menuLeft}>
              <View
                style={[styles.iconContainer, { backgroundColor: "#FFF1F1" }]}
              >
                <Ionicons
                  name="log-out-outline"
                  size={20}
                  color={theme.colors.red}
                />
              </View>
              <Text style={[styles.menuTitle, { color: theme.colors.red }]}>
                Logout
              </Text>
            </View>
          </TouchableOpacity>
        </View>
        <Text style={styles.versionText}>Version 1.0.2 (2026)</Text>
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  mainContainer: { flex: 1, backgroundColor: theme.colors.backgroundhome },
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
  backButton: { padding: 5, marginRight: scale(10) },
  headerTitle: {
    fontSize: 22,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.heading,
  },
  avatarSection: { alignItems: "center", marginVertical: verticalScale(20) },
  avatar: {
    width: scale(90),
    height: scale(90),
    borderRadius: scale(45),
    backgroundColor: theme.colors.surface,
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
  menuContainer: { marginTop: verticalScale(10) },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: verticalScale(18),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surfaceVariant,
  },
  menuLeft: { flexDirection: "row", alignItems: "center" },
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
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  modalContentContainer: {
    width: "100%",
  },
  modalContent: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: scale(40),
    borderTopRightRadius: scale(40),
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(40),
    alignItems: "center",
  },
  dragHandle: {
    width: scale(40),
    height: verticalScale(5),
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 10,
    marginTop: verticalScale(12),
    marginBottom: verticalScale(24),
  },
  modalTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.red,
    marginBottom: verticalScale(20),
  },
  modalDivider: {
    width: "100%",
    height: 1,
    backgroundColor: theme.colors.surface,
    marginBottom: verticalScale(24),
  },
  modalSubtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.black,
    textAlign: "center",
    marginBottom: verticalScale(30),
  },
  modalButtons: {
    flexDirection: "row",
    width: "100%",
    marginBottom: verticalScale(10),
  },
  btnAction: {
    flex: 1,
    height: verticalScale(45),
    borderRadius: scale(30),
    justifyContent: "center",
    alignItems: "center",
  },
  btnCancel: {
    backgroundColor: theme.colors.surfaceVariant,
    marginRight: scale(10),
  },
  btnLogout: { backgroundColor: theme.colors.primary, marginLeft: scale(10) },
  btnCancelText: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.black,
  },
  btnLogoutText: {
    fontSize: 16,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.white,
  },
});

export default ProfileScreen;
