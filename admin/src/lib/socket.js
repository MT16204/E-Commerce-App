import { io } from "socket.io-client";

// const SOCKET_URL = "https://e-commerce-app-production-9263.up.railway.app"; 
const SOCKET_URL = "http://localhost:3000";

export const socket = io(SOCKET_URL, {
  autoConnect: false,
});