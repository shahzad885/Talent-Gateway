import React, { useState, useEffect, useRef } from "react";
import api from "../../services/api";
import { Link } from "react-router-dom";
import { io } from "socket.io-client";
import {
  FaUser,
  FaEnvelope,
  FaProjectDiagram,
  FaBriefcase,
  FaPaperPlane,
  FaCircle,
  FaArrowLeft,
  FaClock,
} from "react-icons/fa";

const ChatList = () => {
  const [chats, setChats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeChat, setActiveChat] = useState(null);
  const [showMessagesScreen, setShowMessagesScreen] = useState(false);
  const [newMessage, setNewMessage] = useState("");
  const [sending, setSending] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  // Socket reference
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    // Create socket connection
    const SOCKET_URL = import.meta.env.VITE_BACKEND_URL;
    socketRef.current = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
    });

    // Set up socket event listeners
    socketRef.current.on("connect", () => {
      console.log("Connected to websocket server!");
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      console.log("Disconnected from socket server");
      setIsConnected(false);
    });

    socketRef.current.on("receive_message", (messageData) => {
      updateChatWithNewMessage(messageData);
    });

    socketRef.current.on("messages_read", (data) => {
      if (data.userId !== localStorage.getItem("userId")) {
        updateReadStatus(data.chatId);
      }
    });

    // Fetch chats on component mount
    fetchChats();

    // Cleanup socket connection when component unmounts
    return () => {
      socketRef.current.disconnect();
    };
  }, []);

  // Scroll to bottom of messages when new messages arrive or chat changes
  useEffect(() => {
    if (showMessagesScreen) {
      scrollToBottom();
    }
  }, [activeChat?.messages, showMessagesScreen]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const updateChatWithNewMessage = (messageData) => {
    setChats((prevChats) => {
      return prevChats.map((chat) => {
        if (chat._id === messageData.chatId) {
          const updatedChat = {
            ...chat,
            messages: [...chat.messages, messageData.message],
          };
          if (activeChat && activeChat._id === chat._id) {
            setActiveChat(updatedChat);
            markMessagesAsRead(chat._id);
          }
          return updatedChat;
        }
        return chat;
      });
    });
    setTimeout(scrollToBottom, 100);
  };

  const fetchChats = async () => {
    try {
      const response = await api.get("/student/chats");
      setChats(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching chats:", error);
      setError("Failed to load chats. Please try again later.");
      setLoading(false);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !activeChat || !isConnected) return;

    setSending(true);
    try {
      const currentUserId = localStorage.getItem("userId");
      const messageData = {
        content: newMessage,
        sender: currentUserId,
        timestamp: new Date().toISOString(),
        read: false,
      };

      const updatedChat = {
        ...activeChat,
        messages: [...activeChat.messages, messageData],
      };

      setChats((prevChats) =>
        prevChats.map((chat) =>
          chat._id === activeChat._id ? updatedChat : chat
        )
      );
      setActiveChat(updatedChat);

      await api.post(`/student/chats/${activeChat._id}/messages`, {
        content: newMessage,
      });

      socketRef.current.emit("send_message", {
        chatId: activeChat._id,
        message: messageData,
      });

      setNewMessage("");
      scrollToBottom();
    } catch (error) {
      console.error("Error sending message:", error);
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const updateReadStatus = (chatId) => {
    setChats((prevChats) =>
      prevChats.map((chat) => {
        if (chat._id === chatId) {
          const updatedMessages = chat.messages.map((msg) => ({
            ...msg,
            read: true,
          }));
          return { ...chat, messages: updatedMessages };
        }
        return chat;
      })
    );
    if (activeChat && activeChat._id === chatId) {
      setActiveChat((prev) => ({
        ...prev,
        messages: prev.messages.map((msg) => ({ ...msg, read: true })),
      }));
    }
  };

  const markMessagesAsRead = async (chatId) => {
    try {
      updateReadStatus(chatId);
      await api.post(`/student/chats/${chatId}/read`);
      socketRef.current.emit("mark_read", {
        chatId: chatId,
        userId: localStorage.getItem("userId"),
      });
    } catch (error) {
      console.error("Error marking messages as read:", error);
    }
  };

  const handleChatSelect = async (chat) => {
    try {
      socketRef.current.emit("join_chat", chat._id);
      setActiveChat(chat);
      setShowMessagesScreen(true);
      markMessagesAsRead(chat._id);
    } catch (error) {
      console.error("Error loading chat:", error);
      setError("Failed to load conversation. Please try again.");
    }
  };

  const getOtherParticipant = (chat) => {
    const currentUserId = localStorage.getItem("userId");
    return chat.participants.find((p) => p._id !== currentUserId) || {};
  };

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString();
  };

  const getUnreadCount = (chat) => {
    const currentUserId = localStorage.getItem("userId");
    return chat.messages.filter(
      (msg) => !msg.read && msg.sender !== currentUserId
    ).length;
  };

  const handleBackToList = () => {
    setShowMessagesScreen(false);
    setActiveChat(null);
    setError(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f4f7fa' }}>
        <div className="flex items-center justify-center h-64">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2" style={{ borderColor: '#123458' }}></div>
            <p className="text-gray-600 font-medium">Loading conversations...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error && !showMessagesScreen) {
    return (
      <div className="min-h-screen p-6" style={{ backgroundColor: '#f4f7fa' }}>
        <div className="max-w-md mx-auto">
          <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-xl shadow-sm">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="font-medium">{error}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Messages Screen
  if (showMessagesScreen && activeChat) {
    return (
      <div className="min-h-screen" style={{ backgroundColor: '#f4f7fa' }}>
        <div className="max-w-4xl mx-auto p-6">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden" style={{ height: 'calc(100vh - 48px)' }}>
            <div className="flex flex-col h-full">
              {/* Chat Header */}
              <div className="p-6 border-b border-gray-200" style={{ backgroundColor: 'white' }}>
                <div className="flex items-center">
                  <button
                    onClick={handleBackToList}
                    className="mr-4 p-2 rounded-full hover:bg-gray-100 transition-colors"
                  >
                    <FaArrowLeft className="text-gray-600" />
                  </button>
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold mr-4 shadow-sm"
                    style={{ backgroundColor: '#B8C8D9' }}
                  >
                    {getOtherParticipant(activeChat).name?.charAt(0)?.toUpperCase()}
                  </div>
                  <div>
                    <h2 className="font-bold text-xl text-gray-800">
                      {getOtherParticipant(activeChat).name}
                    </h2>
                    {activeChat.project && (
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <FaProjectDiagram className="mr-1" />
                        Project: {activeChat.project.title}
                      </p>
                    )}
                    {activeChat.internship && (
                      <p className="text-sm text-gray-600 flex items-center mt-1">
                        <FaBriefcase className="mr-1" />
                        Internship: {activeChat.internship.title}
                      </p>
                    )}
                  </div>
                </div>
              </div>

              {/* Error Message */}
              {error && (
                <div className="mx-6 mt-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl">
                  <p className="text-sm">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="text-red-500 hover:text-red-700 text-xs mt-1"
                  >
                    Dismiss
                  </button>
                </div>
              )}

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4" style={{ backgroundColor: '#fafbfc' }}>
                {activeChat.messages?.length === 0 ? (
                  <div className="text-center py-16">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#B8C8D9' }}>
                      <FaEnvelope className="text-white text-xl" />
                    </div>
                    <p className="text-gray-600 font-medium mb-2">No messages yet</p>
                    <p className="text-sm text-gray-500">Start the conversation!</p>
                  </div>
                ) : (
                  activeChat.messages?.map((message, index) => {
                    const isCurrentUser = message.sender === localStorage.getItem("userId");

                    return (
                      <div
                        key={index}
                        className={`flex ${isCurrentUser ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`rounded-2xl px-6 py-3 max-w-[70%] shadow-sm ${
                            isCurrentUser
                              ? "text-white"
                              : "bg-white text-gray-800 border border-gray-100"
                          }`}
                          style={{
                            backgroundColor: isCurrentUser ? '#123458' : 'white',
                          }}
                        >
                          <p className="leading-relaxed">{message.content}</p>
                          <p
                            className={`text-xs mt-2 flex items-center justify-between ${
                              isCurrentUser ? "text-gray-200" : "text-gray-500"
                            }`}
                          >
                            <span>{formatTimestamp(message.timestamp)}</span>
                            {isCurrentUser && (
                              <span className="ml-2 flex items-center">
                                {message.read ? (
                                  <span className="text-green-300">✓✓</span>
                                ) : (
                                  <span className="text-gray-300">✓</span>
                                )}
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Message Input */}
              <div className="p-6 border-t border-gray-200 bg-white">
                <form onSubmit={handleSendMessage} className="flex space-x-4">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-opacity-50 transition-colors"
                    style={{ focusBorderColor: '#B8C8D9' }}
                    placeholder={isConnected ? "Type your message..." : "Connecting..."}
                    disabled={sending || !isConnected}
                  />
                  <button
                    type="submit"
                    className="px-6 py-3 rounded-xl text-white font-medium transition-all duration-200 hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                    style={{ backgroundColor: '#123458' }}
                    disabled={sending || !newMessage.trim() || !isConnected}
                  >
                    {sending ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Sending...</span>
                      </>
                    ) : (
                      <>
                        <FaPaperPlane />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Chat List Screen
  return (
    <div className="min-h-screen p-6" style={{ backgroundColor: '#f4f7fa' }}>
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Messages</h1>
            <p className="text-gray-600">Connect and collaborate with your network</p>
          </div>
          <div className="flex items-center space-x-3 px-4 py-2 rounded-full" style={{ backgroundColor: 'white' }}>
            <FaCircle
              className={`text-xs ${isConnected ? 'text-green-500' : 'text-red-500'}`}
            />
            <span className="text-sm font-medium text-gray-700">
              {isConnected ? "Connected" : "Reconnecting..."}
            </span>
          </div>
        </div>

        {/* Chat List Container */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Chat List Header */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800">Conversations</h2>
            <p className="text-sm text-gray-500 mt-1">{chats.length} active chats</p>
          </div>

          {/* Chat List */}
          <div className="max-h-96 overflow-y-auto">
            {chats.length === 0 ? (
              <div className="text-center py-16 px-6">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: '#B8C8D9' }}>
                  <FaEnvelope className="text-white text-xl" />
                </div>
                <p className="text-gray-600 font-medium mb-2">No conversations yet</p>
                <p className="text-sm text-gray-500">
                  Start a chat with alumni from their profiles
                </p>
              </div>
            ) : (
              <div className="space-y-1 p-3">
                {chats.map((chat) => {
                  const otherParticipant = getOtherParticipant(chat);
                  const lastMessage =
                    chat.messages && chat.messages.length > 0
                      ? chat.messages[chat.messages.length - 1]
                      : null;
                  const unreadCount = getUnreadCount(chat);

                  return (
                    <div
                      key={chat._id}
                      className="p-4 rounded-xl cursor-pointer transition-all duration-200 hover:shadow-md hover:bg-gray-50"
                      onClick={() => handleChatSelect(chat)}
                    >
                      <div className="flex items-center mb-2">
                        <div
                          className="w-12 h-12 rounded-full flex items-center justify-center text-white font-semibold mr-3 shadow-sm"
                          style={{ backgroundColor: '#B8C8D9' }}
                        >
                          {otherParticipant.name?.charAt(0)?.toUpperCase()}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold truncate text-gray-800">
                            {otherParticipant.name}
                          </h3>
                          <p className="text-sm text-gray-500">
                            {otherParticipant.role === "alumni" ? "Alumni" : "Student"}
                          </p>
                        </div>
                        {unreadCount > 0 && (
                          <span
                            className="text-white text-xs font-bold px-2 py-1 rounded-full shadow-sm"
                            style={{ backgroundColor: '#D4C9BE' }}
                          >
                            {unreadCount}
                          </span>
                        )}
                      </div>

                      {chat.project && (
                        <div className="flex items-center text-xs mb-2 text-gray-500">
                          <FaProjectDiagram className="mr-2" />
                          <span className="truncate">Project: {chat.project.title}</span>
                        </div>
                      )}

                      {chat.internship && (
                        <div className="flex items-center text-xs mb-2 text-gray-500">
                          <FaBriefcase className="mr-2" />
                          <span className="truncate">Internship: {chat.internship.title}</span>
                        </div>
                      )}

                      {lastMessage && (
                        <div>
                          <p className="text-sm line-clamp-2 text-gray-600">
                            <span className="font-medium">
                              {lastMessage.sender === localStorage.getItem("userId")
                                ? "You: "
                                : `${otherParticipant.name}: `}
                            </span>
                            {lastMessage.content}
                          </p>
                          <p className="text-xs mt-1 text-gray-400">
                            {formatTimestamp(lastMessage.timestamp)}
                          </p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatList;