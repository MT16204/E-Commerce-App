import React, { useMemo } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Href, useRouter } from "expo-router";
import { Image } from "expo-image";
import dayjs from "dayjs";

import theme, { scale, verticalScale } from "@/theme";
import SafeScreen from "@/components/SafeScreen";
import ScreenHeader from "@/components/ScreenHeader";
import LoadingState from "@/components/LoadingState";
import { FocusAwareStatusBar } from "@/components/StatusBar";
import useNotifications from "@/hooks/useNotifications";

const NotificationScreen = () => {
  const router = useRouter();
  const { notifications, isLoading, markAsRead, deleteNotification } =
    useNotifications();

  const groupedNotifications = useMemo(() => {
    const groups: { [key: string]: any[] } = {};
    notifications.forEach((notif: any) => {
      const date = dayjs(notif.createdAt);
      let label = "";
      if (date.isSame(dayjs(), "day")) label = "Today";
      else if (date.isSame(dayjs().subtract(1, "day"), "day"))
        label = "Yesterday";
      else label = date.format("MMMM DD, YYYY");

      if (!groups[label]) groups[label] = [];
      groups[label].push(notif);
    });
    return groups;
  }, [notifications]);

  if (isLoading) {
    return (
      <SafeScreen style={styles.container}>
        <FocusAwareStatusBar style="dark" />
        <ScreenHeader title="Notifications" />
        <LoadingState message="Loading notifications..." />
      </SafeScreen>
    );
  }

  return (
    <SafeScreen style={styles.container}>
      <FocusAwareStatusBar style="dark" />
      <ScreenHeader title="Notifications" />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.contentBody}>
          {notifications.length === 0 ? (
            <View style={styles.emptyContainer}>
              <View style={styles.emptyIconCircle}>
                <Ionicons
                  name="notifications-off"
                  size={48}
                  color={theme.colors.primary}
                />
              </View>
              <Text style={styles.emptyTitle}>No notifications yet</Text>
              <Text style={styles.emptySubTitle}>
                Orders and promotions will appear here.
              </Text>
            </View>
          ) : (
            Object.keys(groupedNotifications).map((dateLabel) => (
              <View key={dateLabel} style={styles.dateGroup}>
                <Text style={styles.dateLabel}>{dateLabel}</Text>
                {groupedNotifications[dateLabel].map((notif: any) => (
                  <TouchableOpacity
                    key={notif._id}
                    activeOpacity={0.8}
                    style={[
                      styles.notifCard,
                      !notif.isRead && styles.notifUnread,
                    ]}
                    onPress={() => {
                      markAsRead(notif._id);
                      if (notif.type === "CHAT") {
                        router.push("/(profile)/customer-service" as Href);
                      } else if (notif.order?._id) {
                        router.push("/(tabs)/orders" as Href);
                      }
                    }}
                  >
                    {/* ICON / IMAGE */}
                    <View style={styles.imageContainer}>
                      {notif.order?.orderItems?.[0]?.product?.images?.[0] ? (
                        <Image
                          source={notif.order.orderItems[0].product.images[0]}
                          style={styles.productImg}
                          contentFit="cover"
                        />
                      ) : (
                        <View
                          style={[
                            styles.iconBox,
                            notif.type === "CHAT" && {
                              backgroundColor: theme.colors.primary,
                            },
                          ]}
                        >
                          <Ionicons
                            name={
                              notif.type === "PROMOTION"
                                ? "gift"
                                : notif.type === "CHAT"
                                  ? "chatbubble-ellipses"
                                  : "receipt"
                            }
                            size={24}
                            color={theme.colors.white}
                          />
                        </View>
                      )}
                      {!notif.isRead && <View style={styles.unreadDot} />}
                    </View>

                    {/* CONTENT */}
                    <View style={styles.notifInfo}>
                      <View style={styles.notifHeader}>
                        <Text style={styles.notifTitle} numberOfLines={1}>
                          {notif.title}
                        </Text>
                        <Text style={styles.notifTime}>
                          {dayjs(notif.createdAt).format("HH:mm")}
                        </Text>
                      </View>

                      <Text style={styles.notifMessage} numberOfLines={2}>
                        {notif.message}
                      </Text>

                      {notif.order && (
                        <View style={styles.orderBadge}>
                          <Text style={styles.orderBadgeText}>
                            Order: #{notif.order._id.slice(-6).toUpperCase()}
                          </Text>
                        </View>
                      )}
                    </View>

                    {/* DELETE BUTTON */}
                    <TouchableOpacity
                      style={styles.deleteBtn}
                      onPress={() => {
                        Alert.alert("Delete", "Remove this notification?", [
                          { text: "Cancel", style: "cancel" },
                          {
                            text: "Delete",
                            style: "destructive",
                            onPress: () => deleteNotification(notif._id),
                          },
                        ]);
                      }}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={18}
                        color={theme.colors.grayMedium}
                      />
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.backgroundhome },
  scrollContent: { paddingBottom: verticalScale(40) },
  contentBody: { paddingHorizontal: scale(20) },
  dateGroup: { marginTop: verticalScale(20) },
  dateLabel: {
    fontSize: 16,
    fontFamily: theme.fonts.bold,
    color: theme.colors.textPrimary,
    marginBottom: verticalScale(12),
  },
  notifCard: {
    flexDirection: "row",
    padding: scale(15),
    borderRadius: scale(20),
    backgroundColor: theme.colors.white,
    marginBottom: verticalScale(12),
    borderWidth: 1,
    borderColor: theme.colors.surfaceVariant,
    position: "relative",
  },
  notifUnread: {
    backgroundColor: theme.colors.surface,
    borderColor: theme.colors.primary,
  },
  imageContainer: { position: "relative" },
  productImg: {
    width: scale(55),
    height: scale(55),
    borderRadius: scale(15),
    backgroundColor: theme.colors.surface,
  },
  iconBox: {
    width: scale(55),
    height: scale(55),
    borderRadius: scale(15),
    backgroundColor: theme.colors.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  unreadDot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: scale(12),
    height: scale(12),
    borderRadius: 6,
    backgroundColor: theme.colors.primaryPressed,
    borderWidth: 2,
    borderColor: theme.colors.white,
  },
  notifInfo: {
    flex: 1,
    marginLeft: scale(12),
    marginRight: scale(25), 
    justifyContent: "center",
  },
  notifHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  notifTitle: {
    fontSize: 15,
    fontFamily: theme.fonts.semiBold,
    color: theme.colors.heading,
    flex: 1,
  },
  notifTime: {
    fontSize: 11,
    color: theme.colors.textPlaceholder,
    fontFamily: theme.fonts.regular,
  },
  notifMessage: {
    fontSize: 13,
    color: theme.colors.textSecondary,
    fontFamily: theme.fonts.medium,
    marginTop: 2,
  },
  orderBadge: {
    backgroundColor: theme.colors.background,
    alignSelf: "flex-start",
    paddingHorizontal: scale(8),
    paddingVertical: verticalScale(2),
    borderRadius: scale(6),
    marginTop: verticalScale(6),
    borderWidth: 1,
    borderColor: theme.colors.primary,
  },
  orderBadgeText: {
    fontSize: 10,
    color: theme.colors.primary,
    fontFamily: theme.fonts.bold,
  },
  deleteBtn: {
    position: "absolute",
    right: scale(10),
    top: scale(30),
    padding: scale(5),
  },
  emptyContainer: {
    marginTop: verticalScale(100),
    alignItems: "center",
    paddingHorizontal: scale(40),
  },
  emptyIconCircle: {
    width: scale(100),
    height: scale(100),
    borderRadius: scale(50),
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontFamily: theme.fonts.bold,
    color: theme.colors.heading,
  },
  emptySubTitle: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    textAlign: "center",
    marginTop: 8,
    lineHeight: 20,
  },
});

export default NotificationScreen;
