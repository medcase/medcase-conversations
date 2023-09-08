
# medcase-conversations

![GitHub Workflow Status](https://github.com/medcase/medcase-conversations/actions/workflows/main.yml/badge.svg)
![GitHub Workflow Status](https://github.com/medcase/medcase-conversations/actions/workflows/release.yml/badge.svg)

**medcase-conversations** is a Software Development Kit (SDK) that allows developers to effortlessly build and manage conversational interfaces. Built with Node.js, it is readily available through npm, making integration into your projects a breeze.

## Installation

To install **medcase-conversations** via npm, simply run:

```bash
npm install @medcase/medcase-conversations
```

## Getting Started

Here's a basic example in react to help you get started:

```typescript
import { useState, useEffect } from 'react';
import {
  initMedcaseConversationClient,
  MedcaseConversation,
  MedcaseMessage,
  MedcaseConnectionState,
  MedcaseClient,
} from '@medcase/conversations';

interface Props {
  token: string;
  conversationId: string;
  refetchToken: () => Promise<void>;
}

const useConversation = ({ token = '', conversationId = '', refetchToken }: Props) => {
  const [client, setClient] = useState<MedcaseClient | undefined>(undefined);
  const [conversation, setConversation] = useState<MedcaseConversation>();
  const [messages, setMessages] = useState<MedcaseMessage[] | undefined>(undefined);
  const [connectionState, setConnectionState] = useState<MedcaseConnectionState>();
  const [clientIteration, setClientIteration] = useState(0);

  const handleCatchError = (title: string) => (error: unknown) => {
    setClientIteration((iteration) => iteration + 1);

    console.warn('Medcase Conversations - Error ', title, error);
  };

  // connect to conversation
  useEffect(() => {
    const init = async () => {
      if (!token || !conversationId || !!client) {
        return;
      }

      const medcaseClient = initMedcaseConversationClient(token);

      setClient(medcaseClient);

      const medcaseConversation = await medcaseClient
        .connectToConversation(conversationId)
        .catch(handleCatchError('Error when trying to connect to conversation'));

      if (medcaseConversation) {
        setConversation(medcaseConversation);
      }
    };

    init();
  }, [conversationId, token, client, clientIteration]);

  // refresh token when about to expired
  useEffect(() => {
    const refreshTokenWhenAboutToExpireListener = async () => {
      await refetchToken();

      if (token) {
        await client
          ?.updateToken(token)
          .catch(handleCatchError('Error when trying to refresh token about to expire'));
      }
    };

    const refreshTokenWhenAboutToExpire = () => {
      client?.addClientEventListener('tokenAboutToExpire', refreshTokenWhenAboutToExpireListener);
    };

    refreshTokenWhenAboutToExpire();

    return () =>
      client?.removeClientEventListener(
        'tokenAboutToExpire',
        refreshTokenWhenAboutToExpireListener,
      );
  }, [token, client, conversation, refetchToken]);

  // refresh token when expired
  useEffect(() => {
    const refreshTokenWhenExpiredListener = async () => {
      await refetchToken();

      if (token) {
        await client
          ?.updateToken(token)
          .catch(handleCatchError('Error when trying to refresh expired token'));
      }
    };

    const refreshTokenWhenExpired = () => {
      client?.addClientEventListener('tokenExpired', refreshTokenWhenExpiredListener);
    };

    refreshTokenWhenExpired();

    return () => client?.removeClientEventListener('tokenExpired', refreshTokenWhenExpiredListener);
  }, [token, client, conversation, refetchToken]);

  // get connection state
  useEffect(() => {
    const connectionStateListener = async (state: MedcaseConnectionState) => {
      setConnectionState(state);
    };

    const addConnectionStateListener = () => {
      client?.addClientEventListener('connectionStateChanged', connectionStateListener);
    };

    addConnectionStateListener();

    return () =>
      client?.removeClientEventListener('connectionStateChanged', connectionStateListener);
  }, [client, conversation]);

  // get messages when connected
  useEffect(() => {
    const getInitialMessages = async () => {
      if (connectionState === 'connected') {
        const results = await conversation
          ?.getMessages()
          .catch(handleCatchError('Error when trying to get initial messages'));
        setMessages(results?.items);
      }
    };

    getInitialMessages();
  }, [connectionState, conversation]);

  // update messages when appeared new message
  useEffect(() => {
    const updateMessagesListener = (message: MedcaseMessage) =>
      setMessages((prev) => (prev ? [...prev, message] : [message]));

    const updateMessages = async () => {
      conversation?.addConversationEventListener('messageAdded', updateMessagesListener);
    };

    updateMessages();

    return () =>
      conversation?.removeConversationEventListener('messageAdded', updateMessagesListener);
  }, [connectionState, conversation]);

  const handleGetNextPageMessages = async () => {
    if (!messages?.[0].index) {
      return;
    }

    const nextMessagesPage = await conversation?.getMessages(
      50,
      messages?.[0].index - 1,
      'backwards',
    );

    if (!nextMessagesPage) {
      return;
    }

    setMessages((prev) => (prev ? [...nextMessagesPage?.items, ...prev] : nextMessagesPage?.items));
  };

  const handleSendMessage = (message: string) => {
    conversation
      ?.sendMessage(message)
      .catch(handleCatchError('Error when trying to send a message'));
  };

  return {
    messages,
    connectionState,
    sendMessage: handleSendMessage,
    getNextPageMessages: handleGetNextPageMessages,
  };
};

export default useConversation;
```

## Support

Having trouble with **medcase-conversations**? Post your questions/issues on [https://github.com/medcase/medcase-conversations/issues].



