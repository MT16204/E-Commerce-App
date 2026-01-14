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
import theme from "@/theme";
import { styles } from "./styles";

const slides = [
  {
    id: 1,
    image: require("../../assets/images/onboarding-1.png"),
    title: "Latest Fashion",
    subtitle: "New Styles, New Trends",
    description:
      "Discover trendy fashion items and explore the newest collections.",
  },
  {
    id: 2,
    image: require("../../assets/images/onboarding-2.png"),
    title: "All Types Offers",
    subtitle: "Within Your Reach",
    description:
      "From casual to formal, find everything you need in one place.",
  },
  {
    id: 3,
    image: require("../../assets/images/onboarding-3.png"),
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
      router.replace("/welcomeScreen" as any);
    }
  };

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.skipContainer}
        onPress={() => router.replace("/welcomeScreen" as any)}
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
