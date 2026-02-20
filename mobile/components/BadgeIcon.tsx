import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import theme, { scale } from "@/theme";

interface BadgeIconProps {
  name: keyof typeof Ionicons.glyphMap;
  size: number;
  color: string;
  count?: number;
}

const BadgeIcon = ({ name, size, color, count }: BadgeIconProps) => {
  return (
    <View style={{ width: size, height: size }}>
      <Ionicons name={name} size={size} color={color} />
      {count !== undefined && count > 0 && (
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {count > 99 ? "9+" : count} 
          </Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    position: "absolute",
    right: -scale(4),
    top: -scale(2),
    backgroundColor: theme.colors.primary,
    borderRadius: scale(10),
    minWidth: scale(16),
    height: scale(16),
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: scale(2),
    borderWidth: 1.5,
    borderColor: theme.colors.white,
  },
  badgeText: {
    color: theme.colors.white,
    fontSize: scale(9),
    fontFamily: theme.fonts.bold,
    lineHeight: scale(10),
  },
});

export default BadgeIcon;