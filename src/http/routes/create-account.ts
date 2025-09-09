import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { users } from "../../database/schema.ts"
import { db } from "../../database/client.ts"
import z from "zod"
import { eq } from "drizzle-orm"
import { createJWT } from "../../services/create-jwt.ts"
import { sendEmail } from "../../services/send-email.ts"
import { env } from "../../env.ts"

export const createAccountRoute: FastifyPluginAsyncZod  = async (server) => {
  server.post(
    '/accounts', 
    {
      schema: {
        tags: ['auth'],
        summary: 'Login',
        body: z.object({ 
          email: z.email(),
          name: z.string()
        }),
        response: {
          201: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
          409: z.object({ message: z.string() }),
        }
      }
    }, 
    async (request, reply) => {    
      const { email, name } = request.body
      
      const existentUser = await db
        .select()
        .from(users)
        .where(eq(users.email, email))

      if (existentUser.length > 0) {
        return reply.status(409).send({ message: 'account already exists' })
      }

      const result = await db
        .insert(users)
        .values({ email,  name })
        .returning()

      const newUser = result[0]

      const token = createJWT({ sub: newUser.id })

      try {
        await sendEmail({
          from: env.SMTP_USER,
          to: newUser.email,
          subject: 'You authentication on Jarvis',
          content: token
        })
      } catch {
        return reply.status(500).send({ message: 'we could not finish the operation. Try login' })
      }
          
      return reply.status(201).send({ message: 'an authentication link was sent to your email' })
    }
  )
}