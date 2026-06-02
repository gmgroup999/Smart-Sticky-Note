import { pgTable, uuid, text, timestamp, index, customType } from 'drizzle-orm/pg-core'
import { notes } from './notes'

// pgvector column — stores 1536-dimension float arrays.
// Driver returns the vector as a string like "[0.1,0.2,...]"; we parse it to number[].
const pgVector = customType<{ data: number[]; driverData: string }>({
  dataType() {
    return 'vector(1536)'
  },
  toDriver(value: number[]): string {
    return `[${value.join(',')}]`
  },
  fromDriver(value: string): number[] {
    return value.slice(1, -1).split(',').map(Number)
  },
})

export const noteEmbeddings = pgTable('note_embeddings', {
  id:           uuid('id').defaultRandom().primaryKey(),
  noteId:       uuid('note_id').notNull().references(() => notes.id, { onDelete: 'cascade' }),
  embedding:    pgVector('embedding').notNull(),
  embeddedText: text('embedded_text').notNull(),
  model:        text('model').notNull().default('text-embedding-3-small'),
  createdAt:    timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
}, (t) => ({
  noteIdIdx: index('note_embeddings_note_id_idx').on(t.noteId),
}))

export type NoteEmbedding    = typeof noteEmbeddings.$inferSelect
export type NewNoteEmbedding = typeof noteEmbeddings.$inferInsert
