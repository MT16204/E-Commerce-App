import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Href } from "expo-router";
import { Image } from "expo-image";
import theme, { scale, verticalScale } from "@/theme";
import SafeScreen from "@/components/SafeScreen";
import useProducts from "@/hooks/useProducts";
import useWishlist from "@/hooks/useWishlist";
import useCart from "@/hooks/useCart";
import LoadingState from "@/components/LoadingState";
import ScreenHeader from "@/components/ScreenHeader";
import { FocusAwareStatusBar } from "@/components/StatusBar";
import { Product } from "@/types";

const CATEGORIES = [
  "All",
  "Sports",
  "Furniture",
  "Electronics",
  "Books",
  "Fashion",
  "Shoes",
  "Cosmetics",
];

const PopularProductsScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");
  const { data: products, isLoading } = useProducts();
  const { toggleWishlist, wishlist } = useWishlist();
  const { addToCart, isAddingToCart } = useCart();

  const filteredProducts = useMemo(() => {
    if (!products) return [];

    // 1. Lọc sản phẩm có totalReviews > 100 theo yêu cầu của bạn
    // 2. Sắp xếp theo averageRating giảm dần (Rating cao nhất lên đầu)
    let list = [...products]
      .filter((p) => (p.totalReviews || 0) > 100)
      .sort((a, b) => (b.averageRating || 0) - (a.averageRating || 0));

    // 3. Lọc theo Category nếu không phải "All"
    if (selectedCategory === "All") return list;
    return list.filter((p) => p.category === selectedCategory);
  }, [products, selectedCategory]);

  const handleAddToCart = (product: Product) => {
    addToCart(
      { productId: product._id, quantity: 1 },
      {
        onSuccess: () =>
          Alert.alert("Success", `${product.name} added to cart!`),
      },
    );
  };

  if (isLoading)
    return (
      <SafeScreen style={styles.container}>
        <ScreenHeader title="Most Popular" />
        <LoadingState />
      </SafeScreen>
    );

  return (
    <SafeScreen style={styles.container}>
      <FocusAwareStatusBar style="dark" />
      <ScreenHeader title="Most Popular" count={filteredProducts.length} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.categoryContainer}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.catListScroll}
          >
            {CATEGORIES.map((cat, index) => (
              <TouchableOpacity
                key={index}
                style={[
                  styles.catBtn,
                  selectedCategory === cat && styles.catBtnActive,
                ]}
                onPress={() => setSelectedCategory(cat)}
              >
                <Text
                  style={[
                    styles.catText,
                    selectedCategory === cat && styles.catTextActive,
                  ]}
                >
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>

        <View style={styles.contentBody}>
          {filteredProducts.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                No popular products found in this category.
              </Text>
            </View>
          ) : (
            <View style={styles.customGrid}>
              {filteredProducts.map((product) => {
                const isFavorite = wishlist?.some(
                  (item) => item._id === product._id,
                );
                return (
                  <TouchableOpacity
                    key={product._id}
                    style={styles.card}
                    onPress={() =>
                      router.push(`/product/${product._id}` as Href)
                    }
                  >
                    <View style={styles.imageWrapper}>
                      <Image
                        source={product.images[0]}
                        style={styles.image}
                        contentFit="cover"
                      />
                      {/* Badge hiển thị số lượt Review để người dùng thấy độ Popular */}
                      <View style={styles.popularBadge}>
                        <Ionicons name="flame" size={10} color="#FFD700" />
                        <Text style={styles.popularBadgeText}>
                          {product.totalReviews}
                        </Text>
                      </View>

                      <TouchableOpacity
                        style={styles.heartBtn}
                        onPress={() => toggleWishlist(product._id)}
                      >
                        <Ionicons
                          name={isFavorite ? "heart" : "heart-outline"}
                          size={18}
                          color={
                            isFavorite
                              ? theme.colors.primary
                              : theme.colors.black
                          }
                        />
                      </TouchableOpacity>
                    </View>

                    <View style={styles.info}>
                      <Text style={styles.catName}>{product.category}</Text>
                      <Text style={styles.prodName} numberOfLines={1}>
                        {product.name}
                      </Text>

                      <View style={styles.stockRow}>
                        <View
                          style={[
                            styles.stockDot,
                            {
                              backgroundColor:
                                product.stock > 0
                                  ? theme.colors.primary
                                  : theme.colors.grayMedium,
                            },
                          ]}
                        />
                        <Text style={styles.stockText}>
                          {product.stock} in stock
                        </Text>
                      </View>

                      <View style={styles.footer}>
                        <Text style={styles.price}>
                          ${product.price.toFixed(2)}
                        </Text>
                        <TouchableOpacity
                          style={[
                            styles.addBtn,
                            product.stock === 0 && { opacity: 0.5 },
                          ]}
                          onPress={() => handleAddToCart(product)}
                          disabled={isAddingToCart || product.stock === 0}
                        >
                          {isAddingToCart ? (
                            <ActivityIndicator
                              size="small"
                              color={theme.colors.white}
                            />
                          ) : (
                            <>
                              <Ionicons
                                name="cart"
                                size={14}
                                color={theme.colors.white}
                                style={{ marginRight: 6 }}
                              />
                              <Text style={styles.addBtnText}>Add</Text>
                            </>
                          )}
                        </TouchableOpacity>
                      </View>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.backgroundhome },
  scrollContent: { paddingBottom: verticalScale(40) },
  categoryContainer: {
    marginTop: verticalScale(10),
    marginBottom: verticalScale(15),
  },
  catListScroll: { paddingLeft: scale(20), paddingRight: scale(10) },
  catBtn: {
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(10),
    borderRadius: scale(25),
    backgroundColor: theme.colors.white,
    marginRight: scale(6),
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  catBtnActive: { backgroundColor: theme.colors.primary },
  catText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.black,
  },
  catTextActive: { color: theme.colors.white },
  contentBody: { paddingHorizontal: scale(20) },
  customGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  card: {
    width: "48%",
    backgroundColor: theme.colors.surface,
    borderRadius: scale(24),
    marginBottom: verticalScale(16),
    overflow: "hidden",
  },
  imageWrapper: { position: "relative" },
  image: { width: "100%", height: verticalScale(140) },
  popularBadge: {
    position: "absolute",
    top: scale(10),
    left: scale(10),
    backgroundColor: "rgba(0,0,0,0.6)",
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    zIndex: 1,
  },
  popularBadgeText: {
    color: "#FFF",
    fontSize: 10,
    fontFamily: theme.fonts.bold,
    marginLeft: 4,
  },
  heartBtn: {
    position: "absolute",
    top: scale(10),
    right: scale(10),
    backgroundColor: theme.colors.white,
    padding: scale(8),
    borderRadius: scale(20),
  },
  info: { padding: scale(12) },
  catName: {
    fontSize: 10,
    color: theme.colors.grayMedium,
    fontFamily: theme.fonts.bold,
    textTransform: "uppercase",
  },
  prodName: {
    fontSize: 14,
    color: theme.colors.black,
    fontFamily: theme.fonts.bold,
    marginVertical: 2,
  },
  stockRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  stockDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  stockText: { fontSize: 11, color: theme.colors.textSecondary },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
  },
  addBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: verticalScale(8),
    paddingHorizontal: scale(12),
    borderRadius: scale(12),
    flexDirection: "row",
    alignItems: "center",
  },
  addBtnText: {
    color: theme.colors.white,
    fontSize: 12,
    fontFamily: theme.fonts.bold,
  },
  emptyContainer: { marginTop: verticalScale(50), alignItems: "center" },
  emptyText: { fontFamily: theme.fonts.medium, color: theme.colors.grayMedium },
});

export default PopularProductsScreen;
