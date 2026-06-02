import type { FastifyInstance } from 'fastify'
import { eq, and, isNull } from 'drizzle-orm'
import { notes } from '@neo/db'
import type { CreateNoteBody, UpdateNoteBody } from '@neo/types'

export default async function notesRoutes(server: FastifyInstance) {
  const BOARD_ID    = process.env.BOARD_ID!
  const WORKSPACE_ID = process.env.WORKSPACE_ID!
  const USER_ID     = process.env.USER_ID!

  // GET /notes — all active notes for the board
  server.get('/notes', async () => {
    return server.db.query.notes.findMany({
      where: and(
        eq(notes.boardId, BOARD_ID),
        isNull(notes.deletedAt),
      ),
      orderBy: (n, { asc }) => [asc(n.createdAt)],
    })
  })

  // POST /notes — create a new note
  server.post<{ Body: CreateNoteBody }>('/notes', async (request, reply) => {
    const { title, noteType = 'idea', posX = 0, posY = 0 } = request.body

    const [note] = await server.db.insert(notes).values({
      boardId:     BOARD_ID,
      workspaceId: WORKSPACE_ID,
      userId:      USER_ID,
      noteType,
      title,
      posX,
      posY,
    }).returning()

    reply.code(201)
    return note
  })

  // PATCH /notes/:id — update title, position, content
  server.patch<{ Params: { id: string }; Body: UpdateNoteBody }>(
    '/notes/:id',
    async (request, reply) => {
      const { id } = request.params
      const body = request.body

      const [note] = await server.db
        .update(notes)
        .set({ ...body, updatedAt: new Date() })
        .where(and(eq(notes.id, id), eq(notes.boardId, BOARD_ID)))
        .returning()

      if (!note) {
        reply.code(404)
        return { error: 'Note not found' }
      }
      return note
    },
  )

  // DELETE /notes/:id — soft delete
  server.delete<{ Params: { id: string } }>(
    '/notes/:id',
    async (request, reply) => {
      const { id } = request.params

      await server.db
        .update(notes)
        .set({ deletedAt: new Date() })
        .where(and(eq(notes.id, id), eq(notes.boardId, BOARD_ID)))

      reply.code(204)
    },
  )
}
