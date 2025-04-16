import React from "react";
import { createChatBotMessage } from "react-chatbot-kit";
import BotAvatar from "./components/BotAvatar";
import UserAvatar from "./components/UserAvatar";
import CustomHeader from "./components/CustomHeader";

const config = {
  initialMessages: [
    createChatBotMessage("Welcome to Volvo Support! How can I assist you today?"),
    createChatBotMessage("I can help with equipment information, maintenance schedules, and parts inquiries."),
  ],
  botName: "Volvo Support",
  customStyles: {
    botMessageBox: {
      backgroundColor: "#003057",
    },
    chatButton: {
      backgroundColor: "#003057",
    }
  },
  customComponents: {
    header: () => <CustomHeader />,
    botAvatar: () => <BotAvatar />,
    userAvatar: () => <UserAvatar />
  }
};

export default config;
