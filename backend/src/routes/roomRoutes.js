const express = require("express");
const { createRoom, joinRoom, getRoom } = require("../controllers/roomController");

const router = express.Router();

router.post("/create", createRoom);
router.post("/join", joinRoom);
router.get("/:roomCode", getRoom);

module.exports = router;
