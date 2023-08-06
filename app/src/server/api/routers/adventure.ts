import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

export const adventureRouter = createTRPCRouter({
  create: protectedProcedure
    .input(
      z.object({
        adventureName: z
          .string()
          .min(2, "Adventure name must be at least 2 characters long."),
        characterName: z
          .string()
          .min(2, "Character name must be at least 2 characters long."),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.adventure.create({
        data: {
          adventureName: input.adventureName,
          characterName: input.characterName,
          userId: ctx.session.user.id,
        },
      });
    }),
  getAll: protectedProcedure.query(async ({ ctx }) => {
    const adventures = await ctx.prisma.adventure.findMany({
      where: { userId: ctx.session.user.id },
    });

    return adventures;
  }),
  getById: protectedProcedure
    .input(z.object({ adventureId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.adventure.findUnique({
        where: { id: input.adventureId },
      });
    }),
});
