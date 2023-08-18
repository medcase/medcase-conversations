import { Client } from '@twilio/conversations';
import {
  getMedcaseMessages,
  addClientEventListener,
  removeClientEventListener,
  addConversationEventListener,
  removeConversationEventListener,
  sendMedcaseMessage,
  updateMedcaseToken,
} from './functions';

/**
 * Initialize medcase conversation
 *
 * @param token User access token
 * @param conversationSid Conversation Sid
 */

const initMedcaseConversation = async (token: string, conversationSid: string) => {
  const client = new Client(token);
  const conversation = await client.getConversationBySid(conversationSid);

  return {
    /**
     * Send a message to the conversation.
     *
     * @param message Message body for the text message
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
     * Add client event listener
     *
     * @param eventName The name of the event.
     *
     * @param listener The callback function
     */
    addClientEventListener: addClientEventListener(client),
    /**
     * Remove client event listener
     *
     * @param eventName The name of the event.
     *
     * @param listener The callback function
     */
    removeClientEventListener: removeClientEventListener(client),
    /**
     * Update the token used by the client and re-register with the Conversations services.
     *
     * @param token New access token.
     */
    updateToken: updateMedcaseToken(client),
  };
};

export default initMedcaseConversation;
