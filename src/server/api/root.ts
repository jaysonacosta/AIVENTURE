import { adventureRouter } from "@/server/api/routers/adventure";
import { createTRPCRouter } from "@/server/api/trpc";
import { adventureTextRouter } from "./routers/adventureText";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  adventure: adventureRouter,
  adventureText: adventureTextRouter,
});

// export type definition of API
export type AppRouter = typeof appRouter;
