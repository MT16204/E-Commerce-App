import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Alert,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSignIn, useClerk } from "@clerk/clerk-expo"; 
import theme, { scale, verticalScale } from "@/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ResetScreen() {
  const router = useRouter();
  const { signIn, isLoaded } = useSignIn();
  const { signOut } = useClerk(); 

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const isFormValid = password.length >= 8 && confirmPassword.length >= 8;

  const handleReset = async () => {
    if (!isLoaded) return;

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const result = await signIn.resetPassword({ password });

      if (result.status === "complete") {
        Alert.alert(
          "Success",
          "Your password has been updated. Please sign in with your new password.",
          [
            {
              text: "Sign In",
              onPress: async () => {
                await signOut();
                router.replace("/signIn");
              },
            },
          ],
        );
      }
    } catch (err: any) {
      Alert.alert("Error", err.errors[0]?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.headerRow}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
              disabled={loading}
            >
              <Ionicons
                name="chevron-back"
                size={22}
                color={theme.colors.heading}
              />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Create New Password</Text>
          </View>

          <Animated.Image
            entering={FadeInDown.duration(600)}
            source={require("@/assets/images/reset.png")}
            style={styles.illustration}
          />

          <View style={styles.form}>
            {/* Input New Password */}
            <View style={[styles.inputContainer, loading && { opacity: 0.5 }]}>
              <Ionicons
                name="lock-closed"
                size={20}
                color={
                  password
                    ? theme.colors.textPrimary
                    : theme.colors.textPlaceholder
                }
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="New Password"
                placeholderTextColor={theme.colors.textPlaceholder}
                secureTextEntry={!showPassword}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                disabled={loading}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={18}
                  color={
                    showPassword
                      ? theme.colors.textPrimary
                      : theme.colors.textPlaceholder
                  }
                />
              </TouchableOpacity>
            </View>

            {/* Input Confirm Password */}
            <View style={[styles.inputContainer, loading && { opacity: 0.5 }]}>
              <Ionicons
                name="lock-closed"
                size={20}
                color={
                  confirmPassword
                    ? theme.colors.textPrimary
                    : theme.colors.textPlaceholder
                }
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor={theme.colors.textPlaceholder}
                secureTextEntry={!showConfirmPassword}
                style={styles.input}
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                editable={!loading}
              />
              <TouchableOpacity
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                disabled={loading}
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-off" : "eye"}
                  size={18}
                  color={
                    showConfirmPassword
                      ? theme.colors.textPrimary
                      : theme.colors.textPlaceholder
                  }
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={[
                styles.updateButton,
                {
                  backgroundColor:
                    isFormValid && !loading
                      ? theme.colors.primary
                      : theme.colors.primaryDisabled,
                },
              ]}
              disabled={!isFormValid || loading}
              onPress={handleReset}
            >
              <Text style={styles.updateButtonText}>
                {loading ? "Updating..." : "Update Password"}
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(40),
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: verticalScale(16),
    marginBottom: verticalScale(32),
    gap: scale(12),
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  headerTitle: {
    fontSize: 26,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.heading,
  },
  illustration: {
    width: "100%",
    height: verticalScale(220),
    resizeMode: "contain",
    marginBottom: verticalScale(30),
  },
  form: {
    gap: verticalScale(16),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: scale(16),
    height: verticalScale(56),
    borderWidth: 1,
    borderColor: "transparent",
  },
  input: {
    flex: 1,
    fontSize: theme.fontSize.FONT_14Px,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.regular,
  },
  inputIcon: {
    marginRight: scale(12),
  },
  updateButton: {
    height: verticalScale(50),
    borderRadius: 25,
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(24),
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  updateButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.FONT_16Px,
    fontFamily: theme.fonts.bold,
  },
});
