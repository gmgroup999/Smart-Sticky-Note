import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { users } from './users'

export const workspaces = pgTable('workspaces', {
  id:        uuid('id').defaultRandom().primaryKey(),
  ownerId:   uuid('owner_id').notNull().references(() => users.id),
  name:      text('name').notNull().default('My Second Brain'),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
  metadata:  jsonb('metadata').notNull().default(sql`'{}'`),
})

export type Workspace    = typeof workspaces.$inferSelect
export type NewWorkspace = typeof workspaces.$inferInsert
