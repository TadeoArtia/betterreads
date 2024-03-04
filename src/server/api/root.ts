import { createTRPCRouter } from "~/server/api/trpc";
import { userRouter } from "./routers/user";
import { bookshelfRouter } from "./routers/bookshelves";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  bookshelves: bookshelfRouter,
  user: userRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
