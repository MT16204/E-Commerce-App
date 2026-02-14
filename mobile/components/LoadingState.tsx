import React from "react";
import { View, Text, ActivityIndicator, StyleSheet } from "react-native";
import theme, { scale, verticalScale } from "@/theme";

interface LoadingStateProps {
  message?: string;
  color?: string;
}

const LoadingState = ({
  message = "Loading...",
  color = theme.colors.primary, 
}: LoadingStateProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator size="large" color={color} />
      {message && <Text style={styles.text}>{message}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundhome,
    alignItems: "center",
    justifyContent: "center",
  },
  text: {
    fontFamily: theme.fonts.medium,
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginTop: verticalScale(15),
  },
});

export default LoadingState;
