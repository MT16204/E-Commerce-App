import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface Props {
  children: ReactNode;
  style?: StyleProp<ViewStyle>;
}

const SafeScreen = ({ children, style }: Props) => {
  const insets = useSafeAreaInsets();

  return (
    <View 
      style={[{ flex: 1, paddingTop: insets.top, }, style]} 
    >
      {children}
    </View>
  );
};

export default SafeScreen;