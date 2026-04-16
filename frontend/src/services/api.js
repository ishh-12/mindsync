import { BASE_URL } from "./config";

export const createRoom = async (name) => {
  const res = await fetch(`${BASE_URL}/room/create`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ name }),
  });
  return res.json();
};

export const joinRoomAPI = async (roomCode, name) => {
  const res = await fetch(`${BASE_URL}/room/join`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ roomCode, name }),
  });
  return res.json();
};

export const getRoomAPI = async (roomCode) => {
  const res = await fetch(`${BASE_URL}/room/${roomCode}`);
  return res.json();
};

export const getLeaderboardAPI = async () => {
  const res = await fetch(`${BASE_URL}/leaderboard`);
  return res.json();
};
