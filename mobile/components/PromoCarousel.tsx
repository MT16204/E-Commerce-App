import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  Dimensions,
  NativeScrollEvent,
  NativeSyntheticEvent,
} from "react-native";
import { Image } from "expo-image";
import theme, { scale, verticalScale } from "@/theme";

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const CARD_WIDTH = SCREEN_WIDTH - scale(32);

const PROMOS = [
  {
    id: "1",
    title: "Fashion Collection",
    desc: "Explore the latest trends and upgrade your wardrobe today",
    image: require("@/assets/images/promo-1.png"),
  },
  {
    id: "2",
    title: "Jewelry Collection",
    desc: "Elegant pieces crafted to make you shine every moment",
    image: require("@/assets/images/promo-2.jpeg"),
  },
  {
    id: "3",
    title: "Tech Essentials",
    desc: "Discover cutting-edge gadgets for your modern lifestyle",
    image: require("@/assets/images/promo-3.png"),
  },
  {
    id: "4",
    title: "Beauty & Cosmetics",
    desc: "Premium skincare and makeup for your daily glow",
    image: require("@/assets/images/promo-4.png"),
  },
  {
    id: "5",
    title: "Sports & Fitness",
    desc: "Gear up with quality equipment for an active lifestyle",
    image: require("@/assets/images/promo-5.png"),
  },
];

const PromoCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const scrollTo = (index: number) => {
    flatListRef.current?.scrollToIndex({
      index,
      animated: true,
    });
  };

  useEffect(() => {
    const timer = setInterval(() => {
      const nextIndex = (currentIndex + 1) % PROMOS.length;
      scrollTo(nextIndex);
    }, 4000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  const onMomentumScrollEnd = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / CARD_WIDTH);
    setCurrentIndex(index);
  };

  const renderItem = ({ item }: { item: (typeof PROMOS)[0] }) => (
    <View style={[styles.card, { width: CARD_WIDTH }]}>
      <View style={styles.textSide}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.desc}>{item.desc}</Text>

        <View style={styles.indicatorContainer}>
          {PROMOS.map((_, index) => (
            <TouchableOpacity key={index} onPress={() => scrollTo(index)}>
              <View
                style={[
                  styles.dot,
                  index === currentIndex ? styles.dotLong : styles.dotSmall,
                  {
                    backgroundColor:
                      index === currentIndex
                        ? theme.colors.primary
                        : theme.colors.grayLight,
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Image Side */}
      <View style={styles.imageSide}>
        <Image source={item.image} style={styles.promoImg} contentFit="cover" />
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={PROMOS}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={onMomentumScrollEnd}
        snapToInterval={CARD_WIDTH}
        decelerationRate="fast"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: verticalScale(25),
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: scale(32),
    height: verticalScale(165),
    flexDirection: "row",
    overflow: "hidden",
    alignItems: "center",
  },
  textSide: {
    flex: 1,
    paddingLeft: scale(25),
    paddingRight: scale(10),
    justifyContent: "center",
    zIndex: 10,
  },
  imageSide: {
    flex: 1,
    height: "100%",
  },
  title: {
    fontSize: theme.fontSize.FONT_22Px,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
    marginBottom: verticalScale(8),
  },
  desc: {
    fontSize: theme.fontSize.FONT_12Px,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  promoImg: {
    width: "100%",
    height: "100%",
    position: "absolute",
    right: -scale(5),
  },
  indicatorContainer: {
    flexDirection: "row",
    marginTop: verticalScale(20),
    alignItems: "center",
  },
  dot: {
    height: 4,
    borderRadius: 2,
    marginRight: 6,
  },
  dotLong: {
    width: scale(22),
  },
  dotSmall: {
    width: scale(4),
  },
});

export default PromoCarousel;
