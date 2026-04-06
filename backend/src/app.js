const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../.env") });

const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");

const roomRoutes = require("./routes/roomRoutes");
const leaderboardRoutes = require("./routes/leaderboardRoutes");

const app = express();

app.use(helmet());

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});
app.use(limiter);

app.use(cors({ origin: "*" }));
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  console.log("Body:", req.body);
  next();
});

app.use("/api/room", roomRoutes);
app.use("/api/leaderboard", leaderboardRoutes);

app.get("/api/health", (_req, res) => {
  res.json({ success: true, message: "Backend running" });
});

app.get("/", (_req, res) => {
  res.send("API running");
});

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error("ERROR:", err.message);
  res.status(500).json({
    success: false,
    message: "Server error",
  });
});

module.exports = app;
