import { defineConfig } from "drizzle-kit";
import { env } from "./src/env.ts";

export default defineConfig({
  out: './dizzle',
  dialect: 'postgresql',
  schema: './src/database/schema.ts',
  dbCredentials: {
    url: env.DATABASE_URL
  }
})