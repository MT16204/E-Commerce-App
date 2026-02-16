import React, { useMemo, useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  StyleSheet,
  StatusBar,
  Alert,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons, Octicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import theme, { scale, verticalScale } from "@/theme";
import SafeScreen from "@/components/SafeScreen";
import ProductsGrid from "@/components/ProductsGrid";
import useProducts from "@/hooks/useProducts";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import LoadingState from "@/components/LoadingState";
import PromoCarousel from "@/components/PromoCarousel";
import ProductCard from "@/components/ProductCard";

const CATEGORIES = [
  { name: "All", icon: "apps" as const, isIcon: true },
  {
    name: "Sports",
    image: require("@/assets/images/sport.svg"),
    isIcon: false,
  },
  {
    name: "Furniture",
    image: require("@/assets/images/furniture.svg"),
    isIcon: false,
  },
  {
    name: "Electronics",
    image: require("@/assets/images/electronic.svg"),
    isIcon: false,
  },
  { name: "Books", image: require("@/assets/images/books.svg"), isIcon: false },
  {
    name: "Fashion",
    image: require("@/assets/images/fashion.svg"),
    isIcon: false,
  },
  { name: "Shoes", image: require("@/assets/images/shoes.svg"), isIcon: false },
  {
    name: "Cosmetics",
    image: require("@/assets/images/cosmetics.svg"),
    isIcon: false,
  },
];
const HomeScreen = () => {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const scrollRef = useRef<ScrollView>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isAddingToCart, addToCart } = useCart();
  const { data: products, isLoading, isError } = useProducts();

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(
      { productId, quantity: 1 },
      {
        onSuccess: () =>
          Alert.alert("Success", `${productName} added to cart!`),
        onError: (err: any) =>
          Alert.alert("Error", err?.response?.data?.error || "Failed"),
      },
    );
  };

  const baseFiltered = useMemo(() => {
    if (!products) return [];
    let filtered = products;
    if (selectedCategory !== "All") {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }
    if (searchQuery.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()),
      );
    }
    return filtered;
  }, [products, selectedCategory, searchQuery]);

  const popularSection = useMemo(() => {
    return [...baseFiltered]
      .filter((p) => (p.totalReviews || 0) > 100)
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0))
      .slice(0, 6);
  }, [baseFiltered]);

  const newArrivalsSection = useMemo(() => {
    return [...baseFiltered].reverse().slice(0, 10);
  }, [baseFiltered]);

  const handleScroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        x: direction === "left" ? 0 : scale(450),
        animated: true,
      });
    }
  };

  useEffect(() => {
    if (popularSection.length === 0 || isLoading) return;

    const interval = setInterval(() => {
      const nextIndex = (currentIndex + 1) % popularSection.length;
      setCurrentIndex(nextIndex);
      const itemWidth = scale(165) + scale(12);
      scrollRef.current?.scrollTo({
        x: nextIndex * itemWidth,
        animated: true,
      });
    }, 2000);

    return () => clearInterval(interval);
  }, [currentIndex, popularSection.length, isLoading]);

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        translucent
        backgroundColor="transparent"
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: verticalScale(100) }}
      >
        {/* HEADER SECTION */}
        <ImageBackground
          source={require("@/assets/images/headerbackground.png")}
          style={styles.headerImageBg}
          imageStyle={styles.headerImageStyle}
        >
          <SafeScreen>
            <View style={styles.headerInner}>
              <View style={styles.topRow}>
                <Text style={styles.logoText}>NOVA</Text>
                <View style={styles.headerIcons}>
                  <TouchableOpacity style={styles.iconButton}>
                    <Ionicons
                      name="chatbubble-outline"
                      size={24}
                      color={theme.colors.white}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}>
                    <Ionicons
                      name="notifications-outline"
                      size={24}
                      color={theme.colors.white}
                    />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.searchBox}>
                <Octicons
                  name="search"
                  size={20}
                  color={theme.colors.grayMedium}
                />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search..."
                  placeholderTextColor={theme.colors.textPlaceholder}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                <TouchableOpacity>
                  <Octicons
                    name="sliders"
                    size={18}
                    color={theme.colors.black}
                  />
                </TouchableOpacity>
              </View>

              <Text style={styles.categoryTitle}>Popular Categories</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.catList}
              >
                {CATEGORIES.map((item, index) => {
                  const isSelected = selectedCategory === item.name;
                  return (
                    <TouchableOpacity
                      key={index}
                      style={styles.catItem}
                      onPress={() => setSelectedCategory(item.name)}
                    >
                      <View
                        style={[
                          styles.catIconCircle,
                          isSelected && { backgroundColor: theme.colors.black },
                        ]}
                      >
                        {item.isIcon ? (
                          <Ionicons
                            name={item.icon as any}
                            size={28}
                            color={
                              isSelected
                                ? theme.colors.primary
                                : theme.colors.black
                            }
                          />
                        ) : (
                          <Image
                            source={item.image}
                            style={{ width: scale(28), height: scale(28) }}
                            contentFit="contain"
                            tintColor={
                              isSelected
                                ? theme.colors.primary
                                : theme.colors.black
                            }
                          />
                        )}
                      </View>
                      <Text style={styles.catLabel}>{item.name}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          </SafeScreen>
        </ImageBackground>

        {/* CONTENT BODY */}
        <View style={styles.contentBody}>
          <PromoCarousel />

          {isLoading ? (
            <View style={styles.statusContainer}>
              <LoadingState />
            </View>
          ) : isError ? (
            <View style={styles.statusContainer}>
              <Ionicons
                name="alert-circle-outline"
                size={48}
                color={theme.colors.red}
              />
              <Text style={[styles.statusText, { color: theme.colors.red }]}>
                Something went wrong!
              </Text>
            </View>
          ) : (
            <>
              {/* SECTION: MOST POPULAR */}
              <View style={styles.listHeader}>
                <Text style={styles.listTitle}>Most Popular</Text>
                <TouchableOpacity
                  onPress={() => router.push("/popular-products")}
                >
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>

              <View style={styles.horizontalWrapper}>
                <ScrollView
                  ref={scrollRef}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.horizontalScrollContent}
                  snapToInterval={scale(165) + scale(12)}
                  decelerationRate="fast"
                  onMomentumScrollEnd={(event) => {
                    const newIndex = Math.round(
                      event.nativeEvent.contentOffset.x /
                        (scale(165) + scale(12)),
                    );
                    setCurrentIndex(newIndex);
                  }}
                >
                  {popularSection.map((item) => (
                    <ProductCard
                      key={item._id}
                      product={item}
                      horizontal={true}
                      isFavorite={isInWishlist(item._id)}
                      isAddingToCart={isAddingToCart}
                      onToggleWishlist={toggleWishlist}
                      onAddToCart={handleAddToCart}
                    />
                  ))}
                </ScrollView>
              </View>

              {/* SECTION: NEW ARRIVALS */}
              <View style={styles.listHeader}>
                <Text style={styles.listTitle}>New Arrivals</Text>
                <TouchableOpacity
                  onPress={() => router.push("/new-arrivals" as any)}
                >
                  <Text style={styles.seeAllText}>See All</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.productsContainer}>
                <ProductsGrid
                  products={newArrivalsSection}
                  isLoading={isLoading}
                  isError={isError}
                />
              </View>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.backgroundhome },
  headerImageBg: { width: "100%", minHeight: verticalScale(300) },
  headerImageStyle: {
    borderBottomLeftRadius: scale(32),
    borderBottomRightRadius: scale(32),
  },
  headerInner: { paddingHorizontal: scale(16) },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(10),
    marginBottom: verticalScale(30),
  },
  logoText: {
    fontSize: theme.fontSize.FONT_20Px,
    fontFamily: theme.fonts.medium,
    color: theme.colors.white,
    letterSpacing: 2.8,
  },
  headerIcons: { flexDirection: "row" },
  iconButton: { marginLeft: scale(15) },
  searchBox: {
    backgroundColor: theme.colors.white,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: scale(18),
    height: verticalScale(48),
    marginBottom: verticalScale(20),
  },
  searchInput: {
    flex: 1,
    marginLeft: scale(10),
    fontFamily: theme.fonts.regular,
    fontSize: theme.fontSize.FONT_14Px,
  },
  categoryTitle: {
    fontSize: theme.fontSize.FONT_20Px,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.white,
    marginBottom: verticalScale(25),
  },
  catList: { paddingBottom: verticalScale(20), paddingRight: scale(15) },
  catItem: { alignItems: "center", width: scale(70) },
  catIconCircle: {
    width: scale(48),
    height: scale(48),
    borderRadius: scale(27),
    backgroundColor: theme.colors.white,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(8),
  },
  catLabel: {
    color: theme.colors.white,
    fontSize: theme.fontSize.FONT_12Px,
    fontFamily: theme.fonts.medium,
  },
  contentBody: { paddingHorizontal: scale(16), marginTop: verticalScale(20) },
  listHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: verticalScale(15),
  },
  listTitle: {
    fontSize: theme.fontSize.FONT_20Px,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.black,
  },
  seeAllText: {
    fontSize: theme.fontSize.FONT_14Px,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primary,
  },
  statusContainer: {
    minHeight: verticalScale(200),
    alignItems: "center",
    justifyContent: "center",
  },
  productsContainer: { flex: 1 },
  statusText: {
    marginTop: verticalScale(12),
    fontSize: theme.fontSize.FONT_14Px,
    fontFamily: theme.fonts.medium,
  },
  popularWrapper: {
    position: "relative",
    marginHorizontal: scale(-16),
    justifyContent: "center",
  },
  horizontalScrollContent: { paddingHorizontal: scale(20) },
  horizontalWrapper: { marginHorizontal: scale(-16) , marginBottom: scale(20)},
});

export default HomeScreen;
