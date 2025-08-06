import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaSearch,
  FaEllipsisV,
  FaPaperclip,
  FaMicrophone,
  FaSmile,
  FaChevronLeft,
  FaTimes,
  FaSignOutAlt,
} from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { BsRobot, BsThreeDotsVertical } from "react-icons/bs";
import { IoSend } from "react-icons/io5";
import AxiosInstance from "../Config/Axios";
import { Bounce, toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import socket from "../Config/SocketIO";

const RaktFlowChat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("people");
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatHistories, setChatHistories] = useState({});
  const [showSearch, setShowSearch] = useState(false);
  const [peoples, setPeoples] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const messagesEndRef = useRef(null);
  const inputRef = useRef(null);

  const Navigate = useNavigate();

  // Get current user data
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const res = await AxiosInstance.get("/users/profile");
        if (res.status === 200) {
          setCurrentUser(res.data.user);
        }
      } catch (error) {
      }
    };
    fetchCurrentUser();
  }, []);

  // Socket.IO message handling
  useEffect(() => {
    if (!currentUser) return;

    const handleReceiveMessage = (msg) => {
  
  // Only add message if it's for the current chat
  if (selectedUser && (
    (msg.senderId === selectedUser._id && msg.receiverId === currentUser._id) ||
    (msg.senderId === currentUser._id && msg.receiverId === selectedUser._id)
  )) {  // Added missing closing parenthesis here
    const newMessage = {
      id: msg.id || Date.now(),
      text: msg.text,
      sender: msg.senderId === currentUser._id ? "me" : "them",
      time: new Date(msg.time || Date.now()).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      image: msg.image || null
    };

    setChatHistories((prev) => {
      const existingMessages = prev[selectedUser._id] || [];
      
      // Check if message already exists to prevent duplicates
      if (existingMessages.some(m => m.id === newMessage.id)) {
        return prev;
      }
      
      return {
        ...prev,
        [selectedUser._id]: [...existingMessages, newMessage],
      };
    });
  }
};

    socket.on("receiveMessage", handleReceiveMessage);

    // Cleanup listener on unmount
    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
    };
  }, [selectedUser, currentUser]);

  // Join room when user is selected
  useEffect(() => {
    if (!currentUser || !selectedUser) return;

    const roomId = [currentUser._id, selectedUser._id || selectedUser.id]
      .sort()
      .join("-");
    
    socket.emit("joinRoom", roomId);

    return () => {
      socket.emit("leaveRoom", roomId);
    };
  }, [selectedUser, currentUser]);

  // Detect mobile/desktop
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Fetch users list
  useEffect(() => {
    const handleGetUsers = async () => {
      try {
        const res = await AxiosInstance.get("/users/all");
        if (res.status === 200) {
          setPeoples(res.data.users);
        } else {
        }
      } catch (error) {
      }
    };
    handleGetUsers();
  }, []);

  const bots = [
    {
      id: 101,
      name: "EmoAI",
      avatar: "",
      description: "Your emotional support AI",
      category: "Mental Health",
    },
    {
      id: 102,
      name: "EndVerseAI",
      avatar: "",
      description: "Advanced conversational AI",
      category: "General",
    },
    {
      id: 103,
      name: "ChatGPT",
      avatar: "",
      description: "AI language model",
      category: "General",
    },
    {
      id: 104,
      name: "MediBot",
      avatar: "",
      description: "Healthcare assistant",
      category: "Health",
    },
  ];

  // Filter contacts
  const filteredPeople = peoples.filter((person) =>
    person.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBots = bots.filter(
    (bot) =>
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (message.trim() === "" || !selectedUser || !currentUser) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      senderId: currentUser._id,
      receiverId: selectedUser._id || selectedUser.id,
      time: new Date().toISOString(),
    };

    // Optimistically update UI
    const uiMessage = {
      id: newMessage.id,
      text: newMessage.text,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    setChatHistories((prev) => ({
      ...prev,
      [selectedUser._id]: [...(prev[selectedUser._id] || []), uiMessage],
    }));

    socket.emit("sendMessage", newMessage);

    setMessage("");

    // Auto-scroll to bottom
    setTimeout(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file || !selectedUser || !currentUser) return;

    if (file.size > 10 * 1024 * 1024) {
      toast.error("Please select an image smaller than 10MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const newMessage = {
        id: Date.now(),
        image: event.target.result,
        senderId: currentUser._id,
        receiverId: selectedUser._id || selectedUser.id,
        time: new Date().toISOString(),
      };

      // Optimistically update UI
      const uiMessage = {
        id: newMessage.id,
        image: newMessage.image,
        sender: "me",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChatHistories((prev) => ({
        ...prev,
        [selectedUser._id]: [...(prev[selectedUser._id] || []), uiMessage],
      }));

      // Send message via socket
      socket.emit("sendMessage", {
        ...newMessage,
        text: "Image shared",
      });

      // Auto-scroll to bottom
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    };
    reader.readAsDataURL(file);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser({ ...user, isBot: activeTab === "bots" });

    const userId = user._id || user.id;
    if (!chatHistories[userId]) {
      setChatHistories((prev) => ({
        ...prev,
        [userId]: [],
      }));
    }

    setShowSearch(false);
  };

  const handleLogout = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await AxiosInstance.post("/users/logout", null, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        localStorage.clear();
        socket.disconnect();
        toast.success(response.data.message, {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Bounce,
        });
        Navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Logout failed", {
        position: "top-right",
        autoClose: 5000,
        theme: "dark",
        transition: Bounce,
      });
    }
  };

  const currentMessages = selectedUser
    ? chatHistories[selectedUser._id || selectedUser.id] || []
    : [];

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentMessages]);

  return (
    <div className="flex h-screen bg-gray-950 text-gray-200 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          isMobile && selectedUser ? "hidden" : "flex"
        } flex-col w-full md:w-1/3 lg:w-1/4 bg-gray-900 border-r border-gray-800`}
      >
        {/* Header */}
        <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 backdrop-blur-sm">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-red-500">RaktFlow</h1>
          </div>
          <div className="flex space-x-3 text-gray-400">
            <button
              className="hover:text-red-500"
              onClick={() => setShowSearch(!showSearch)}
            >
              <FaSearch />
            </button>
            <button className="hover:text-red-500">
              <BsThreeDotsVertical />
            </button>
          </div>
        </div>

        {/* Search - Expanded view */}
        {showSearch && (
          <div className="p-3 border-b border-gray-800 bg-gray-800">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <FaSearch className="text-gray-500" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search contacts"
                className="w-full pl-10 pr-4 py-2 bg-gray-700 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500"
                autoFocus
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-300"
                >
                  <FaTimes />
                </button>
              )}
            </div>
          </div>
        )}

        {/* Tabs */}
        <div className="flex border-b border-gray-800">
          <button
            onClick={() => setActiveTab("people")}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "people"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            People
          </button>
          <button
            onClick={() => setActiveTab("bots")}
            className={`flex-1 py-3 text-center font-medium ${
              activeTab === "bots"
                ? "text-red-500 border-b-2 border-red-500"
                : "text-gray-400 hover:text-gray-200"
            }`}
          >
            AI Bots
          </button>
        </div>

        {/* Chat List */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === "people" ? (
            filteredPeople.length > 0 ? (
              filteredPeople.map((person) => (
                <motion.div
                  key={person._id}
                  whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.5)" }}
                  whileTap={{ backgroundColor: "rgba(55, 65, 81, 0.7)" }}
                  className={`flex items-center p-3 border-b border-gray-800 cursor-pointer ${
                    selectedUser?._id === person._id ? "bg-gray-800" : ""
                  }`}
                  onClick={() => handleUserSelect(person)}
                >
                  <div className="relative">
                    <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                      <span className="text-lg text-red-500">
                        {person.username.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="ml-3 flex-1 min-w-0">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium truncate">
                        {person.username}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      Start chatting with {person.username}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="p-4 text-center text-gray-500">
                No matching people found
              </div>
            )
          ) : filteredBots.length > 0 ? (
            filteredBots.map((bot) => (
              <motion.div
                key={bot.id}
                whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.5)" }}
                whileTap={{ backgroundColor: "rgba(55, 65, 81, 0.7)" }}
                className={`flex items-center p-3 border-b border-gray-800 cursor-pointer ${
                  selectedUser?.id === bot.id ? "bg-gray-800" : ""
                }`}
                onClick={() => handleUserSelect(bot)}
              >
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                  <BsRobot className="text-2xl text-red-500" />
                </div>
                <div className="ml-3 flex-1 min-w-0">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium truncate">{bot.name}</h3>
                    <span className="text-xs px-2 py-1 bg-gray-800 rounded-full text-gray-400 whitespace-nowrap">
                      {bot.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400 truncate">
                    {bot.description}
                  </p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No matching bots found
            </div>
          )}
        </div>

        {/* Logout Button */}
        <div className="p-3 border-t border-gray-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center space-x-2 py-2 px-4 bg-gray-800 hover:bg-gray-700 rounded-lg text-red-500 transition-colors"
          >
            <FaSignOutAlt />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`${
          isMobile && !selectedUser ? "hidden" : "flex"
        } flex-col flex-1 bg-gray-950 relative`}
      >
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-3 fixed w-full z-40 border-b border-gray-800 flex justify-between items-center bg-gray-900/80 backdrop-blur-xl">
              <div className="flex items-center">
                {isMobile && (
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="mr-2 text-gray-400 hover:text-red-500"
                  >
                    <FaChevronLeft className="text-xl" />
                  </button>
                )}
                {selectedUser.avatar ? (
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.username || selectedUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                    {selectedUser.isBot ? (
                      <BsRobot className="text-xl text-red-500" />
                    ) : (
                      <span className="text-lg text-red-500">
                        {selectedUser.username?.charAt(0).toUpperCase()}
                      </span>
                    )}
                  </div>
                )}
                <div className="ml-3">
                  <h3 className="font-medium">
                    {selectedUser.username || selectedUser.name}
                  </h3>
                  <p className="text-xs text-green-400">
                    {selectedUser.isBot ? "AI Assistant" : "Online"}
                  </p>
                </div>
              </div>
              <div className="flex space-x-4 text-gray-400">
                <button className="hover:text-red-500">
                  <FaSearch />
                </button>
                <button className="hover:text-red-500">
                  <BsThreeDotsVertical />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-[url(./assets/img/bg22.jpg)] bg-cover bg-no-repeat bg-center">
              <div className="min-h-full w-full px-2 sm:px-4 pt-16 pb-24 backdrop-blur-sm bg-gray-950/30">
                {currentMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-300 p-4">
                    <div className="backdrop-blur-xl bg-gray-900/80 p-6 rounded-xl border border-red-900/30 max-w-md">
                      <p className="text-lg">No messages yet</p>
                      <p className="text-sm mt-2 text-gray-400">
                        Start the conversation with{" "}
                        {selectedUser.username || selectedUser.name}
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2 p-2">
                    <AnimatePresence>
                      {currentMessages.map((msg) => (
                        <motion.div
                          key={msg.id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className={`flex ${
                            msg.sender === "me"
                              ? "justify-end"
                              : "justify-start"
                          }`}
                        >
                          <div
                            className={`max-w-[85%] sm:max-w-[75%] md:max-w-[65%] rounded-lg px-3 py-2 ${
                              msg.sender === "me"
                                ? "bg-red-600/90 border border-red-700/50 rounded-tr-none"
                                : "bg-gray-800/90 border border-gray-700/50 rounded-tl-none"
                            }`}
                          >
                            {msg.image ? (
                              <div className="mb-1">
                                <img
                                  src={msg.image}
                                  alt="Uploaded content"
                                  className="max-h-64 rounded-lg object-contain"
                                />
                              </div>
                            ) : (
                              <p className="text-gray-100 break-words">
                                {msg.text}
                              </p>
                            )}
                            <p
                              className={`text-[10px] mt-1 text-right ${
                                msg.sender === "me"
                                  ? "text-red-200/90"
                                  : "text-gray-400/90"
                              }`}
                            >
                              {msg.time}
                            </p>
                          </div>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <div ref={messagesEndRef} />
                  </div>
                )}
              </div>
            </div>

            {/* Message Input */}
            <div className="p-3 fixed bottom-0 md:left-1/3 lg:left-1/4 left-0 right-0 max-w-screen z-50 border-t border-gray-800 bg-gray-900/80 backdrop-blur-sm">
              <div className="flex justify-center">
                <div className="px-2 w-full">
                  <div className="flex items-center gap-2">
                    <div className="flex items-center">
                      <button
                        className="p-2 text-gray-400 hover:text-red-500"
                        onClick={() =>
                          document.getElementById("file-upload").click()
                        }
                      >
                        <FaPaperclip className="text-lg" />
                      </button>
                      <input
                        id="file-upload"
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <button className="p-2 text-gray-400 hover:text-red-500">
                        <FaSmile className="text-lg" />
                      </button>
                    </div>

                    <div className="flex-1 relative">
                      <textarea
                        ref={inputRef}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={handleKeyPress}
                        placeholder="Type a message"
                        className="w-full py-2 px-4 bg-gray-800 rounded-full text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500 resize-none max-h-32 transition-all duration-200"
                        rows="1"
                      />
                    </div>

                    <button
                      onClick={handleSendMessage}
                      disabled={!message}
                      className={`p-2 rounded-full ${
                        message
                          ? "text-red-500 hover:text-red-400"
                          : "text-gray-500"
                      }`}
                    >
                      {message ? (
                        <IoSend className="text-xl" />
                      ) : (
                        <FaMicrophone className="text-lg" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-red-500 mb-2">RaktFlow</h1>
              <p className="text-gray-200">Real-time chat application</p>
            </div>
            <div className="max-w-md w-full px-4">
              <img
                src="https://illustrations.popsy.co/red/video-call.svg"
                alt="Chat Illustration"
                className="w-full h-auto"
              />
            </div>
            <p className="mt-6 text-gray-500 max-w-md px-4">
              {activeTab === "people"
                ? "Select a person to start chatting"
                : "Select an AI bot to get assistance"}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default RaktFlowChat;