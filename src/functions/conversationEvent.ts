import { Conversation } from '@twilio/conversations';
import { CustomMessage } from '../types';
import { convertMessageClass } from '../utils';

const ConversationEventType = {
  MESSAGE_ADDED: 'messageAdded',
} as const;

export interface ConversationEventMap {
  [ConversationEventType.MESSAGE_ADDED]: (message: CustomMessage) => void;
}

type EventHandler<K extends keyof ConversationEventMap> = (
  event: K,
  listener: ConversationEventMap[K],
) => void;

const getCustomHandlers = (conversation: Conversation) => (type: 'add' | 'remove') => {
  const conversationFunction = conversation[type === 'add' ? 'on' : 'removeListener'];

  const handlers: {
    [K in keyof ConversationEventMap]?: EventHandler<K>;
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
      conversation[type === 'add' ? 'on' : 'removeListener'](event, listener);

    const customHandlers = getCustomHandlers(conversation)(type);

    return (event, listener) => (customHandlers[event] || defaultHandler)(event, listener);
  };

const onConversationEvent = conversationEvent('add');
const removeConversationEventListener = conversationEvent('remove');

export { onConversationEvent, removeConversationEventListener };
