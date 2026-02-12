import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Cart } from "@/types";

const useCart = () => {
  const api = useApi();
  const queryClient = useQueryClient();

  const {
    data: cart,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["cart"],
    queryFn: async () => {
      const { data } = await api.get<{ cart: Cart }>("/cart");
      return data.cart;
    },
  });

  const addToCartMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity = 1,
    }: {
      productId: string;
      quantity?: number;
    }) => {
      const { data } = await api.post<{ cart: Cart }>("/cart", {
        productId,
        quantity,
      });
      return data.cart;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const updateQuantityMutation = useMutation({
    mutationFn: async ({
      productId,
      quantity,
    }: {
      productId: string;
      quantity: number;
    }) => {
      const { data } = await api.put<{ cart: Cart }>(`/cart/${productId}`, {
        quantity,
      });
      return data.cart;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const removeFromCartMutation = useMutation({
    mutationFn: async (productId: string) => {
      const { data } = await api.delete<{ cart: Cart }>(`/cart/${productId}`);
      return data.cart;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  const clearCartMutation = useMutation({
    mutationFn: async () => {
      const { data } = await api.delete<{ cart: Cart }>("/cart");
      return data.cart;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["cart"] }),
  });

  // --- PHẦN SỬA LỖI TẠI ĐÂY ---
  const cartTotal =
    cart?.items.reduce((sum, item) => {
      // Kiểm tra nếu sản phẩm bị null (do đã bị xóa khỏi DB) thì bỏ qua không cộng giá
      const itemPrice = item.product?.price ?? 0;
      return sum + itemPrice * item.quantity;
    }, 0) ?? 0;

  const cartItemCount =
    cart?.items.reduce((sum, item) => {
      // Chỉ đếm số lượng nếu sản phẩm đó vẫn tồn tại
      return item.product ? sum + item.quantity : sum;
    }, 0) ?? 0;
  // ----------------------------

  return {
    cart,
    isLoading,
    isError,
    cartTotal,
    cartItemCount,
    addToCart: addToCartMutation.mutate,
    updateQuantity: updateQuantityMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    clearCart: clearCartMutation.mutate,
    isAddingToCart: addToCartMutation.isPending,
    isUpdating: updateQuantityMutation.isPending,
    isRemoving: removeFromCartMutation.isPending,
    isClearing: clearCartMutation.isPending,
  };
};

export default useCart;
