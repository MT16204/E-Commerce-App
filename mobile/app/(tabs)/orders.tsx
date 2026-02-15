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
import { FocusAwareStatusBar } from "@/components/StatusBar";
import RatingModal from "@/components/RatingModal";
import LoadingState from "@/components/LoadingState";

import { useOrders } from "@/hooks/useOrders";
import { useReviews } from "@/hooks/useReviews";
import { capitalizeFirstLetter, formatDate, getStatusColor } from "@/lib/utils";
import { Order } from "@/types";
import ScreenHeader from "@/components/ScreenHeader";

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
      Alert.alert("Success", "Thank you for your feedback!");
      setShowRatingModal(false);
    } catch (error: any) {
      Alert.alert("Error", "Failed to submit rating");
    }
  };

  if (isLoading) {
    return (
      <SafeScreen style={styles.container}>
        <FocusAwareStatusBar style="dark" />
        <ScreenHeader title="My Orders" />
        <LoadingState message="Fetching your orders..." />
      </SafeScreen>
    );
  }

  if (isError) {
    return (
      <SafeScreen style={styles.container}>
        <FocusAwareStatusBar style="dark" />
        <ScreenHeader title="My Orders" />
        <View style={styles.emptyContainer}>
          <Feather name="alert-circle" size={60} color={theme.colors.red} />
          <Text style={styles.emptyTitle}>Oops! Something went wrong</Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.back()}
          >
            <Text style={styles.primaryBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen style={styles.container}>
      <FocusAwareStatusBar style="dark" />

      {/* HEADER */}
      <ScreenHeader title="My Orders" count={orders?.length} unit="order" />

      {!orders || orders.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather name="package" size={80} color={theme.colors.grayMedium} />
          <Text style={styles.emptyTitle}>No orders yet</Text>
          <Text style={styles.emptySubtitle}>
            You haven't placed any orders.
          </Text>
          <TouchableOpacity
            style={styles.primaryBtn}
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text style={styles.primaryBtnText}>Explore Shop</Text>
          </TouchableOpacity>
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
            const statusColor = getStatusColor(order.status);

            return (
              <View key={order._id} style={styles.orderCard}>
                <View style={styles.orderHeader}>
                  <View style={styles.imageWrapper}>
                    <Image
                      source={order.orderItems[0]?.image}
                      style={styles.orderImage}
                      contentFit="cover"
                    />
                    {order.orderItems.length > 1 && (
                      <View style={styles.multiBadge}>
                        <Text style={styles.multiBadgeText}>
                          +{order.orderItems.length - 1}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View style={styles.orderMainInfo}>
                    <Text style={styles.orderId}>
                      ID: #{order._id.slice(-6).toUpperCase()}
                    </Text>
                    <Text style={styles.orderDate}>
                      {formatDate(order.createdAt)}
                    </Text>
                    <View
                      style={[
                        styles.statusBadge,
                        { backgroundColor: statusColor + "15" },
                      ]}
                    >
                      <Text style={[styles.statusText, { color: statusColor }]}>
                        {capitalizeFirstLetter(order.status)}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.priceSection}>
                    <Text style={styles.totalPrice}>
                      ${order.totalPrice.toFixed(2)}
                    </Text>
                    <Text style={styles.itemQty}>{totalItems} items</Text>
                  </View>
                </View>

                {/* ACTION BUTTON */}
                {order.status === "delivered" && (
                  <View style={styles.footerAction}>
                    {order.hasReviewed ? (
                      <View style={styles.reviewedBadge}>
                        <Ionicons
                          name="checkmark-circle"
                          size={16}
                          color={theme.colors.green}
                        />
                        <Text style={styles.reviewedText}>Reviewed</Text>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.rateBtn}
                        onPress={() => handleOpenRating(order)}
                        disabled={isCreatingReview}
                      >
                        <Ionicons
                          name="star"
                          size={16}
                          color={theme.colors.white}
                        />
                        <Text style={styles.rateBtnText}>Rate Experience</Text>
                      </TouchableOpacity>
                    )}
                  </View>
                )}
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
  container: { flex: 1, backgroundColor: theme.colors.backgroundhome },
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
  orderCard: {
    backgroundColor: theme.colors.white,
    borderRadius: scale(20),
    padding: scale(16),
    marginBottom: verticalScale(15),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 3,
  },
  orderHeader: { flexDirection: "row", alignItems: "center" },
  imageWrapper: { position: "relative" },
  orderImage: {
    width: scale(70),
    height: scale(70),
    borderRadius: scale(12),
    backgroundColor: theme.colors.surface,
  },
  multiBadge: {
    position: "absolute",
    bottom: -5,
    right: -5,
    backgroundColor: theme.colors.primary,
    borderRadius: scale(10),
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  multiBadgeText: {
    color: theme.colors.white,
    fontSize: 10,
    fontFamily: theme.fonts.bold,
  },
  orderMainInfo: { flex: 1, marginLeft: scale(15) },
  orderId: {
    fontSize: 15,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
  },
  orderDate: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  statusBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    marginTop: 6,
  },
  statusText: { fontSize: 11, fontFamily: theme.fonts.bold },
  priceSection: { alignItems: "flex-end" },
  totalPrice: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
  itemQty: { fontSize: 12, color: theme.colors.textSecondary, marginTop: 2 },
  footerAction: {
    marginTop: scale(15),
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface,
    paddingTop: scale(12),
  },
  reviewedBadge: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 8,
  },
  reviewedText: {
    marginLeft: 6,
    color: theme.colors.green,
    fontFamily: theme.fonts.medium,
    fontSize: 13,
  },
  rateBtn: {
    backgroundColor: theme.colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: scale(12),
  },
  rateBtnText: {
    color: theme.colors.white,
    marginLeft: 8,
    fontFamily: theme.fonts.bold,
    fontSize: 13,
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
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
  },
  primaryBtn: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 25,
  },
  primaryBtnText: { color: theme.colors.white, fontFamily: theme.fonts.bold },
});

export default OrdersScreen;
