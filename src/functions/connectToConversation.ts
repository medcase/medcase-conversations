import { Client } from '@twilio/conversations';
import sendMedcaseMessage from './sendMedcaseMessage';
import getMedcaseMessages from './getMedcaseMessages';
import {
  addConversationEventListener,
  removeAllConversationEventListeners,
  removeConversationEventListener,
} from './conversationEvent';

const connectToConversation = (client: Client) => async (conversationSid: string) => {
  const conversation = await client.getConversationBySid(conversationSid);

  return {
    /**
     * Send a message to the conversation.
     *
     * @param message MedcaseMessage body for the text message
     * @return Index of the new message.
     */
    sendMessage: sendMedcaseMessage(conversation),
    /**
     * Returns messages from the conversation using the paginator interface.
     *
     * @param pageSize Number of messages to return in a single chunk. Default is 50.
     * @param anchor Index of the newest message to fetch. Default is from the end.
     * @param direction Query direction. By default, it queries backwards from newer to older. The "forward" value will query in the opposite direction.
     * @returns A page of messages.
     *
     */
    getMessages: getMedcaseMessages(conversation),
    /**
     * Add conversation event listener
     *
     * @param eventName The name of the event.
     *
     * @param listener The callback function
     */
    addConversationEventListener: addConversationEventListener(conversation),
    /**
     * Remove conversation event listener
     *
     * @param eventName The name of the event.
     *
     * @param listener The callback function
     */
    removeConversationEventListener: removeConversationEventListener(conversation),
    /**
     * Removes all conversation listeners, or those of the specified `eventName`.
     *
     * @param eventName The name of the event.
     */
    removeAllConversationEventListeners: removeAllConversationEventListeners(conversation),
  };
};

export default connectToConversation;
