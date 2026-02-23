import React, { useState, useEffect, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { socket } from "../lib/socket";
import { customerApi, chatApi } from "../lib/api";
import { formatDate } from "../lib/utils";
import { Search, Send, User, MoreVertical, Trash2 } from "lucide-react";

function MessagesPage() {
  const [selectedUser, setSelectedUser] = useState(null);
  const [messageInput, setMessageInput] = useState("");
  const [chatMessages, setChatMessages] = useState([]);
  const [showMenu, setShowMenu] = useState(false);
  const scrollRef = useRef(null);
  const queryClient = useQueryClient();

  const { data: customerData, isLoading: loadingCustomers } = useQuery({
    queryKey: ["customers"],
    queryFn: customerApi.getAll,
  });

  const customers = customerData?.customers || [];

  const { data: historyData } = useQuery({
    queryKey: ["chatHistory", selectedUser?.clerkId],
    queryFn: () => chatApi.getHistory(selectedUser?.clerkId),
    enabled: !!selectedUser?.clerkId,
  });

  useEffect(() => {
    if (historyData?.messages) setChatMessages(historyData.messages);
    else setChatMessages([]);
  }, [historyData]);

  useEffect(() => {
    socket.connect();
    socket.emit("join", "ADMIN");

    const handleNewMsg = (msg) => {
      console.log("📩 Admin Console nhận tin mới:", msg);

      if (
        selectedUser &&
        (msg.senderId === selectedUser.clerkId ||
          msg.receiverId === selectedUser.clerkId)
      ) {
        setChatMessages((prev) => [...prev, msg]);
      }

      queryClient.invalidateQueries({ queryKey: ["customers"] });
    };

    socket.on("newMessage", handleNewMsg);

    return () => {
      socket.off("newMessage", handleNewMsg);
    };
  }, [selectedUser, queryClient]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  useEffect(() => {
    const handleOutsideClick = () => setShowMenu(false);

    if (showMenu) {
      window.addEventListener("click", handleOutsideClick);
    }

    return () => window.removeEventListener("click", handleOutsideClick);
  }, [showMenu]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!messageInput.trim() || !selectedUser) return;

    const msgData = {
      senderId: "ADMIN",
      receiverId: selectedUser.clerkId,
      text: messageInput,
      isAdmin: true,
      createdAt: new Date().toISOString(),
    };

    socket.emit("sendMessage", msgData);
    setChatMessages((prev) => [...prev, msgData]);
    setMessageInput("");
  };

  const handleDeleteHistory = async () => {
    if (!selectedUser) return;

    if (
      confirm(
        `Are you sure you want to delete chat history with ${selectedUser.name}?`,
      )
    ) {
      try {
        await chatApi.deleteHistory(selectedUser.clerkId);
        setChatMessages([]);
        setShowMenu(false);
        alert("Chat history deleted successfully.");
      } catch (error) {
        alert("Failed to delete chat history.");
      }
    }
  };

  return (
    <div className="flex h-[calc(100vh-120px)] gap-4 text-white">
      {/* SIDEBAR */}
      <div className="w-80 bg-[#1e232d] rounded-2xl flex flex-col border border-gray-800 overflow-hidden shadow-xl">
        <div className="p-4 border-b border-gray-800">
          <div className="flex gap-4 mb-4 text-sm font-semibold border-b border-gray-800">
            <span className="text-[#5D76FF] border-b-2 border-[#5D76FF] pb-2">
              All messages
            </span>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 w-4 h-4 text-gray-500" />
            <input
              type="text"
              placeholder="Search..."
              className="w-full bg-[#161b22] border border-gray-700 rounded-lg py-2 pl-10 text-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loadingCustomers ? (
            <div className="flex justify-center p-4">
              <span className="loading loading-spinner text-[#5D76FF]" />
            </div>
          ) : (
            customers.map((customer) => (
              <button
                key={customer._id}
                onClick={() => setSelectedUser(customer)}
                className={`w-full p-4 flex items-center gap-3 hover:bg-[#252b36] border-b border-gray-800/50 ${
                  selectedUser?._id === customer._id
                    ? "bg-[#252b36] border-r-4 border-[#5D76FF]"
                    : ""
                }`}
              >
                <img
                  src={customer.imageUrl || "https://via.placeholder.com/150"}
                  className="w-12 h-12 rounded-full border border-gray-700"
                  alt=""
                />
                <div className="flex-1 text-left truncate">
                  <p className="font-bold text-gray-200">{customer.name}</p>
                  <p className="text-xs text-gray-500">Tap to chat</p>
                </div>
              </button>
            ))
          )}
        </div>
      </div>

      {/* CHAT AREA */}
      <div className="flex-1 bg-[#1e232d] rounded-2xl border border-gray-800 flex flex-col overflow-hidden shadow-xl">
        {selectedUser ? (
          <>
            <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-[#1e232d]">
              <div className="flex items-center gap-3">
                <img
                  src={selectedUser.imageUrl}
                  className="w-10 h-10 rounded-full"
                  alt=""
                />
                <h3 className="font-bold text-white">{selectedUser.name}</h3>
              </div>

              <div className="relative" onClick={(e) => e.stopPropagation()}>
                <button
                  onClick={() => setShowMenu(!showMenu)}
                  className={`p-2 rounded-full transition-colors ${
                    showMenu
                      ? "bg-[#272727] text-white"
                      : "text-gray-400 hover:bg-[#272727]"
                  }`}
                >
                  <MoreVertical size={20} />
                </button>

                {showMenu && (
                  <div className="absolute right-0 top-11 w-48 bg-[#272727] border border-gray-700 rounded-lg shadow-2xl z-50 py-1">
                    <button
                      onClick={handleDeleteHistory}
                      className="w-full text-left px-4 py-3 text-sm text-red-500 hover:bg-[#1e232d] flex items-center gap-2 transition-colors"
                    >
                      <Trash2 size={16} /> Delete chat history
                    </button>
                  </div>
                )}
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-[#161b22]/20">
              {chatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${
                    msg.isAdmin ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] p-3 rounded-2xl text-sm ${
                      msg.isAdmin
                        ? "bg-[#5D76FF] rounded-tr-none"
                        : "bg-[#252b36] rounded-tl-none border border-gray-700"
                    }`}
                  >
                    {msg.text}
                    <p className="text-[10px] mt-1 opacity-50">
                      {formatDate(String(msg.createdAt))}
                    </p>
                  </div>
                </div>
              ))}
              <div ref={scrollRef} />
            </div>

            <form
              onSubmit={handleSendMessage}
              className="p-4 border-t border-gray-800 flex gap-2"
            >
              <input
                type="text"
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="Type a message..."
                className="flex-1 bg-[#161b22] border border-gray-700 rounded-xl px-4 py-2 focus:outline-none focus:border-[#5D76FF]"
              />
              <button type="submit" className="bg-[#5D76FF] p-3 rounded-xl">
                <Send size={20} />
              </button>
            </form>
          </>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-gray-500 opacity-50">
            <User size={64} className="mb-4" />
            <p className="text-lg font-bold">No conversation selected</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default MessagesPage;
