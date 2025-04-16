// File: src/components/ChatList.jsx
import React from "react";
import "../styles/ChatList.css"; // Import styles

const ChatList = ({ chats, onSelectChat }) => {
  return (
    <div className="chat-list">
      {chats.map((chat) => (
        <div key={chat.id} onClick={() => onSelectChat(chat.id)}>
          {chat.name}
        </div>
      ))}
    </div>
  );
};

export default ChatList;
