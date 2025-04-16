import React from 'react';
import '../styles/ChatbotToggle.css';

const ChatbotToggle = ({ onClick, isOpen }) => {
  return (
    <button 
      className={`chatbot-toggle ${isOpen ? 'open' : ''}`} 
      onClick={onClick} 
      aria-label="Toggle Chatbot"
    >
      <img 
        src="/icons/R2D2.png" 
        alt="Chatbot" 
        className="toggle-icon"
      />
    </button>
  );
};

export default ChatbotToggle;
