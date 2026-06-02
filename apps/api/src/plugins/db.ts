import fp from 'fastify-plugin'
import { createDbClient, type DbClient } from '@neo/db'

declare module 'fastify' {
  interface FastifyInstance {
    db: DbClient
  }
}

export default fp(async (server) => {
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('DATABASE_URL is not set')

  const db = createDbClient(url)
  server.decorate('db', db)
})
