import SafeScreen from "@/components/SafeScreen";
import { useAddresses } from "@/hooks/useAddressess";
import useCart from "@/hooks/useCart";
import { useApi } from "@/lib/api";
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useStripe } from "@stripe/stripe-react-native";
import { useState } from "react";
import { Address } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import OrderSummary from "@/components/OrderSummary";
import AddressSelectionModal from "@/components/AddressSelectionModal";

import * as Sentry from "@sentry/react-native";

const CartScreen = () => {
  const api = useApi();
  const {
    cart,
    cartItemCount,
    cartTotal,
    clearCart,
    isError,
    isLoading,
    isRemoving,
    isUpdating,
    removeFromCart,
    updateQuantity,
  } = useCart();
  const { addresses } = useAddresses();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();

  const [paymentLoading, setPaymentLoading] = useState(false);
  const [addressModalVisible, setAddressModalVisible] = useState(false);

  const cartItems = cart?.items || [];
  const subtotal = cartTotal;
  const shipping = 10.0;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

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
    if (cartItems.length === 0 || paymentLoading) return;

    if (!addresses || addresses.length === 0) {
      Alert.alert(
        "No Address",
        "Please add a shipping address in your profile before checking out.",
        [{ text: "OK" }],
      );
      return;
    }

    setAddressModalVisible(true);
  };

  const handleProceedWithPayment = async (selectedAddress: Address) => {
    // 1. NGĂN CHẶN CLICK NHIỀU LẦN (Sửa lỗi Resolve twice)
    if (paymentLoading) return;

    setAddressModalVisible(false);
    setPaymentLoading(true);

    Sentry.logger.info("Checkout initiated", {
      itemCount: cartItemCount,
      total: total.toFixed(2),
      city: selectedAddress.city,
    });

    try {
      // 2. Tạo Payment Intent từ Backend
      const { data } = await api.post("/payment/create-intent", {
        cartItems,
        shippingAddress: {
          fullName: selectedAddress.fullName,
          streetAddress: selectedAddress.streetAddress,
          city: selectedAddress.city,
          state: selectedAddress.state,
          zipCode: selectedAddress.zipCode,
          phoneNumber: selectedAddress.phoneNumber,
        },
      });

      // 3. Khởi tạo Payment Sheet với màu Figma #5D76FF
      const { error: initError } = await initPaymentSheet({
        paymentIntentClientSecret: data.clientSecret,
        merchantDisplayName: "Nova Store",
        appearance: {
          colors: {
            primary: "#5D76FF",
            background: "#FFFFFF",
            componentBackground: "#F4F4F4",
            primaryText: "#000000",
            secondaryText: "#999999",
            placeholderText: "#ABABAB",
            icon: "#5D76FF",
          },
          shapes: {
            borderRadius: 16,
          },
        },
      });

      if (initError) {
        throw initError;
      }

      // 4. Hiển thị giao diện thanh toán
      const { error: presentError } = await presentPaymentSheet();

      if (presentError) {
        // Chỉ Alert nếu không phải lỗi do người dùng chủ động thoát (Canceled)
        if (presentError.code !== "Canceled") {
          Alert.alert("Error", presentError.message);
        }
        Sentry.logger.info("Payment not completed", {
          code: presentError.code,
        });
      } else {
        // THANH TOÁN THÀNH CÔNG
        Sentry.logger.info("Payment successful", { total: total.toFixed(2) });

        Alert.alert(
          "Success",
          "Your payment was successful! Your order is being processed.",
          [{ text: "OK", onPress: () => clearCart() }],
        );
      }
    } catch (error: any) {
      Sentry.logger.error("Payment flow failed", {
        error: error?.message || "Unknown error",
      });
      Alert.alert("Error", error?.message || "Failed to process payment");
    } finally {
      // 5. GIẢI PHÓNG TRẠNG THÁI LOADING
      setPaymentLoading(false);
    }
  };

  if (isLoading) return <LoadingUI />;
  if (isError) return <ErrorUI />;
  if (cartItems.length === 0) return <EmptyUI />;

  return (
    <SafeScreen>
      <Text className="px-6 pb-5 text-text-primary text-3xl font-bold tracking-tight">
        Cart
      </Text>

      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 240 }}
      >
        <View className="px-6 gap-2">
          {cartItems.map((item) => (
            <View
              key={item._id}
              className="bg-surface rounded-3xl overflow-hidden"
            >
              <View className="p-4 flex-row">
                <View className="relative">
                  <Image
                    source={item.product.images[0]}
                    className="bg-background-lighter"
                    contentFit="cover"
                    style={{ width: 112, height: 112, borderRadius: 16 }}
                  />
                  <View className="absolute top-2 right-2 bg-primary rounded-full px-2 py-0.5">
                    <Text className="text-background text-xs font-bold">
                      ×{item.quantity}
                    </Text>
                  </View>
                </View>

                <View className="flex-1 ml-4 justify-between">
                  <View>
                    <Text
                      className="text-text-primary font-bold text-lg leading-tight"
                      numberOfLines={2}
                    >
                      {item.product.name}
                    </Text>
                    <View className="flex-row items-center mt-2">
                      <Text className="text-primary font-bold text-2xl">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </Text>
                      <Text className="text-text-secondary text-sm ml-2">
                        ${item.product.price.toFixed(2)}
                      </Text>
                    </View>
                  </View>

                  <View className="flex-row items-center mt-3">
                    <TouchableOpacity
                      className="bg-background-lighter rounded-full w-9 h-9 items-center justify-center"
                      onPress={() =>
                        handleQuantityChange(
                          item.product._id,
                          item.quantity,
                          -1,
                        )
                      }
                      disabled={isUpdating}
                    >
                      <Ionicons name="remove" size={18} color="#FFFFFF" />
                    </TouchableOpacity>

                    <View className="mx-4 min-w-[32px] items-center">
                      <Text className="text-text-primary font-bold text-lg">
                        {item.quantity}
                      </Text>
                    </View>

                    <TouchableOpacity
                      className="bg-primary rounded-full w-9 h-9 items-center justify-center"
                      onPress={() =>
                        handleQuantityChange(item.product._id, item.quantity, 1)
                      }
                      disabled={isUpdating}
                    >
                      <Ionicons name="add" size={18} color="#121212" />
                    </TouchableOpacity>

                    <TouchableOpacity
                      className="ml-auto bg-red-500/10 rounded-full w-9 h-9 items-center justify-center"
                      onPress={() =>
                        handleRemoveItem(item.product._id, item.product.name)
                      }
                      disabled={isRemoving}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color="#EF4444"
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          ))}
        </View>

        <OrderSummary
          subtotal={subtotal}
          shipping={shipping}
          tax={tax}
          total={total}
        />
      </ScrollView>

      {/* Checkout Panel */}
      <View className="absolute bottom-0 left-0 right-0 bg-background/95 backdrop-blur-xl border-t border-surface pt-4 pb-32 px-6">
        <View className="flex-row items-center justify-between mb-4">
          <View className="flex-row items-center">
            <Ionicons name="cart" size={20} color="#5D76FF" />
            <Text className="text-text-secondary ml-2">
              {cartItemCount} {cartItemCount === 1 ? "item" : "items"}
            </Text>
          </View>
          <Text className="text-text-primary font-bold text-xl">
            ${total.toFixed(2)}
          </Text>
        </View>

        <TouchableOpacity
          className={`${paymentLoading ? "bg-gray-400" : "bg-primary"} rounded-2xl overflow-hidden`}
          activeOpacity={0.9}
          onPress={handleCheckout}
          disabled={paymentLoading}
        >
          <View className="py-5 flex-row items-center justify-center">
            {paymentLoading ? (
              <ActivityIndicator size="small" color="#FFFFFF" />
            ) : (
              <>
                <Text className="text-background font-bold text-lg mr-2">
                  Checkout
                </Text>
                <Ionicons name="arrow-forward" size={20} color="#121212" />
              </>
            )}
          </View>
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

export default CartScreen;

function LoadingUI() {
  return (
    <View className="flex-1 bg-background items-center justify-center">
      <ActivityIndicator size="large" color="#5D76FF" />
      <Text className="text-text-secondary mt-4">Loading cart...</Text>
    </View>
  );
}

function ErrorUI() {
  return (
    <View className="flex-1 bg-background items-center justify-center px-6">
      <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
      <Text className="text-text-primary font-semibold text-xl mt-4">
        Failed to load cart
      </Text>
    </View>
  );
}

function EmptyUI() {
  return (
    <View className="flex-1 bg-background">
      <View className="px-6 pt-16 pb-5">
        <Text className="text-text-primary text-3xl font-bold tracking-tight">
          Cart
        </Text>
      </View>
      <View className="flex-1 items-center justify-center px-6">
        <Ionicons name="cart-outline" size={80} color="#ABABAB" />
        <Text className="text-text-primary font-semibold text-xl mt-4">
          Your cart is empty
        </Text>
      </View>
    </View>
  );
}
