import React from "react";
import { View, Text, StyleSheet } from "react-native";
import theme, { scale, verticalScale } from "@/theme";

interface OrderSummaryProps {
  subtotal: number;
  shipping: number;
  tax: number;
  total: number;
}

export default function OrderSummary({
  subtotal,
  shipping,
  tax,
  total,
}: OrderSummaryProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>Summary</Text>

        <View style={styles.content}>
          <View style={styles.row}>
            <Text style={styles.label}>Subtotal</Text>
            <Text style={styles.value}>${subtotal.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Shipping</Text>
            <Text style={styles.value}>${shipping.toFixed(2)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.label}>Tax</Text>
            <Text style={styles.value}>${tax.toFixed(2)}</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.row}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>${total.toFixed(2)}</Text>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: scale(24),
    marginTop: verticalScale(24),
  },
  card: {
    backgroundColor: theme.colors.white, 
    borderRadius: scale(24),
    padding: scale(20),
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
  },
  title: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.heading, 
    marginBottom: verticalScale(16),
  },
  content: {
    gap: verticalScale(12),
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 15,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textPlaceholder, 
  },
  value: {
    fontSize: 15,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.heading,
  },
  divider: {
    height: 1,
    backgroundColor: theme.colors.surfaceVariant, 
    marginVertical: verticalScale(4),
  },
  totalLabel: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.heading,
  },
  totalValue: {
    fontSize: 22,
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
  },
});
