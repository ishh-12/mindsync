require("dotenv").config();

const http = require("http");
const app = require("./app");
const connectDB = require("./config/db");
const { Server } = require("socket.io");

const handleRoomSockets = require("./sockets/roomHandler");
const handleGameSockets = require("./sockets/gameHandler");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("🟢 MongoDB connected");

    const server = http.createServer(app);

    const io = new Server(server, {
      cors: {
        origin: "*",
      },
    });

    // 🔥 SOCKET CONNECTION
    io.on("connection", (socket) => {
      console.log("⚡ User connected:", socket.id);

      handleRoomSockets(io, socket);
      handleGameSockets(io, socket);

      socket.on("disconnect", () => {
        console.log("❌ User disconnected:", socket.id);
      });
    });

    server.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });

  } catch (error) {
    console.error("❌ Server failed:", error.message);
  }
};

startServer();