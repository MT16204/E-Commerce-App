import React, { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import Animated, {
  FadeInRight,
  FadeOutLeft,
  LinearTransition,
  FadeInDown,
} from "react-native-reanimated";
import theme from "../theme";
import { StyleSheet } from "react-native";

const slides = [
  {
    id: 1,
    image: require("../assets/images/onboarding-1.png"),
    title: "Latest Fashion",
    subtitle: "New Styles, New Trends",
    description:
      "Discover trendy fashion items and explore the newest collections.",
  },
  {
    id: 2,
    image: require("../assets/images/onboarding-2.png"),
    title: "All Types Offers",
    subtitle: "Within Your Reach",
    description:
      "From casual to formal, find everything you need in one place.",
  },
  {
    id: 3,
    image: require("../assets/images/onboarding-3.png"),
    title: "Easy Shopping",
    subtitle: "Everything in One App",
    description:
      "Add to cart, checkout fast, and enjoy a smooth shopping experience.",
  },
];

export default function OnboardingScreen() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const router = useRouter();

  const handleNext = () => {
    if (currentSlide < slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    } else {
      router.replace("/welcome" as any);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.skipContainer}
        onPress={() => router.replace("/welcome" as any)}
      >
        <Text style={styles.skipText}>Skip</Text>
      </TouchableOpacity>

      <View style={styles.content}>
        {/* 1. HIỆU ỨNG ẢNH: Fade từ phải qua trái */}
        <View style={styles.imageWrapper}>
          <Animated.Image
            key={`img-${currentSlide}`}
            entering={FadeInRight.duration(600)}
            exiting={FadeOutLeft.duration(400)}
            source={slides[currentSlide].image}
            style={styles.image}
            resizeMode="cover"
          />
        </View>

        <View style={styles.textSection}>
          <Animated.Text
            key={`title-${currentSlide}`}
            entering={FadeInDown.delay(200).duration(500).springify()}
            style={styles.title}
          >
            {slides[currentSlide].title}
          </Animated.Text>

          <Animated.Text
            key={`sub-${currentSlide}`}
            entering={FadeInDown.delay(300).duration(500).springify()}
            style={styles.subtitle}
          >
            {slides[currentSlide].subtitle}
          </Animated.Text>

          <Animated.Text
            key={`desc-${currentSlide}`}
            entering={FadeInDown.delay(400).duration(500).springify()}
            style={styles.description}
          >
            {slides[currentSlide].description}
          </Animated.Text>
        </View>

        <View style={styles.footer}>
          <View style={styles.dotContainer}>
            {slides.map((_, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => goToSlide(index)}
                activeOpacity={0.7}
              >
                <Animated.View
                  layout={LinearTransition.springify()}
                  style={[
                    styles.dot,
                    index === currentSlide ? styles.activeDot : null,
                  ]}
                />
              </TouchableOpacity>
            ))}
          </View>
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Ionicons
              name="arrow-forward"
              size={30}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white, 
  },
  skipContainer: {
    position: "absolute",
    top: 60,
    right: 30,
    zIndex: 10,
  },
  skipText: {
    color: theme.colors.grayMedium, 
    fontSize: 16,
    fontFamily: theme.fonts.medium,
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 100,
  },
  imageWrapper: {
    width: "100%",
    height: 420,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 90,
    overflow: "hidden",
    backgroundColor: theme.colors.surface, 
    marginBottom: 35,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textSection: {
    gap: 8,
  },
  title: {
    fontSize: 30,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black, 
  },
  subtitle: {
    fontSize: 30,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
  },
  description: {
    fontSize: 15,
    color: theme.colors.grayMedium, // 999999 [cite: 2026-01-14]
    lineHeight: 22,
    fontFamily: theme.fonts.regular,
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 40,
  },
  dotContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EBEBEB", 
  },
  activeDot: {
    width: 28,
    backgroundColor: theme.colors.primary, 
  },
  nextButton: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: theme.colors.primary, 
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});

