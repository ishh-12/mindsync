const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { Server } = require("socket.io");
const handleSocket = require("./sockets/handler");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("🟢 MongoDB connected");

    const server = http.createServer(app);
    const io = new Server(server, { cors: { origin: "*" } });

    io.on("connection", (socket) => {
      console.log("⚡ User connected:", socket.id);
      handleSocket(io, socket);
    });

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server failed:", error.message);
  }
};

startServer();
