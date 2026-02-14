import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  TextInput,
  Switch,
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import SafeScreen from "./SafeScreen";
import { Ionicons } from "@expo/vector-icons";
import theme, { scale, verticalScale } from "@/theme";
import { StyleSheet } from "react-native";

interface AddressFormData {
  label: string;
  fullName: string;
  streetAddress: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  isDefault: boolean;
}

interface AddressFormModalProps {
  visible: boolean;
  isEditing: boolean;
  addressForm: AddressFormData;
  isAddingAddress: boolean;
  isUpdatingAddress: boolean;
  onClose: () => void;
  onSave: () => void;
  onFormChange: (form: AddressFormData) => void;
}

const AddressFormModal = ({ ...props }) => {
  return (
    <Modal visible={props.visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <SafeScreen style={{ flex: 1, backgroundColor: theme.colors.white }}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>
              {props.isEditing ? "Edit Address" : "Add New Address"}
            </Text>
            <TouchableOpacity onPress={props.onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={theme.colors.black} />
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.formContent}
          >
            {[
              { label: "Label", key: "label", placeholder: "e.g. Home, Work" },
              {
                label: "Full Name",
                key: "fullName",
                placeholder: "Enter name",
              },
              {
                label: "Street Address",
                key: "streetAddress",
                placeholder: "Enter address",
              },
              { label: "City", key: "city", placeholder: "e.g. New York" },
              { label: "State", key: "state", placeholder: "e.g. NY" },
              {
                label: "ZIP Code",
                key: "zipCode",
                placeholder: "10001",
                keyboard: "numeric",
              },
              {
                label: "Phone Number",
                key: "phoneNumber",
                placeholder: "0123...",
                keyboard: "phone-pad",
              },
            ].map((field) => (
              <View key={field.key} style={styles.inputGroup}>
                <Text style={styles.inputLabel}>{field.label}</Text>
                <TextInput
                  style={styles.input}
                  placeholder={field.placeholder}
                  placeholderTextColor={theme.colors.grayMedium}
                  value={
                    props.addressForm[
                      field.key as keyof AddressFormData
                    ] as string
                  }
                  onChangeText={(text) =>
                    props.onFormChange({
                      ...props.addressForm,
                      [field.key]: text,
                    })
                  }
                  keyboardType={field.keyboard as any}
                />
              </View>
            ))}

            <View style={styles.switchRow}>
              <Text style={styles.switchLabel}>Set as default address</Text>
              <Switch
                value={props.addressForm.isDefault}
                onValueChange={(val) =>
                  props.onFormChange({ ...props.addressForm, isDefault: val })
                }
                trackColor={{
                  false: theme.colors.grayMedium,
                  true: theme.colors.primary,
                }}
                thumbColor={theme.colors.white}
              />
            </View>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={props.onSave}
              disabled={props.isAddingAddress || props.isUpdatingAddress}
            >
              {props.isAddingAddress || props.isUpdatingAddress ? (
                <ActivityIndicator color={theme.colors.white} />
              ) : (
                <Text style={styles.saveBtnText}>
                  {props.isEditing ? "Save Changes" : "Add Address"}
                </Text>
              )}
            </TouchableOpacity>
          </ScrollView>
        </SafeScreen>
      </KeyboardAvoidingView>
    </Modal>
  );
};
export default AddressFormModal;

const styles = StyleSheet.create({
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: scale(20),
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.backgroundhome,
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: theme.fonts.bold,
    color: theme.colors.heading,
  },
  closeBtn: {
    backgroundColor: theme.colors.backgroundhome,
    borderRadius: 20,
    padding: 4,
  },
  formContent: { padding: scale(20), paddingBottom: verticalScale(40) },
  inputGroup: { marginBottom: verticalScale(15) },
  inputLabel: {
    fontSize: 14,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.heading,
    marginBottom: 8,
  },
  input: {
    backgroundColor: theme.colors.backgroundhome,
    borderRadius: scale(12),
    padding: scale(14),
    fontSize: 15,
    fontFamily: theme.fonts.regular,
    color: theme.colors.black,
  },
  switchRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: theme.colors.backgroundhome,
    padding: scale(15),
    borderRadius: scale(12),
    marginVertical: verticalScale(10),
  },
  switchLabel: {
    fontSize: 15,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.heading,
  },
  saveBtn: {
    backgroundColor: theme.colors.primary,
    borderRadius: scale(15),
    height: verticalScale(55),
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(20),
  },
  saveBtnText: {
    color: theme.colors.white,
    fontSize: 16,
    fontFamily: theme.fonts.bold,
  },
});
