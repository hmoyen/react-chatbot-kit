import React, { useState, useEffect } from 'react';
import socket from '../utils/socket';
import MessageInput from './MessageInput';
import '../styles/LiveChat.css';

const LiveChatWrapper = () => {
  const [messages, setMessages] = useState([]);
  const [technicianInfo, setTechnicianInfo] = useState({
    name: 'Connecting...',
    id: 'Connecting...',
    status: 'Connecting...'
  });
  
  useEffect(() => {
    // Connect to technician
    socket.emit('joinLiveChatQueue', {
      name: 'Customer',
      issue: 'Equipment assistance',
      machine: 'Volvo CE Excavator',
      priority: 'Medium'
    });
    
    socket.on('technicianConnected', (technician) => {
      setTechnicianInfo({
        name: technician.name || 'Support Agent',
        id: technician.technicianId || 'Wvv4T9V3qNFMHw6bAAA',
        status: 'Online'
      });
    });
    
    socket.on('message', (data) => {
      setMessages(prev => [...prev, data]);
    });
    
    return () => {
      socket.off('technicianConnected');
      socket.off('message');
    };
  }, []);
  
  const handleSendMessage = (messageData) => {
    const message = typeof messageData === 'string' ? messageData : messageData.message;
    
    const newMessage = {
      text: message,
      fromUser: true,
      timestamp: Date.now()
    };
    
    setMessages(prev => [...prev, newMessage]);
    
    socket.emit('message', {
      to: technicianInfo.id,
      message: message
    });
  };
  
  const handleEndChat = () => {
    const confirmEnd = window.confirm('Are you sure you want to end this chat?');
    if (confirmEnd) {
      socket.emit('endChat', { customerId: socket.id });
      // Return to the chatbot
      window.location.href = '/';
    }
  };
  
  return (
    <div className="chat-container">
      <div className="chat-sidebar">
        <h3>TECHNICIAN DETAILS</h3>
        <p><strong>Name:</strong> {technicianInfo.name}</p>
        <p><strong>ID:</strong> {technicianInfo.id}</p>
        <p><strong>Status:</strong> {technicianInfo.status}</p>
      </div>
      
      <div className="chat-main">
        <div className="chat-window">
          {messages.map((msg, idx) => (
            <div key={idx} className={`message ${msg.fromUser ? 'sent' : 'received'}`}>
              <div className="message-content">
                {msg.text || msg.message}
                <div className="timestamp">
                  {new Date(msg.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="chat-actions">
          <button className="end-chat-button" onClick={handleEndChat}>End Chat</button>
        </div>
        
        <div className="message-input-container">
          <MessageInput onSendMessage={handleSendMessage} onTyping={() => socket.emit('customerTyping')} />
        </div>
      </div>
    </div>
  );
};

export default LiveChatWrapper;