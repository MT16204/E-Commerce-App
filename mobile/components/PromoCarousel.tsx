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
// Đảm bảo CARD_WIDTH khớp với padding của contentBody ở HomeScreen
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
      {/* Text Side - Dùng flex để ép text phải wrap trong không gian còn lại */}
      <View style={styles.textSide}>
        <Text style={styles.title} numberOfLines={2}>
          {item.title}
        </Text>
        <Text style={styles.desc}>{item.desc}</Text>

        {/* Indicators nằm gọn dưới text */}
        <View style={styles.indicatorContainer}>
          {PROMOS.map((_, index) => (
            <TouchableOpacity key={index} onPress={() => scrollTo(index)}>
              <View
                style={[
                  styles.dot,
                  index === currentIndex ? styles.dotLong : styles.dotSmall,
                  {
                    backgroundColor:
                      index === currentIndex ? theme.colors.primary : "#B2B2B2", // Dùng màu B2B2B2 từ palette của bạn
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
          contentFit="cover" // Đổi sang cover để ảnh tràn đẹp hơn như thiết kế
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
    position: 'absolute',
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
