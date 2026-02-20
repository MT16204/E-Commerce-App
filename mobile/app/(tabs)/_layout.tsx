import { Redirect, Tabs } from "expo-router";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { useAuth } from "@clerk/clerk-expo";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import theme, { scale, verticalScale } from "@/theme";
import useCart from "@/hooks/useCart";
import useWishlist from "@/hooks/useWishlist";
import { useOrders } from "@/hooks/useOrders";

const TabsLayout = () => {
  const { isSignedIn, isLoaded } = useAuth();
  const insets = useSafeAreaInsets();
  const { cartItemCount } = useCart();
  const { wishlist } = useWishlist();
  const { data: ongoingOrders } = useOrders("pending");

  if (!isLoaded) return null;
  if (!isSignedIn) return <Redirect href={"/welcome"} />;

  return (
    <Tabs
      screenOptions={{
        headerShown: false,

        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.textSecondary,

        tabBarBadgeStyle: {
          backgroundColor: theme.colors.primary, 
          color: theme.colors.white,
          fontSize: 10,
          fontFamily: theme.fonts.bold,
          lineHeight: 14,
        },

        tabBarStyle: {
          height: 60 + insets.bottom,
          paddingBottom: insets.bottom,
          paddingHorizontal: scale(16),
          paddingTop: 8,
          backgroundColor: theme.colors.white,
          borderTopWidth: 1,
          borderTopColor: theme.colors.background,
        },

        tabBarItemStyle: {
          paddingVertical: verticalScale(6),
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },

        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: theme.fonts.medium,
          marginTop: 3,
          textAlign: "center",
        },
        tabBarIconStyle: {
          margin: 0,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          title: "Home",
          tabBarIcon: ({ color }) => (
            <Ionicons name="home" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="orders"
        options={{
          title: "Orders",
          tabBarBadge:
            ongoingOrders?.length && ongoingOrders.length > 0
              ? ongoingOrders.length
              : undefined,
          tabBarIcon: ({ color }) => (
            <Ionicons name="bag-handle" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="cart"
        options={{
          title: "Cart",
          tabBarBadge:
            typeof cartItemCount === "number" && cartItemCount > 0
              ? cartItemCount
              : undefined,
          tabBarIcon: ({ color }) => (
            <Ionicons name="cart" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="wishList"
        options={{
          title: "Wishlist",
          tabBarBadge:
            wishlist?.length && wishlist.length > 0
              ? wishlist.length
              : undefined,
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart" size={24} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="profile"
        options={{
          title: "Profile",
          tabBarIcon: ({ color }) => (
            <Ionicons name="person" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
};

export default TabsLayout;
