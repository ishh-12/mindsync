const express = require("express");
const { createRoom, joinRoom, getRoom,startGame } = require("../controllers/roomController");

const router = express.Router();

router.post("/create", createRoom);
router.post("/join", joinRoom);
router.get("/:roomCode", getRoom);
router.post("/start", startGame);

module.exports = router;
