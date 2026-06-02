import { pgTable, uuid, text, timestamp, jsonb, pgEnum, index } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { notes } from './notes'
import { workspaces } from './workspaces'

export const relationshipTypeEnum = pgEnum('relationship_type', [
  'supports', 'contradicts', 'leads_to',
  'depends_on', 'related_to', 'resulted_in', 'part_of',
])

export const noteRelationships = pgTable('note_relationships', {
  id:           uuid('id').defaultRandom().primaryKey(),
  workspaceId:  uuid('workspace_id').notNull().references(() => workspaces.id),
  sourceNoteId: uuid('source_note_id').notNull().references(() => notes.id),
  targetNoteId: uuid('target_note_id').notNull().references(() => notes.id),
  relType:      relationshipTypeEnum('rel_type').notNull().default('related_to'),
  createdBy:    text('created_by').notNull().default('user'),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  metadata:     jsonb('metadata').notNull().default(sql`'{}'`),
}, (t) => ({
  sourceIdx: index('note_relationships_source_idx').on(t.sourceNoteId),
  targetIdx: index('note_relationships_target_idx').on(t.targetNoteId),
}))

export type NoteRelationship    = typeof noteRelationships.$inferSelect
export type NewNoteRelationship = typeof noteRelationships.$inferInsert
