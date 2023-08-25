export interface MedcaseUser {
  identity: string;
}
export interface MedcaseMessage {
  index: number;
  body: string;
  createdAt: Date;
  author: string;
}

export interface MedcasePaginator<T> {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  items: T[];
  nextPage(): Promise<MedcasePaginator<T>>;
  prevPage(): Promise<MedcasePaginator<T>>;
}

export type MedcaseConnectionError = {
  terminal: boolean;
  message: string;
};

export type MedcaseConnectionState =
  | 'unknown'
  | 'disconnecting'
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'denied'
  | 'error';
export type MedcaseState = 'initialized' | 'failed';

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
  [ClientEventType.CONNECTION_STATE_CHANGED]: (state: MedcaseConnectionState) => void;
  [ClientEventType.MESSAGE_ADDED]: (message: MedcaseMessage) => void;
  [ClientEventType.STATE_CHANGED]: (state: MedcaseState) => void;
  [ClientEventType.INITIALIZED]: () => void;
  [ClientEventType.INIT_FAILED]: ({ error }: { error?: MedcaseConnectionError }) => void;
  [ClientEventType.CONNECTION_ERROR]: (data: MedcaseConnectionError) => void;
  [ClientEventType.TOKEN_ABOUT_TO_EXPIRE]: () => void;
  [ClientEventType.TOKEN_EXPIRED]: () => void;
}
export interface ConversationEventMap {
  [ConversationEventType.MESSAGE_ADDED]: (message: MedcaseMessage) => void;
}

export interface MedcaseConversation {
  getMessages: (
    pageSize?: number,
    anchor?: number,
    direction?: 'forward' | 'backwards',
  ) => Promise<MedcasePaginator<MedcaseMessage>>;
  sendMessage: (message: string) => Promise<number>;
  addConversationEventListener: <K extends keyof ConversationEventMap>(
    event: K,
    listener: ConversationEventMap[K],
  ) => void;
  removeConversationEventListener: <K extends keyof ConversationEventMap>(
    event: K,
    listener: ConversationEventMap[K],
  ) => void;
  removeAllConversationEventListeners: (eventName?: string) => void;
}

export interface MedcaseClient {
  connectToConversation: (conversationSid: string) => Promise<MedcaseConversation>;
  addClientEventListener: <K extends keyof ClientEventMap>(
    event: K,
    listener: ClientEventMap[K],
  ) => void;
  removeClientEventListener: <K extends keyof ClientEventMap>(
    event: K,
    listener: ClientEventMap[K],
  ) => void;
  removeAllClientEventListeners: (eventName?: string) => void;
  updateToken: (token: string) => Promise<void>;
  user: MedcaseUser;
}
