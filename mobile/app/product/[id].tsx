import React, { useState } from "react";
import {
  View,
  Text,
  Alert,
  ActivityIndicator,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import SafeScreen from "@/components/SafeScreen";
import useCart from "@/hooks/useCart";
import { useProduct } from "@/hooks/useProduct";
import useWishlist from "@/hooks/useWishlist";
import theme, { scale, verticalScale } from "@/theme";
import { FocusAwareStatusBar } from "@/components/StatusBar";

const { width } = Dimensions.get("window");

const ProductDetailScreen = () => {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: product, isError, isLoading } = useProduct(id);
  const { addToCart, isAddingToCart } = useCart();
  const {
    isInWishlist,
    toggleWishlist,
    isAddingToWishlist,
    isRemovingFromWishlist,
  } = useWishlist();

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart(
      { productId: product._id, quantity },
      {
        onSuccess: () =>
          Alert.alert("Success", `${product.name} added to cart!`),
        onError: (error: any) => {
          Alert.alert(
            "Error",
            error?.response?.data?.error || "Failed to add to cart",
          );
        },
      },
    );
  };

  if (isLoading) return <LoadingUI />;
  if (isError || !product) return <ErrorUI />;

  const inStock = product.stock > 0;
  const isFavorite = isInWishlist(product._id);

  return (
    <SafeScreen style={styles.container}>
      <FocusAwareStatusBar style="dark" />
      {/* HEADER OVERLAY */}
      <View style={styles.headerButtons}>
        <TouchableOpacity
          style={styles.circleBtn}
          onPress={() => router.back()}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.black} />
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.circleBtn,
            isFavorite && { backgroundColor: theme.colors.white },
          ]}
          onPress={() => toggleWishlist(product._id)}
          disabled={isAddingToWishlist || isRemovingFromWishlist}
          activeOpacity={0.7}
        >
          {isAddingToWishlist || isRemovingFromWishlist ? (
            <ActivityIndicator
              size="small"
              color={isFavorite ? theme.colors.primary : theme.colors.black}
            />
          ) : (
            <Ionicons
              name={isFavorite ? "heart" : "heart-outline"}
              size={24}
              color={isFavorite ? theme.colors.primary : theme.colors.black}
            />
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        {/* IMAGE GALLERY */}
        <View style={styles.galleryContainer}>
          <ScrollView
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={(e) => {
              const index = Math.round(e.nativeEvent.contentOffset.x / width);
              setSelectedImageIndex(index);
            }}
            scrollEventThrottle={16}
          >
            {product.images.map((image: string, index: number) => (
              <Image
                key={index}
                source={image}
                style={{ width, height: 420 }}
                contentFit="cover"
              />
            ))}
          </ScrollView>

          {/* Indicators */}
          <View style={styles.indicatorWrapper}>
            {product.images.map((_: any, index: number) => (
              <View
                key={index}
                style={[
                  styles.dot,
                  index === selectedImageIndex
                    ? styles.activeDot
                    : styles.inactiveDot,
                ]}
              />
            ))}
          </View>
        </View>

        {/* PRODUCT CONTENT */}
        <View style={styles.content}>
          <View style={styles.categoryBadge}>
            <Text style={styles.categoryText}>{product.category}</Text>
          </View>

          <Text style={styles.productName}>{product.name}</Text>

          <View style={styles.metaRow}>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={16} color="#FFC107" />
              <Text style={styles.ratingText}>
                {product.averageRating.toFixed(1)}
              </Text>
              <Text style={styles.reviewText}>
                ({product.totalReviews} reviews)
              </Text>
            </View>

            <View style={styles.stockWrapper}>
              <View
                style={[
                  styles.stockDot,
                  { backgroundColor: inStock ? theme.colors.green : theme.colors.red },
                ]}
              />
              <Text
                style={[
                  styles.stockText,
                  { color: inStock ? theme.colors.green : theme.colors.red },
                ]}
              >
                {inStock ? `${product.stock} in stock` : "Out of Stock"}
              </Text>
            </View>
          </View>

          {/* <Text style={styles.price}>${product.price.toFixed(2)}</Text> */}

          {/* QUANTITY SELECTOR */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quantity</Text>
            <View style={styles.quantityRow}>
              <TouchableOpacity
                style={styles.qtyBtn}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={!inStock}
              >
                <Ionicons name="remove" size={24} color={theme.colors.black} />
              </TouchableOpacity>

              <Text style={styles.qtyValue}>{quantity}</Text>

              <TouchableOpacity
                style={[
                  styles.qtyBtn,
                  { backgroundColor: theme.colors.primary },
                ]}
                onPress={() =>
                  setQuantity(Math.min(product.stock, quantity + 1))
                }
                disabled={!inStock || quantity >= product.stock}
              >
                <Ionicons name="add" size={24} color={theme.colors.white} />
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>
        </View>
      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={styles.bottomBar}>
        <View style={styles.priceInfo}>
          <Text style={styles.totalLabel}>Total Price</Text>
          <Text style={styles.totalPrice}>
            ${(product.price * quantity).toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          style={[
            styles.addCartBtn,
            !inStock && { backgroundColor: theme.colors.grayMedium },
          ]}
          onPress={handleAddToCart}
          disabled={!inStock || isAddingToCart}
        >
          {isAddingToCart ? (
            <ActivityIndicator color={theme.colors.white} />
          ) : (
            <>
              <Ionicons name="cart" size={22} color={theme.colors.white} />
              <Text style={styles.addCartText}>
                {inStock ? "Add to Cart" : "Sold Out"}
              </Text>
            </>
          )}
        </TouchableOpacity>
      </View>
    </SafeScreen>
  );
};

function ErrorUI() {
  return (
    <SafeScreen style={styles.center}>
      <Ionicons
        name="alert-circle-outline"
        size={80}
        color={theme.colors.grayMedium}
      />
      <Text style={styles.errorTitle}>Product not found</Text>
      <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
        <Text style={styles.backBtnText}>Go Back</Text>
      </TouchableOpacity>
    </SafeScreen>
  );
}

function LoadingUI() {
  return (
    <SafeScreen style={styles.center}>
      <ActivityIndicator size="large" color={theme.colors.primary} />
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.backgroundhome },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  headerButtons: {
    position: "absolute",
    top: verticalScale(70),
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: scale(20),
  },
  circleBtn: {
    width: scale(45),
    height: scale(45),
    borderRadius: 25,
    backgroundColor: "rgba(255,255,255,0.9)",
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  galleryContainer: { backgroundColor: theme.colors.surface },
  indicatorWrapper: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    width: "100%",
    justifyContent: "center",
    gap: 6,
  },
  dot: { height: 6, borderRadius: 3 },
  activeDot: { width: 20, backgroundColor: theme.colors.primary },
  inactiveDot: { width: 6, backgroundColor: "rgba(0,0,0,0.2)" },
  content: { padding: scale(20) },
  categoryBadge: {
    backgroundColor: "#F0F3FF",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
    marginBottom: 10,
  },
  categoryText: {
    color: theme.colors.primary,
    fontSize: 12,
    fontFamily: theme.fonts.bold,
  },
  productName: {
    fontSize: 28,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
    marginBottom: 10,
  },
  metaRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 15,
  },
  ratingText: {
    marginLeft: 4,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
  },
  reviewText: { marginLeft: 4, color: theme.colors.grayMedium, fontSize: 12 },
  stockWrapper: { flexDirection: "row", alignItems: "center", marginLeft: 15 },
  stockDot: { width: 8, height: 8, borderRadius: 4, marginRight: 6 },
  stockText: { fontSize: 13, fontFamily: theme.fonts.semiBold },
  price: {
    fontSize: 32,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginBottom: 25,
  },
  section: { marginBottom: 25 },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.black,
    marginBottom: 12,
  },
  quantityRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  qtyBtn: {
    width: 45,
    height: 45,
    borderRadius: 23,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyValue: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    marginHorizontal: 20,
  },
  description: {
    fontSize: 15,
    color: theme.colors.grayMedium,
    lineHeight: 24,
    fontFamily: theme.fonts.regular,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    backgroundColor: theme.colors.white,
    paddingHorizontal: scale(20),
    paddingVertical: verticalScale(15),
    paddingBottom: verticalScale(30),
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: theme.colors.surfaceVariant,
  },
  priceInfo: { flex: 1 },
  totalLabel: {
    fontSize: 12,
    color: theme.colors.grayMedium,
    fontFamily: theme.fonts.bold,
  },
  totalPrice: {
    fontSize: 28,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.black,
  },
  addCartBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(45),
    height: verticalScale(55),
    borderRadius: 15,
    gap: 8,
  },
  addCartText: {
    color: theme.colors.white,
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },
  errorTitle: {
    fontSize: 18,
    color: theme.colors.grayMedium,
    marginTop: 15,
  },
  backBtn: {
    marginTop: 20,
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 25,
    paddingVertical: 12,
    borderRadius: 10,
  },
  backBtnText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.bold,
  },
  loadingText: {
    marginTop: 10,
    color: theme.colors.grayMedium,
  },
});

export default ProductDetailScreen;
