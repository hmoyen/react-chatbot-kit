import React from "react";
import "../styles/Notification.css"; // Import styles

const Notification = ({ message, onDismiss }) => {
  return (
    <div className="notification">
      <span>{message}</span>
      <button className="dismiss-button" onClick={onDismiss}>
        ✖
      </button>
    </div>
  );
};

export default Notification;
