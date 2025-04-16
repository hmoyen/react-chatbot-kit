import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import socket from '../utils/socket';

const LiveChatRedirect = ({ steps }) => {
  const navigate = useNavigate();
  
  useEffect(() => {
    // Extract information from the chat to populate the live chat
    const userName = steps.waitingName ? steps.waitingName.value : "User";
    const issue = steps.waitingTechnicianIssue ? steps.waitingTechnicianIssue.value : 
               (steps.waitingIssue ? steps.waitingIssue.value : "General assistance");
    const machine = steps.waitingModel ? steps.waitingModel.value : "Not specified";
    
    // Prepare data for live chat
    const chatData = {
      role: "customer",
      name: userName,
      issue: issue,
      machine: machine,
      priority: "Medium"
    };
    
    // Store data for the live chat form
    localStorage.setItem("livechatFormData", JSON.stringify(chatData));
    
    // Optionally automatically connect to live chat queue
    socket.emit("joinLiveChatQueue", {
      name: userName,
      issue: issue,
      machine: machine,
      priority: "Medium",
    });
    
    // Redirect to the live chat page
    navigate("/livechat", { state: chatData });
  }, [navigate, steps]);
  
  return (
    <div className="redirect-container">
      <p>Connecting you to a technician...</p>
    </div>
  );
};

export default LiveChatRedirect;
