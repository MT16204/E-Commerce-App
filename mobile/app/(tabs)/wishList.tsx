import React, { useMemo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, Href } from "expo-router";
import { Image } from "expo-image";

import theme, { scale, verticalScale } from "@/theme";
import SafeScreen from "@/components/SafeScreen";
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
  "Clothes",
  "Shoes",
];

const WishlistScreen = () => {
  const router = useRouter();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const {
    wishlist,
    isLoading,
    toggleWishlist,
    isAddingToWishlist,
    isRemovingFromWishlist,
  } = useWishlist();
  const { addToCart, isAddingToCart } = useCart();

  const filteredWishlist = useMemo(() => {
    if (!wishlist) return [];
    if (selectedCategory === "All") return wishlist;
    return wishlist.filter((p) => p.category === selectedCategory);
  }, [wishlist, selectedCategory]);

  const handleAddToCart = (product: Product) => {
    addToCart(
      { productId: product._id, quantity: 1 },
      {
        onSuccess: () =>
          Alert.alert("Success", `${product.name} added to cart!`),
        onError: (error: any) =>
          Alert.alert("Error", error?.response?.data?.error || "Failed"),
      },
    );
  };

  if (isLoading) {
    return (
      <SafeScreen style={styles.container}>
        <FocusAwareStatusBar style="dark" />
        <ScreenHeader title="My Wishlist" />
        <LoadingState message="Fetching your favorites..." />
      </SafeScreen>
    );
  }

  return (
    <SafeScreen style={styles.container}>
      <FocusAwareStatusBar style="dark" />
      <ScreenHeader title="My Wishlist" count={wishlist?.length || 0} />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* CATEGORIES */}
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

        {/* PRODUCT GRID */}
        <View style={styles.contentBody}>
          {filteredWishlist.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons name="heart-outline" size={80} color={theme.colors.primary} />
              </View>
              <Text style={styles.emptyTitle}>Nothing here yet</Text>
              <Text style={styles.emptySubtitle}>
                Tap the heart icon on any product to save it here for later.
              </Text>
              <TouchableOpacity
                style={styles.browseButton}
                onPress={() => router.push("/(tabs)/home")}
              >
                <Text style={styles.browseButtonText}>Start Shopping</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.customGrid}>
              {filteredWishlist.map((product) => (
                <TouchableOpacity
                  key={product._id}
                  style={styles.card}
                  activeOpacity={0.8}
                  onPress={() => router.push(`/product/${product._id}` as Href)}
                >
                  {/* IMAGE */}
                  <View style={styles.imageWrapper}>
                    <Image
                      source={product.images[0]}
                      style={styles.image}
                      contentFit="cover"
                    />
                    <TouchableOpacity
                      style={styles.heartBtn}
                      onPress={() => toggleWishlist(product._id)}
                      disabled={isAddingToWishlist || isRemovingFromWishlist}
                    >
                      <Ionicons
                        name="heart"
                        size={18}
                        color={theme.colors.primary}
                      />
                    </TouchableOpacity>
                  </View>

                  {/* INFO */}
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
                                : theme.colors.grayLight,
                          },
                        ]}
                      />
                      <Text style={styles.stockText}>
                        <Text
                          style={{
                            color: theme.colors.primary,
                            fontWeight: "700",
                          }}
                        >
                          {product.stock}
                        </Text>{" "}
                        in stock
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
                            <Text style={styles.addBtnText}>Add to Cart</Text>
                          </>
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
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
    color: "#999",
    fontFamily: theme.fonts.bold,
    textTransform: "uppercase",
  },
  prodName: {
    fontSize: 14,
    color: theme.colors.heading,
    fontFamily: theme.fonts.bold,
    marginVertical: 2,
  },
  ratingRow: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  ratingText: { fontSize: 12, fontWeight: "bold", marginLeft: 4 },
  stockRow: { flexDirection: "row", alignItems: "center", marginBottom: 8 },
  stockDot: { width: 6, height: 6, borderRadius: 3, marginRight: 6 },
  stockText: { fontSize: 11, color: theme.colors.textSecondary },
  footer: { marginTop: 4 },
  price: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
    marginBottom: 8,
  },
  addBtn: {
    backgroundColor: theme.colors.primary,
    paddingVertical: verticalScale(8),
    borderRadius: scale(12),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  addBtnText: {
    color: theme.colors.white,
    fontSize: 12,
    fontFamily: theme.fonts.bold,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: scale(70),
    paddingHorizontal: scale(40),
  },
  emptyIconCircle: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
    marginTop: 15,
  },
  emptySubtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
  browseButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: scale(30),
    paddingVertical: verticalScale(12),
    borderRadius: scale(12),
    marginTop: 25,
  },
  browseButtonText: { color: theme.colors.white, fontFamily: theme.fonts.bold },
});

export default WishlistScreen;
