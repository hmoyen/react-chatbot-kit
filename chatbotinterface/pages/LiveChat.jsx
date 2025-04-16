import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ChatWindow from "../components/ChatWindow";
import MessageInput from "../components/MessageInput";
import socket from "../utils/socket";
import "../styles/LiveChat.css"; // Styles for the chat interface

const LiveChat = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { role, customerId, name, queue = [] } = location.state || {};
  const [messages, setMessages] = useState({});
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [connectedTechnician, setConnectedTechnician] = useState(null);
  const [typingIndicator, setTypingIndicator] = useState(false);
  const [readReceipts, setReadReceipts] = useState({}); // Track read receipts

  useEffect(() => {
    const handleReceiveMessage = (message) => {
      const senderId = message.from;
      setMessages((prev) => ({
        ...prev,
        [senderId]: [...(prev[senderId] || []), message],
      }));
      socket.emit("readReceipt", { from: senderId }); // Send read receipt
    };

    const handleTyping = (id) => {
      if ((role === "technician" && selectedCustomer?.id === id) || (role === "customer" && connectedTechnician?.technicianId === id)) {
        setTypingIndicator(true);
        setTimeout(() => setTypingIndicator(false), 2000);
      }
    };

    if (role === "technician") {
      socket.emit("registerUser", { role: "technician", name: "Technician" });
      socket.on("receiveMessage", handleReceiveMessage);
      socket.on("customerTyping", handleTyping);
    } else if (role === "customer") {
      socket.emit("registerUser", { role: "customer", name });
      socket.on("technicianConnected", (technician) => setConnectedTechnician(technician));
      socket.on("receiveMessage", handleReceiveMessage);
      socket.on("technicianTyping", handleTyping);
    }

    socket.on("readReceipt", ({ from }) => {
      setReadReceipts((prev) => ({ ...prev, [from]: true })); // Mark messages as read
    });

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("customerTyping", handleTyping);
      socket.off("technicianTyping", handleTyping);
      socket.off("readReceipt");
      if (role === "customer") {
        socket.off("technicianConnected");
      }
    };
  }, [role, name, selectedCustomer, connectedTechnician]);

  const handleSendMessage = (message) => {
    const recipientId = role === "technician" ? selectedCustomer?.id : connectedTechnician?.technicianId;
    if (!recipientId) {
      console.warn("No recipient ID found. Message not sent.");
      return;
    }

    const newMessage = {
      to: recipientId,
      message: typeof message === "string" ? message : JSON.stringify(message),
      timestamp: Date.now(),
      from: socket.id,
    };

    setMessages((prev) => ({
      ...prev,
      [recipientId]: [...(prev[recipientId] || []), newMessage],
    }));

    if (socket.connected) {
      socket.emit("sendMessage", newMessage);
    } else {
      console.error("Socket is not connected. Message not sent.");
    }
  };

  const handleTyping = () => {
    if (role === "technician" && selectedCustomer) {
      socket.emit("technicianTyping", selectedCustomer.id);
    } else if (role === "customer" && connectedTechnician) {
      socket.emit("customerTyping", connectedTechnician.technicianId);
    }
  };

  const handleEndChat = () => {
    const confirmEnd = window.confirm("Are you sure you want to end this chat?");
    if (confirmEnd) {
      const recipientId = role === "technician" ? selectedCustomer?.id : connectedTechnician?.technicianId;
      if (recipientId) {
        socket.emit("endChat", { customerId: recipientId });
        setMessages({});
        setSelectedCustomer(null);
        setConnectedTechnician(null);
        alert("Chat ended.");
        navigate(role === "technician" ? "/technician" : "/customer_home"); // Navigate to dashboard
      }
    }
  };

  useEffect(() => {
    socket.on("chatEnded", () => {
      alert("The other side has ended the chat.");
      setMessages({});
      setSelectedCustomer(null);
      setConnectedTechnician(null);
      navigate(role === "technician" ? "/technician" : "/customer_home"); // Navigate to dashboard
    });

    return () => {
      socket.off("chatEnded");
    };
  }, [role, navigate]);

  return (
    <div className="live-chat-page">  
      <div className="chat-container">
        <div className="chat-sidebar">

          <h3>{role === "technician" ? "Customer Queue" : "Technician Details"}</h3> 
          
          {role === "technician" ? (
            queue.map((customer) => (
              <div
                key={customer.id}
                className={`queue-item ${selectedCustomer?.id === customer.id ? "selected" : ""}`}
                onClick={() => setSelectedCustomer(customer)}
              >
                <span>{customer.name}</span>
              </div>
            
            ))
          ) : (
            connectedTechnician ? (
              <div className="technician-details">
                <p><strong>Name:</strong> {connectedTechnician.name}</p>
                <p><strong>ID:</strong> {connectedTechnician.technicianId}</p>
                <p><strong>Status:</strong> Online</p>
              </div>
            ) : (
              <p>No technician connected.</p>
            )
          )}
        </div>
        <div className="chat-main">
          
          <div className="chat-window">
            <ChatWindow
              messages={messages[selectedCustomer?.id || connectedTechnician?.technicianId] || []}
              socket={socket}
              readReceipts={readReceipts}
              role={role}
            />
          </div>
          <div className="chat-actions">
            <button className="end-chat-button" onClick={handleEndChat}>End Chat</button> {/* Moved here */}
          </div>
          <MessageInput onSendMessage={handleSendMessage} onTyping={handleTyping} />
          {typingIndicator && (
            <div className="typing-indicator">
              {role === "technician" ? "Customer is typing..." : "Technician is typing..."}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LiveChat;
