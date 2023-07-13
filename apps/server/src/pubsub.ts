import { Message } from '../.prisma';
import { createPubSub } from '@graphql-yoga/subscription';

export type PubSubChannels = {
  userTyping: [{ receiverId: string; senderId: string }];
  newMessages: [{ newMessages: Message[] }];
};

export const pubSub = createPubSub<PubSubChannels>();
