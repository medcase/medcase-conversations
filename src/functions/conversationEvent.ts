import { Conversation } from '@twilio/conversations';
import { ConversationEventMap, ConversationEventType, EventHandler } from '../types';
import { convertMessageClass } from '../utils';

const getCustomHandlers = (conversation: Conversation) => (type: 'add' | 'remove') => {
  const conversationFunction = conversation[type === 'add' ? 'addListener' : 'removeListener'];

  const handlers: {
    [K in keyof ConversationEventMap]?: EventHandler<ConversationEventMap, K>;
  } = {
    [ConversationEventType.MESSAGE_ADDED]: (event, listener) =>
      conversationFunction(event, (payload) => listener(convertMessageClass(payload))),
  };

  return handlers;
};

const conversationEvent =
  (type: 'add' | 'remove') =>
  (
    conversation: Conversation,
  ): (<K extends keyof ConversationEventMap>(
    event: K,
    listener: ConversationEventMap[K],
  ) => void) => {
    const defaultHandler = (event, listener) =>
      conversation[type === 'add' ? 'addListener' : 'removeListener'](event, listener);

    const customHandlers = getCustomHandlers(conversation)(type);

    return (event, listener) => (customHandlers[event] || defaultHandler)(event, listener);
  };

const addConversationEventListener = conversationEvent('add');
const removeConversationEventListener = conversationEvent('remove');
const removeAllConversationEventListeners =
  (conversation: Conversation) => (eventName: string) => () =>
    conversation.removeAllListeners(eventName);

export {
  addConversationEventListener,
  removeConversationEventListener,
  removeAllConversationEventListeners,
};
