import React from "react";
import {
  View,
  Text,
  Modal,
  TouchableWithoutFeedback,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Image } from "expo-image";
import { Ionicons } from "@expo/vector-icons";
import { Order } from "@/types";
import theme, { scale, verticalScale } from "@/theme";

interface RatingModalProps {
  visible: boolean;
  onClose: () => void;
  order: Order | null;
  productRatings: { [key: string]: number };
  onRatingChange: (productId: string, rating: number) => void;
  onSubmit: () => void;
  isSubmitting: boolean;
}

const RatingModal = ({
  visible,
  onClose,
  order,
  productRatings,
  onRatingChange,
  onSubmit,
  isSubmitting,
}: RatingModalProps) => {
  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.modalContainer}>
              {/* HEADER */}
              <View style={styles.header}>
                <View style={styles.iconCircle}>
                  <Ionicons
                    name="star"
                    size={32}
                    color={theme.colors.primaryPressed}
                  />
                </View>
                <Text style={styles.title}>Rate Your Products</Text>
                <Text style={styles.subtitle}>
                  Your feedback helps us improve our service
                </Text>
              </View>

              {/* LIST PRODUCTS */}
              <ScrollView
                showsVerticalScrollIndicator={false}
                style={styles.scrollView}
              >
                {order?.orderItems
                  .filter((item) => item.product?._id)
                  .map((item, index) => {
                    const productId = item.product._id;
                    const currentRating = productRatings[productId] || 0;

                    return (
                      <View key={item._id || index} style={styles.productCard}>
                        <View style={styles.productHeader}>
                          <Image
                            source={item.image}
                            style={styles.productImage}
                            contentFit="cover"
                          />
                          <View style={styles.productInfo}>
                            <Text style={styles.productName} numberOfLines={1}>
                              {item.name}
                            </Text>
                            <Text style={styles.productDetails}>
                              Qty: {item.quantity} • ${item.price.toFixed(2)}
                            </Text>
                          </View>
                        </View>

                        {/* STAR RATING */}
                        <View style={styles.starsContainer}>
                          {[1, 2, 3, 4, 5].map((star) => (
                            <TouchableOpacity
                              key={star}
                              onPress={() => onRatingChange(productId, star)}
                              activeOpacity={0.6}
                              style={styles.starTouch}
                            >
                              <Ionicons
                                name={
                                  star <= currentRating
                                    ? "star"
                                    : "star-outline"
                                }
                                size={34}
                                color={
                                  star <= currentRating
                                    ? theme.colors.primaryPressed
                                    : theme.colors.grayLight
                                }
                              />
                            </TouchableOpacity>
                          ))}
                        </View>
                      </View>
                    );
                  })}
              </ScrollView>

              {/* ACTIONS */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={[styles.btnSubmit, isSubmitting && styles.btnDisabled]}
                  onPress={onSubmit}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <ActivityIndicator
                      size="small"
                      color={theme.colors.white}
                    />
                  ) : (
                    <Text style={styles.btnSubmitText}>Submit Review</Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.btnCancel}
                  onPress={onClose}
                  disabled={isSubmitting}
                >
                  <Text style={styles.btnCancelText}>Maybe Later</Text>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(20),
  },
  modalContainer: {
    backgroundColor: theme.colors.white,
    borderRadius: scale(24),
    padding: scale(24),
    width: "100%",
    maxWidth: 400,
    maxHeight: "85%",
  },
  header: {
    alignItems: "center",
    marginBottom: verticalScale(20),
  },
  iconCircle: {
    width: scale(64),
    height: scale(64),
    borderRadius: scale(32),
    backgroundColor: "#2563EB15",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  title: {
    fontSize: 22,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 4,
  },
  scrollView: {
    marginBottom: verticalScale(20),
  },
  productCard: {
    backgroundColor: theme.colors.surface,
    borderRadius: scale(16),
    padding: scale(12),
    marginBottom: verticalScale(12),
  },
  productHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(12),
  },
  productImage: {
    width: scale(50),
    height: scale(50),
    borderRadius: scale(8),
  },
  productInfo: {
    flex: 1,
    marginLeft: scale(12),
  },
  productName: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
  },
  productDetails: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  starsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    paddingTop: 4,
  },
  starTouch: {
    paddingHorizontal: scale(6),
  },
  footer: {
    gap: verticalScale(10),
  },
  btnSubmit: {
    backgroundColor: "#2563EB",
    height: verticalScale(50),
    borderRadius: scale(15),
    justifyContent: "center",
    alignItems: "center",
  },
  btnDisabled: {
    backgroundColor: theme.colors.grayLight,
  },
  btnSubmitText: {
    color: theme.colors.white,
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },
  btnCancel: {
    height: verticalScale(50),
    justifyContent: "center",
    alignItems: "center",
  },
  btnCancelText: {
    color: theme.colors.primaryDisabled,
    fontSize: 14,
    fontFamily: theme.fonts.medium,
  },
});

export default RatingModal;
