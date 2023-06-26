import { Message, Post, Vote } from '../.prisma';
import { createPubSub } from '@graphql-yoga/subscription';

export type PubSubChannels = {
  newPost: [{ newPost: Post }];
  newVote: [{ newVote: Vote }];
  userTyping: [{ receiverId: string; senderId: string }];
  newMessages: [{ newMessages: Message[] }];
};

export const pubSub = createPubSub<PubSubChannels>();
