import React, { useState } from "react";
import { Chatbot } from "react-chatbot-kit";
import config from "./config";
import MessageParser from "./components/MessageParser";
import ActionProvider from "./components/ActionProvider";
import ChatbotToggle from "./components/ChatbotToggle";
import LiveChatWrapper from "./components/LiveChatWrapper";
import "react-chatbot-kit/build/main.css";
import "./styles/fonts.css";
import "./styles/App.css";

// Placeholder for when we don't have react-router-dom
const RouterPlaceholder = ({ children }) => <div>{children}</div>;

function App() {
  const [showBot, setShowBot] = useState(false);
  const [showLiveChat, setShowLiveChat] = useState(false);

  const toggleBot = () => {
    setShowBot((prev) => !prev); // Correctly toggle the state
    if (showLiveChat) setShowLiveChat(false);
  };

  const switchToLiveChat = () => {
    setShowBot(false);
    setShowLiveChat(true);
  };

  return (
    <div className="app-container">
      <div className="welcome-message">
        <h1>Welcome to Volvo Support</h1>
        <p>Click the chat button to get assistance</p>
      </div>
      
      {showBot && !showLiveChat && (
        <div className="chatbot-container volvo-font">
          <Chatbot
            config={config}
            messageParser={MessageParser}
            actionProvider={{
              ...ActionProvider,
              switchToLiveChat
            }}
          />
        </div>
      )}
      
      {showLiveChat && (
        <div className="livechat-container">
          <LiveChatWrapper />
        </div>
      )}
      
      <ChatbotToggle onClick={toggleBot} isOpen={showBot || showLiveChat} />
    </div>
  );
}

export default App;
