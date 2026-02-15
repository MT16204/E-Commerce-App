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
import { Ionicons } from "@expo/vector-icons";
import AddressCard from "@/components/AddressCard";
import AddressesHeader from "@/components/AddressesHeader";
import AddressFormModal from "@/components/AddressFormModal";
import SafeScreen from "@/components/SafeScreen";
import { FocusAwareStatusBar } from "@/components/StatusBar";
import { useAddresses } from "@/hooks/useAddressess";
import theme, { scale, verticalScale } from "@/theme"; 
import { Address } from "@/types";

function AddressesScreen() {
  const {
    addAddress,
    addresses,
    deleteAddress,
    isAddingAddress,
    isDeletingAddress,
    isError,
    isLoading,
    isUpdatingAddress,
    updateAddress,
  } = useAddresses();

  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [addressForm, setAddressForm] = useState({
    label: "",
    fullName: "",
    streetAddress: "",
    city: "",
    state: "",
    zipCode: "",
    phoneNumber: "",
    isDefault: false,
  });

  const handleAddAddress = () => {
    setAddressForm({
      label: "",
      fullName: "",
      streetAddress: "",
      city: "",
      state: "",
      zipCode: "",
      phoneNumber: "",
      isDefault: false,
    });
    setEditingAddressId(null);
    setShowAddressForm(true);
  };

  const handleEditAddress = (address: Address) => {
    setAddressForm({
      label: address.label,
      fullName: address.fullName,
      streetAddress: address.streetAddress,
      city: address.city,
      state: address.state,
      zipCode: address.zipCode,
      phoneNumber: address.phoneNumber,
      isDefault: address.isDefault,
    });
    setEditingAddressId(address._id);
    setShowAddressForm(true);
  };

  const handleDeleteAddress = (addressId: string, label: string) => {
    Alert.alert(
      "Delete Address",
      `Are you sure you want to delete "${label}"?`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: () => deleteAddress(addressId),
        },
      ],
    );
  };

  const handleSaveAddress = () => {
    const {
      label,
      fullName,
      streetAddress,
      city,
      state,
      zipCode,
      phoneNumber,
    } = addressForm;
    if (
      !label ||
      !fullName ||
      !streetAddress ||
      !city ||
      !state ||
      !zipCode ||
      !phoneNumber
    ) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    if (editingAddressId) {
      updateAddress(
        { addressId: editingAddressId, addressData: addressForm },
        {
          onSuccess: () => {
            setShowAddressForm(false);
            setEditingAddressId(null);
          },
          onError: (error: any) => {
            Alert.alert(
              "Error",
              error?.response?.data?.error || "Failed to update address",
            );
          },
        },
      );
    } else {
      addAddress(addressForm, {
        onSuccess: () => setShowAddressForm(false),
        onError: (error: any) => {
          Alert.alert(
            "Error",
            error?.response?.data?.error || "Failed to add address",
          );
        },
      });
    }
  };

  if (isLoading) return <LoadingUI />;
  if (isError) return <ErrorUI />;

  return (
    <SafeScreen style={styles.container}>
      <FocusAwareStatusBar style="dark" />
      <AddressesHeader />

      {addresses.length === 0 ? (
        <View style={styles.emptyContainer}>
          <View style={styles.emptyIconCircle}>
            <Ionicons
              name="location-outline"
              size={48}
              color={theme.colors.primary}
            />
          </View>
          <Text style={styles.emptyTitle}>No addresses yet</Text>
          <Text style={styles.emptySubtitle}>
            Add your first delivery address to start shopping
          </Text>
          <TouchableOpacity
            style={styles.addBtnLarge}
            activeOpacity={0.8}
            onPress={handleAddAddress}
          >
            <Text style={styles.addBtnTextLarge}>Add New Address</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView
          style={{ flex: 1 }}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.listContainer}>
            {addresses.map((address) => (
              <AddressCard
                key={address._id}
                address={address}
                onEdit={handleEditAddress}
                onDelete={handleDeleteAddress}
                isUpdatingAddress={isUpdatingAddress}
                isDeletingAddress={isDeletingAddress}
              />
            ))}

            <TouchableOpacity
              style={styles.addNewBtnInline}
              activeOpacity={0.8}
              onPress={handleAddAddress}
            >
              <Ionicons
                name="add-circle"
                size={20}
                color={theme.colors.white}
              />
              <Text style={styles.addNewBtnTextInline}>Add New Address</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      )}

      <AddressFormModal
        visible={showAddressForm}
        isEditing={!!editingAddressId}
        addressForm={addressForm}
        isAddingAddress={isAddingAddress}
        isUpdatingAddress={isUpdatingAddress}
        onClose={() => setShowAddressForm(false)}
        onSave={handleSaveAddress}
        onFormChange={setAddressForm}
      />
    </SafeScreen>
  );
}

function ErrorUI() {
  return (
    <SafeScreen style={styles.container}>
      <AddressesHeader />
      <View style={styles.centerContent}>
        <Ionicons
          name="alert-circle-outline"
          size={64}
          color={theme.colors.red}
        />
        <Text style={styles.emptyTitle}>Failed to load addresses</Text>
        <Text style={styles.emptySubtitle}>
          Please check your connection and try again
        </Text>
      </View>
    </SafeScreen>
  );
}
function LoadingUI() {
  return (
    <SafeScreen style={styles.container}>
      <AddressesHeader />
      <View style={styles.centerContent}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={styles.loadingText}>Loading addresses...</Text>
      </View>
    </SafeScreen>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundhome,
  },
  scrollContent: {
    paddingBottom: verticalScale(40),
  },
  listContainer: {
    paddingHorizontal: scale(20),
    paddingTop: verticalScale(10),
  },
  centerContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(40),
  },
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: scale(40),
  },
  emptyIconCircle: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    backgroundColor: "#F0F3FF",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: verticalScale(20),
  },
  emptyTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.heading,
    textAlign: "center",
  },
  emptySubtitle: {
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
  addBtnLarge: {
    backgroundColor: theme.colors.primary,
    borderRadius: scale(15),
    paddingHorizontal: scale(30),
    paddingVertical: verticalScale(15),
    marginTop: verticalScale(30),
    width: "100%",
    alignItems: "center",
  },
  addBtnTextLarge: {
    color: theme.colors.white,
    fontFamily: theme.fonts.bold,
    fontSize: 16,
  },
  addNewBtnInline: {
    backgroundColor: theme.colors.primary,
    borderRadius: scale(15),
    height: verticalScale(50),
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(10),
    gap: 8,
  },
  addNewBtnTextInline: {
    color: theme.colors.white,
    fontFamily: theme.fonts.bold,
    fontSize: 15,
  },
  loadingText: {
    marginTop: 10,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.medium,
  },
});

export default AddressesScreen;
