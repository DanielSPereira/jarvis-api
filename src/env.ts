import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['development', 'production', 'test']),
  JWT_SECRET: z.string(),
  SMTP_PASS: z.string(),
  SMTP_USER: z.string(),
  DATABASE_URL: z.string(),
  GOOGLE_API_KEY: z.string()
})

export const env = envSchema.parse(process.env)