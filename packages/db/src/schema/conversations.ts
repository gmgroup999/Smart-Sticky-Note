import { pgTable, uuid, text, integer, timestamp, jsonb, pgEnum, index } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { workspaces } from './workspaces'
import { users } from './users'

export const conversationSourceEnum = pgEnum('conversation_source', [
  'chatgpt', 'claude', 'meeting_notes', 'voice_transcript', 'other',
])

export const conversations = pgTable('conversations', {
  id:          uuid('id').defaultRandom().primaryKey(),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  userId:      uuid('user_id').notNull().references(() => users.id),
  source:      conversationSourceEnum('source').notNull().default('other'),
  contextHint: text('context_hint'),
  rawText:     text('raw_text').notNull(),
  charCount:   integer('char_count'),
  createdAt:   timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  metadata:    jsonb('metadata').notNull().default(sql`'{}'`),
}, (t) => ({
  workspaceIdx: index('conversations_workspace_id_idx').on(t.workspaceId),
}))

export type Conversation    = typeof conversations.$inferSelect
export type NewConversation = typeof conversations.$inferInsert
