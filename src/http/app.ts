import { validatorCompiler, serializerCompiler, type ZodTypeProvider, jsonSchemaTransform } from "fastify-type-provider-zod";
import scalarApiReference from '@scalar/fastify-api-reference';
import fastifySwagger from "@fastify/swagger";
import { env } from "../env.ts";
import fastify from "fastify";
import { loginRoute } from "./routes/login.ts";
import { createAccountRoute } from "./routes/create-account.ts";
import { askAiRoute } from "./routes/ask-ai.ts";
import { stripeWebhookEventsRoute } from "./routes/stripe-webhook-events.ts";
import fastifyRawBody from "fastify-raw-body";
import { createCheckoutRoute } from "./routes/create-checkout.ts";

const server = fastify({ 
  logger: {
    transport: {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname'
      }
    }
  } 
}).withTypeProvider<ZodTypeProvider>()

server.register(fastifyRawBody, {
  field: 'rawBody',
  global: false,
  encoding: 'utf8',
  runFirst: true,
  routes: [],
  jsonContentTypes: [],
})


if (env.NODE_ENV === 'development') {
  server.register(fastifySwagger, {
    openapi: {
      info: {
        title: 'Jarvis',
        version: '1.0.0'
      },
    },
    transform: jsonSchemaTransform
  })
  
  server.register(scalarApiReference, {
    routePrefix: '/docs',
    configuration: { 
      theme: "deepSpace"
    }
  })
}
  

server.setValidatorCompiler(validatorCompiler)
server.setSerializerCompiler(serializerCompiler)

server.register(loginRoute)
server.register(createAccountRoute)
server.register(askAiRoute)
server.register(stripeWebhookEventsRoute)
server.register(createCheckoutRoute)


export { server }
