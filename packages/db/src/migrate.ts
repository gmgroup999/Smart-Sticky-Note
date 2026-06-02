import 'dotenv/config'
import { drizzle } from 'drizzle-orm/postgres-js'
import { migrate } from 'drizzle-orm/postgres-js/migrator'
import postgres from 'postgres'

const url = process.env.DATABASE_URL
if (!url) {
  console.error('DATABASE_URL is not set. Create packages/db/.env from .env.example.')
  process.exit(1)
}

const sql = postgres(url, { max: 1 })
const db  = drizzle(sql)

async function runMigrations() {
  console.log('Running migrations...')
  await migrate(db, { migrationsFolder: './src/migrations' })
  console.log('All migrations applied.')
  await sql.end()
}

runMigrations().catch((err) => {
  console.error('Migration failed:', err.message)
  process.exit(1)
})
