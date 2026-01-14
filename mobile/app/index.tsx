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
import theme from "@/theme";

export default function Index() {
  const router = useRouter();

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

    const timer = setTimeout(() => {
      // Thay đổi đường dẫn này tới nơi chứa Onboarding của bạn
      // Ví dụ nếu bạn để trong (auth)/onboarding
      router.replace("/onboarding");
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

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
    backgroundColor: theme.colors.primary, // Màu #5D76FF
    alignItems: "center",
    justifyContent: "center",
  },
  logoText: {
    fontFamily: theme.fonts.medium,
    fontSize: theme.fontSize.FONT_42Px,
    letterSpacing: 10,
    color: theme.colors.white,
  },
});
