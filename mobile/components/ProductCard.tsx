import React, { memo } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { router, Href } from "expo-router";
import theme, { scale } from "@/theme";
import { Product } from "@/types";

interface ProductCardProps {
  product: Product;
  horizontal?: boolean; 
  isFavorite: boolean;
  isAddingToCart: boolean;
  onToggleWishlist: (id: string) => void;
  onAddToCart: (id: string, name: string) => void;
}

const ProductCard = ({
  product,
  horizontal = false,
  isFavorite,
  isAddingToCart,
  onToggleWishlist,
  onAddToCart,
}: ProductCardProps) => {
  return (
    <TouchableOpacity
      className="bg-[#efeeee] rounded-3xl overflow-hidden mb-3"
      style={{
        width: horizontal ? scale(165) : "48%",
        marginRight: horizontal ? scale(12) : 0,
      }}
      activeOpacity={0.8}
      onPress={() => router.push(`/product/${product._id}` as Href)}
    >
      <View className="relative">
        <Image
          source={{ uri: product.images[0] }}
          className="w-full h-44 bg-background-lighter"
          resizeMode="cover"
        />
        <TouchableOpacity
          className="absolute top-3 right-3 bg-white p-2 rounded-full"
          onPress={() => onToggleWishlist(product._id)}
        >
          <Ionicons
            name={isFavorite ? "heart" : "heart-outline"}
            size={18}
            color={isFavorite ? theme.colors.primary : theme.colors.black}
          />
        </TouchableOpacity>
      </View>

      <View className="p-3">
        <Text className="text-text-secondary text-xs mb-1" numberOfLines={1}>
          {product.category}
        </Text>
        <Text
          className="text-text-primary font-bold text-sm mb-2"
          numberOfLines={1}
        >
          {product.name}
        </Text>

        <View className="flex-row items-center mb-2">
          <Ionicons name="star" size={12} color="#FFC107" />
          <Text className="text-text-primary text-xs font-semibold ml-1">
            {product.averageRating.toFixed(1)}
          </Text>
          <View className="mx-2 h-3 w-[1px] bg-[#ABABAB]" />
          <Text className="text-text-secondary text-xs ml-1">
            ({product.totalReviews})
          </Text>
        </View>

        <View className="flex-row items-center justify-between">
          <Text className="text-primary font-bold text-lg">
            ${product.price.toFixed(2)}
          </Text>
          <TouchableOpacity
            className="bg-[#5D76FF] rounded-full w-8 h-8 items-center justify-center"
            onPress={() => onAddToCart(product._id, product.name)}
            disabled={isAddingToCart}
          >
            {isAddingToCart ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Ionicons name="add" size={18} color="white" />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default memo(ProductCard);
