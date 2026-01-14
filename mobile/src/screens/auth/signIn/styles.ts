import { StyleSheet } from "react-native";
import theme, { scale, verticalScale } from "@/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: scale(24), // Theo Figma: Margin trái/phải 24px
    paddingBottom: verticalScale(40),
  },
  backButton: {
    width: scale(40),
    height: scale(40),
    borderRadius: 20,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(16),
    marginBottom: verticalScale(24),
  },
  headerTitle: {
    fontSize: theme.fontSize.FONT_42Px,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.heading,
    marginBottom: verticalScale(30),
  },
  form: {
    gap: verticalScale(16), // Theo Figma: Khoảng cách giữa các input
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 8, // Theo Figma: Corner radius 8px
    paddingHorizontal: scale(16),
    height: verticalScale(56), // Theo Figma: Height 56px
  },
  inputIcon: {
    marginRight: scale(12),
  },
  input: {
    flex: 1,
    fontSize: theme.fontSize.FONT_14Px,
    color: theme.colors.textPrimary,
    fontFamily: theme.fonts.regular,
  },
  forgotPassword: {
    alignSelf: "flex-end",
    marginTop: verticalScale(8),
  },
  forgotPasswordText: {
    color: theme.colors.textLink,
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSize.FONT_12Px,
  },
  signInButton: {
    height: verticalScale(56), // Theo Figma: Height 56px
    borderRadius: 28, // Theo Figma: Pill shape
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(24),
    // Shadow nhẹ cho button
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  signInButtonText: {
    color: theme.colors.white,
    fontSize: theme.fontSize.FONT_16Px,
    fontFamily: theme.fonts.bold,
  },
  socialSection: {
    marginTop: verticalScale(40),
  },
  dividerRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: verticalScale(24),
    justifyContent: "center",
  },
  line: {
    width: scale(100), // Độ dài đường kẻ
    height: 1,
    backgroundColor: theme.colors.surfaceVariant,
  },
  dividerText: {
    marginHorizontal: scale(12),
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.FONT_12Px,
    fontFamily: theme.fonts.regular,
  },
  socialButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: scale(20), // Theo Figma: Gap 20-30px giữa các icon
  },
  socialButton: {
    width: scale(64),
    height: scale(64),
    borderRadius: 16, // Theo Figma: Corner radius
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: verticalScale(40),
  },
  footerText: {
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.FONT_12Px,
    fontFamily: theme.fonts.regular,
  },
  signUpLink: {
    color: theme.colors.textLink,
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSize.FONT_12Px,
  },
});
