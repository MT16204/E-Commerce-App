import React, { useState, useMemo } from "react";
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
import { useStripe } from "@stripe/stripe-react-native";
import * as Sentry from "@sentry/react-native";

import theme, { scale, verticalScale } from "@/theme";
import SafeScreen from "@/components/SafeScreen";
import { FocusAwareStatusBar } from "@/components/StatusBar";
import AddressSelectionModal from "@/components/AddressSelectionModal";
import LoadingState from "@/components/LoadingState";
import ScreenHeader from "@/components/ScreenHeader";

import useCart from "@/hooks/useCart";
import { useAddresses } from "@/hooks/useAddressess";
import { useApi } from "@/lib/api";
import { Address } from "@/types";

const CartScreen = () => {
  const router = useRouter();
  const api = useApi();
  const {
    cart,
    cartItemCount,
    isError,
    isLoading,
    isRemoving,
    isUpdating,
    removeFromCart,
    updateQuantity,
    clearCart,
  } = useCart();

  const { addresses } = useAddresses();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const cartItems = cart?.items || [];

  const toggleSelectItem = (productId: string) => {
    setSelectedItems((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId],
    );
  };

  const toggleSelectAll = () => {
    if (selectedItems.length === cartItems.length) {
      setSelectedItems([]);
    } else {
      setSelectedItems(cartItems.map((item) => item.product._id));
    }
  };

  const selectedSubtotal = useMemo(() => {
    return cartItems
      .filter((item) => selectedItems.includes(item.product._id))
      .reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  }, [cartItems, selectedItems]);

  const shipping = selectedItems.length > 0 ? 10.0 : 0;
  const tax = selectedSubtotal * 0.08;
  const total = selectedSubtotal + shipping + tax;

  const handleQuantityChange = (
    productId: string,
    currentQuantity: number,
    change: number,
  ) => {
    const newQuantity = currentQuantity + change;
    if (newQuantity < 1) return;
    updateQuantity({ productId, quantity: newQuantity });
  };

  const handleRemoveItem = (productId: string, productName: string) => {
    Alert.alert("Remove Item", `Remove ${productName} from cart?`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Remove",
        style: "destructive",
        onPress: () => removeFromCart(productId),
      },
    ]);
  };

  const handleCheckout = () => {
    if (selectedItems.length === 0) {
      Alert.alert("No Selection", "Please select items to checkout.");
      return;
    }
    router.push({
      pathname: "/checkout",
      params: { selectedIds: JSON.stringify(selectedItems) },
    });
  };

  const handleProceedWithPayment = async (selectedAddress: Address) => {
    if (paymentLoading) return;
    setAddressModalVisible(false);
    setPaymentLoading(true);

    try {
      const itemsToPay = cartItems.filter((item) =>
        selectedItems.includes(item.product._id),
      );

      const { data } = await api.post("/payment/create-intent", {
        cartItems: itemsToPay,
        shippingAddress: selectedAddress,
      });

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
        merchantDisplayName: "Nova Store",
        appearance: {
          colors: {
            primary: theme.colors.primary,
            background: theme.colors.white,
            componentBackground: theme.colors.surface,
          },
          shapes: { borderRadius: 16 },
        },
      });

      if (initError) throw initError;

      const { error: presentError } = await presentPaymentSheet();
      if (presentError) {
        if (presentError.code !== "Canceled")
          Alert.alert("Error", presentError.message);
      } else {
        Alert.alert("Success", "Payment successful!", [
          { text: "OK", onPress: () => clearCart() },
        ]);
      }
    } catch (error: any) {
      Sentry.captureException(error);
      Alert.alert("Error", error.message || "Payment failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  if (isLoading) {
    return (
      <SafeScreen style={styles.container}>
        <FocusAwareStatusBar style="dark" />
        <ScreenHeader title="Cart" count={cartItemCount} />
        <LoadingState message="Updating your cart..." />
      </SafeScreen>
    );
  }

  if (isError) {
    return (
      <SafeScreen style={styles.container}>
        <FocusAwareStatusBar style="dark" />
        <View style={styles.emptyContainer}>
          <Feather name="alert-triangle" size={60} color={theme.colors.red} />
          <Text style={styles.emptyTitle}>Failed to load cart!</Text>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen style={styles.container}>
      <FocusAwareStatusBar style="dark" />
      <ScreenHeader title="My Cart" />

      {cartItems.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Feather
            name="shopping-cart"
            size={80}
            color={theme.colors.grayMedium}
          />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <TouchableOpacity
            style={styles.browseButton}
            onPress={() => router.push("/(tabs)/home")}
          >
            <Text style={styles.browseButtonText}>Start Shopping</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.selectAllBar}>
            <TouchableOpacity
              style={styles.checkAllBtn}
              onPress={toggleSelectAll}
            >
              <Ionicons
                name={
                  selectedItems.length === cartItems.length &&
                  cartItems.length > 0
                    ? "checkmark-circle"
                    : "ellipse-outline"
                }
                size={22}
                color={
                  selectedItems.length === cartItems.length
                    ? theme.colors.primary
                    : theme.colors.grayMedium
                }
              />
              <Text style={styles.selectAllText}>
                Select All ({cartItems.length})
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {cartItems.map((item) => {
              const isSelected = selectedItems.includes(item.product._id);
              return (
                <View key={item._id} style={styles.productCard}>
                  <View style={styles.cardInfo}>
                    <TouchableOpacity
                      style={styles.itemCheckbox}
                      onPress={() => toggleSelectItem(item.product._id)}
                    >
                      <Ionicons
                        name={
                          isSelected ? "checkmark-circle" : "ellipse-outline"
                        }
                        size={24}
                        color={
                          isSelected
                            ? theme.colors.primary
                            : theme.colors.grayMedium
                        }
                      />
                    </TouchableOpacity>

                    <View style={styles.imageContainer}>
                      <Image
                        source={item.product.images[0]}
                        style={styles.productImage}
                        contentFit="cover"
                      />
                    </View>

                    <View style={styles.textContainer}>
                      <Text style={styles.productName} numberOfLines={1}>
                        {item.product.name}
                      </Text>
                      <Text style={styles.productPrice}>
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </Text>

                      <View style={styles.controlsRow}>
                        <View style={styles.quantitySelector}>
                          <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity,
                                -1,
                              )
                            }
                            disabled={isUpdating}
                          >
                            <Ionicons
                              name="remove"
                              size={16}
                              color={theme.colors.heading}
                            />
                          </TouchableOpacity>
                          <Text style={styles.qtyText}>{item.quantity}</Text>
                          <TouchableOpacity
                            style={[
                              styles.qtyBtn,
                              { backgroundColor: theme.colors.primary },
                            ]}
                            onPress={() =>
                              handleQuantityChange(
                                item.product._id,
                                item.quantity,
                                1,
                              )
                            }
                            disabled={isUpdating}
                          >
                            <Ionicons
                              name="add"
                              size={16}
                              color={theme.colors.white}
                            />
                          </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                          style={styles.removeIconBtn}
                          onPress={() =>
                            handleRemoveItem(
                              item.product._id,
                              item.product.name,
                            )
                          }
                          disabled={isRemoving}
                        >
                          <Feather
                            name="trash-2"
                            size={18}
                            color={theme.colors.red}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>
              );
            })}
          </ScrollView>

          {/* CHECKOUT FOOTER */}
          <View style={styles.footer}>
            <View style={styles.footerRow}>
              <Text style={styles.totalLabel}>
                Total Price ({selectedItems.length} items)
              </Text>
              <Text style={styles.totalAmount}>${total.toFixed(2)}</Text>
            </View>
            <TouchableOpacity
              style={[
                styles.checkoutBtn,
                (selectedItems.length === 0 || paymentLoading) && {
                  backgroundColor: theme.colors.grayMedium,
                },
              ]}
              onPress={handleCheckout}
              disabled={selectedItems.length === 0 || paymentLoading}
            >
              {paymentLoading ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <>
                  <Text style={styles.checkoutText}>Proceed to Checkout</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={20}
                    color={theme.colors.white}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}

      <AddressSelectionModal
        visible={addressModalVisible}
        onClose={() => setAddressModalVisible(false)}
        onProceed={handleProceedWithPayment}
        isProcessing={paymentLoading}
      />
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.backgroundhome },
  selectAllBar: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(10),
  },
  checkAllBtn: { flexDirection: "row", alignItems: "center", gap: 8 },
  selectAllText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    color: theme.colors.heading,
  },
  scrollContent: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(160),
  },
  productCard: {
    backgroundColor: theme.colors.white,
    borderRadius: scale(20),
    padding: scale(12),
    marginBottom: verticalScale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 10,
    elevation: 2,
  },
  cardInfo: { flexDirection: "row", alignItems: "center" },
  itemCheckbox: { paddingRight: scale(10) },
  imageContainer: { position: "relative" },
  productImage: {
    width: scale(90),
    height: scale(90),
    borderRadius: scale(15),
    backgroundColor: theme.colors.surface,
  },
  textContainer: {
    flex: 1,
    marginLeft: scale(15),
    justifyContent: "space-between",
  },
  productName: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.heading,
  },
  productPrice: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    marginTop: 2,
  },
  controlsRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 8,
  },
  quantitySelector: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 12,
    padding: 4,
  },
  qtyBtn: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: theme.colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  qtyText: { marginHorizontal: 12, fontFamily: theme.fonts.bold, fontSize: 14 },
  removeIconBtn: { padding: 8 },
  footer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.white,
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(15),
    paddingBottom: verticalScale(15),
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -10 },
    shadowOpacity: 0.05,
    shadowRadius: 15,
    elevation: 10,
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  totalAmount: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.heading,
  },
  checkoutBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: 18,
    flexDirection: "row",
    height: verticalScale(55),
    alignItems: "center",
    justifyContent: "center",
  },
  checkoutText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    marginRight: 8,
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
    marginTop: 20,
    color: theme.colors.heading,
  },
  browseButton: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 15,
    marginTop: 25,
  },
  browseButtonText: { color: "#FFF", fontFamily: theme.fonts.bold },
});

export default CartScreen;
