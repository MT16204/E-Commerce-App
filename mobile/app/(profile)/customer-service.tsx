import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

import theme, { scale, verticalScale } from "@/theme";
import SafeScreen from "@/components/SafeScreen";
import ScreenHeader from "@/components/ScreenHeader";
import LoadingState from "@/components/LoadingState";
import { FocusAwareStatusBar } from "@/components/StatusBar";

import { useUser } from "@clerk/clerk-expo";
import { socket } from "@/lib/socket";
import { useApi } from "@/lib/api";

const CustomerServiceScreen = () => {
  const router = useRouter();
  const { user } = useUser();
  const api = useApi();

  const [inputText, setInputText] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const flatListRef = useRef<FlatList>(null);

  const fetchHistory = async () => {
    try {
      const response = await api.get("/user/history");
      if (response.data.messages) {
        setMessages(response.data.messages);
        setTimeout(() => {
          flatListRef.current?.scrollToEnd({ animated: false });
        }, 200);
      }
    } catch (error) {
      console.error("Lỗi lấy lịch sử chat:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!user?.id) return;

    fetchHistory();

    if (!socket.connected) socket.connect();
    socket.emit("join", user.id);

    const handleNewMessage = (msg: any) => {
      if (msg.receiverId === user.id || msg.senderId === user.id) {
        setMessages((prev) => [...prev, msg]);
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, [user?.id]);

  const handleSendMessage = () => {
    if (!inputText.trim() || !user?.id) return;

    const msgData = {
      senderId: user.id,
      receiverId: "ADMIN",
      text: inputText,
      isAdmin: false,
      createdAt: new Date().toISOString(),
    };

    socket.emit("sendMessage", msgData);

    setMessages((prev) => [...prev, msgData]);
    setInputText("");
  };

  const renderItem = ({ item }: { item: any }) => {
    const isSent = !item.isAdmin;

    return (
      <View
        style={[
          styles.messageRow,
          isSent ? styles.sentRow : styles.receivedRow,
        ]}
      >
        <View
          style={[
            styles.bubble,
            isSent ? styles.sentBubble : styles.receivedBubble,
          ]}
        >
          <Text
            style={[
              styles.messageText,
              isSent ? styles.sentText : styles.receivedText,
            ]}
          >
            {item.text}
          </Text>
          {item.createdAt && (
            <Text
              style={[
                styles.timeText,
                isSent ? styles.sentTime : styles.receivedTime,
              ]}
            >
              {new Date(item.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
          )}
        </View>
      </View>
    );
  };

  const isInputEmpty = !inputText.trim();

  if (loading) {
    return (
      <SafeScreen style={styles.container}>
        <ScreenHeader title="Customer Service" />
        <LoadingState message="Loading conversation..." />
      </SafeScreen>
    );
  }

  return (
    <SafeScreen style={styles.container}>
      <FocusAwareStatusBar style="dark" />
      <ScreenHeader title="Customer Service" />

      <FlatList
        ref={flatListRef}
        data={messages}
        keyExtractor={(item, index) => item._id || index.toString()}
        contentContainerStyle={styles.chatList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() =>
          messages.length > 0 ? (
            <View style={styles.dateDivider}>
              <View style={styles.dateBadge}>
                <Text style={styles.dateText}>Today</Text>
              </View>
            </View>
          ) : null
        }
        renderItem={renderItem}
        onContentSizeChange={() =>
          flatListRef.current?.scrollToEnd({ animated: true })
        }
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 10 : 0}
      >
        <View style={styles.inputArea}>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="I have a problem when I ... "
              style={styles.input}
              value={inputText}
              onChangeText={setInputText}
              placeholderTextColor={theme.colors.grayMedium}
              multiline={false}
            />
          </View>

          <TouchableOpacity
            onPress={handleSendMessage}
            disabled={isInputEmpty}
            style={[
              styles.actionBtn,
              {
                backgroundColor: isInputEmpty
                  ? "#ABABAB"
                  : theme.colors.primary,
                opacity: isInputEmpty ? 0.6 : 1,
              },
            ]}
          >
            <Ionicons
              name={isInputEmpty ? "send-outline" : "send"}
              size={22}
              color={theme.colors.white}
            />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.backgroundhome,
  },
  chatList: {
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(20),
  },
  dateDivider: {
    alignItems: "center",
    marginVertical: verticalScale(20),
  },
  dateBadge: {
    backgroundColor: theme.colors.surface,
    paddingHorizontal: scale(12),
    paddingVertical: verticalScale(4),
    borderRadius: scale(8),
  },
  dateText: {
    fontSize: 12,
    color: theme.colors.grayMedium,
    fontFamily: theme.fonts.medium,
  },
  messageRow: {
    marginBottom: verticalScale(16),
    width: "100%",
  },
  sentRow: {
    alignItems: "flex-end",
  },
  receivedRow: {
    alignItems: "flex-start",
  },
  bubble: {
    maxWidth: "85%",
    padding: scale(14),
    borderRadius: scale(20),
  },
  sentBubble: {
    backgroundColor: theme.colors.primary,
    borderBottomRightRadius: scale(4),
  },
  receivedBubble: {
    backgroundColor: theme.colors.surfaceVariant,
    borderBottomLeftRadius: scale(4),
  },
  messageText: {
    fontSize: 14,
    fontFamily: theme.fonts.medium,
    lineHeight: 20,
  },
  sentText: { color: theme.colors.white },
  receivedText: { color: theme.colors.black },
  timeText: {
    fontSize: 10,
    marginTop: 4,
    alignSelf: "flex-end",
    fontFamily: theme.fonts.regular,
  },
  sentTime: { color: "rgba(255,255,255,0.6)" },
  receivedTime: { color: theme.colors.grayMedium },
  inputArea: {
    flexDirection: "row",
    paddingHorizontal: scale(20),
    paddingBottom: verticalScale(30),
    paddingTop: verticalScale(10),
    alignItems: "center",
    backgroundColor: theme.colors.backgroundhome,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.white,
    borderRadius: scale(16),
    paddingHorizontal: scale(15),
    height: verticalScale(56),
    borderWidth: 1,
    borderColor: theme.colors.surface,
  },
  input: {
    flex: 1,
    fontFamily: theme.fonts.regular,
    fontSize: 15,
    color: theme.colors.black,
  },
  actionBtn: {
    width: scale(54),
    height: scale(54),
    borderRadius: scale(27),
    marginLeft: scale(12),
    justifyContent: "center",
    alignItems: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
  },
});

export default CustomerServiceScreen;
