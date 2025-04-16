//ChatInterface.jsx is a component that displays a chat interface with a message area, input area, and buttons for sending messages, viewing suggestions, starting a video call, and connecting to a technician. The component uses the useState hook to manage the messages, user input, and error state. It also includes the Suggestions, VideoCallButton, and TechnicianConnect components.
import React, { useState, useEffect } from "react";
import Suggestions from "./Suggestions";
import VideoCallButton from "./VideoCallButton";
import "../styles/ChatInterface.css";

export default function ChatInterface() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [file, setFile] = useState(null); // State for file attachments
  const [error, setError] = useState("");
  const [suggestions, setSuggestions] = useState([]);

  useEffect(() => {
    // Simulate fetching suggestions based on user input
    if (input.length > 2) {
      setSuggestions([
        `Try restarting your ${input}`,
        `Check the ${input} manual`,
        `Contact support about ${input}`,
      ]);
    } else {
      setSuggestions([]);
    }
  }, [input]);

  const handleSendMessage = () => {
    if (input.trim() === "" && !file) {
      setError("Please enter a message or attach a file.");
      return;
    }

    // Add the message to the chat
    setMessages([...messages, { text: input, file, sender: "user" }]);
    setInput("");
    setFile(null); // Clear the file input
    setError("");

    // Simulate a response from the assistant
    setTimeout(() => {
      const response = "I'm sorry, I couldn't fix that. Would you like to connect with a technician?";
      setMessages((prevMessages) => [...prevMessages, { text: response, sender: "assistant" }]);
    }, 1000);
    navigate("/chatpage");
  };

  const onSelectSuggestion = (suggestion) => {
    setInput(suggestion);
    setSuggestions([]);
  };

  return (
    <div className="chat-interface">
      <div className="messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            {msg.text}
            {msg.file && (
              <div className="attachment">
                <img src={URL.createObjectURL(msg.file)} alt="Attachment" />
              </div>
            )}
          </div>
        ))}
      </div>
      <div className="input-area">
        <div className="input-wrapper">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type your message..."
          />
          <label className="attachment-icon">
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setFile(e.target.files[0])}
              style={{ display: "none" }}
            />
            📎
          </label>
        </div>
        <button className="send-button" onClick={handleSendMessage}>
          Send
        </button>
        {error && <div className="error">{error}</div>}
      </div>
      <Suggestions suggestions={suggestions} onSelectSuggestion={onSelectSuggestion} />
      <VideoCallButton />
    </div>
  );
}