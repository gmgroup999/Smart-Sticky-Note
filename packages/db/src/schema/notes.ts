import { pgTable, uuid, text, real, timestamp, jsonb, pgEnum, index } from 'drizzle-orm/pg-core'
import { sql } from 'drizzle-orm'
import { boards } from './boards'
import { workspaces } from './workspaces'
import { users } from './users'

export const noteTypeEnum = pgEnum('note_type', [
  'idea', 'decision', 'goal', 'learning', 'task', 'insight', 'question',
])

export const notes = pgTable('notes', {
  id:          uuid('id').defaultRandom().primaryKey(),
  boardId:     uuid('board_id').notNull().references(() => boards.id),
  workspaceId: uuid('workspace_id').notNull().references(() => workspaces.id),
  userId:      uuid('user_id').notNull().references(() => users.id),
  noteType:    noteTypeEnum('note_type').notNull().default('idea'),
  title:       text('title').notNull(),
  summary:     text('summary'),
  details:     text('details'),
  tags:        text('tags').array().notNull().default(sql`'{}'`),
  posX:        real('pos_x').notNull().default(0),
  posY:        real('pos_y').notNull().default(0),
  width:       real('width').notNull().default(240),
  height:      real('height').notNull().default(160),
  rotation:    real('rotation').notNull().default(0),
  sourceType:  text('source_type'),
  sourceId:    uuid('source_id'),
  archivedAt:  timestamp('archived_at',  { withTimezone: true }),
  deletedAt:   timestamp('deleted_at',   { withTimezone: true }),
  createdAt:   timestamp('created_at',   { withTimezone: true }).notNull().defaultNow(),
  updatedAt:   timestamp('updated_at',   { withTimezone: true }).notNull().defaultNow(),
  metadata:    jsonb('metadata').notNull().default(sql`'{}'`),
}, (t) => ({
  boardIdx:  index('notes_board_id_idx').on(t.boardId),
  activeIdx: index('notes_active_idx').on(t.boardId).where(sql`deleted_at IS NULL`),
}))

export type Note    = typeof notes.$inferSelect
export type NewNote = typeof notes.$inferInsert
