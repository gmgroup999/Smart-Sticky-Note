import { pgTable, uuid, text, timestamp, jsonb } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { workspaces } from './workspaces'

export const boards = pgTable('boards', {
  id:          uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  name:        text('name').notNull().default('Board'),
  createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  updatedAt:   timestamp('updated_at', { withTimezone: true }).notNull().defaultNow(),
  deletedAt:   timestamp('deleted_at', { withTimezone: true }),
  metadata:    jsonb('metadata').notNull().default(sql`'{}'`),
})

export type Board    = typeof boards.$inferSelect
export type NewBoard = typeof boards.$inferInsert
