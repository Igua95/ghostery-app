import { createTRPCReact } from '@trpc/react-query';

// For now, we'll use a simple type definition
// In a real app, you'd import this from a shared package
type AppRouter = any;

export const trpc = createTRPCReact<AppRouter>();