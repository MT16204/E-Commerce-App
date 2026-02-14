import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import theme, { scale, verticalScale } from "@/theme";

export default function AddressesHeader() {
  return (
    <View style={styles.header}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
      </TouchableOpacity>
      <Text style={styles.title}>My Addresses</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(15),
    backgroundColor: theme.colors.backgroundhome,
  },
  backBtn: { marginRight: scale(10), padding: 4 },
  title: {
    fontSize: 22,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.heading,
  },
});
