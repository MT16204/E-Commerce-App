import React from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import theme, { scale, verticalScale } from "@/theme";

interface ScreenHeaderProps {
  title: string;
  count?: number;
  unit?: string;
  showBackButton?: boolean;
}

const ScreenHeader = ({
  title,
  count,
  unit = "item",
  showBackButton = true,
}: ScreenHeaderProps) => {
  const router = useRouter();

  const handleBack = () => {
    if (router.canGoBack()) {
      router.back(); 
    } else {
      router.replace("/(tabs)/home");
    }
  };

  return (
    <View style={styles.headerRow}>
      {showBackButton && (
        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBack}
        >
          <Ionicons
            name="chevron-back"
            size={24}
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      )}

      <Text style={styles.headerTitle}>{title}</Text>

      {count !== undefined && (
        <Text style={styles.itemCount}>
          {count} {count === 1 ? unit : `${unit}s`}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: scale(20),
    marginTop: verticalScale(10),
    marginBottom: verticalScale(10),
    minHeight: verticalScale(40),
  },
  backButton: {
    padding: 5,
    marginRight: scale(10),
  },
  headerTitle: {
    fontSize: 22,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.heading,
  },
  itemCount: {
    marginLeft: "auto",
    fontSize: 14,
    fontFamily: theme.fonts.regular,
    color: theme.colors.textSecondary,
  },
});

export default ScreenHeader;
