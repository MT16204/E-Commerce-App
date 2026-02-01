import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import theme from "@/theme";
import { styles } from "./styles";

export default function SignInScreen() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const isFormValid = email.trim() !== "" && password.trim().length >= 6;

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
          {/* Nút Back - Theo Figma: X: 24, Y: 231 */}
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

            <TouchableOpacity style={styles.forgotPassword}>
              <Text style={styles.forgotPasswordText}>Forgot Password ?</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.signInButton,
                {
                  backgroundColor: isFormValid
                    ? theme.colors.primary
                    : theme.colors.primaryDisabled,
                },
              ]}
              disabled={!isFormValid}
              onPress={() => router.replace("/(tabs)")}
            >
              <Text style={styles.signInButtonText}>Sign in</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.socialSection}>
            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.socialButtonsRow}>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-google" size={24} color="#EA4335" />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons
                  name="logo-apple"
                  size={24}
                  color={theme.colors.black}
                />
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Ionicons name="logo-facebook" size={24} color="#1877F2" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Footer - Theo Figma: Gap 12px */}
          <View style={styles.footer}>
            <Text style={styles.footerText}>Dont have an Account ? </Text>
            <TouchableOpacity onPress={() => router.push("/signUp")}>
              <Text style={styles.signUpLink}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
