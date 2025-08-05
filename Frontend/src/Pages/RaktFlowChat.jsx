import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaSearch,
  FaEllipsisV,
  FaPaperclip,
  FaMicrophone,
  FaSmile,
  FaChevronDown,
} from "react-icons/fa";
import { IoMdSend } from "react-icons/io";
import { BsRobot } from "react-icons/bs";

const RaktFlowChat = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [activeTab, setActiveTab] = useState("people");
  const [message, setMessage] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [searchQuery, setSearchQuery] = useState("");
  const [chatHistories, setChatHistories] = useState({});
  const messagesEndRef = React.useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Sample data
  const people = [
    {
      id: 1,
      name: "John Doe",
      avatar: "https://randomuser.me/api/portraits/men/1.jpg",
      lastMessage: "Hey, how are you?",
      time: "10:30 AM",
      unread: 2,
    },
    {
      id: 2,
      name: "Jane Smith",
      avatar: "https://randomuser.me/api/portraits/women/2.jpg",
      lastMessage: "Meeting at 3 PM",
      time: "Yesterday",
      unread: 0,
    },
    {
      id: 3,
      name: "Mike Johnson",
      avatar: "https://randomuser.me/api/portraits/men/3.jpg",
      lastMessage: "Please review the docs",
      time: "Yesterday",
      unread: 5,
    },
    {
      id: 4,
      name: "Sarah Williams",
      avatar: "https://randomuser.me/api/portraits/women/4.jpg",
      lastMessage: "Thanks for the help!",
      time: "Monday",
      unread: 0,
    },
  ];

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

  // Filter contacts based on search query
  const filteredPeople = people.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredBots = bots.filter(
    (bot) =>
      bot.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      bot.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSendMessage = () => {
    if (message.trim() === "" || !selectedUser) return;

    const newMessage = {
      id: Date.now(),
      text: message,
      sender: "me",
      time: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
    };

    // Update chat history for the selected user
    setChatHistories((prev) => ({
      ...prev,
      [selectedUser.id]: [...(prev[selectedUser.id] || []), newMessage],
    }));

    setMessage("");

    // Simulate reply after 1 second
    setTimeout(() => {
      const reply = {
        id: Date.now() + 1,
        text: selectedUser.isBot
          ? `This is an automated reply from ${selectedUser.name}. How can I assist you further?`
          : `This is a simulated reply from ${selectedUser.name}`,
        sender: "them",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };

      setChatHistories((prev) => ({
        ...prev,
        [selectedUser.id]: [...(prev[selectedUser.id] || []), reply],
      }));
    }, 1000);
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
    // Initialize empty chat if doesn't exist
    if (!chatHistories[user.id]) {
      setChatHistories((prev) => ({
        ...prev,
        [user.id]: [],
      }));
    }
  };

  const currentMessages = selectedUser
    ? chatHistories[selectedUser.id] || []
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
        <div className="p-4 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 backdrop-blur-sm">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-red-500">RaktFlow</h1>
          </div>
          <div className="flex space-x-3 text-gray-400">
            <button className="hover:text-red-500">
              <FaEllipsisV />
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="p-3 border-b border-gray-800">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <FaSearch className="text-gray-500" />
            </div>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search or start new chat"
              className="w-full pl-10 pr-4 py-2 bg-gray-800 rounded-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-red-500"
            />
          </div>
        </div>

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
                  key={person.id}
                  whileHover={{ backgroundColor: "rgba(55, 65, 81, 0.5)" }}
                  className={`flex items-center p-3 border-b border-gray-800 cursor-pointer ${
                    selectedUser?.id === person.id ? "bg-gray-800" : ""
                  }`}
                  onClick={() => handleUserSelect(person)}
                >
                  <div className="relative">
                    <img
                      src={person.avatar}
                      alt={person.name}
                      className="w-12 h-12 rounded-full object-cover"
                    />
                    {person.unread > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {person.unread}
                      </div>
                    )}
                  </div>
                  <div className="ml-3 flex-1">
                    <div className="flex justify-between items-center">
                      <h3 className="font-medium">{person.name}</h3>
                      <span className="text-xs text-gray-500">
                        {person.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 truncate">
                      {person.lastMessage}
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
                className={`flex items-center p-3 border-b border-gray-800 cursor-pointer ${
                  selectedUser?.id === bot.id ? "bg-gray-800" : ""
                }`}
                onClick={() => handleUserSelect({ ...bot, isBot: true })}
              >
                <div className="w-12 h-12 rounded-full bg-gray-700 flex items-center justify-center">
                  <BsRobot className="text-2xl text-red-500" />
                </div>
                <div className="ml-3 flex-1">
                  <div className="flex justify-between items-center">
                    <h3 className="font-medium">{bot.name}</h3>
                    <span className="text-xs px-2 py-1 bg-gray-800 rounded-full text-gray-400">
                      {bot.category}
                    </span>
                  </div>
                  <p className="text-sm text-gray-400">{bot.description}</p>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="p-4 text-center text-gray-500">
              No matching bots found
            </div>
          )}
        </div>
      </div>

      {/* Chat Area */}
      <div
        className={`${
          isMobile && !selectedUser ? "hidden" : "flex"
        } flex-col flex-1 bg-gray-950`}
      >
        {selectedUser ? (
          <>
            {/* Chat Header */}
            <div className="p-3 border-b border-gray-800 flex justify-between items-center bg-gray-900/50 backdrop-blur-sm">
              <div className="flex items-center">
                {isMobile && (
                  <button
                    onClick={() => setSelectedUser(null)}
                    className="mr-2 text-gray-400 hover:text-red-500"
                  >
                    <FaChevronDown className="transform rotate-90" />
                  </button>
                )}
                {selectedUser.avatar ? (
                  <img
                    src={selectedUser.avatar}
                    alt={selectedUser.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center">
                    <BsRobot className="text-xl text-red-500" />
                  </div>
                )}
                <div className="ml-3">
                  <h3 className="font-medium">{selectedUser.name}</h3>
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
                  <FaEllipsisV />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto bg-[url(./assets/img/bg23.jpg)] bg-cover bg-no-repeat bg-center">
              <div className="min-h-full w-full backdrop-blur-sm bg-gray-950/30 p-4 rounded-lg">
                {currentMessages.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center text-gray-300">
                    <div className="backdrop-blur-xl bg-gray-900/80 p-6 rounded-xl border border-red-900/30">
                      <p className="text-lg">No messages yet</p>
                      <p className="text-sm mt-2 text-gray-400">
                        Start the conversation with{" "}
                        {selectedUser?.name || "your contact"}
                      </p>
                    </div>
                  </div>
                ) : (
                  currentMessages.map((msg) => (
                    <motion.div
                      key={msg.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className={`flex mb-4 ${
                        msg.sender === "me" ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-xs md:max-w-md lg:max-w-lg rounded-lg px-4 py-2 backdrop-blur-xl ${
                          msg.sender === "me"
                            ? "bg-red-600/90 border border-red-700/50 rounded-tr-none"
                            : "bg-gray-900/90 border border-gray-700/50 rounded-tl-none"
                        }`}
                      >
                        <p className="text-gray-100">{msg.text}</p>
                        <p
                          className={`text-xs mt-1 text-right ${
                            msg.sender === "me"
                              ? "text-red-200/90"
                              : "text-gray-400/90"
                          }`}
                        >
                          {msg.time}
                        </p>
                      </div>
                    </motion.div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>
            </div>

            {/* Message Input */}
            <div className="p-3 border-t border-gray-800 bg-gray-900/50 backdrop-blur-sm">
              <div className="flex items-center">
                <button className="p-2 text-gray-400 hover:text-red-500">
                  <FaPaperclip />
                </button>
                <button className="p-2 text-gray-400 hover:text-red-500">
                  <FaSmile />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Type a message"
                  className="flex-1 mx-2 py-2 px-4 bg-gray-800 rounded-full text-gray-200 focus:outline-none focus:ring-1 focus:ring-red-500"
                />
                {message ? (
                  <button
                    onClick={handleSendMessage}
                    className="p-2 text-red-500 hover:text-red-400"
                  >
                    <IoMdSend className="text-xl" />
                  </button>
                ) : (
                  <button className="p-2 text-gray-400 hover:text-red-500">
                    <FaMicrophone />
                  </button>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="h-full flex flex-col items-center justify-center p-6 text-center">
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-red-500 mb-2">RaktFlow</h1>
              <p className="text-gray-200">Real-time chat application</p>
            </div>
            <div className="max-w-md">
              <img
                src="https://illustrations.popsy.co/red/video-call.svg"
                alt="Chat Illustration"
                className="w-full h-auto"
              />
            </div>
            <p className="mt-6 text-gray-500 max-w-md">
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
