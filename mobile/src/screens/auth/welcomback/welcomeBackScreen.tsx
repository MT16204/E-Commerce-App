import React from "react";
import { View, Text, TouchableOpacity, SafeAreaView } from "react-native";
import { useRouter } from "expo-router";
import { MaterialIcons, Ionicons } from "@expo/vector-icons";
import Animated, { FadeInUp, FadeInDown } from "react-native-reanimated";
import theme from "@/theme";
import { styles } from "./styles";

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* LOGO SECTION - THEO PHONG CÁCH LOVABLE */}
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

        {/* Nút bấm hành động */}
        <Animated.View
          entering={FadeInUp.delay(600).duration(600)}
          style={styles.buttonSection}
        >
          <TouchableOpacity
            style={styles.primaryButton}
            onPress={() => router.push("/signUp" as any)}
          >
            <Text style={styles.primaryButtonText}>Get Started</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.outlineButton}
            onPress={() => router.push("/signIn" as any)}
          >
            <Text style={styles.outlineButtonText}>Sign In</Text>
          </TouchableOpacity>

          <View style={styles.dividerContainer}>
            <View style={styles.line} />
            <Text style={styles.dividerText}>Or continue with</Text>
            <View style={styles.line} />
          </View>

          <View style={styles.socialRow}>
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
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}
