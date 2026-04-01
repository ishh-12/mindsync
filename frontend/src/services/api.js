const BASE_URL = "http://localhost:5000/api";

export const createRoom = async () => {
  const res = await fetch(`${BASE_URL}/room/create`);
  return res.json();
};