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
    title: "Today's Special",
    desc: "Get discount for every order, only for today",
    image: require("@/assets/images/promo-4.png"),
  },
  {
    id: "2",
    title: "New Arrival",
    desc: "Check out our latest premium collections",
    image: require("@/assets/images/promo-1.jpeg"),
  },
  {
    id: "3",
    title: "Flash Sale",
    desc: "Limited time offer up to 50% off",
    image: require("@/assets/images/promo-2.jpeg"),
  },
  {
    id: "4",
    title: "Flash Sale",
    desc: "Limited time offer up to 50% off",
    image: require("@/assets/images/promo-3.jpeg"),
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

  // Tự động chạy
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
      {/* Text Side */}
      <View style={styles.textSide}>
        <Text style={styles.title}>{item.title}</Text>
        <Text style={styles.desc}>{item.desc}</Text>

        {/* Indicators */}
        <View style={styles.indicatorContainer}>
          {PROMOS.map((_, index) => (
            <TouchableOpacity key={index} onPress={() => scrollTo(index)}>
              <View
                style={[
                  styles.dot,
                  index === currentIndex ? styles.dotLong : styles.dotSmall,
                  {
                    backgroundColor:
                      index === currentIndex ? theme.colors.primary : theme.colors.grayLight,
                  },
                ]}
              />
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Image Side */}
      <View style={styles.imageSide}>
        <Image
          source={item.image}
          style={styles.promoImg}
          contentFit="contain"
        />
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
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: scale(32),
    height: verticalScale(165),
    flexDirection: "row",
    paddingLeft: scale(25),
    overflow: "hidden",
    alignItems: "center",
  },
  textSide: {
    flex: 1.4,
    justifyContent: "center",
  },
  imageSide: {
    flex: 1,
    height: "100%",
    justifyContent: "flex-end",
    alignItems: "flex-end",
  },
  title: {
    fontSize: theme.fontSize.FONT_20Px,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.textPrimary,
    marginBottom: verticalScale(10),
  },
  desc: {
    fontSize: theme.fontSize.FONT_12Px,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    // lineHeight: 20,
    // width: "90%",
  },
  promoImg: {
    width: scale(180),
    height: "150%",
    position: "absolute",
    right: -scale(15),
    bottom: -verticalScale(50),
  },
  indicatorContainer: {
    flexDirection: "row",
    marginTop: verticalScale(18),
    alignItems: "center",
    alignSelf: "flex-start",
  },
  dot: {
    height: 5,
    borderRadius: 5,
    marginRight: 6,
  },
  dotLong: { width: scale(24) },
  dotSmall: { width: 6 },
});

export default PromoCarousel;
