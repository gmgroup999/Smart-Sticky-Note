import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'

export const users = pgTable('users', {
  id:          uuid('id').defaultRandom().primaryKey(),
  email:       text('email').notNull().unique(),
  displayName: text('display_name'),
  avatarUrl:   text('avatar_url'),
  createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:   timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt:   timestamp('deleted_at', { withTimezone: true }),
  metadata:    jsonb('metadata').notNull().default(sql`'{}'`),
})

export type User    = typeof users.$inferSelect
export type NewUser = typeof users.$inferInsert
