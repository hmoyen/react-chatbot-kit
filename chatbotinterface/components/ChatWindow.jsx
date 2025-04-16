// ChatWindow.jsx
import React from "react";
import "../styles/ChatWindow.css"; // Import styles

const ChatWindow = ({ messages, socket, readReceipts, typingIndicator }) => {
  return (
    <div className="chat-window">
      {messages.map((msg, index) => {
        let messageContent = msg.message;

        // Parse the message if it is a JSON string
        try {
          const parsedMessage = JSON.parse(msg.message);
          if (parsedMessage && typeof parsedMessage.message === "string") {
            messageContent = parsedMessage.message;
          }
        } catch (error) {
          console.warn("Failed to parse message:", msg.message);
        }

        const isSent = msg.from === socket.id;
        const readReceipt = isSent && readReceipts[msg.to] ? "✓✓" : "✓";

        // Parse and format the timestamp
        const timestamp = msg.timestamp
          ? new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
          : "N/A";

        return (
          <div
            key={index}
            className={`chat-bubble ${isSent ? "sent" : "received"}`}
          >
            <div className="message-body">{messageContent}</div>
            <div className="message-footer">
              {isSent && <span className="read-receipt">{readReceipt}</span>}
              <span className="message-timestamp">{timestamp}</span>
            </div>
          </div>
        );
      })}
      {typingIndicator && <div className="typing-indicator">Typing...</div>}
    </div>
  );
};

export default ChatWindow;
