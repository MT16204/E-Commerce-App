import { useApi } from "@/lib/api";
import { Product } from "@/types";
import { useQuery } from "@tanstack/react-query";

const useProducts = () => {
  const api = useApi();

  const result = useQuery({
    queryKey: ["products"],
    queryFn: async () => {
      try {
        const { data } = await api.get<Product[]>("/products");
        return data;
      } catch (error: any) {
        // Log chi tiết lỗi ra Terminal
        console.error("--- API PRODUCTS ERRORS:", {
          message: error.message,
          status: error.response?.status, // 404, 500, etc.
          data: error.response?.data, // Nội dung lỗi từ server
        });
        throw error;
      }
    },
  });

  return result;
};

export default useProducts;
