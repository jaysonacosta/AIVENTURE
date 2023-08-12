import { z } from "zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";

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

export const adventureTextRouter = createTRPCRouter({
  create: protectedProcedure
    .input(z.object({ adventureId: z.string(), userInput: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.prisma.adventureText.create({
        data: {
          role: "user",
          text: input.userInput,
          adventureId: input.adventureId,
        },
      });

      const history = await ctx.prisma.adventureText.findMany({
        where: { adventureId: input.adventureId },
        select: { text: true, role: true },
      });

      console.log(history);

      const generatedText = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: history.map((entry) => ({
          role: entry.role,
          content: entry.text,
        })) as ChatCompletionRequestMessage[],
      });

      return await ctx.prisma.adventureText.create({
        data: {
          role: "assistant",
          text: generatedText.data.choices[0]?.message?.content
            ? generatedText.data.choices[0]?.message?.content
            : "",
          adventureId: input.adventureId,
        },
      });
    }),
  getAllByAdventureId: protectedProcedure
    .input(z.object({ adventureId: z.string() }))
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.adventureText.findMany({
        where: { adventureId: input.adventureId },
      });
    }),
});
