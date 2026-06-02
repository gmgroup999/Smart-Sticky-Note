import { pgTable, uuid, text, integer, real, timestamp, jsonb, pgEnum, index } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { conversations } from './conversations'
import { workspaces } from './workspaces'
import { notes } from './notes'
import { noteTypeEnum } from './notes'

export const extractionStatusEnum = pgEnum('extraction_status', [
  'pending', 'processing', 'preview', 'accepted', 'rejected', 'partial', 'failed',
])

export const extractionItemStatusEnum = pgEnum('extraction_item_status', [
  'pending', 'accepted', 'rejected', 'edited',
])

export const extractions = pgTable('extractions', {
  id:             uuid('id').defaultRandom().primaryKey(),
  conversationId: uuid('conversation_id').notNull().references(() => conversations.id),
  workspaceId:    uuid('workspace_id').notNull().references(() => workspaces.id),
  status:         extractionStatusEnum('status').notNull().default('pending'),
  model:          text('model'),
  promptVersion:  text('prompt_version'),
  rawResponse:    jsonb('raw_response'),
  extractedCount: integer('extracted_count').notNull().default(0),
  acceptedCount:  integer('accepted_count').notNull().default(0),
  processingMs:   integer('processing_ms'),
  errorMessage:   text('error_message'),
  createdAt:      timestamp('created_at',   { withTimezone: true }).notNull().defaultNow(),
  completedAt:    timestamp('completed_at', { withTimezone: true }),
  metadata:       jsonb('metadata').notNull().default(sql`'{}'`),
}, (t) => ({
  convIdx:      index('extractions_conversation_id_idx').on(t.conversationId),
  workspaceIdx: index('extractions_workspace_id_idx').on(t.workspaceId),
  statusIdx:    index('extractions_status_idx').on(t.status),
}))

export const extractionItems = pgTable('extraction_items', {
  id:              uuid('id').defaultRandom().primaryKey(),
  extractionId:    uuid('extraction_id').notNull().references(() => extractions.id),
  workspaceId:     uuid('workspace_id').notNull().references(() => workspaces.id),
  noteType:        noteTypeEnum('note_type').notNull(),
  title:           text('title').notNull(),
  summary:         text('summary'),
  details:         text('details'),
  tags:            text('tags').array().notNull().default(sql`'{}'`),
  confidence:      real('confidence'),
  reasoning:       text('reasoning'),
  status:          extractionItemStatusEnum('status').notNull().default('pending'),
  resultingNoteId: uuid('resulting_note_id').references(() => notes.id),
  createdAt:       timestamp('created_at',  { withTimezone: true }).notNull().defaultNow(),
  reviewedAt:      timestamp('reviewed_at', { withTimezone: true }),
  metadata:        jsonb('metadata').notNull().default(sql`'{}'`),
}, (t) => ({
  extractionIdx: index('extraction_items_extraction_id_idx').on(t.extractionId),
}))

export type Extraction       = typeof extractions.$inferSelect
export type NewExtraction    = typeof extractions.$inferInsert
export type ExtractionItem   = typeof extractionItems.$inferSelect
export type NewExtractionItem = typeof extractionItems.$inferInsert
