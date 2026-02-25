import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useUser } from "@clerk/clerk-expo";
import { Image } from "expo-image";

import theme, { scale, verticalScale } from "@/theme";
import SafeScreen from "@/components/SafeScreen";
import ScreenHeader from "@/components/ScreenHeader";
import { FocusAwareStatusBar } from "@/components/StatusBar";

const EditProfileScreen = () => {
  const router = useRouter();
  const { user, isLoaded } = useUser();

  const [fullName, setFullName] = useState(user?.fullName || "");
  const [email] = useState(user?.emailAddresses[0]?.emailAddress || "");
  const [phone, setPhone] = useState(user?.phoneNumbers[0]?.phoneNumber || "");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const nameParts = fullName.split(" ");
      await user?.update({
        firstName: nameParts[0],
        lastName: nameParts.slice(1).join(" "),
      });
      if (newPassword) {
        if (!currentPassword) {
          Alert.alert(
            "Error",
            "Please enter current password to set a new one",
          );
          setLoading(false);
          return;
        }
        await user?.updatePassword({
          currentPassword,
          newPassword,
        });
      }

      Alert.alert("Success", "Profile updated successfully!");
      router.back();
    } catch (err: any) {
      Alert.alert("Error", err.errors?.[0]?.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeScreen style={styles.container}>
      <FocusAwareStatusBar style="dark" />
      <ScreenHeader title="Edit Profile" />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {/* AVATAR SECTION */}
          <View style={styles.avatarContainer}>
            <Image
              source={user?.imageUrl}
              style={styles.avatar}
              contentFit="cover"
            />
            <TouchableOpacity style={styles.editBadge}>
              <Ionicons name="pencil" size={14} color={theme.colors.white} />
            </TouchableOpacity>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Full Name</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={fullName}
                  onChangeText={setFullName}
                  placeholder="Enter your name"
                />
              </View>
            </View>

            {/* EMAIL (Read Only - Clerk managed) */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email Address</Text>
              <View style={[styles.inputWrapper, { opacity: 0.6 }]}>
                <TextInput
                  style={styles.input}
                  value={email}
                  editable={false}
                />
                <Ionicons
                  name="mail-outline"
                  size={20}
                  color={theme.colors.black}
                />
              </View>
            </View>

            <View style={styles.divider} />
            <Text style={styles.sectionTitle}>Security</Text>

            {/* CURRENT PASSWORD */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Current Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={currentPassword}
                  onChangeText={setCurrentPassword}
                  secureTextEntry={!showPass}
                  placeholder="Enter new password"
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  <Ionicons
                    name={showPass ? "eye-off" : "eye"}
                    size={20}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* NEW PASSWORD */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>New Password</Text>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={newPassword}
                  onChangeText={setNewPassword}
                  secureTextEntry={!showPass}
                  placeholder="Enter new password"
                />
                <TouchableOpacity onPress={() => setShowPass(!showPass)}>
                  <Ionicons
                    name={showPass ? "eye-off" : "eye"}
                    size={20}
                    color={theme.colors.primary}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </ScrollView>

        <View style={styles.footer}>
          <TouchableOpacity
            style={[styles.updateBtn, loading && { opacity: 0.7 }]}
            onPress={handleUpdateProfile}
            disabled={loading}
          >
            <Text style={styles.updateBtnText}>
              {loading ? "Updating..." : "Update"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.white }, 
  scrollContent: {
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(30),
  },
  avatarContainer: {
    alignSelf: "center",
    marginVertical: verticalScale(20),
    position: "relative",
  },
  avatar: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    backgroundColor: "#F4F4F4",
  },
  editBadge: {
    position: "absolute",
    bottom: 0,
    right: 0,
    backgroundColor: theme.colors.primary,
    padding: scale(6),
    borderRadius: scale(10),
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },
  form: { marginTop: verticalScale(10) },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    marginBottom: verticalScale(15),
  },
  label: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    marginBottom: verticalScale(8),
    color: "#272727",
  },
  inputGroup: { marginBottom: verticalScale(20) },
  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F4F4F4",
    height: verticalScale(56),
    borderRadius: scale(16),
    paddingHorizontal: scale(16),
  },
  input: {
    flex: 1,
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: "#000000",
  },
  divider: {
    height: 1,
    backgroundColor: "#EBEBEB",
    marginVertical: verticalScale(20),
  },
  footer: { padding: scale(24), backgroundColor: "#FFFFFF" },
  updateBtn: {
    backgroundColor: theme.colors.primary,
    height: verticalScale(56),
    borderRadius: scale(28),
    justifyContent: "center",
    alignItems: "center",
  },
  updateBtnText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },
});

export default EditProfileScreen;
