class ActionProvider {
  constructor(createChatBotMessage, setStateFunc, createClientMessage) {
    this.createChatBotMessage = createChatBotMessage;
    this.setState = setStateFunc;
    this.createClientMessage = createClientMessage;
  }

  handleGreeting() {
    const message = this.createChatBotMessage("Hello! Nice to meet you!");
    this.updateChatbotState(message);
  }

  handleHelp() {
    const message = this.createChatBotMessage(
      "I can respond to greetings and help commands. Try saying 'hello' or asking for 'help'. If you need to talk to a real person, say 'live chat'."
    );
    this.updateChatbotState(message);
  }

  handleLiveChatRequest() {
    const message = this.createChatBotMessage(
      "I'll connect you with a technician right away. Please wait a moment..."
    );
    this.updateChatbotState(message);
    
    // Connect to live chat after a brief delay
    setTimeout(() => {
      if (this.switchToLiveChat) {
        this.switchToLiveChat();
      }
    }, 1500);
  }

  handleDefault() {
    const message = this.createChatBotMessage(
      "I'm not sure how to respond to that. Try asking for help or type 'live chat' to connect with a technician.",
      {
        withAvatar: true,
      }
    );
    this.updateChatbotState(message);
  }

  updateChatbotState(message) {
    this.setState((prevState) => ({
      ...prevState,
      messages: [...prevState.messages, message],
    }));
  }
}

export default ActionProvider;
