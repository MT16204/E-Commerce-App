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
import { Ionicons } from "@expo/vector-icons";
import { useRouter, useLocalSearchParams } from "expo-router";
import { useStripe } from "@stripe/stripe-react-native";
import * as Sentry from "@sentry/react-native";
import { useQueryClient } from "@tanstack/react-query";

import theme, { scale, verticalScale } from "@/theme";
import SafeScreen from "@/components/SafeScreen";
import { FocusAwareStatusBar } from "@/components/StatusBar";
import OrderSummary from "@/components/OrderSummary";
import AddressSelectionModal from "@/components/AddressSelectionModal";
import ScreenHeader from "@/components/ScreenHeader";

import useCart from "@/hooks/useCart";
import { useAddresses } from "@/hooks/useAddressess";
import { useApi } from "@/lib/api";
import { Address } from "@/types";

const CheckoutScreen = () => {
  const queryClient = useQueryClient();
  const router = useRouter();
  const api = useApi();
  const { selectedIds } = useLocalSearchParams();
  const { cart, clearCart } = useCart();
  const { addresses } = useAddresses();
  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  const selectedAddress = useMemo(() => {
    return addresses?.find((addr) => addr.isDefault) || addresses?.[0] || null;
  }, [addresses]);

  const selectedItems = useMemo(() => {
    const ids = selectedIds ? JSON.parse(selectedIds as string) : [];
    return cart?.items.filter((item) => ids.includes(item.product._id)) || [];
  }, [cart, selectedIds]);

  const subtotal = useMemo(
    () =>
      selectedItems.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0,
      ),
    [selectedItems],
  );

  const shipping = 10.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = () => {
    if (!selectedAddress) {
      Alert.alert(
        "No Address Found",
        "Please add a shipping address in your profile before checking out.",
      );
      return;
    }
    setAddressModalVisible(true);
  };

  const handleProceedWithPayment = async (address: Address) => {
    setAddressModalVisible(false);
    setPaymentLoading(true);

    try {
      const { data } = await api.post("/payment/create-intent", {
        cartItems: selectedItems,
        shippingAddress: address,
      });

      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
        merchantDisplayName: "Nova Store",
        appearance: {
          colors: {
            primary: theme.colors.primary,
            background: theme.colors.white,
          },
          shapes: { borderRadius: 16 },
        },
      });

      if (initError) throw initError;

      const { error: presentError } = await presentPaymentSheet();
      if (!presentError) {
        try {
          const stripeId =
            data.paymentIntentId || data.clientSecret?.split("_secret")[0];

          await api.post("/orders", {
            orderItems: selectedItems.map((item) => ({
              product: item.product._id,
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price,
              image: item.product.images?.[0],
            })),
            shippingAddress: address,
            totalPrice: Number(total.toFixed(2)),
            paymentResult: { id: stripeId, status: "succeeded" },
          });

          // Updates new stock after ordering
          await queryClient.invalidateQueries({ queryKey: ["products"] });

          clearCart();
          router.replace("/(tabs)/home");
        } catch (err: any) {
          console.error("❌ Order creation failed");
          console.error("URL:", err.config?.baseURL, err.config?.url);
          console.error("HTTP status:", err.response?.status);
          console.error(
            "Backend response:",
            JSON.stringify(err.response?.data, null, 2),
          );
          console.error("Error message:", err.message);

          Alert.alert(
            "Order Failed",
            err.response?.data?.error ||
              err.message ||
              "Failed to create order",
          );
        }
      }
    } catch (error: any) {
      Sentry.captureException(error);
      Alert.alert("Error", error.message || "Payment failed");
    } finally {
      setPaymentLoading(false);
    }
  };

  return (
    <SafeScreen style={styles.container}>
      <FocusAwareStatusBar style="dark" />
      <ScreenHeader title="Checkout" showBackButton />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* SECTION: ORDER LIST */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order List</Text>
          {selectedItems.map((item) => (
            <View key={item._id} style={styles.itemCard}>
              <Image
                source={item.product.images[0]}
                style={styles.itemImage}
                contentFit="cover"
              />
              <View style={styles.itemInfo}>
                <Text style={styles.itemName} numberOfLines={1}>
                  {item.product.name}
                </Text>
                <Text style={styles.itemPrice}>
                  ${item.product.price.toFixed(2)}
                </Text>
              </View>
              <View style={styles.qtyBadge}>
                <Text style={styles.qtyText}>x{item.quantity}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* SECTION: ORDER SUMMARY */}
        <OrderSummary
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
        />
      </ScrollView>

      {/* FOOTER */}
      <View style={styles.floatingFooter}>
        <TouchableOpacity
          style={[styles.payBtn, paymentLoading && { opacity: 0.8 }]}
          onPress={handlePlaceOrder}
          disabled={paymentLoading}
        >
          {paymentLoading ? (
            <ActivityIndicator color={theme.colors.surface} />
          ) : (
            <>
              <Text style={styles.payText}>Continue to Payment</Text>
              <Ionicons
                name="arrow-forward"
                size={18}
                color={theme.colors.white}
              />
            </>
          )}
        </TouchableOpacity>
      </View>

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
  scrollContent: { paddingBottom: verticalScale(150) },
  section: { paddingHorizontal: scale(20), marginTop: verticalScale(20) },
  sectionTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.heading,
    marginBottom: verticalScale(12),
  },

  itemCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    padding: scale(12),
    borderRadius: scale(24),
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: theme.colors.surface,
  },
  itemImage: {
    width: scale(80),
    height: scale(80),
    borderRadius: scale(20),
    backgroundColor: theme.colors.surface,
  },
  itemInfo: { flex: 1, marginLeft: scale(15) },
  itemName: {
    fontSize: 15,
    fontFamily: theme.fonts.bold,
    color: theme.colors.heading,
  },
  itemSubText: {
    fontSize: 12,
    color: theme.colors.textSecondary,
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontFamily: theme.fonts.regular,
    color: theme.colors.primary,
    marginTop: 8,
  },
  qtyBadge: {
    width: scale(30),
    height: scale(30),
    borderRadius: scale(15),
    backgroundColor: theme.colors.surface,
    justifyContent: "center",
    alignItems: "center",
  },
  qtyText: { fontSize: 12, fontFamily: theme.fonts.medium },
  floatingFooter: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(35),
    backgroundColor: "transparent",
  },
  payBtn: {
    backgroundColor: theme.colors.primary,
    height: verticalScale(60),
    borderRadius: scale(35),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(25),
    gap: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 15,
    elevation: 15,
  },
  payText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.bold,
    fontSize: 16,
    letterSpacing: 0.5,
  },
});

export default CheckoutScreen;
