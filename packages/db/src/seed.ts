import 'dotenv/config'
import { createDbClient } from './client'
import * as schema from './schema'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set. Create packages/db/.env from .env.example.')
  process.exit(1)
}

const db = createDbClient(url)

async function seed() {
  console.log('Seeding database...')

  const [user] = await db.insert(schema.users).values({
    email:       'dev@neo.app',
    displayName: 'Dev User',
  }).returning()

  console.log('Created user:', user.id)

  const [workspace] = await db.insert(schema.workspaces).values({
    ownerId: user.id,
    name:    'Dev Second Brain',
  }).returning()

  console.log('Created workspace:', workspace.id)

  const [board] = await db.insert(schema.boards).values({
    workspaceId: workspace.id,
    name:        'Board',
  }).returning()

  console.log('Created board:', board.id)
  console.log('Seed complete.')
  process.exit(0)
}

seed().catch((err) => {
  console.error('Seed failed:', err.message)
  process.exit(1)
})
