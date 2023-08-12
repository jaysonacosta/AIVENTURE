import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";
import {
  type ChatCompletionRequestMessage,
  Configuration,
  OpenAIApi,
} from "openai";
import { env } from "@/env.mjs";

const configuration = new Configuration({
  apiKey: env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);

const request: ChatCompletionRequestMessage[] = [
  {
    role: "user",
    content:
      "I want you to act as if you are a classic text adventure game and we are playing. I don’t want you to ever break out of your character, and you must not refer to yourself in any way. If I want to give you instructions outside the context of the game, I will use curly brackets {like this} but otherwise you are to stick to being the text adventure program. In this game, the setting is a fantasy adventure world. Each room should have at least 3 sentence descriptions. Start by displaying the first room at the beginning of the game, and wait for my to give you my first command.",
  },
];

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
      const adventure = await ctx.prisma.adventure.create({
        data: {
          adventureName: input.adventureName,
          characterName: input.characterName,
          userId: ctx.session.user.id,
        },
      });

      const generatedText = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: request,
      });

      await ctx.prisma.adventureText.create({
        data: {
          adventureId: adventure.id,
          text: generatedText.data.choices[0]?.message?.content
            ? generatedText.data.choices[0]?.message?.content
            : "",
          role: "assistant",
        },
      });

      return adventure;
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
