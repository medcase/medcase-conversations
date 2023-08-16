import { Client, State, ConnectionState } from '@twilio/conversations';
import { CustomMessage } from '../types';
import { convertMessageClass } from '../utils';

type ConnectionError = {
  terminal: boolean;
  message: string;
};

const ClientEventType = {
  CONNECTION_STATE_CHANGED: 'connectionStateChanged',
  MESSAGE_ADDED: 'messageAdded',
  STATE_CHANGED: 'stateChanged',
  INITIALIZED: 'initialized',
  INIT_FAILED: 'initFailed',
  CONNECTION_ERROR: 'connectionError',
  TOKEN_ABOUT_TO_EXPIRE: 'tokenAboutToExpire',
  TOKEN_EXPIRED: 'tokenExpired',
} as const;

export interface ClientEventMap {
  [ClientEventType.CONNECTION_STATE_CHANGED]: (state: ConnectionState) => void;
  [ClientEventType.MESSAGE_ADDED]: (message: CustomMessage) => void;
  [ClientEventType.STATE_CHANGED]: (state: State) => void;
  [ClientEventType.INITIALIZED]: () => void;
  [ClientEventType.INIT_FAILED]: ({ error }: { error?: ConnectionError }) => void;
  [ClientEventType.CONNECTION_ERROR]: (data: ConnectionError) => void;
  [ClientEventType.TOKEN_ABOUT_TO_EXPIRE]: () => void;
  [ClientEventType.TOKEN_EXPIRED]: () => void;
}

type EventHandler<K extends keyof ClientEventMap> = (event: K, listener: ClientEventMap[K]) => void;

const getCustomHandlers = (client: Client) => (type: 'add' | 'remove') => {
  const clientFunction = client[type === 'add' ? 'on' : 'removeListener'];

  const handlers: {
    [K in keyof ClientEventMap]?: EventHandler<K>;
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
      client[type === 'add' ? 'on' : 'removeListener'](event, listener);

    const customHandlers = getCustomHandlers(client)(type);

    return (event, listener) => (customHandlers[event] || defaultHandler)(event, listener);
  };

const onClientEvent = clientEvent('add');
const removeClientEventListener = clientEvent('remove');

export { onClientEvent, removeClientEventListener };
