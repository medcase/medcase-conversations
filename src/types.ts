import { State, ConnectionState } from '@twilio/conversations';
export interface Message {
  body: string;
  createdAt: Date;
  participantSid: string;
}

export interface Paginator<T> {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  items: T[];
  nextPage(): Promise<Paginator<T>>;
  prevPage(): Promise<Paginator<T>>;
}

export type ConnectionError = {
  terminal: boolean;
  message: string;
};

export type EventHandler<T, K extends keyof T> = (event: K, listener: T[K]) => void;

export const ConversationEventType = {
  MESSAGE_ADDED: 'messageAdded',
} as const;

export const ClientEventType = {
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
  [ClientEventType.MESSAGE_ADDED]: (message: Message) => void;
  [ClientEventType.STATE_CHANGED]: (state: State) => void;
  [ClientEventType.INITIALIZED]: () => void;
  [ClientEventType.INIT_FAILED]: ({ error }: { error?: ConnectionError }) => void;
  [ClientEventType.CONNECTION_ERROR]: (data: ConnectionError) => void;
  [ClientEventType.TOKEN_ABOUT_TO_EXPIRE]: () => void;
  [ClientEventType.TOKEN_EXPIRED]: () => void;
}
export interface ConversationEventMap {
  [ConversationEventType.MESSAGE_ADDED]: (message: Message) => void;
}
export interface MedcaseConversation {
  getMessages: (
    pageSize?: number,
    anchor?: number,
    direction?: 'forward' | 'backwards',
  ) => Promise<Paginator<Message>>;
  sendMessage: (message: string) => Promise<number>;
  addConversationEventListener: <K extends keyof ConversationEventMap>(
    event: K,
    listener: ConversationEventMap[K],
  ) => void;
  removeConversationEventListener: <K extends keyof ConversationEventMap>(
    event: K,
    listener: ConversationEventMap[K],
  ) => void;
  removeAllConversationEventListeners: (eventName: string) => void;
  addClientEventListener: <K extends keyof ClientEventMap>(
    event: K,
    listener: ClientEventMap[K],
  ) => void;
  removeClientEventListener: <K extends keyof ClientEventMap>(
    event: K,
    listener: ClientEventMap[K],
  ) => void;
  removeAllClientEventListeners: (eventName: string) => void;
  updateToken: (token: string) => Promise<void>;
}

export { ConnectionState, State };
