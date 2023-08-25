import { Message as TwilioMessage } from '@twilio/conversations';
import { MedcaseMessage, MedcasePaginator } from '../types';

const convertMessageClass = (message: TwilioMessage): MedcaseMessage => ({
  index: message.index,
  body: message.body,
  createdAt: message.dateCreated,
  author: message.author,
});

const convertPaginatorMessages = (
  messages: MedcasePaginator<TwilioMessage>,
): MedcasePaginator<MedcaseMessage> => ({
  hasNextPage: messages.hasNextPage,
  hasPrevPage: messages.hasPrevPage,
  items: messages.items.map(convertMessageClass),
  nextPage: async () => convertPaginatorMessages(await messages.nextPage()),
  prevPage: async () => convertPaginatorMessages(await messages.prevPage()),
});

export { convertMessageClass, convertPaginatorMessages };
