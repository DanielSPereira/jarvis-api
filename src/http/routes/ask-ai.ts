import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamObject, streamText } from "ai";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import z from "zod";
import { db } from "../../database/client.ts";
import { users } from "../../database/schema.ts";
import { checkRequestJWT } from "./hooks/check-request-jwt.ts";
import { eq } from "drizzle-orm";
import { getAuthenticatedUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts";
import { env } from "../../env.ts";

const google = createGoogleGenerativeAI({
  apiKey: env.GOOGLE_API_KEY,
});

const system = "You are a helpful financial assistant. You will receive a question about user's finance."

const basePrompt = `
  Use the financial tools you have access to answer the question as accurately and concisely as possible.
  Always format the dates for portuguese language
  Always answer in portuguese (Brazil)
  Always answer in markdown format.

  Current Date:
  {date}
  
  Question:
  {question}
`

export const askAiRoute: FastifyPluginAsyncZod  = async (server) => {
  server.post(
  '/ask-ai',
  {
    preHandler: [checkRequestJWT],
    schema: { 
      body: z.object({
        question: z.string()
      })
    } 
  },
  async (request, reply) => {
    const question = request.body.question
    
    const prompt = basePrompt
      .replace('{question}', question)
      .replace('{date}', new Date().toISOString())

    const user = getAuthenticatedUserFromRequest(request)

    const [{ tokens }] = await db
      .select({ tokens: users.tokens })
      .from(users)
      .where(eq(users.id, user.sub))

    if (tokens === 0) {
      return reply
        .status(200)
        .send({ message: 'you do not have any more tokens left' })
    }
    
    try {
      const result = streamObject({
        model: google('gemini-2.0-flash-001'),
        system,
        prompt,
        schema: z.object({
          answer: z.string()
        }),
        maxOutputTokens: tokens
      });

      result.usage
        .then(async res => {
          const newAmountOfTokens = res.outputTokens
            ? Math.max(0, tokens - res.outputTokens)
            : tokens
          
          if (newAmountOfTokens !== tokens) {
            await db
              .update(users)
              .set({ tokens: newAmountOfTokens })
              .where(eq(users.id, user.sub))
          }  
        })

        return reply
          .send(result.toTextStreamResponse({ status: 201 }))
    } catch {
      return reply
        .status(500)
        .send({ message: 'we could not finish the operation'});
    }
  }
)
}
