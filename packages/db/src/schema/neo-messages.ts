import { pgTable, uuid, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { workspaces } from './workspaces'
import { users } from './users'

export const neoMessages = pgTable('neo_messages', {
  id:          uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  userId:      uuid('user_id').notNull().references(() => users.id),
  role:        text('role').notNull(),
  content:     text('content').notNull(),
  citedNotes:  uuid('cited_notes').array(),
  createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  metadata:    jsonb('metadata').notNull().default(sql`'{}'`),
}, (t) => ({
  workspaceIdx: index('neo_messages_workspace_id_idx').on(t.workspaceId),
}))

export type NeoMessage    = typeof neoMessages.$inferSelect
export type NewNeoMessage = typeof neoMessages.$inferInsert
