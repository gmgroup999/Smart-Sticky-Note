import { pgTable, uuid, text, timestamp, jsonb, index } from 'drizzle-orm/pg-core'
import { notes } from './notes'
import { users } from './users'

export const noteEvents = pgTable('note_events', {
  id:         uuid('id').defaultRandom().primaryKey(),
  noteId:     uuid('note_id').notNull().references(() => notes.id),
  userId:     uuid('user_id').notNull().references(() => users.id),
  eventType:  text('event_type').notNull(),
  beforeData: jsonb('before_data'),
  afterData:  jsonb('after_data'),
  createdAt:  timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  noteIdx: index('note_events_note_id_idx').on(t.noteId),
}))

export type NoteEvent    = typeof noteEvents.$inferSelect
export type NewNoteEvent = typeof noteEvents.$inferInsert
