import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod"
import z from "zod"
import { env } from "../../env.ts"
import Stripe from 'stripe'
import { stripe } from "../../services/stripe-client.ts"
import { db } from "../../database/client.ts"
import { users } from "../../database/schema.ts"
import { eq } from "drizzle-orm"

const tokensPerPrice = {
  // in cents: 100 = R$ 10
  1000: 30000
}

export const stripeWebhookEventsRoute: FastifyPluginAsyncZod  = async (server) => {
  server.post(
    '/stripe-webhook-events', 
    {
      config: { rawBody: true },
      schema: {
        tags: ['webhooks'],
        summary: 'Handle stripe webhook events from stripe',
        response: {
          201: z.object({ received: z.boolean() }),
          404: z.void(),
          401: z.object({ message: z.string() }),
        }
      },
    }, 
    async (request, reply) => {      
      let event: Stripe.Event;
      
      try {
        event = stripe.webhooks.constructEvent(
          request.rawBody as string, 
          request.headers['stripe-signature'] as string,
          env.STRIPE_WEBHOOK_SIGNATURE_SECRET
        )
      } catch (err) {
        return reply.status(401).send()
      }

      // Handle the event
      switch (event.type) {
        case 'checkout.session.completed':
          const checkout = event.data.object;
          if (checkout.customer_details?.email && checkout.amount_subtotal) {
            await db
              .update(users)
              .set({ tokens: tokensPerPrice[checkout.amount_subtotal as keyof typeof tokensPerPrice] })
              .where(eq(users.email, checkout.customer_details?.email))
          }
          break;
        default:
          return reply.status(404).send()
      }
      
      return reply.status(201)
    }
  )
}