import React, { useEffect } from "react";
import { View, Text, StyleSheet } from "react-native";
import { useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withDelay,
  Easing,
} from "react-native-reanimated";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import theme from "../theme";
import { useAuth } from "@clerk/clerk-expo";

export default function Index() {
  const router = useRouter();
  const { isLoaded, isSignedIn } = useAuth();

  const opacity = useSharedValue(0);
  const scale = useSharedValue(0.8);
  const textX = useSharedValue(-20);
  const iconX = useSharedValue(20);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 800 });
    scale.value = withTiming(1, {
      duration: 800,
      easing: Easing.out(Easing.exp),
    });
    textX.value = withDelay(300, withTiming(0, { duration: 500 }));
    iconX.value = withDelay(500, withTiming(0, { duration: 500 }));
  }, []);

  useEffect(() => {
    if (!isLoaded) return;

    const timer = setTimeout(() => {
      const hasSeenOnboarding = true;

      if (!hasSeenOnboarding) {
        router.replace("/onboarding");
        return;
      }

      if (!isSignedIn) {
        router.replace("/welcome");
        return;
      }

      router.replace("/home");
    }, 2500);

    return () => clearTimeout(timer);
  }, [isLoaded, isSignedIn]);

  const animatedContainerStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
    flexDirection: "row",
    alignItems: "center",
    gap: theme.spacing.sm,
  }));

  return (
    <View style={styles.container}>
      <Animated.View style={animatedContainerStyle}>
        <Animated.View
          style={[
            useAnimatedStyle(() => ({
              transform: [{ translateX: textX.value }],
            })),
          ]}
        >
          <Text style={styles.logoText}>NOVA</Text>
        </Animated.View>

        <Animated.View
          style={[
            useAnimatedStyle(() => ({
              transform: [{ translateX: iconX.value }],
            })),
          ]}
        >
          <MaterialCommunityIcons
            name="cart-outline"
            size={39}
            color={theme.colors.white}
          />
        </Animated.View>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSize.FONT_42Px,
    letterSpacing: 10,
    color: theme.colors.white,
  },
});
