import { Client, Message } from '@twilio/conversations';
import { convertMessageClass } from '../utils';
import { ClientEventMap, ClientEventType } from '../types';

type ClientListenerParameters = Parameters<Client['addListener']>;

type EventListener = ClientListenerParameters[1];
type EventType = ClientListenerParameters[0];

const getEventListener = (event, listener) => {
  const customListeners: Partial<Record<EventType, EventListener>> = {
    [ClientEventType.MESSAGE_ADDED]: (payload: Message) => listener(convertMessageClass(payload)),
  };

  return customListeners?.[event] || listener;
};

const clientEvent =
  (type: 'add' | 'remove') =>
  (
    client: Client,
  ): (<K extends keyof ClientEventMap>(event: K, listener: ClientEventMap[K]) => void) => {
    const listenerHandler = (event, listener) =>
      client[type === 'add' ? 'addListener' : 'removeListener'](event, listener);

    return (event, listener) => listenerHandler(event, getEventListener(event, listener));
  };

const addClientEventListener = clientEvent('add');
const removeClientEventListener = clientEvent('remove');
const removeAllClientEventListeners = (client: Client) => (eventName: string) => () =>
  client.removeAllListeners(eventName);

export { addClientEventListener, removeClientEventListener, removeAllClientEventListeners };
