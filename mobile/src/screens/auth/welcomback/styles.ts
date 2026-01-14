import { StyleSheet } from "react-native";
import theme from "@/theme"; 

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white, 
  },
  content: {
    flex: 1,
    paddingHorizontal: 25,
    alignItems: "center",
    justifyContent: "center",
  },
  logoContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 60,
  },
  logoText: {
    fontSize: 40,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.primary, // 5D76FF [cite: 2026-01-14]
    letterSpacing: 8, // Tạo hiệu ứng hiện đại như Lovable
  },
  textSection: {
    alignItems: "center",
    marginBottom: 50,
  },
  title: {
    fontSize: 26,
    fontFamily: theme.fonts.bold,
    color: "#272727", // Mã màu 272727 của bạn [cite: 2026-01-14]
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: theme.colors.grayMedium, // 999999 [cite: 2026-01-14]
    textAlign: "center",
    marginTop: 15,
    lineHeight: 24,
    paddingHorizontal: 10,
  },
  buttonSection: {
    width: "100%",
    gap: 15,
  },
  primaryButton: {
    backgroundColor: theme.colors.primary, // 5D76FF [cite: 2026-01-14]
    height: 58,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    elevation: 4,
    shadowColor: theme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  primaryButtonText: {
    color: theme.colors.white, // FFFFFF [cite: 2026-01-14]
    fontSize: 17,
    fontFamily: theme.fonts.bold,
  },
  outlineButton: {
    height: 58,
    borderRadius: 18,
    borderWidth: 1.5,
    borderColor: "#EBEBEB", // EBEBEB [cite: 2026-01-14]
    alignItems: "center",
    justifyContent: "center",
  },
  outlineButtonText: {
    color: "#272727", // 272727 [cite: 2026-01-14]
    fontSize: 17,
    fontFamily: theme.fonts.medium,
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 25,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: "#F4F4F4", // F4F4F4 [cite: 2026-01-14]
  },
  dividerText: {
    paddingHorizontal: 15,
    color: theme.colors.grayMedium,
    fontSize: 14,
  },
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 20,
  },
  socialButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F4F4F4", // F4F4F4 [cite: 2026-01-14]
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#EBEBEB", // EBEBEB [cite: 2026-01-14]
  },
});