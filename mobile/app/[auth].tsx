import { useLocalSearchParams } from "expo-router";
import WelcomeScreen from "@/screens/auth/welcomback/welcomeBackScreen";
import SignInScreen from "@/screens/auth/signIn/signInScreen";
import SignUpScreen from "@/screens/auth/signUp/signUpScreen";

export default function AuthDispatcher() {
  const { auth } = useLocalSearchParams();

  // Kiểm tra tham số trên URL để render đúng màn hình từ src
  switch (auth) {
    case "signIn":
      return <SignInScreen />;
    case "signUp":
      return <SignUpScreen />;
    case "welcome":
      return <WelcomeScreen />;
    default:
      return <WelcomeScreen />;
  }
}