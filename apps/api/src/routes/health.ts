import type { FastifyInstance } from 'fastify'
import { sql, isNull } from 'drizzle-orm'
import { notes, users } from '@neo/db'

const START_TIME = Date.now()

export default async function healthRoutes(server: FastifyInstance) {
  server.get('/health', async () => ({
    status:    'ok',
    service:   'SmartStickyNote',
    timestamp: new Date().toISOString(),
  }))

  server.get('/stats', async () => {
    const [noteRow] = await server.db
      .select({ count: sql<number>`count(*)` })
      .from(notes)
      .where(isNull(notes.deletedAt))

    const [userRow] = await server.db
      .select({ count: sql<number>`count(*)` })
      .from(users)

    return {
      notes:   Number(noteRow?.count  ?? 0),
      users:   Number(userRow?.count  ?? 0),
      uptime:  Math.floor((Date.now() - START_TIME) / 1000),
      version: process.env.npm_package_version ?? '0.1.0',
    }
  })

  server.get('/export', async () => {
    const allNotes = await server.db.query.notes.findMany({
      where:   isNull(notes.deletedAt),
      orderBy: (n, { asc }) => [asc(n.createdAt)],
    })

    return {
      exportedAt: new Date().toISOString(),
      notes:      allNotes,
    }
  })
}
