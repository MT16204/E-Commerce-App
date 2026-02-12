import React from "react";
import { View, Text, TouchableOpacity, } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import theme from "../theme";
import { StyleSheet } from "react-native";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Animated.View
          entering={FadeInDown.duration(800).springify()}
          style={styles.logoContainer}
        >
          <Text style={styles.logoText}>NOVA</Text>
          <MaterialIcons
            name="shopping-cart"
            size={36}
            color={theme.colors.primary}
          />
        </Animated.View>

        <View style={styles.textSection}>
          <Animated.Text
            entering={FadeInUp.delay(200).duration(600)}
            style={styles.title}
          >
            Welcome to NOVA
          </Animated.Text>
          <Animated.Text
            entering={FadeInUp.delay(400).duration(600)}
            style={styles.subtitle}
          >
            Millions of products at your fingertips. Experience the fastest and
            most secure way to shop online.
          </Animated.Text>
        </View>

        <Animated.View
          entering={FadeInUp.delay(600).duration(600)}
          style={styles.buttonSection}
        >
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/(auth)/signUp" as any)}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => router.push("/(auth)/signIn" as any)}
          >
            <Text style={styles.outlineButtonText}>Sign In</Text>
          </TouchableOpacity>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 40,
  },
  logoText: {
    fontSize: 38,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primary,
    letterSpacing: 4,
  },
  textSection: {
    alignItems: "center",
    marginBottom: 50,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.fonts.bold,
    color: "#272727",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.grayMedium,
    textAlign: "center",
    marginTop: 15,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  buttonSection: {
    width: "100%",
    gap: 15,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary,
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: theme.colors.white,
    fontSize: 17,
    fontFamily: theme.fonts.semiBold,
    padding: 10,
  },
  outlineButton: {
    height: 58,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#EBEBEB",
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButtonText: {
    color: "#272727",
    fontSize: 17,
    fontFamily: theme.fonts.semiBold,
    padding: 10,
  },
  // dividerContainer: {
  //   flexDirection: "row",
  //   alignItems: "center",
  //   marginVertical: 25,
  // },
  // line: {
  //   flex: 1,
  //   height: 1,
  //   backgroundColor: "#F4F4F4", // F4F4F4 [cite: 2026-01-14]
  // },
  // dividerText: {
  //   paddingHorizontal: 15,
  //   color: theme.colors.grayMedium,
  //   fontSize: 14,
  // },
  // socialRow: {
  //   flexDirection: "row",
  //   justifyContent: "center",
  //   gap: 20,
  // },
  // socialButton: {
  //   width: 60,
  //   height: 60,
  //   borderRadius: 30,
  //   backgroundColor: "#F4F4F4",
  //   alignItems: "center",
  //   justifyContent: "center",
  //   borderWidth: 1,
  //   borderColor: "#EBEBEB",
  // },
});
