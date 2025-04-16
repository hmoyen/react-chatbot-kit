//socket.js
import { io } from "socket.io-client";

// Dynamically determine the WebSocket server URL
const getWebSocketURL = () => {
  const backendUrl = (typeof process !== "undefined" && process?.env?.REACT_APP_BACKEND_URL) || "http://localhost:6000";
  if (backendUrl) {
    return backendUrl.replace(/^http/, "ws");
  }
  if (window.location.hostname.includes("github.dev")) {
    // Ensure the WebSocket URL uses port 5000
    return `wss://${window.location.hostname.replace("-8080", "-6000")}`;
  }
  return "ws://localhost:6000"; // Default for local development
};

const serverUrl = getWebSocketURL();
console.log(`[SOCKET LOG]: Attempting to connect to WebSocket server at ${serverUrl}`);

const token = localStorage.getItem("token"); // or sessionStorage.getItem("token")

const socket = io(serverUrl, {
  transports: ["websocket"],
  reconnection: true,
  reconnectionAttempts: 10,
  timeout: 20000,
  auth: {
    token: token, // Send token during connection
  },
});

socket.on("connect", () => {
  console.log(`[SOCKET LOG]: Connected to server with ID: ${socket.id}`);
});

socket.on("disconnect", (reason) => {
  console.warn(`[SOCKET LOG]: Disconnected from server. Reason: ${reason}`);
  if (reason === "io server disconnect") {
    socket.connect(); // Attempt to reconnect if the server disconnects
  }
});

socket.on("connect_error", (error) => {
  console.error(`[SOCKET ERROR]: Connection error`, error);
  console.error(`[SOCKET ERROR DETAILS]:`, error.message);
});

socket.on("reconnect_attempt", (attempt) => {
  console.log(`[SOCKET LOG]: Reconnection attempt #${attempt}`);
});

socket.on("reconnect_failed", () => {
  console.error(`[SOCKET ERROR]: Reconnection failed after maximum attempts`);
});

socket.onAny((event, ...args) => {
  console.log(`[SOCKET EVENT]: ${event}`, args);
});

// Add specific logging for chat-related events
socket.on("chat_message", (message) => {
  console.log(`[CHAT EVENT]: Received chat message`, message);
});

socket.on("chat_error", (error) => {
  console.error(`[CHAT ERROR]:`, error);
});

socket.on("message", (data) => {
  console.log("Received message:", data);

});

// Wrap emit to log outgoing messages
const originalEmit = socket.emit;
socket.emit = function (event, ...args) {
  console.log(`[SOCKET EMIT]: Event: ${event}`, args);
  originalEmit.apply(socket, [event, ...args]);
};

export default socket;