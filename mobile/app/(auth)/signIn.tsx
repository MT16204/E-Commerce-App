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
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSignIn } from "@clerk/clerk-expo";
import theme, { scale, verticalScale } from "../../theme";
import { SafeAreaView } from "react-native-safe-area-context";
import useSocialAuth from "@/hooks/useSocialAuth";

export default function SignInScreen() {
  const router = useRouter();
  const { signIn, setActive, isLoaded } = useSignIn();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { loadingStrategy, handleSocialAuth } = useSocialAuth();

  const isFormValid = email.trim() !== "" && password.trim().length >= 6;

  const onSignInPress = async () => {
    if (!isLoaded) return;
    setLoading(true);
    try {
      const completeSignIn = await signIn.create({
        identifier: email,
        password,
      });

      await setActive({ session: completeSignIn.createdSessionId });

      router.replace("/");
    } catch (err: any) {
      if (err.errors[0].code === "form_identifier_not_found") {
        Alert.alert("Account not found", "Please check your email or sign up.");
      } else {
        Alert.alert("Error", err.errors[0].message);
      }
    } finally {
      setLoading(false);
    }
  };

  const onForgotPassword = async () => {
    if (!isLoaded || !email) {
      Alert.alert("Error", "Please enter your email first");
      return;
    }
    try {
      await signIn.create({
        strategy: "reset_password_email_code",
        identifier: email,
      });
      router.push({
        pathname: "/verify" as any,
        params: { email, mode: "reset" },
      });
    } catch (err: any) {
      Alert.alert("Error", err.errors[0].message);
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="chevron-back"
              size={20}
              color={theme.colors.heading}
            />
          </TouchableOpacity>

          <Animated.View entering={FadeInDown.duration(600)}>
            <Text style={styles.headerTitle}>Sign in</Text>
          </Animated.View>

          <View style={styles.form}>
            <View style={styles.inputContainer}>
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
            </View>

            <View style={styles.inputContainer}>
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
                  size={18}
                  color={
                    showPassword
                      ? theme.colors.textPrimary
                      : theme.colors.textPlaceholder
                  }
                />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.forgotPassword}
              onPress={onForgotPassword}
            >
              <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.signInButton,
                {
                  backgroundColor:
                    isFormValid && !loading
                      ? theme.colors.primary
                      : theme.colors.primaryDisabled,
                },
              ]}
              disabled={!isFormValid || loading}
              onPress={onSignInPress}
            >
              <Text style={styles.signInButtonText}>
                {loading ? "Loading..." : "Sign in"}
              </Text>
            </TouchableOpacity>
          </View>

          <View style={styles.socialSection}>
            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.socialButtonsRow}>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialAuth("oauth_google")}
                disabled={loadingStrategy !== null}
              >
                <Ionicons name="logo-google" size={24} color="#EA4335" />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.socialButton}
                onPress={() => handleSocialAuth("oauth_apple")}
                disabled={loadingStrategy !== null}
              >
                <Ionicons
                  name="logo-apple"
                  size={24}
                  color={theme.colors.black}
                />
              </TouchableOpacity>
              {/* <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={24} color="#1877F2" />
              </TouchableOpacity> */}
            </View>
          </View>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Dont have an Account ? </Text>
            <TouchableOpacity onPress={() => router.push("/(auth)/signUp")}>
              <Text style={styles.signUpLink}>Sign Up</Text>
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
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: 20,
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
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: verticalScale(8),
  },
  forgotPasswordText: {
    color: theme.colors.textLink,
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSize.FONT_12Px,
  },
  signInButton: {
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
  signInButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.FONT_16Px,
    fontFamily: theme.fonts.bold,
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
  signUpLink: {
    color: theme.colors.textLink,
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSize.FONT_12Px,
  },
});
