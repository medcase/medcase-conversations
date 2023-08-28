
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
import {
  initMedcaseConversationClient,
  MedcaseClient,
  MedcaseConnectionState,
  MedcaseConversation,
  MedcaseMessage,
  MedcasePaginator,
} from '@medcase/conversations';

const Chat = () => {
  const [medcaseClient, setMedcaseClient] = useState<MedcaseClient>();
  const [connectionState, setConnectionState] = useState<MedcaseConnectionState>();
  const [clientIteration, setClientIteration] = useState(0);
  const [medcaseConversation, setMedcaseConversation] = useState<MedcaseConversation>();
  const [messages, setMessages] = useState<MedcaseMessage[]>([]);
  const [messagesPaginator, setMessagesPaginator] = useState<MedcasePaginator<MedcaseMessage>>();

  const connectToConversation = useCallback(async () => {
    if (medcaseClient) {
      const conversation = await medcaseClient.connectToConversation(convId);

      setMedcaseConversation(conversation);

      const latestsMessages = await conversation.getMessages();

      setMessages(latestsMessages.items);
      setMessagesPaginator(latestsMessages);
    }
  }, [medcaseClient]);

  useEffect(() => {
    const client = initMedcaseConversationClient(token);

    setMedcaseClient(client);

    client.addClientEventListener('connectionStateChanged', (state) => {
      setConnectionState(state);
    });

    client.addClientEventListener('tokenAboutToExpire', () => {
      const newToken = token;
      client.updateToken(newToken);
    });

    client.addClientEventListener('tokenExpired', () => {
      setClientIteration((p) => p + 1);
    });

    return () => {
      client?.removeAllClientEventListeners();
    };
  }, [clientIteration]);

  useEffect(() => {
    if (connectionState === 'connected') {
      connectToConversation();
    }
  }, [connectionState, connectToConversation]);

  useEffect(() => {
    if (medcaseConversation) {
      medcaseConversation?.addConversationEventListener('messageAdded', (e) => {
        setMessages((prev) => [...prev, e]);
      });
    }

    return () => {
      medcaseConversation?.removeAllConversationEventListeners();
    };
  }, [medcaseConversation]);
}

```

## Support

Having trouble with **medcase-conversations**? Post your questions/issues on [https://github.com/medcase/medcase-conversations/issues].



