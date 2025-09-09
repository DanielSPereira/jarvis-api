import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import { users } from "../../database/schema.ts"
import { db } from "../../database/client.ts"
import z from "zod"
import { eq } from "drizzle-orm"
import { sendEmail } from "../../services/send-email.ts"
import { createJWT } from "../../services/create-jwt.ts"
import { env } from "../../env.ts"

export const loginRoute: FastifyPluginAsyncZod  = async (server) => {
  server.post(
    '/sessions', 
    {
      schema: {
        tags: ['auth'],
        summary: 'Login',
        body: z.object({ email: z.email() }),
        response: {
          201: z.object({ message: z.string() }),
          401: z.object({ message: z.string() }),
          500: z.object({ message: z.string() }),
        }
      }
    }, 
    async (request, reply) => {    
      const { email } = request.body

      const result = await db
        .select()
        .from(users)
        .where(eq(users.email, email))

      if (result.length === 0) {
        return reply.status(401).send({ message: 'invalid credentials' })
      }

      const user = result[0]

      const token = createJWT({ sub: user.id })

      try {
        await sendEmail({
          from: env.SMTP_USER,
          to: user.email,
          subject: 'You authentication on Jarvis',
          content: token
        })
      } catch {
        return reply.status(500).send({ message: 'we could not finish the operation' })
      }
          
      return reply.status(201).send({ message: 'an authentication link was sent to your email' })
    }
  )
}