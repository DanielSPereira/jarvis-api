import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { createStripeCustomer, stripe } from "../../services/stripe-client.ts"
import { checkRequestJWT } from "./hooks/check-request-jwt.ts"
import { getAuthenticatedDataBaseUserFromRequest } from "../../utils/get-authenticated-user-from-request.ts"
import { db } from "../../database/client.ts"
import { users } from "../../database/schema.ts"
import { eq } from "drizzle-orm"

export const createCheckoutRoute: FastifyPluginAsyncZod  = async (server) => {
  server.post(
    '/checkout', 
    {
      preHandler: [checkRequestJWT],
      schema: {
        tags: ['billing'],
        summary: 'Create a checkout session',
        body: z.object({
          priceId: z.string()
        }),
        response: {
          201: z.object({ url: z.string() }),
          500: z.object({ message: z.string() }),
        }
      },
    }, 
    async (request, reply) => {
      const priceId = request.body.priceId
      // 1 - create customer on stripe if not existent
      // and save the customer id
      const { email, name, id, stripeCustomerId } = await getAuthenticatedDataBaseUserFromRequest(request)
      
      const stripeCostumer = await createStripeCustomer({ email, name })

      if (!stripeCustomerId) {
        await db
          .update(users)
          .set({ stripeCustomerId: stripeCostumer.id })
          .where(eq(users.id, id));
      }

      // 2 - create the checkout session
      let checkoutSession;

      try {
        const price = await stripe.prices.retrieve(priceId)
  
        checkoutSession = await stripe.checkout.sessions.create({
          payment_method_types: ['card'],
          mode: 'payment',
          customer: stripeCostumer.id,
          currency: 'BRL',
          line_items: [
            {
              price: price.id,
              quantity: 1,
            },
          ],
          success_url: 'http://localhost:3333/success?session_id={CHECKOUT_SESSION_ID}',
          cancel_url: 'http://localhost:3333/cancel',
        });

        if (!checkoutSession.url) throw Error()
      } catch {
        return reply.status(500).send({ message: 'we could not finish the operation' });
      }

      return reply.status(201).send({ url: checkoutSession.url });
    }
  )
}