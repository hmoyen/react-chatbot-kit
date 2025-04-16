require("dotenv").config(); // Load environment variables from .env file
const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: process.env.CODESPACE_NAME
      ? `https://\${process.env.CODESPACE_NAME}-3000.app.github.dev`
      : "http://localhost:3000",
    methods: ["GET", "POST"],
  },
});

const technicians = new Map(); // Track connected technicians
let liveChatQueue = [];
const videoCallQueue = [];

// Generate unique video call link
const generateVideoCallLink = () => `https://meet.google.com/${Math.random().toString(36).substring(2, 15)}`;

io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // Handle technician connection
  socket.on("technicianConnected", (technicianId) => {
    technicians.set(socket.id, { id: technicianId, status: "Available" });
    io.emit("updateTechnicianStatus", Array.from(technicians.values()));
  });

  // Handle customer joining live chat queue
  socket.on("joinLiveChatQueue", (customerDetails) => {
    liveChatQueue.push({ id: socket.id, ...customerDetails, connected: true });
    io.emit("updateLiveChatQueue", liveChatQueue.filter((customer) => customer.connected)); // Send only connected customers
  });

  // Handle customer joining video call queue
  socket.on("joinVideoCallQueue", (customerDetails) => {
    const videoCallLink = generateVideoCallLink();
    videoCallQueue.push({ socketId: socket.id, ...customerDetails, videoCallLink });
    io.emit("updateVideoCallQueue", videoCallQueue);
    io.emit("newCustomer", customerDetails);
  });

  // Handle technician joining
  socket.on("technicianJoin", (technician) => {
    technicians.set(socket.id, { id: socket.id, ...technician });
    io.emit("updateTechnicianStatus", Array.from(technicians.values())); // Notify all customers
  });

  // Handle technician selecting a customer from the queue
  socket.on("selectCustomer", (customerId) => {
    const customer = liveChatQueue.find((c) => c.id === customerId);
    if (customer) {
      io.to(customerId).emit("technicianConnected", { technicianId: socket.id });
      io.to(socket.id).emit("customerConnected", customer);
    }
  });

  // Handle real-time messaging
  socket.on("message", ({ to, message }) => {
    console.log(message);
    io.to(to).emit("message", { from: socket.id, message });
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected:", socket.id);
    liveChatQueue = liveChatQueue.filter((customer) => customer.id !== socket.id);
    io.emit("updateLiveChatQueue", liveChatQueue.filter((customer) => customer.connected)); // Send only connected customers
    technicians.delete(socket.id);
    io.emit("updateTechnicianStatus", Array.from(technicians.values()));
  });
});

const PORT = process.env.PORT || 6000; // Use PORT from .env or default to 6000

server.listen(PORT, () => {
  const host = process.env.CODESPACE_NAME
    ? `https://${process.env.CODESPACE_NAME}-${PORT}.app.github.dev`
    : `http://localhost:${PORT}`;
  console.log(`Server is running on ${host}`);
});