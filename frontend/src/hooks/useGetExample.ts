import { trpc } from '../utils/trpc';

export const useGetExample = (input: string) => {
  return trpc.getExample.useQuery(input);
};
