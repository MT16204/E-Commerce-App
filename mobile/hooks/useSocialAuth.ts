import { useSSO } from "@clerk/clerk-expo";
import { useState } from "react";
import { Alert } from "react-native";
import { useRouter } from "expo-router";

function useSocialAuth() {
  const [loadingStrategy, setLoadingStrategy] = useState<string | null>(null);
  const { startSSOFlow } = useSSO();
  const router = useRouter();

  const handleSocialAuth = async (strategy: "oauth_google" | "oauth_apple") => {
    setLoadingStrategy(strategy);

    try {
      const { createdSessionId, setActive, signUp } = await startSSOFlow({
        strategy,
        redirectUrl: "ecommerceapp://",
      });

      console.log("Check Session:", createdSessionId);

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
        console.log("✅ Sign In thành công!");
        router.replace("/");
        return; 
      }

      if (signUp && setActive) {
        console.log("🆕 Đang tạo tài khoản mới từ Google...");

        const completeSignUp = await signUp.update({});

        if (completeSignUp.status === "complete") {
          await setActive({ session: completeSignUp.createdSessionId });
          console.log("✅ Sign Up thành công!");
          router.replace("/");
        }
      }
    } catch (error: any) {
      console.log("💥 Error in social auth:", error);

      if (error?.errors?.[0]?.code === "auth_registration_cancelled") return;

      const provider = strategy === "oauth_google" ? "Google" : "Apple";
      Alert.alert(
        "Error",
        `Failed to sign in with ${provider}. Please try again.`,
      );
    } finally {
      setLoadingStrategy(null);
    }
  };

  return { loadingStrategy, handleSocialAuth };
}

export default useSocialAuth;
