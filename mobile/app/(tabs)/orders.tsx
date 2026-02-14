import React, { useState } from "react";
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
import { useOrders } from "@/hooks/useOrders";
import { useReviews } from "@/hooks/useReviews";
import { capitalizeFirstLetter, formatDate, getStatusColor } from "@/lib/utils";
import { Order } from "@/types";
import { FocusAwareStatusBar } from "@/components/StatusBar";
import LoadingState from "@/components/LoadingState";
import RatingModal from "@/components/RatingModal";

const OrdersScreen = () => {
  const router = useRouter();
  const { data: orders, isLoading, isError } = useOrders();
  const { createReviewAsync, isCreatingReview } = useReviews();

  const [showRatingModal, setShowRatingModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [productRatings, setProductRatings] = useState<{
    [key: string]: number;
  }>({});

  const handleOpenRating = (order: Order) => {
    setShowRatingModal(true);
    setSelectedOrder(order);
    const initialRatings: { [key: string]: number } = {};
    order.orderItems.forEach((item) => {
      initialRatings[item.product._id] = 0;
    });
    setProductRatings(initialRatings);
  };

  const handleSubmitRating = async () => {
    if (!selectedOrder) return;
    const allRated = Object.values(productRatings).every(
      (rating) => rating > 0,
    );
    if (!allRated) {
      Alert.alert("Error", "Please rate all products");
      return;
    }

    try {
      await Promise.all(
        selectedOrder.orderItems.map((item) =>
          createReviewAsync({
            productId: item.product._id,
            orderId: selectedOrder._id,
            rating: productRatings[item.product._id],
          }),
        ),
      );
      Alert.alert("Success", "Thank you for rating all products!");
      setShowRatingModal(false);
      setSelectedOrder(null);
    } catch (error: any) {
      Alert.alert(
        "Error",
        error?.response?.data?.error || "Failed to submit rating",
      );
    }
  };

  // 1. TRẠNG THÁI LOADING
  if (isLoading) {
    return (
      <SafeScreen
        style={{ flex: 1, backgroundColor: theme.colors.backgroundhome }}
      >
        <LoadingState message="Fetching your orders..." />
      </SafeScreen>
    );
  }

  // 2. TRẠNG THÁI LỖI
  if (isError) {
    return (
      <SafeScreen
        style={{ flex: 1, backgroundColor: theme.colors.backgroundhome }}
      >
        <View style={styles.centerContainer}>
          <Feather name="alert-circle" size={60} color={theme.colors.primary} />
          <Text style={styles.emptyTitle}>Failed to load orders</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.replace("/(tabs)/home")}
          >
            <Text style={styles.browseButtonText}>Try Again</Text>
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

      {/* HEADER ĐỒNG BỘ PROFILE */}
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
        <Text style={styles.headerTitle}>My Orders</Text>
      </View>

      {!orders || orders.length === 0 ? (
        <View style={styles.centerContainer}>
          <Feather name="package" size={80} color={theme.colors.grayMedium} />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>
            Your order history will appear here
          </Text>
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          {orders.map((order) => {
            const totalItems = order.orderItems.reduce(
              (sum, item) => sum + item.quantity,
              0,
            );
            return (
              <View key={order._id} style={styles.orderCard}>
                <View style={styles.orderTopSection}>
                  <View style={styles.imageContainer}>
                    <Image
                      source={order.orderItems[0]?.image}
                      style={styles.orderThumb}
                      contentFit="cover"
                    />
                    {order.orderItems.length > 1 && (
                      <View style={styles.badge}>
                        <Text style={styles.badgeText}>
                          +{order.orderItems.length - 1}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.orderInfo}>
                    <Text style={styles.orderId}>
                      Order #{order._id.slice(-8).toUpperCase()}
                    </Text>
                    <Text style={styles.orderDate}>
                      {formatDate(order.createdAt)}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        {
                          backgroundColor: getStatusColor(order.status) + "15",
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.statusText,
                          { color: getStatusColor(order.status) },
                        ]}
                      >
                        {capitalizeFirstLetter(order.status)}
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.orderFooter}>
                  <View>
                    <Text style={styles.itemCountText}>{totalItems} items</Text>
                    <Text style={styles.priceText}>
                      ${order.totalPrice.toFixed(2)}
                    </Text>
                  </View>

                  {order.status === "delivered" && (
                    <TouchableOpacity
                      style={[
                        styles.actionBtn,
                        order.hasReviewed && styles.disabledBtn,
                      ]}
                      onPress={() =>
                        !order.hasReviewed && handleOpenRating(order)
                      }
                      disabled={order.hasReviewed}
                    >
                      <Text
                        style={[
                          styles.actionBtnText,
                          order.hasReviewed && styles.disabledBtnText,
                        ]}
                      >
                        {order.hasReviewed ? "Reviewed" : "Leave Rating"}
                      </Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })}
        </ScrollView>
      )}

      <RatingModal
        visible={showRatingModal}
        onClose={() => setShowRatingModal(false)}
        order={selectedOrder}
        productRatings={productRatings}
        onSubmit={handleSubmitRating}
        isSubmitting={isCreatingReview}
        onRatingChange={(productId, rating) =>
          setProductRatings((prev) => ({ ...prev, [productId]: rating }))
        }
      />
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(20),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(15),
  },
  backButton: { padding: 5, marginRight: scale(10) },
  headerTitle: {
    fontSize: 22,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.heading,
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(30),
  },
  orderCard: {
    backgroundColor: theme.colors.white,
    borderRadius: scale(24),
    padding: scale(20),
    marginBottom: verticalScale(15),
    elevation: 2,
    shadowColor: theme.colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
  },
  orderTopSection: { flexDirection: "row", marginBottom: verticalScale(15) },
  imageContainer: { position: "relative" },
  orderThumb: {
    width: scale(75),
    height: scale(75),
    borderRadius: scale(15),
    backgroundColor: theme.colors.surface,
  },
  badge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: theme.colors.primary,
    width: scale(24),
    height: scale(24),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: 10,
    fontFamily: theme.fonts.bold,
  },
  orderInfo: {
    flex: 1,
    marginLeft: scale(15),
    justifyContent: "center",
  },
  orderId: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
  },
  orderDate: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    marginVertical: 4,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: scale(8),
  },
  statusText: { fontSize: 11, fontFamily: theme.fonts.bold },
  orderFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: verticalScale(15),
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface,
  },
  itemCountText: {
    fontSize: 12,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  priceText: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
  actionBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: scale(18),
    paddingVertical: verticalScale(10),
    borderRadius: scale(12),
  },
  actionBtnText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.bold,
    fontSize: 13,
  },
  disabledBtn: {
    backgroundColor: theme.colors.surface,
  },
  disabledBtnText: {
    color: theme.colors.grayMedium,
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(40),
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
    marginTop: verticalScale(20),
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
  browseButtonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.bold,
  },
});

export default OrdersScreen;
