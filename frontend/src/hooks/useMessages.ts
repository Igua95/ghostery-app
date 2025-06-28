import { trpc } from '../utils/trpc';

const MINUTES = 1000 * 60;

export const useGetUserThreads = (userId: number | null) => {
  return trpc.messages.getUserThreads.useQuery(
    { userId: userId! },
    {
      enabled: userId !== null,
      staleTime: 5 * MINUTES, // 5 minutes
    }
  );
};

export const useGetThreadMessages = (threadId: number | null, userId: number | null) => {
  return trpc.messages.getThreadMessages.useQuery(
    { threadId: threadId!, userId: userId! },
    {
      enabled: threadId !== null && userId !== null,
      staleTime: 1 * MINUTES, // 1 minute
    }
  );
};

export const useCheckUserExists = (username: string | null, currentUserId?: number) => {
  return trpc.messages.checkUserExists.useQuery(
    { username: username!, currentUserId },
    {
      enabled: username !== null && username.length > 0,
      staleTime: 5 * MINUTES, // 5 minutes
    }
  );
};
