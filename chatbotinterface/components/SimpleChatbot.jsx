import React from 'react';
import { Chatbot } from 'react-chatbot-kit';
import config from '../config';
import MessageParser from './MessageParser';
import ActionProvider from './ActionProvider';

const SimpleChatbot = ({ handleEnd }) => {
  return (
    <div className="simple-chatbot-container">
      <Chatbot
        config={config}
        messageParser={MessageParser}
        actionProvider={ActionProvider}
        runOnMount={true}
      />
    </div>
  );
};

export default SimpleChatbot;
