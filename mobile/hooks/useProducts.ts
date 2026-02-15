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
        console.error("--- API PRODUCTS ERRORS:", {
          message: error.message,
          status: error.response?.status, 
          data: error.response?.data, 
        });
        throw error;
      }
    },
  });

  return result;
};

export default useProducts;
