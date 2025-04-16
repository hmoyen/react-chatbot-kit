import React from "react";
import { Helmet } from "react-helmet"; // Updated import
import '../styles/ChatPage.css';
import TypedReact from "../components/TypedReact";
import SimpleChatbot from "../components/SimpleChatbot";

export default function ChatPage() {
  const handleChatbotEnd = () => {
    console.log("Chat ended");
  };

  return (
    <div className="ChatPage">
      <Helmet>
        <title>Volvo CE Chatbot</title>
        <meta name="description" content="Repair AI assistance" />
      </Helmet>

      <h1>Volvo CE Chatbot</h1>
      <h2>Start chatting with the Volvo CE Chatbot!</h2>

      <TypedReact />

      {/* The SimpleChatbot component is floating on the bottom right */}
      <SimpleChatbot handleEnd={handleChatbotEnd} />
    </div>
  );
}