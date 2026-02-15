import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useAddresses } from "@/hooks/useAddressess";
import { Address } from "@/types";
import theme, { scale, verticalScale } from "@/theme";

interface AddressSelectionModalProps {
  visible: boolean;
  onClose: () => void;
  onProceed: (address: Address) => void;
  isProcessing: boolean;
}

const AddressSelectionModal = ({
  visible,
  onClose,
  onProceed,
  isProcessing,
}: AddressSelectionModalProps) => {
  const [selectedAddress, setSelectedAddress] = useState<Address | null>(null);
  const { addresses, isLoading: addressesLoading } = useAddresses();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.sheetHeader}>
            <Text style={styles.sheetTitle}>Select Address</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={theme.colors.black} />
            </TouchableOpacity>
          </View>

          {/* List Address */}
          <ScrollView style={styles.list} showsVerticalScrollIndicator={false}>
            {addressesLoading ? (
              <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color={theme.colors.primary} />
              </View>
            ) : (
              addresses?.map((address: Address) => {
                const isSelected = selectedAddress?._id === address._id;
                return (
                  <TouchableOpacity
                    key={address._id}
                    style={[
                      styles.addressItem,
                      isSelected && styles.selectedItem,
                    ]}
                    activeOpacity={0.7}
                    onPress={() => setSelectedAddress(address)}
                  >
                    <View style={styles.itemContent}>
                      <View style={styles.itemHeader}>
                        <Text
                          style={[
                            styles.itemLabel,
                            isSelected && { color: theme.colors.primary },
                          ]}
                        >
                          {address.label}
                        </Text>
                        {address.isDefault && (
                          <View style={styles.miniBadge}>
                            <Text style={styles.miniBadgeText}>Default</Text>
                          </View>
                        )}
                      </View>
                      <Text style={styles.itemName}>{address.fullName}</Text>
                      <Text style={styles.itemDetail} numberOfLines={1}>
                        {address.streetAddress}
                      </Text>
                    </View>
                    
                    {isSelected ? (
                      <View style={styles.checkCircle}>
                        <Ionicons
                          name="checkmark"
                          size={16}
                          color={theme.colors.white}
                        />
                      </View>
                    ) : (
                       <View style={styles.uncheckCircle} />
                    )}
                  </TouchableOpacity>
                );
              })
            )}
          </ScrollView>

          {/* Footer */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={[
                styles.continueBtn,
                (!selectedAddress || isProcessing) && styles.disabledBtn,
              ]}
              onPress={() =>
                selectedAddress && onProceed(selectedAddress)
              }
              disabled={!selectedAddress || isProcessing}
            >
              {isProcessing ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <>
                  <Text style={styles.continueText}>Continue to Payment</Text>
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={theme.colors.white}
                  />
                </>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: theme.colors.white,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    maxHeight: "80%", 
    minHeight: "50%",
  },
  sheetHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(20),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.backgroundhome,
  },
  sheetTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.heading,
  },
  closeBtn: {
    backgroundColor: theme.colors.backgroundhome,
    borderRadius: 20,
    padding: 4,
  },
  list: { padding: scale(20) },
  loadingContainer: {
    paddingVertical: verticalScale(40),
  },
  addressItem: {
    flexDirection: "row",
    alignItems: "center",
    padding: scale(16),
    borderRadius: scale(16),
    borderWidth: 1,
    borderColor: theme.colors.backgroundhome,
    marginBottom: verticalScale(12),
  },
  selectedItem: {
    borderColor: theme.colors.primary,
    backgroundColor: "#F0F3FF",
  },
  itemContent: { flex: 1 },
  itemHeader: { flexDirection: "row", alignItems: "center", marginBottom: 4 },
  itemLabel: {
    fontSize: 14,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
    marginRight: 8,
  },
  miniBadge: {
    backgroundColor: theme.colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  miniBadgeText: {
    color: theme.colors.white,
    fontSize: 8,
    fontFamily: theme.fonts.bold,
  },
  itemName: {
    fontSize: 15,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.black,
  },
  itemDetail: {
    fontSize: 13,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
  checkCircle: {
    backgroundColor: theme.colors.primary,
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  uncheckCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: theme.colors.grayMedium,
  },
  footer: {
    padding: scale(20),
    paddingBottom: verticalScale(30),
    borderTopWidth: 1,
    borderTopColor: theme.colors.backgroundhome,
  },
  continueBtn: {
    backgroundColor: theme.colors.primary,
    height: verticalScale(55),
    borderRadius: scale(15),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
  },
  disabledBtn: {
    opacity: 0.5,
  },
  continueText: {
    color: theme.colors.white,
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },
});

export default AddressSelectionModal;