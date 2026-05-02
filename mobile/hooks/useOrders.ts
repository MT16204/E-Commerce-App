import { useQuery } from "@tanstack/react-query";
import { useApi } from "@/lib/api";
import { Order } from "@/types";

// Add (status: string) here
export const useOrders = (status: string) => {
  const api = useApi();

  return useQuery<Order[]>({
    // Add status to the queryKey so React Query refetches when tab changes
    queryKey: ["orders", status],
    queryFn: async () => {
      const { data } = await api.get("/orders", {
        params: { status },
      });
      return data.orders ?? [];
    },
    refetchInterval: 6000,
  });
};
