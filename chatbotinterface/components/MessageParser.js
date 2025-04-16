class MessageParser {
  constructor(actionProvider, state) {
    this.actionProvider = actionProvider;
    this.state = state;
  }

  parse(message) {
    const lowerCaseMessage = message.toLowerCase();
    
    if (lowerCaseMessage.includes("hello") || lowerCaseMessage.includes("hi")) {
      this.actionProvider.handleGreeting();
    } else if (lowerCaseMessage.includes("help")) {
      this.actionProvider.handleHelp();
    } else if (lowerCaseMessage.includes("live chat") || lowerCaseMessage.includes("technician") || lowerCaseMessage.includes("person") || lowerCaseMessage.includes("agent")) {
      this.actionProvider.handleLiveChatRequest();
    } else {
      this.actionProvider.handleDefault();
    }
  }
}

export default MessageParser;
