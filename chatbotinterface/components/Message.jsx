//Message.jsx
import React from "react";
import "../styles/Message.css"; // Import the new stylesheet

const Message = ({ sender, text, timestamp, attachment, isSender }) => {
  return (
    <div className={`message ${isSender ? "sent" : "received"}`}>
      <div className="message-header">
        <span>{sender}</span>
      </div>
      <div className="message-body">
        {text}
        {attachment && (
          <div className="attachment">
            {attachment.type.startsWith("image/") ? (
              <img src={URL.createObjectURL(attachment)} alt="Attachment" />
            ) : (
              <a href={URL.createObjectURL(attachment)} download>
                {attachment.name}
              </a>
            )}
          </div>
        )}
      </div>
      <div className="message-timestamp">
        {new Date(timestamp).toLocaleTimeString()}
      </div>
    </div>
  );
};

export default Message;
