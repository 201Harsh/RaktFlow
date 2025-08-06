import { io } from "socket.io-client";

const socket = io(import.meta.env.VITE_BACKEND_URL, {
  transports: ["websocket"], // Optional: ensure WebSocket is used
});

socket.on("connect", () => {
  console.log("✅ Connected to socket server:", socket.id);
});

export default socket;
