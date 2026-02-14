import React from "react";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons, Feather } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import theme, { scale, verticalScale } from "@/theme";
import SafeScreen from "@/components/SafeScreen";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import { FocusAwareStatusBar } from "@/components/StatusBar";
import LoadingState from "@/components/LoadingState";

const WishlistScreen = () => {
  const router = useRouter();
  const {
    wishlist,
    isLoading,
    isError,
    removeFromWishlist,
    isRemovingFromWishlist,
  } = useWishlist();
  const { addToCart, isAddingToCart } = useCart();

  const handleRemoveFromWishlist = (productId: string, productName: string) => {
    Alert.alert(
      "Remove from wishlist",
      `Remove ${productName} from wishlist?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Remove",
          style: "destructive",
          onPress: () => removeFromWishlist(productId),
        },
      ],
    );
  };

  const handleAddToCart = (productId: string, productName: string) => {
    addToCart(
      { productId, quantity: 1 },
      {
        onSuccess: () =>
          Alert.alert("Success", `${productName} added to cart!`),
        onError: (error: any) =>
          Alert.alert(
            "Error",
            error?.response?.data?.error || "Failed to add to cart",
          ),
      },
    );
  };

  if (isLoading) {
    return (
      <SafeScreen
        style={{ flex: 1, backgroundColor: theme.colors.backgroundhome }}
      >
        <FocusAwareStatusBar style="dark" />
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wishlist</Text>
        </View>
        <LoadingState message="Loading your items..." />
      </SafeScreen>
    );
  }

  if (isError) {
    return (
      <SafeScreen
        style={{ flex: 1, backgroundColor: theme.colors.backgroundhome }}
      >
        <FocusAwareStatusBar style="dark" />
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Ionicons
              name="chevron-back"
              size={24}
              color={theme.colors.primary}
            />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Wishlist</Text>
        </View>
        <View style={styles.emptyContainer}>
          <Feather
            name="alert-triangle"
            size={60}
            color={theme.colors.primary}
          />
          <Text style={styles.emptyTitle}>Failed to load wishlist!</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.back()}
          >
            <Text style={styles.browseButtonText}>Please Try Again</Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen
      style={{ flex: 1, backgroundColor: theme.colors.backgroundhome }}
    >
      <FocusAwareStatusBar style="dark" />

      {/* HEADER */}
      <View style={styles.headerRow}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Wishlist</Text>
        <Text style={styles.itemCount}>
          {wishlist?.length || 0} {wishlist?.length === 1 ? "item" : "items"}
        </Text>
      </View>

      {wishlist?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="heart" size={80} color={theme.colors.grayMedium} />
          <Text style={styles.emptyTitle}>Your wishlist is empty</Text>
          <Text style={styles.emptySubtitle}>
            Start adding products you love!
          </Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text style={styles.browseButtonText}>Browse Products</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {wishlist.map((item) => (
            <View key={item._id} style={styles.productCard}>
              <View style={styles.cardInfo}>
                <Image
                  source={item.images[0]}
                  style={styles.productImage}
                  contentFit="cover"
                />
                <View style={styles.textContainer}>
                  <Text style={styles.productName} numberOfLines={2}>
                    {item.name}
                  </Text>
                  <Text style={styles.productPrice}>
                    ${item.price.toFixed(2)}
                  </Text>
                  <View style={styles.stockRow}>
                    <View
                      style={[
                        styles.stockDot,
                        { backgroundColor: item.stock > 0 ? theme.colors.green : theme.colors.red },
                      ]}
                    />
                    <Text
                      style={[
                        styles.stockStatus,
                        { color: item.stock > 0 ? theme.colors.green : theme.colors.red },
                      ]}
                    >
                      {item.stock > 0 ? `${item.stock} in stock` : "Out of Stock"}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  style={styles.removeBtn}
                  onPress={() => handleRemoveFromWishlist(item._id, item.name)}
                  disabled={isRemovingFromWishlist}
                >
                  <Feather name="trash-2" size={20} color={theme.colors.red} />
                </TouchableOpacity>
              </View>

              {item.stock > 0 && (
                <TouchableOpacity
                  style={styles.addToCartBtn}
                  onPress={() => handleAddToCart(item._id, item.name)}
                  disabled={isAddingToCart}
                >
                  {isAddingToCart ? (
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.white}
                    />
                  ) : (
                    <Text style={styles.addToCartText}>Add to Cart</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          ))}
        </ScrollView>
      )}
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(20),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
  },
  backButton: { padding: 5, marginRight: scale(10) },
  headerTitle: {
    fontSize: 22,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.heading,
  },
  itemCount: {
    marginLeft: "auto",
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(30),
  },
  productCard: {
    backgroundColor: theme.colors.white,
    borderRadius: scale(20),
    padding: scale(15),
    marginBottom: verticalScale(15),
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  cardInfo: { flexDirection: "row", alignItems: "center" },
  productImage: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(12),
    backgroundColor: theme.colors.surface,
  },
  textContainer: {
    flex: 1,
    marginLeft: scale(15),
  },
  productName: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
  },
  productPrice: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginTop: 4,
  },
  stockRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 4,
  },
  stockDot: {
    width: scale(8),
    height: scale(8),
    borderRadius: scale(4),
    marginRight: scale(6),
  },
  stockStatus: {
    fontSize: 12,
    fontFamily: theme.fonts.medium,
  },
  removeBtn: { padding: 8 },
  addToCartBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: scale(12),
    paddingVertical: verticalScale(12),
    alignItems: "center",
    marginTop: verticalScale(12),
  },
  addToCartText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.bold,
    fontSize: 14,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(40),
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    marginTop: verticalScale(20),
    color: theme.colors.black,
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
  browseButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: scale(30),
    paddingVertical: verticalScale(15),
    borderRadius: scale(15),
    marginTop: verticalScale(25),
  },
  browseButtonText: { color: theme.colors.white, fontFamily: theme.fonts.bold },
});

export default WishlistScreen;
