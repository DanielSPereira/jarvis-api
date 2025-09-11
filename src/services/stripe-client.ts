import Stripe from "stripe";
import { env } from "../env.ts";

export const stripe = new Stripe(env.STRIPE_SECRET_KEY)

export async function getCustomerByEmail(email: string) {
  const customers = await stripe.customers.list({ email })
  return customers.data[0]

}

export async function createStripeCustomer({ email, name }: { email: string, name?: string }) {
  const customer = await getCustomerByEmail(email)
  if (customer) return customer
  return await stripe.customers.create({ email, name })
}