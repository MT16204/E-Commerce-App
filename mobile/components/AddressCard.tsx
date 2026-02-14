import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons, Feather } from "@expo/vector-icons";
import theme, { scale, verticalScale } from "@/theme";
import { Address } from "@/types";

interface AddressCardProps {
  address: Address;
  onEdit: (address: Address) => void;
  onDelete: (addressId: string, label: string) => void;
  isUpdatingAddress: boolean;
  isDeletingAddress: boolean;
}

export default function AddressCard({
  address,
  onEdit,
  onDelete,
  isUpdatingAddress,
  isDeletingAddress,
}: AddressCardProps) {
  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View style={styles.labelRow}>
          <View style={styles.iconContainer}>
            <Ionicons name="location" size={20} color={theme.colors.primary} />
          </View>
          <Text style={styles.label}>{address.label}</Text>
        </View>
        {address.isDefault && (
          <View style={styles.defaultBadge}>
            <Text style={styles.defaultText}>Default</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <Text style={styles.fullName}>{address.fullName}</Text>
        <Text style={styles.addressText}>{address.streetAddress}</Text>
        <Text style={styles.addressText}>
          {address.city}, {address.state} {address.zipCode}
        </Text>
        <Text style={styles.phoneText}>{address.phoneNumber}</Text>
      </View>

      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.btn, styles.editBtn]}
          onPress={() => onEdit(address)}
          disabled={isUpdatingAddress}
        >
          <Feather name="edit-3" size={16} color={theme.colors.primary} />
          <Text style={styles.editBtnText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.btn, styles.deleteBtn]}
          onPress={() => onDelete(address._id, address.label)}
          disabled={isDeletingAddress}
        >
          <Feather name="trash-2" size={16} color={theme.colors.red} />
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.colors.white,
    borderRadius: scale(20),
    padding: scale(16),
    marginBottom: verticalScale(12),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: verticalScale(12),
  },
  labelRow: { flexDirection: "row", alignItems: "center" },
  iconContainer: {
    backgroundColor: "#F0F3FF", // Primary nhạt
    width: scale(36),
    height: scale(36),
    borderRadius: scale(18),
    alignItems: "center",
    justifyContent: "center",
    marginRight: scale(10),
  },
  label: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.heading,
  },
  defaultBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: scale(10),
    paddingVertical: verticalScale(4),
    borderRadius: scale(8),
  },
  defaultText: {
    color: theme.colors.white,
    fontSize: 10,
    fontFamily: theme.fonts.bold,
    textTransform: "uppercase",
  },
  content: { marginLeft: scale(46) },
  fullName: {
    fontSize: 15,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.black,
    marginBottom: 2,
  },
  addressText: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    lineHeight: 18,
  },
  phoneText: {
    fontSize: 13,
    fontFamily: theme.fonts.medium,
    color: theme.colors.heading,
    marginTop: 4,
  },
  actionRow: {
    flexDirection: "row",
    marginTop: verticalScale(15),
    gap: scale(10),
  },
  btn: {
    flex: 1,
    flexDirection: "row",
    height: verticalScale(40),
    borderRadius: scale(12),
    alignItems: "center",
    justifyContent: "center",
    gap: 6,
  },
  editBtn: { backgroundColor: "#F0F3FF" },
  editBtnText: { color: theme.colors.primary, fontFamily: theme.fonts.bold },
  deleteBtn: { backgroundColor: "#FEE2E2" },
  deleteBtnText: { color: theme.colors.red, fontFamily: theme.fonts.bold },
});