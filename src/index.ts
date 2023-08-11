import { Client } from '@twilio/conversations';

const initMedcaseConversations = (token: string) => {
  const client = new Client(token);

  return {
    getConversation: async (conversationId) => {
      const conversation = await client.getConversationBySid(conversationId);

      return {
        sendMessage: (message: string) => conversation.sendMessage(message),
        getMessages: conversation.getMessages,
        onMessageAdded: (listener: (message: string) => void) =>
          conversation.on('messageAdded', (twilioMessage) => listener(twilioMessage.body)),
      };
    },
    updateToken: client.updateToken,
  };
};

export default initMedcaseConversations;
