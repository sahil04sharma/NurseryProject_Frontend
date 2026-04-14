import { io } from "socket.io-client";

const SOCKET_URL =  "http://localhost:4000/api";// "https://plantsproject-5dkq.onrender.com";

export const socket = io(SOCKET_URL, {
  transports: ["websocket"], // force websocket for stability
  reconnection: true,
  reconnectionAttempts: Infinity,
  reconnectionDelay: 1000,
});
