import { Client } from '@twilio/conversations';
import { convertMessageClass } from '../utils';
import { ClientEventMap, ClientEventType, EventHandler } from '../types';

const getCustomHandlers = (client: Client) => (type: 'add' | 'remove') => {
  const clientFunction = client[type === 'add' ? 'addListener' : 'removeListener'];

  const handlers: {
    [K in keyof ClientEventMap]?: EventHandler<ClientEventMap, K>;
  } = {
    [ClientEventType.MESSAGE_ADDED]: (event, listener) =>
      clientFunction(event, (payload) => listener(convertMessageClass(payload))),
  };

  return handlers;
};

const clientEvent =
  (type: 'add' | 'remove') =>
  (
    client: Client,
  ): (<K extends keyof ClientEventMap>(event: K, listener: ClientEventMap[K]) => void) => {
    const defaultHandler = (event, listener) =>
      client[type === 'add' ? 'addListener' : 'removeListener'](event, listener);

    const customHandlers = getCustomHandlers(client)(type);

    return (event, listener) => (customHandlers[event] || defaultHandler)(event, listener);
  };

const addClientEventListener = clientEvent('add');
const removeClientEventListener = clientEvent('remove');
const removeAllClientEventListeners = (client: Client) => (eventName: string) => () =>
  client.removeAllListeners(eventName);

export { addClientEventListener, removeClientEventListener, removeAllClientEventListeners };
