import { Client } from '@twilio/conversations';
import {
  getMedcaseMessages,
  addClientEventListener,
  removeClientEventListener,
  removeAllClientEventListeners,
  addConversationEventListener,
  removeConversationEventListener,
  removeAllConversationEventListeners,
  sendMedcaseMessage,
  updateMedcaseToken,
} from './functions';
import { MedcaseConversation } from './types';

/**
 * Initialize medcase conversation
 *
 * @param token User access token
 * @param conversationSid Conversation Sid
 */

const initMedcaseConversation = async (
  token: string,
  conversationSid: string,
): Promise<MedcaseConversation> => {
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
     * Removes all conversation listeners, or those of the specified `eventName`.
     *
     * @param eventName The name of the event.
     */
    removeAllConversationEventListeners: removeAllConversationEventListeners(conversation),
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
     * Removes all client listeners, or those of the specified `eventName`.
     *
     * @param eventName The name of the event.
     */
    removeAllClientEventListeners: removeAllClientEventListeners(client),
    /**
     * Update the token used by the client and re-register with the Conversations services.
     *
     * @param token New access token.
     */

    updateToken: updateMedcaseToken(client),
  };
};

export { initMedcaseConversation };
export * from './types';
