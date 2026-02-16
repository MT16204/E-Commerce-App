import React, { useState, useRef, useEffect } from "react";
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
import { useRouter, useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import { useSignUp, useSignIn } from "@clerk/clerk-expo";
import theme, { scale, verticalScale } from "@/theme";
import { SafeAreaView } from "react-native-safe-area-context";

export default function VerifyScreen() {
  const router = useRouter();
  const { email, mode } = useLocalSearchParams();
  const {
    signUp,
    isLoaded: isSignUpLoaded,
    setActive: setSignUpActive,
  } = useSignUp();
  const {
    signIn,
    isLoaded: isSignInLoaded,
    setActive: setSignInActive,
  } = useSignIn();

  const otpLength = 6;
  const [code, setCode] = useState(new Array(otpLength).fill(""));
  const [timer, setTimer] = useState(30);
  const [loading, setLoading] = useState(false); 
  const inputs = useRef<TextInput[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleInput = (text: string, index: number) => {
    const newCode = [...code];
    newCode[index] = text;
    setCode(newCode);
    if (text && index < otpLength - 1) {
      inputs.current[index + 1]?.focus();
    }
  };

  const onVerify = async () => {
    const fullCode = code.join("");
    if (fullCode.length !== otpLength) return;

    setLoading(true); 
    try {
      if (mode === "signup" && isSignUpLoaded) {
        const result = await signUp.attemptEmailAddressVerification({
          code: fullCode,
        });
        if (result.status === "complete") {
          await setSignUpActive({ session: result.createdSessionId });
          router.replace("/(tabs)/home");
        }
      } else if (mode === "reset" && isSignInLoaded) {
        const result = await signIn.attemptFirstFactor({
          strategy: "reset_password_email_code",
          code: fullCode,
        });
        if (result.status === "needs_new_password") {
          router.push({ pathname: "/reset" as any, params: { email } });
        }
      }
    } catch (err: any) {
      Alert.alert(
        "Verification Failed",
        err.errors?.[0]?.message ||
          "Code verification failed. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  const isComplete = code.every((d) => d !== "");

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
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

            <Animated.Text
              entering={FadeInDown.duration(400)}
              style={styles.headerTitle}
            >
              Verify Account
            </Animated.Text>
          </View>

          <Animated.Text
            entering={FadeInDown.delay(100)}
            style={styles.subText}
          >
            We've sent a {otpLength} digit verification code to{"\n"}
            <Text
              style={{
                color: theme.colors.heading,
                fontFamily: theme.fonts.semiBold,
              }}
            >
              {email}
            </Text>
          </Animated.Text>

          <Animated.View
            entering={FadeInUp.delay(200)}
            style={styles.otpContainer}
          >
            {code.map((digit, i) => (
              <TextInput
                key={i}
                ref={(el) => {
                  inputs.current[i] = el as TextInput;
                }}
                style={[
                  styles.otpBox,
                  digit ? styles.otpBoxActive : null,
                  loading && { opacity: 0.5 }, 
                ]}
                keyboardType="number-pad"
                maxLength={1}
                onChangeText={(text) => handleInput(text, i)}
                editable={!loading} 
                onKeyPress={({ nativeEvent }) => {
                  if (nativeEvent.key === "Backspace" && !code[i] && i > 0) {
                    inputs.current[i - 1]?.focus();
                  }
                }}
                value={digit}
              />
            ))}
          </Animated.View>

          <TouchableOpacity
            style={[
              styles.verifyButton,
              {
                backgroundColor:
                  isComplete && !loading
                    ? theme.colors.primary
                    : theme.colors.primaryDisabled,
              },
            ]}
            onPress={onVerify}
            disabled={!isComplete || loading}
          >
            <Text style={styles.verifyButtonText}>
              {loading ? "Processing..." : "Verify OTP"}
            </Text>
          </TouchableOpacity>

          <View style={styles.footer}>
            {timer > 0 ? (
              <Text style={styles.footerText}>
                Resend code in (00:{timer.toString().padStart(2, "0")})
              </Text>
            ) : (
              <TouchableOpacity onPress={() => setTimer(30)} disabled={loading}>
                <Text style={styles.signUpLink}>Resend Code</Text>
              </TouchableOpacity>
            )}
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
    marginBottom: verticalScale(60),
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
  subText: {
    fontSize: theme.fontSize.FONT_14Px,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    textAlign: "center",
    lineHeight: verticalScale(22),
    marginBottom: verticalScale(40),
  },
  otpContainer: {
    flexDirection: "row",
    justifyContent: "center",
    gap: scale(2),
    marginBottom: verticalScale(40),
  },
  otpBox: {
    width: scale(54),
    height: scale(64),
    backgroundColor: theme.colors.surface, 
    borderRadius: 12,
    textAlign: "center",
    fontSize: 22,
    fontFamily: theme.fonts.bold,
    color: theme.colors.heading,
    borderWidth: 1.5,
    borderColor: "transparent",
  },
  otpBoxActive: {
    borderColor: theme.colors.primary,
    backgroundColor: theme.colors.white,
  },
  verifyButton: {
    height: verticalScale(50),
    borderRadius: 25,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(10),
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  verifyButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.FONT_16Px,
    fontFamily: theme.fonts.bold,
  },
  timerText: {
    fontSize: theme.fontSize.FONT_14Px,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.regular,
  },
  footer: {
    marginTop: verticalScale(30),
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  footerText: {
    fontSize: theme.fontSize.FONT_14Px,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.regular,
  },
  signUpLink: {
    color: theme.colors.textLink,
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSize.FONT_14Px,
    marginLeft: scale(4),
  },
});
