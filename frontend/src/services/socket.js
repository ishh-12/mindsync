import { io } from "socket.io-client";
import { SOCKET_ORIGIN } from "./config";

const socket = io(SOCKET_ORIGIN, {
  autoConnect: true,
  transports: ["websocket", "polling"],
});

export default socket;
