import { timestamp, pgTable, text, uuid, integer } from 'drizzle-orm/pg-core'

export const users = pgTable('users', {
  id: uuid().primaryKey().defaultRandom(),
  name: text().notNull(),
  email: text().unique().notNull(),
  tokens: integer().notNull().default(0)
})
