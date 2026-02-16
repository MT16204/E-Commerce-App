import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSignUp } from "@clerk/clerk-expo";
import theme, { scale, verticalScale } from "../../theme";
import { SafeAreaView } from "react-native-safe-area-context";
import useSocialAuth from "@/hooks/useSocialAuth";

export default function SignUpScreen() {
  const router = useRouter();
  const { isLoaded, signUp } = useSignUp();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const { loadingStrategy, handleSocialAuth } = useSocialAuth();

  const isFormValid =
    username.trim() !== "" && email.includes("@") && password.length >= 8;

  const onSignUpPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      await signUp.create({
        username: username,
        emailAddress: email,
        password,
        firstName: username,
      });

      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      router.push({
        pathname: "/verify" as any,
        params: { email, mode: "signup" },
      });
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].message);
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
          <Animated.View entering={FadeInDown.duration(300)}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => router.back()}
            >
              <Ionicons
                name="chevron-back"
                size={24}
                color={theme.colors.heading}
              />
            </TouchableOpacity>
          </Animated.View>

          <Animated.View entering={FadeInDown.delay(100).duration(600)}>
            <Text style={styles.headerTitle}>Create your{"\n"}account</Text>
          </Animated.View>

          <View style={styles.form}>
            <Animated.View
              entering={FadeInUp.delay(200)}
              style={styles.inputContainer}
            >
              <Ionicons
                name="person"
                size={20}
                color={
                  username
                    ? theme.colors.textPrimary
                    : theme.colors.textPlaceholder
                }
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Username"
                placeholderTextColor={theme.colors.textPlaceholder}
                style={styles.input}
                value={username}
                onChangeText={setUsername}
              />
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(300)}
              style={styles.inputContainer}
            >
              <Ionicons
                name="mail"
                size={20}
                color={
                  email
                    ? theme.colors.textPrimary
                    : theme.colors.textPlaceholder
                }
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Email Address"
                placeholderTextColor={theme.colors.textPlaceholder}
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </Animated.View>

            <Animated.View
              entering={FadeInUp.delay(400)}
              style={styles.inputContainer}
            >
              <Ionicons
                name="lock-closed"
                size={22}
                color={
                  password
                    ? theme.colors.textPrimary
                    : theme.colors.textPlaceholder
                }
                style={styles.inputIcon}
              />
              <TextInput
                placeholder="Password"
                placeholderTextColor={theme.colors.textPlaceholder}
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color={
                    showPassword
                      ? theme.colors.textPrimary
                      : theme.colors.textPlaceholder
                  }
                />
              </TouchableOpacity>
            </Animated.View>

            <TouchableOpacity
              style={[
                styles.signUpButton,
                {
                  backgroundColor:
                    isFormValid && !loading
                      ? theme.colors.primary
                      : theme.colors.primaryDisabled,
                },
              ]}
              disabled={!isFormValid || loading}
              onPress={onSignUpPress}
            >
              <Text style={styles.signUpButtonText}>
                {loading ? "Processing..." : "Sign up"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.socialSection}>
            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.line} />
            </View>

            {/* <View style={styles.socialButtonsRow}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialAuth("oauth_google")}
                disabled={loadingStrategy !== null}
              >
                <Ionicons name="logo-google" size={28} color="#EA4335" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialAuth("oauth_apple")}
                disabled={loadingStrategy !== null}
              >
                <Ionicons
                  name="logo-apple"
                  size={28}
                  color={theme.colors.black}
                />
              </TouchableOpacity>
            </View> */}
          </View>

          <Animated.View entering={FadeInUp.delay(600)} style={styles.footer}>
            <Text style={styles.footerText}>Already have an account ? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signIn")}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </Animated.View>
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
    paddingBottom: verticalScale(30),
  },
  backButton: {
    width: scale(48),
    height: scale(48),
    borderRadius: theme.borderRadius.full,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(16),
    marginBottom: verticalScale(24),
  },
  headerTitle: {
    fontSize: theme.fontSize.FONT_42Px,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.heading,
    lineHeight: verticalScale(50),
    marginBottom: verticalScale(32),
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
  },
  inputIcon: {
    marginRight: scale(12),
  },
  input: {
    flex: 1,
    fontSize: theme.fontSize.FONT_14Px,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.regular,
  },
  signUpButton: {
    height: verticalScale(49),
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(24),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  signUpButtonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSize.FONT_16Px,
  },
  socialSection: {
    marginTop: verticalScale(40),
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(24),
    justifyContent: "center",
  },
  line: {
    width: scale(100),
    height: 1,
    backgroundColor: theme.colors.surfaceVariant,
  },
  dividerText: {
    marginHorizontal: scale(12),
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.FONT_12Px,
    fontFamily: theme.fonts.regular,
  },
  socialButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: scale(20),
  },
  socialButton: {
    width: scale(64),
    height: scale(64),
    borderRadius: 16,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: verticalScale(40),
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.FONT_12Px,
    fontFamily: theme.fonts.regular,
  },
  signInLink: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSize.FONT_12Px,
  },
});
