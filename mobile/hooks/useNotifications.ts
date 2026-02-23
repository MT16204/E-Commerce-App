import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";
import { Alert } from "react-native";
import { useApi } from "@/lib/api";
import { socket } from "@/lib/socket";
import { useUser } from "@clerk/clerk-expo";
import { usePathname } from "expo-router";

export interface Notification {
  _id: string;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  order?: {
    _id: string;
    totalPrice: number;
    status: string;
    orderItems: Array<{
      product: {
        name: string;
        image: string;
      };
    }>;
  };
  createdAt: string;
}

const useNotifications = () => {
  const pathname = usePathname();
  const api = useApi();
  const { user } = useUser();
  const queryClient = useQueryClient();

  const { data, isLoading, refetch } = useQuery({
    queryKey: ["notifications"],
    queryFn: async () => {
      const response = await api.get("/notifications");
      return response.data.notifications;
    },
    enabled: !!user?.id,
  });

  useEffect(() => {
    if (!user?.id) return;
    if (!socket.connected) socket.connect();

    socket.emit("join", user.id);

    const handleNewNotification = (notif: any) => {
      console.log("🔔 Socket Received:", notif);

      queryClient.invalidateQueries({ queryKey: ["notifications"] });

      const isChatScreen = pathname.includes("customer-service");

      if (!isChatScreen) {
        Alert.alert(notif.title, notif.message);
      }
    };

    socket.on("notification", handleNewNotification);

    return () => {
      socket.off("notification", handleNewNotification);
    };
  }, [user?.id, queryClient, pathname]); 

  const markAsReadMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.patch(`/notifications/${id}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  const deleteNotificationMutation = useMutation({
    mutationFn: async (id: string) => {
      return await api.delete(`/notifications/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
    },
  });

  return {
    notifications: data || [],
    isLoading,
    refetch,
    markAsRead: markAsReadMutation.mutate,
    deleteNotification: deleteNotificationMutation.mutate,
  };
};

export default useNotifications;
