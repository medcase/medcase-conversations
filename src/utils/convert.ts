import { Message as TwilioMessage } from '@twilio/conversations';
import { Message, Paginator } from '../types';

const convertMessageClass = (message: TwilioMessage): Message => ({
  body: message.body,
  createdAt: message.dateCreated,
  participantSid: message.participantSid,
});

const convertPaginatorMessages = (messages: Paginator<TwilioMessage>): Paginator<Message> => ({
  hasNextPage: messages.hasNextPage,
  hasPrevPage: messages.hasPrevPage,
  items: messages.items.map(convertMessageClass),
  nextPage: async () => convertPaginatorMessages(await messages.nextPage()),
  prevPage: async () => convertPaginatorMessages(await messages.prevPage()),
});

export { convertMessageClass, convertPaginatorMessages };
