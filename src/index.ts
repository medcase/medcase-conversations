import { Client } from '@twilio/conversations';
import {
  addClientEventListener,
  removeClientEventListener,
  removeAllClientEventListeners,
  updateMedcaseToken,
  connectToConversation,
  userDetails,
} from './functions';
import { MedcaseClient } from './types';

/**
 * Initialize medcase conversation client
 *
 * @param token User access token
 */

const initMedcaseConversationClient = (token: string): MedcaseClient => {
  const client = new Client(token);

  return {
    /**
     * Get User details
     *
     * @return user
     */
    user: userDetails(client),
    /**
     * Connect to conversation
     *
     * @param conversationSid Conversation Sid
     * @return conversation
     */
    connectToConversation: connectToConversation(client),
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

export { initMedcaseConversationClient };
export * from './types';
