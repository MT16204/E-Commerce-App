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
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import Animated, { FadeInDown, FadeInUp } from "react-native-reanimated";
import theme from "@/theme";
import { styles } from "./styles";

export default function SignUpScreen() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Logic: Nút bấm sáng màu chủ đạo khi form hợp lệ
  const isFormValid =
    username.trim() !== "" && email.includes("@") && password.length >= 6;

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
          {/* Nút Back */}
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

          {/* Tiêu đề */}
          <Animated.View entering={FadeInDown.delay(100).duration(600)}>
            <Text style={styles.headerTitle}>Create your{"\n"}account</Text>
          </Animated.View>

          {/* Form */}
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

            {/* Email Input */}
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

            {/* Password Input */}
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
                  name={showPassword ? "eye" : "eye-off"}
                  size={20}
                  color={
                    showPassword
                      ? theme.colors.textPrimary
                      : theme.colors.textPlaceholder
                  }
                />
              </TouchableOpacity>
            </Animated.View>

            {/* Submit Button */}
              <TouchableOpacity
                style={[
                  styles.signUpButton,
                  {
                    backgroundColor: isFormValid
                      ? theme.colors.primary
                      : theme.colors.primaryDisabled,
                  },
                ]}
                disabled={!isFormValid}
                onPress={() =>
                  console.log("Sign up:", { username, email, password })
                }
              >
                <Text style={styles.signUpButtonText}>Sign up</Text>
              </TouchableOpacity>
          </View>

          {/* Social Section */}
          <View style={styles.socialSection}>
            <View style={styles.dividerRow}>
              <View style={styles.line} />
              <Text style={styles.dividerText}>Or continue with</Text>
              <View style={styles.line} />
            </View>

            <View style={styles.socialButtonsRow}>
              {["logo-google", "logo-apple", "logo-facebook"].map(
                (icon, index) => (
                  <TouchableOpacity key={index} style={styles.socialButton}>
                    <Ionicons
                      name={icon as any}
                      size={28}
                      color={
                        icon === "logo-google"
                          ? "#EA4335"
                          : icon === "logo-facebook"
                          ? "#1877F2"
                          : theme.colors.black
                      }
                    />
                  </TouchableOpacity>
                )
              )}
            </View>
          </View>

          {/* Footer */}
          <Animated.View entering={FadeInUp.delay(600)} style={styles.footer}>
            <Text style={styles.footerText}>Already have an account ? </Text>
            <TouchableOpacity onPress={() => router.push("/signIn")}>
              <Text style={styles.signInLink}>Sign In</Text>
            </TouchableOpacity>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
