import { StyleSheet } from "react-native";
import theme, { scale, verticalScale } from "@/theme";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: scale(24),
    paddingBottom: verticalScale(30),
  },
  backButton: {
    width: scale(48),
    height: scale(48),
    borderRadius: theme.borderRadius.full,
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
    lineHeight: verticalScale(50),
    marginBottom: verticalScale(32),
  },
  form: {
    gap: verticalScale(16),
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: scale(16),
    height: verticalScale(56),
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
  signUpButton: {
    height: verticalScale(49),
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginTop: verticalScale(24),
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 3,
  },
  signUpButtonText: {
    color: theme.colors.white,
    fontFamily: theme.fonts.bold,
    fontSize: theme.fontSize.FONT_16Px,
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
    width: scale(100),
    height: 1,
    backgroundColor: theme.colors.surfaceVariant,
  },
  dividerText: {
    marginHorizontal: scale(12),
    color: theme.colors.textSecondary,
    fontSize: theme.fontSize.FONT_14Px,
    fontFamily: theme.fonts.regular,
  },
  socialButtonsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: scale(20),
  },
  socialButton: {
    width: scale(64),
    height: scale(64),
    borderRadius: 16,
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
    color: theme.colors.textPrimary,
    fontSize: theme.fontSize.FONT_14Px,
    fontFamily: theme.fonts.regular,
  },
  signInLink: {
    color: theme.colors.primary,
    fontFamily: theme.fonts.semiBold,
    fontSize: theme.fontSize.FONT_14Px,
  },
});