const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const http = require("http");
const { Server } = require("socket.io");

const app = require("./app");
const connectDB = require("./config/db");
const { corsOptions, allowedOrigins } = require("./config/cors");
const handleSocket = require("./sockets/handler");

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    await connectDB();
    console.log("MongoDB connected");

    const server = http.createServer(app);
    const io = new Server(server, { cors: corsOptions });

    io.on("connection", (socket) => {
      console.log("User connected:", socket.id);
      handleSocket(io, socket);
    });

    server.on("error", (err) => {
      if (err.code === "EADDRINUSE") {
        console.error(`Port ${PORT} is already in use. Please stop the process using it or set a different PORT.`);
      } else {
        console.error("Server error:", err);
      }
      process.exit(1);
    });

    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      if (allowedOrigins.length > 0) {
        console.log(`CORS allowlist active for: ${allowedOrigins.join(", ")}`);
      }
    });
  } catch (error) {
    console.error("Server failed:", error.message);
  }
};

startServer();
