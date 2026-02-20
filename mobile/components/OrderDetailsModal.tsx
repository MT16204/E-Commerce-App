import React from "react";
import {
  Modal,
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import theme, { scale, verticalScale } from "@/theme";
import { formatDate, capitalizeFirstLetter } from "@/lib/utils";

interface Props {
  visible: boolean;
  onClose: () => void;
  order: any | null;
}

const OrderDetailsModal = ({ visible, onClose, order }: Props) => {
  if (!order) return null;

  const getProductRating = (productId: string) => {
    if (!order.reviews) return 0;
    const review = order.reviews.find((r: any) => r.productId === productId);
    return review ? review.rating : 0;
  };

  const renderStars = (rating: number = 0) => {
    return (
      <View style={styles.starsRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <Ionicons
            key={star}
            name={star <= rating ? "star" : "star-outline"}
            size={14}
            color={
              star <= rating ? theme.colors.primary : theme.colors.grayLight
            }
            style={{ marginRight: 2 }}
          />
        ))}
      </View>
    );
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.content}>
          <View style={styles.handle} />

          <View style={styles.header}>
            <View>
              <Text style={styles.title}>Order Details</Text>
              <Text style={styles.orderIdSub}>#{order._id.toUpperCase()}</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                name="close-circle"
                size={28}
                color={theme.colors.textPlaceholder}
              />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scroll}
          >
            {/* Status Section */}
            <View style={styles.statusSection}>
              <View style={styles.statusInfo}>
                <Text style={styles.sectionLabel}>Status</Text>
                <Text
                  style={[
                    styles.statusValue,
                    { color: theme.colors.primaryPressed },
                  ]}
                >
                  {capitalizeFirstLetter(order.status)}
                </Text>
              </View>
              <View style={styles.statusInfo}>
                <Text style={styles.sectionLabel}>Order Date</Text>
                <Text style={styles.infoValue}>
                  {formatDate(order.createdAt)}
                </Text>
              </View>
            </View>

            {/* Items List */}
            <Text style={styles.sectionTitle}>
              Items ({order.orderItems.length})
            </Text>
            {order.orderItems.map((item: any, index: number) => {
              const productId = item.product?._id || item.product;
              const itemRating = getProductRating(productId);

              return (
                <View key={index} style={styles.productCard}>
                  <View style={styles.productMain}>
                    <Image source={item.image} style={styles.productImage} />
                    <View style={styles.productInfo}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {item.name}
                      </Text>
                      <Text style={styles.productMeta}>
                        Qty: {item.quantity} x ${item.price.toFixed(2)}
                      </Text>
                    </View>
                    <Text style={styles.productPrice}>
                      ${(item.quantity * item.price).toFixed(2)}
                    </Text>
                  </View>

                  {order.status === "delivered" &&
                    order.hasReviewed &&
                    itemRating > 0 && (
                      <View style={styles.itemReviewBox}>
                        <View style={styles.reviewHeader}>
                          <Text style={styles.yourRatingText}>
                            Your Rating:
                          </Text>
                          {renderStars(itemRating)}
                        </View>
                      </View>
                    )}
                </View>
              );
            })}

            {/* Summary Section */}
            <View style={styles.summaryContainer}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Subtotal</Text>
                <Text style={styles.summaryValue}>
                  ${order.totalPrice.toFixed(2)}
                </Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Shipping</Text>
                <Text style={styles.summaryValue}>Free</Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.totalRow}>
                <Text style={styles.totalLabel}>Total Amount</Text>
                <Text style={styles.totalValue}>
                  ${order.totalPrice.toFixed(2)}
                </Text>
              </View>
            </View>
          </ScrollView>
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  content: {
    backgroundColor: theme.colors.background,
    borderTopLeftRadius: scale(30),
    borderTopRightRadius: scale(30),
    maxHeight: "90%",
    paddingBottom: verticalScale(20),
  },
  handle: {
    width: scale(40),
    height: 5,
    backgroundColor: theme.colors.surfaceVariant,
    borderRadius: 10,
    alignSelf: "center",
    marginTop: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(20),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
  },
  orderIdSub: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  scroll: { padding: scale(20) },
  statusSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: theme.colors.surface,
    padding: scale(15),
    borderRadius: scale(16),
    marginBottom: verticalScale(20),
  },
  statusInfo: { flex: 1 },
  sectionLabel: {
    fontSize: 11,
    color: theme.colors.textSecondary,
    textTransform: "uppercase",
    marginBottom: 4,
  },
  statusValue: { fontSize: 14, fontFamily: theme.fonts.bold },
  infoValue: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    marginBottom: verticalScale(12),
    color: theme.colors.black,
  },
  productCard: {
    backgroundColor: theme.colors.background,
    borderRadius: scale(16),
    padding: scale(12),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: theme.colors.surface,
  },
  productMain: { flexDirection: "row", alignItems: "center" },
  productImage: {
    width: scale(55),
    height: scale(55),
    borderRadius: 12,
    backgroundColor: theme.colors.surface,
  },
  productInfo: { flex: 1, marginLeft: scale(12) },
  productName: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
  },
  productMeta: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  productPrice: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
  },
  itemReviewBox: {
    marginTop: verticalScale(10),
    paddingTop: verticalScale(10),
    borderTopWidth: 1,
    borderTopColor: theme.colors.surface,
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  yourRatingText: {
    fontSize: 12,
    color: theme.colors.primary,
    fontFamily: theme.fonts.medium,
  },
  starsRow: { flexDirection: "row" },
  summaryContainer: {
    marginTop: verticalScale(10),
    padding: scale(18),
    backgroundColor: theme.colors.surface,
    borderRadius: scale(20),
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: verticalScale(8),
  },
  summaryLabel: { color: theme.colors.textSecondary, fontSize: 13 },
  summaryValue: {
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.medium,
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceVariant,
    marginVertical: 4,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.heading,
  },
  totalValue: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primaryPressed, 
  },
});

export default OrderDetailsModal;
