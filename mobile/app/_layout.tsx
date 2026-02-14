import { Stack } from "expo-router";
import "../global.css";
import {
  MutationCache,
  Query,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ClerkProvider } from "@clerk/clerk-expo";
import { tokenCache } from "@clerk/clerk-expo/token-cache";

import { useFonts } from "expo-font";

import {
  Inter_400Regular,
  Inter_500Medium,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_900Black,
} from "@expo-google-fonts/inter";

import { Poppins_300Light } from "@expo-google-fonts/poppins";

import * as Sentry from "@sentry/react-native";
import { StripeProvider } from "@stripe/stripe-react-native"; 

Sentry.init({
  dsn: "https://56e39572f6a2b4e2bc922c1037ff808b@o4510810408091648.ingest.us.sentry.io/4510874071662593",
  sendDefaultPii: true,
  enableLogs: true,

  replaysSessionSampleRate: 1.0,
  replaysOnErrorSampleRate: 1,
  integrations: [Sentry.mobileReplayIntegration()],
});

const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any, query) => {
      Sentry.captureException(error, {
        tags: {
          type: "react-query-error",
          queryKey: query.queryKey[0]?.toString() || "unknon",
        },
        extra: {
          errorMessage: error.message,
          statusCode: error.response?.status,
          queryKey: query.queryKey,
        },
      });
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      Sentry.captureException(error, {
        tags: { type: "react-query-mutation-error" },
        extra: {
          errorMessage: error.message,
          statusCode: error.response?.status,
        },
      });
    },
  }),
});

export default Sentry.wrap(function RootLayout() {
  const [loaded] = useFonts({
    "Inter-Regular": Inter_400Regular,
    "Inter-Medium": Inter_500Medium,
    "Inter-SemiBold": Inter_600SemiBold,
    "Inter-Bold": Inter_700Bold,
    "Inter-Black": Inter_900Black,
    "Poppins-Light": Poppins_300Light,
  });

  if (!loaded) return null;

  return (
    <ClerkProvider tokenCache={tokenCache}>
      <QueryClientProvider client={queryClient}>
        <StripeProvider
          publishableKey={process.env.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY!}
        >
          <Stack screenOptions={{ headerShown: false }} />
        </StripeProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
});
