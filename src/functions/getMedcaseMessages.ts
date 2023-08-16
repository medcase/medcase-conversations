import { Conversation } from '@twilio/conversations';
import { convertPaginatorMessages } from '../utils';

const getMessages =
  (conversation: Conversation) =>
  async (pageSize: number = 50, anchor?: number, direction?: 'forward' | 'backwards') => {
    const messages = await conversation.getMessages(pageSize, anchor, direction);

    return convertPaginatorMessages(messages);
  };

export default getMessages;
