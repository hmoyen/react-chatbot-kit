import React from "react";
import { useNavigate } from "react-router-dom";

const LiveChatLink = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    const stored = localStorage.getItem("livechatFormData");
    console.log(stored);
    const formData = stored ? JSON.parse(stored) : {};
    navigate("/livechat", { state: { role: "customer", ...formData } });
  };

  return (
    <p>
      You're now connected! 👉{" "}
      <button onClick={handleClick} style={{ color: "blue", textDecoration: "underline", background: "none", border: "none", padding: 0, cursor: "pointer" }}>
        Click here to start the live chat
      </button>
    </p>
  );
};

export default LiveChatLink;
