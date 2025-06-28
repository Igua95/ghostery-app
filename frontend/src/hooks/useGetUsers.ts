import { trpc } from '../utils/trpc';

export const useGetUsers = () => {
  return trpc.getUsers.useQuery();
};
