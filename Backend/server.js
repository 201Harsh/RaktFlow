const dotenv = require("dotenv");
dotenv.config();

const app = require("./app");
const http = require("http");
const { Server } = require("socket.io");

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL, // your frontend URL
    methods: ["GET", "POST"],
  },
});

io.on("connection", (socket) => {
  console.log("a user connected");
});

const port = process.env.PORT || 6000;
const host = process.env.HOST || "localhost";
server.listen(port, host, () =>
  console.log(`Server running on port ${host}:${port}`)
);
