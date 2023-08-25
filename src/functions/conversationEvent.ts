import { Conversation, Message } from '@twilio/conversations';
import { ConversationEventMap, ConversationEventType } from '../types';
import { convertMessageClass } from '../utils';

type ConversationListenerParameters = Parameters<Conversation['addListener']>;

type EventListener = ConversationListenerParameters[1];
type EventType = ConversationListenerParameters[0];

const getEventListener = (event, listener) => {
  const customListeners: Partial<Record<EventType, EventListener>> = {
    [ConversationEventType.MESSAGE_ADDED]: (payload: Message) =>
      listener(convertMessageClass(payload)),
  };

  return customListeners?.[event] || listener;
};

const conversationEvent =
  (type: 'add' | 'remove') =>
  (
    conversation: Conversation,
  ): (<K extends keyof ConversationEventMap>(
    event: K,
    listener: ConversationEventMap[K],
  ) => void) => {
    const listenerHandler = (event, listener) =>
      conversation[type === 'add' ? 'addListener' : 'removeListener'](event, listener);

    return (event, listener) => listenerHandler(event, getEventListener(event, listener));
  };

const addConversationEventListener = conversationEvent('add');
const removeConversationEventListener = conversationEvent('remove');
const removeAllConversationEventListeners =
  (conversation: Conversation) => (eventName?: string) => () =>
    conversation.removeAllListeners(eventName);

export {
  addConversationEventListener,
  removeConversationEventListener,
  removeAllConversationEventListeners,
};
