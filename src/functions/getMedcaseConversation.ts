import { Client } from '@twilio/conversations';
import getMedcaseMessages from './getMedcaseMessages';
import { onConversationEvent, removeConversationEventListener } from './conversationEvent';

const getMedcaseConversation = (client: Client) => async (conversationId) => {
  const conversation = await client.getConversationBySid(conversationId);

  return {
    /**
     * Send a message to the conversation.
     *
     * @param message Message body for the text message
     * @return — Index of the new message.
     */
    sendMessage: (message: string) => conversation.sendMessage(message),
    /**
     * Returns messages from the conversation using the paginator interface.
     *
     * @param pageSize Number of messages to return in a single chunk. Default is 50.
     * @param anchor Index of the newest message to fetch. Default is from the end.
     * @param direction Query direction. By default, it queries backwards from newer to older. The "forward" value will query in the opposite direction.
     * @returns A page of messages.
     *
     */
    getMessages: getMedcaseMessages,
    /**
     * Add event listener
     *
     * @param eventName The name of the event.
     *
     * @param listener The callback function
     */
    on: onConversationEvent(conversation),
    /**
     * Remove event listener
     *
     * @param eventName The name of the event.
     *
     * @param listener The callback function
     */
    removeEventListener: removeConversationEventListener(conversation),
  };
};

export default getMedcaseConversation;
