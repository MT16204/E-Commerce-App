import { colors } from "./colors";
import { typography } from "./typography";
import { scale, verticalScale, moderateScale, isIpad } from "./scale";
import { FontSize } from "./font-size";

export const theme = {
  colors,
  fonts: typography, 
  fontSize: FontSize,
  spacing: {
    xs: scale(4),
    sm: scale(8),
    md: scale(16),
    lg: scale(24),
    xl: scale(32),
    xxl: scale(40),
  },
  borderRadius: {
    xs: scale(4),
    sm: scale(8),
    md: scale(12),
    lg: scale(20),
    full: 9999,
  },
};

export type Theme = typeof theme;
export { scale, verticalScale, moderateScale, isIpad };
export default theme;
