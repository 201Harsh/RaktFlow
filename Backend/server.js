const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  maxHttpBufferSize: 1e7, // 10MB
  cors: {
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST"],
    credentials: true
  },
});

// Store active rooms and their participants
const activeRooms = {};
// Store online users
const onlineUsers = new Set();

io.on("connection", (socket) => {
  // Handle user going online
  socket.on("userOnline", (userId) => {
    if (userId) {
      onlineUsers.add(userId);
      // Notify all clients about this user's online status
      io.emit("userStatusChanged", { userId, isOnline: true });
      // Send the current online users list to the newly connected user
      socket.emit("onlineUsersList", Array.from(onlineUsers));
    }
  });

  // Handle user going offline
  socket.on("userOffline", (userId) => {
    if (userId) {
      onlineUsers.delete(userId);
      // Notify all clients about this user's offline status
      io.emit("userStatusChanged", { userId, isOnline: false });
    }
  });

  // Handle joining a room (private chat between two users)
  socket.on("joinRoom", (roomId) => {
    socket.join(roomId);
    
    // Track room participants
    if (!activeRooms[roomId]) {
      activeRooms[roomId] = new Set();
    }
    activeRooms[roomId].add(socket.id);
  });

  // Handle leaving a room
  socket.on("leaveRoom", (roomId) => {
    socket.leave(roomId);
    
    if (activeRooms[roomId]) {
      activeRooms[roomId].delete(socket.id);
      if (activeRooms[roomId].size === 0) {
        delete activeRooms[roomId];
      }
    }
  });

  // Handle sending a message
  socket.on("sendMessage", (messageData) => {
    try {
      const { senderId, receiverId, text, image } = messageData;
      
      if (!senderId || !receiverId) {
        return;
      }

      // Create a room ID by combining and sorting the user IDs
      const roomId = [senderId, receiverId].sort().join("-");
      
      // Create the message object
      const message = {
        id: messageData.id || Date.now(),
        senderId,
        receiverId,
        text: text || (image ? "Image shared" : ""),
        image: image || null,
        time: new Date().toISOString(),
      };

      // Send to all in the room (both sender and receiver)
      io.to(roomId).emit("receiveMessage", message);
    } catch (error) {
      console.error("Error handling message:", error);
    }
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    // Clean up room participation
    for (const roomId in activeRooms) {
      if (activeRooms[roomId].has(socket.id)) {
        activeRooms[roomId].delete(socket.id);
        if (activeRooms[roomId].size === 0) {
          delete activeRooms[roomId];
        }
      }
    }
  });
});

const port = process.env.PORT || 6000;
const host = process.env.HOST || "localhost";
server.listen(port, host, () =>
  console.log(`Server running on port ${host}:${port}`)
);