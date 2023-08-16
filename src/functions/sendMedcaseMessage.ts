import { Conversation } from '@twilio/conversations';

const sendMedcaseMessage = (conversation: Conversation) => (message: string) =>
  conversation.sendMessage(message);

export default sendMedcaseMessage;
