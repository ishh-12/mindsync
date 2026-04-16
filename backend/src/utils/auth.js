const getPlayer = (room, socket) => {
  return room.players.find((player) => player.socketId === socket.id);
};

const requirePlayer = (player, socket) => {
  if (!player) {
    socket.emit("error", "Unauthorized");
    return false;
  }

  return true;
};

const requireRole = (player, role, socket) => {
  if (!requirePlayer(player, socket)) {
    return false;
  }

  if (player.role !== role) {
    socket.emit("error", `Only ${role} can perform this action`);
    return false;
  }

  return true;
};

const requireHost = (player, socket) => {
  if (!requirePlayer(player, socket)) {
    return false;
  }

  if (!player.isHost) {
    socket.emit("error", "Only the host can perform this action");
    return false;
  }

  return true;
};

module.exports = {
  getPlayer,
  requirePlayer,
  requireRole,
  requireHost,
};
