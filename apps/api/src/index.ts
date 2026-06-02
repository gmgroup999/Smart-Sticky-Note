import 'dotenv/config'
import Fastify from 'fastify'
import cors from '@fastify/cors'
import dbPlugin from './plugins/db'
import notesRoutes from './routes/notes'
import healthRoutes from './routes/health'

const server = Fastify({
  logger: { level: process.env.LOG_LEVEL ?? 'info' },
})

async function main() {
  process.on('uncaughtException', (err) => {
    server.log.error({ err }, 'Uncaught exception')
    process.exit(1)
  })

  process.on('unhandledRejection', (reason) => {
    server.log.error({ reason }, 'Unhandled rejection')
    process.exit(1)
  })

  await server.register(cors, { origin: process.env.CORS_ORIGIN ?? true })
  await server.register(dbPlugin)
  await server.register(notesRoutes)
  await server.register(healthRoutes)

  server.setErrorHandler((error, request, reply) => {
    server.log.error(
      { err: error, url: request.url, method: request.method },
      'Request error',
    )
    reply.code(error.statusCode ?? 500).send({
      error: error.message ?? 'Internal server error',
    })
  })

  const port = Number(process.env.PORT ?? 5011)
  const host = process.env.HOST ?? '127.0.0.1'

  await server.listen({ port, host })
  server.log.info(
    { port, host, env: process.env.NODE_ENV },
    'SmartStickyNote API started',
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
