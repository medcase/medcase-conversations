import { Client } from '@twilio/conversations';
import { getMedcaseConversation, onClientEvent, removeClientEventListener } from './functions';

/**
 * Initialize medcase conversations
 *
 * @param token User access token
 */

const initMedcaseConversations = (token: string) => {
  const client = new Client(token);

  return {
    /**
     * Get a known conversation by its SID.
     *
     * @param conversationSid Conversation sid
     */
    getConversation: getMedcaseConversation(client),
    /**
     * Update the token used by the client and re-register with the Conversations services.
     *
     * @param token New access token.
     */
    updateToken: (token: string) => {
      client.updateToken(token);
    },
    /**
     * Add event listener
     *
     * @param eventName The name of the event.
     *
     * @param listener The callback function
     */
    on: onClientEvent(client),
    /**
     * Remove event listener
     *
     * @param eventName The name of the event.
     *
     * @param listener The callback function
     */
    removeEventListener: removeClientEventListener(client),
  };
};

export default initMedcaseConversations;
