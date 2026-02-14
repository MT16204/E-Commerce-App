import React, { useMemo, useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ImageBackground,
  StyleSheet,
  StatusBar,
  FlatList,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons, Octicons } from "@expo/vector-icons";
import theme, { scale, verticalScale } from "@/theme";
import SafeScreen from "@/components/SafeScreen";
import ProductsGrid from "@/components/ProductsGrid";
import useProducts from "@/hooks/useProducts";
import LoadingState from "@/components/LoadingState";
import PromoCarousel from "@/components/PromoCarousel";

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
  {
    name: "Books",
    image: require("@/assets/images/books.svg"),
    isIcon: false,
  },
  {
    name: "Clothes",
    image: require("@/assets/images/clothes.svg"),
    isIcon: false,
  },
  { name: "Shoes", image: require("@/assets/images/shoes.svg"), isIcon: false },
  {
    name: "Cosmetics",
    image: require("@/assets/images/cosmetics.svg"),
    isIcon: false,
  },
];

const PROMOS = [
  {
    id: "1",
    title: "Today's Special",
    desc: "Get discount for every order, only for today",
    image: require("@/assets/images/promo.png"),
  },
  {
    id: "2",
    title: "New Arrival",
    desc: "Check out our latest premium collections",
    image: require("@/assets/images/promo.png"),
  },
  {
    id: "3",
    title: "Flash Sale",
    desc: "Limited time offer up to 50% off",
    image: require("@/assets/images/promo.png"),
  },
];

const HomeScreen = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");

  const { data: products, isLoading, isError } = useProducts();

  const filteredProducts = useMemo(() => {
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

  const flatListRef = useRef<FlatList>(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      let nextIndex = (currentIndex + 1) % PROMOS.length;
      setCurrentIndex(nextIndex);
      flatListRef.current?.scrollToIndex({ index: nextIndex, animated: true });
    }, 4000);
    return () => clearInterval(timer);
  }, [currentIndex]);

  return (
    <View style={styles.container}>
      {/* Để StatusBar translucent để ảnh nền tràn lên đỉnh */}
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

              {/* Search Box */}
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

              {/* Horizontal Categories */}
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
                            transition={200}
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

        {/* PROMO & PRODUCTS SECTION */}
        <View style={styles.contentBody}>
            <PromoCarousel />

          <View style={styles.listHeader}>
            <Text style={styles.listTitle}>Most Popular</Text>
            <Text style={styles.itemCountText}>
              {filteredProducts.length} items
            </Text>
          </View>

          {isLoading ? (
            <View style={styles.statusContainer}>
              <LoadingState />
            </View>
          ) : isError ? (
            <View style={styles.statusContainer}>
              <Ionicons name="alert-circle-outline" size={48} color={theme.colors.red} />
              <Text style={[styles.statusText, { color: theme.colors.red }]}>
                Something went wrong!
              </Text>
            </View>
          ) : (
            <View style={styles.productsContainer}>
              <ProductsGrid
                products={filteredProducts}
                isLoading={isLoading}
                isError={isError}
              />
            </View>
          )}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundhome,
  },
  headerImageBg: {
    width: "100%",
    minHeight: verticalScale(300), 
  },
  headerImageStyle: {
    borderBottomLeftRadius: scale(32),
    borderBottomRightRadius: scale(32),
  },
  headerInner: {
    paddingHorizontal: scale(16),
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: verticalScale(10),
    marginBottom: verticalScale(20),
  },
  logoText: {
    fontSize: theme.fontSize.FONT_20Px,
    fontFamily: theme.fonts.medium,
    color: theme.colors.white,
    letterSpacing: 2.8,
  },
  headerIcons: {
    flexDirection: "row",
  },
  iconButton: {
    marginLeft: scale(15),
  },
  searchBox: {
    backgroundColor: theme.colors.white,
    flexDirection: "row",
    alignItems: "center",
    borderRadius: theme.borderRadius.full,
    paddingHorizontal: scale(18),
    height: verticalScale(48),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 3,
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
    marginBottom: verticalScale(15),
  },
  catList: {
    paddingBottom: verticalScale(20),
  },
  catItem: {
    alignItems: "center",
    marginRight: scale(15),
  },
  catIconCircle: {
    width: scale(54),
    height: scale(54),
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
  contentBody: {
    paddingHorizontal: scale(16),
    marginTop: verticalScale(20),
  },
  // promoCard: {
  //   backgroundColor: theme.colors.surface,
  //   borderRadius: scale(32),
  //   flexDirection: "row",
  //   height: verticalScale(160),
  //   padding: scale(20),
  //   alignItems: "center",
  //   overflow: "hidden",
  //   marginBottom: verticalScale(25),
  // },
  // promoTextSide: {
  //   flex: 1.2,
  //   zIndex: 2,
  // },
  // promoHeading: {
  //   fontSize: theme.fontSize.FONT_24Px,
  //   fontFamily: theme.fonts.bold,
  //   color: theme.colors.black,
  //   marginBottom: verticalScale(5),
  // },
  // promoDesc: {
  //   fontSize: theme.fontSize.FONT_12Px,
  //   fontFamily: theme.fonts.regular,
  //   color: theme.colors.black,
  //   lineHeight: 16,
  // },
  // promoImg: {
  //   width: scale(160),
  //   height: "120%",
  //   position: "absolute",
  //   right: -scale(10),
  //   top: 0,
  // },
  // pageIndicator: {
  //   flexDirection: "row",
  //   marginTop: verticalScale(15),
  //   alignItems: "center",
  // },
  // dotLong: {
  //   width: scale(24),
  //   height: 4,
  //   borderRadius: 4,
  //   backgroundColor: theme.colors.primary,
  //   marginRight: 4,
  // },
  // dotSmall: {
  //   width: 4,
  //   height: 4,
  //   borderRadius: 2,
  //   marginRight: 4,
  // },
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
  itemCountText: {
    fontSize: theme.fontSize.FONT_13Px,
    fontFamily: theme.fonts.medium,
    color: theme.colors.primary,
  },
  statusContainer: {
    minHeight: verticalScale(200),
    alignItems: "center",
    justifyContent: "center",
  },
  productsContainer: {
    flex: 1,
  },
  statusText: {
    marginTop: verticalScale(12),
    fontSize: theme.fontSize.FONT_14Px,
    fontFamily: theme.fonts.medium,
  },
});

export default HomeScreen;
