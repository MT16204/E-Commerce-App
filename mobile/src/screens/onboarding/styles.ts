import { StyleSheet } from "react-native";
import theme from "@/theme"; 

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white, 
  },
  skipContainer: {
    position: "absolute",
    top: 60,
    right: 30,
    zIndex: 10,
  },
  skipText: {
    color: theme.colors.grayMedium, 
    fontSize: 16,
    fontFamily: theme.fonts.medium,
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    paddingTop: 100,
  },
  imageWrapper: {
    width: "100%",
    height: 420,
    borderTopLeftRadius: 60,
    borderTopRightRadius: 60,
    borderBottomLeftRadius: 15,
    borderBottomRightRadius: 90,
    overflow: "hidden",
    backgroundColor: theme.colors.surface, 
    marginBottom: 35,
  },
  image: {
    width: "100%",
    height: "100%",
  },
  textSection: {
    gap: 8,
  },
  title: {
    fontSize: 30,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black, 
  },
  subtitle: {
    fontSize: 30,
    fontFamily: theme.fonts.bold,
    color: theme.colors.black,
  },
  description: {
    fontSize: 15,
    color: theme.colors.grayMedium, // 999999 [cite: 2026-01-14]
    lineHeight: 22,
    fontFamily: theme.fonts.regular,
    marginTop: 10,
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 40,
  },
  dotContainer: {
    flexDirection: "row",
    gap: 8,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#EBEBEB", 
  },
  activeDot: {
    width: 28,
    backgroundColor: theme.colors.primary, 
  },
  nextButton: {
    width: 65,
    height: 65,
    borderRadius: 35,
    backgroundColor: theme.colors.primary, 
    justifyContent: "center",
    alignItems: "center",
    elevation: 5,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
});
