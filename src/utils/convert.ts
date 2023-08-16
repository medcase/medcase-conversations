import { Message, Paginator } from '@twilio/conversations';
import { CustomMessage } from '../types';

const convertMessageClass = (message: Message) =>
  ({
    body: message.body,
    createdAt: message.dateCreated,
    participantSid: message.participantSid,
  }) as CustomMessage;

const convertPaginatorMessages = (messages: Paginator<Message>) => ({
  hasNextPage: messages.hasNextPage,
  hasPrevPage: messages.hasPrevPage,
  items: messages.items.map(convertMessageClass),
  nextPage: async () => convertPaginatorMessages(await messages.nextPage()),
  prevPage: async () => convertPaginatorMessages(await messages.prevPage()),
});

export { convertMessageClass, convertPaginatorMessages };
