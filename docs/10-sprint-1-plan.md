# Sprint 0 + Sprint 1 — Implementation Plan

> Technical Lead review of `docs/09-mvp-blueprint.md`.
> Covers Days 1–7 only. No features beyond blueprint scope.

---

## Scope Boundary

**In this plan:** Sprint 0 (Days 1–3): monorepo, database, auth. Sprint 1 (Days 4–7): board canvas, NoteCard, CRUD, detail panel.

**Not in this plan (future sprints):** Import/extraction (Sprint 2), Search/embeddings (Sprint 3), NEO Chat (Sprint 4). Those tables exist in migrations but no code touches them yet.

---

## File Tree

```
neo-second-brain/
├── package.json                          ← pnpm workspace root
├── pnpm-workspace.yaml
├── turbo.json
├── tsconfig.base.json
│
├── packages/
│   ├── db/
│   │   ├── src/
│   │   │   ├── schema/
│   │   │   │   ├── index.ts
│   │   │   │   ├── users.ts
│   │   │   │   ├── workspaces.ts
│   │   │   │   ├── boards.ts
│   │   │   │   ├── notes.ts
│   │   │   │   ├── note-events.ts
│   │   │   │   ├── note-embeddings.ts
│   │   │   │   ├── note-relationships.ts
│   │   │   │   ├── conversations.ts
│   │   │   │   ├── extractions.ts
│   │   │   │   └── neo-messages.ts
│   │   │   ├── migrations/
│   │   │   │   ├── 0001_extensions.sql
│   │   │   │   ├── 0002_users_workspaces_boards.sql
│   │   │   │   ├── 0003_notes.sql
│   │   │   │   ├── 0004_note_embeddings_relationships.sql
│   │   │   │   ├── 0005_conversations_extractions.sql
│   │   │   │   └── 0006_neo_messages.sql
│   │   │   ├── seed.ts
│   │   │   └── client.ts
│   │   ├── drizzle.config.ts
│   │   └── package.json
│   │
│   └── types/
│       ├── src/index.ts
│       └── package.json
│
└── apps/
    ├── api/
    │   ├── src/
    │   │   ├── index.ts
    │   │   ├── plugins/
    │   │   │   ├── auth.ts
    │   │   │   └── db.ts
    │   │   ├── routes/
    │   │   │   ├── index.ts
    │   │   │   ├── auth.ts
    │   │   │   ├── boards.ts
    │   │   │   └── notes.ts
    │   │   └── lib/errors.ts
    │   ├── .env.example
    │   ├── tsconfig.json
    │   └── package.json
    │
    └── web/
        ├── app/
        │   ├── layout.tsx
        │   ├── globals.css
        │   ├── (auth)/
        │   │   ├── login/page.tsx
        │   │   └── signup/page.tsx
        │   └── board/
        │       ├── page.tsx            ← server component (auth check)
        │       └── BoardPageClient.tsx ← client component (data load)
        ├── components/
        │   ├── board/
        │   │   ├── BoardCanvas.tsx
        │   │   ├── NoteCard.tsx
        │   │   ├── NoteDetailPanel.tsx
        │   │   └── CreateNoteOverlay.tsx
        │   └── ui/
        │       └── Button.tsx
        ├── stores/
        │   └── board.store.ts
        ├── hooks/
        │   ├── usePanZoom.ts
        │   └── useNotePosition.ts
        ├── lib/
        │   ├── api-client.ts
        │   ├── note-config.ts
        │   ├── rotation.ts
        │   └── supabase.ts
        ├── middleware.ts
        ├── next.config.ts
        ├── tailwind.config.ts
        ├── tsconfig.json
        └── package.json
```

---

## Sprint 0 — Foundation (Days 1–3)

### Day 1: Monorepo Config

**`package.json` (root)**
```json
{
  "name": "neo-second-brain",
  "private": true,
  "scripts": {
    "dev": "turbo run dev",
    "build": "turbo run build",
    "db:migrate": "pnpm --filter @neo/db migrate",
    "db:seed": "pnpm --filter @neo/db seed"
  },
  "devDependencies": {
    "turbo": "^2.0.0",
    "typescript": "^5.4.0",
    "@types/node": "^20.0.0",
    "eslint": "^8.57.0",
    "prettier": "^3.2.0"
  }
}
```

**`pnpm-workspace.yaml`**
```yaml
packages:
  - "apps/*"
  - "packages/*"
```

**`turbo.json`**
```json
{
  "$schema": "https://turbo.build/schema.json",
  "tasks": {
    "dev":   { "cache": false, "persistent": true },
    "build": { "dependsOn": ["^build"], "outputs": [".next/**", "dist/**"] }
  }
}
```

**`tsconfig.base.json`**
```json
{
  "compilerOptions": {
    "strict": true,
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}
```

**`packages/db/package.json`**
```json
{
  "name": "@neo/db",
  "version": "0.0.1",
  "scripts": {
    "migrate": "drizzle-kit migrate",
    "seed":    "tsx src/seed.ts"
  },
  "dependencies": {
    "drizzle-orm": "^0.30.0",
    "postgres":    "^3.4.0"
  },
  "devDependencies": {
    "drizzle-kit": "^0.21.0",
    "tsx":         "^4.7.0"
  }
}
```

**`packages/types/package.json`**
```json
{
  "name": "@neo/types",
  "version": "0.0.1",
  "exports": { ".": "./src/index.ts" }
}
```

---

### Day 2: Database Migrations

All 6 migrations run on Day 2. Every table exists from the start — no migrations needed in later sprints.

**`packages/db/src/migrations/0001_extensions.sql`**
```sql
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "vector";
```

**`packages/db/src/migrations/0002_users_workspaces_boards.sql`**
```sql
CREATE TABLE users (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email         text UNIQUE NOT NULL,
  display_name  text,
  avatar_url    text,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  deleted_at    timestamptz,
  metadata      jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE workspaces (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      uuid NOT NULL REFERENCES users(id),
  name          text NOT NULL DEFAULT 'My Second Brain',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  deleted_at    timestamptz,
  metadata      jsonb NOT NULL DEFAULT '{}'
);

CREATE TABLE boards (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  uuid NOT NULL REFERENCES workspaces(id),
  name          text NOT NULL DEFAULT 'Board',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  deleted_at    timestamptz,
  metadata      jsonb NOT NULL DEFAULT '{}'
);
```

**`packages/db/src/migrations/0003_notes.sql`**
```sql
CREATE TYPE note_type AS ENUM (
  'idea', 'decision', 'goal', 'learning', 'task', 'insight', 'question'
);

CREATE TABLE notes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id      uuid NOT NULL REFERENCES boards(id),
  workspace_id  uuid NOT NULL REFERENCES workspaces(id),
  user_id       uuid NOT NULL REFERENCES users(id),
  note_type     note_type NOT NULL DEFAULT 'idea',
  title         text NOT NULL,
  summary       text,
  details       text,
  tags          text[] NOT NULL DEFAULT '{}',
  pos_x         float NOT NULL DEFAULT 0,
  pos_y         float NOT NULL DEFAULT 0,
  width         float NOT NULL DEFAULT 240,
  height        float NOT NULL DEFAULT 160,
  rotation      float NOT NULL DEFAULT 0,
  source_type   text,
  source_id     uuid,
  archived_at   timestamptz,
  deleted_at    timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  metadata      jsonb NOT NULL DEFAULT '{}'
);

CREATE INDEX notes_board_id_idx     ON notes(board_id);
CREATE INDEX notes_workspace_id_idx ON notes(workspace_id);
CREATE INDEX notes_tags_idx         ON notes USING GIN(tags);
CREATE INDEX notes_note_type_idx    ON notes(note_type);
CREATE INDEX notes_active_idx       ON notes(board_id) WHERE deleted_at IS NULL;
CREATE INDEX notes_fts_idx ON notes USING GIN(
  to_tsvector('english',
    coalesce(title,'') || ' ' || coalesce(summary,'') || ' ' || coalesce(details,'')
  )
);

CREATE TABLE note_events (
  id          uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id     uuid NOT NULL REFERENCES notes(id),
  user_id     uuid NOT NULL REFERENCES users(id),
  event_type  text NOT NULL,
  before_data jsonb,
  after_data  jsonb,
  created_at  timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX note_events_note_id_idx ON note_events(note_id);
```

**`packages/db/src/migrations/0004_note_embeddings_relationships.sql`**
```sql
CREATE TYPE relationship_type AS ENUM (
  'supports', 'contradicts', 'leads_to',
  'depends_on', 'related_to', 'resulted_in', 'part_of'
);

CREATE TABLE note_embeddings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id       uuid NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  embedding     vector(1536) NOT NULL,
  embedded_text text NOT NULL,
  model         text NOT NULL DEFAULT 'text-embedding-3-small',
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX note_embeddings_note_id_idx ON note_embeddings(note_id);
CREATE INDEX note_embeddings_vector_idx
  ON note_embeddings USING ivfflat (embedding vector_cosine_ops)
  WITH (lists = 100);

CREATE TABLE note_relationships (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id    uuid NOT NULL REFERENCES workspaces(id),
  source_note_id  uuid NOT NULL REFERENCES notes(id),
  target_note_id  uuid NOT NULL REFERENCES notes(id),
  rel_type        relationship_type NOT NULL DEFAULT 'related_to',
  created_by      text NOT NULL DEFAULT 'user',
  created_at      timestamptz NOT NULL DEFAULT now(),
  metadata        jsonb NOT NULL DEFAULT '{}',
  CONSTRAINT no_self_reference CHECK (source_note_id <> target_note_id)
);

CREATE INDEX note_relationships_source_idx ON note_relationships(source_note_id);
CREATE INDEX note_relationships_target_idx ON note_relationships(target_note_id);
```

**`packages/db/src/migrations/0005_conversations_extractions.sql`**
```sql
CREATE TYPE conversation_source AS ENUM (
  'chatgpt', 'claude', 'meeting_notes', 'voice_transcript', 'other'
);

CREATE TABLE conversations (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  uuid NOT NULL REFERENCES workspaces(id),
  user_id       uuid NOT NULL REFERENCES users(id),
  source        conversation_source NOT NULL DEFAULT 'other',
  context_hint  text,
  raw_text      text NOT NULL,
  char_count    int,
  created_at    timestamptz NOT NULL DEFAULT now(),
  metadata      jsonb NOT NULL DEFAULT '{}'
);

CREATE INDEX conversations_workspace_id_idx ON conversations(workspace_id);

CREATE TYPE extraction_status AS ENUM (
  'pending', 'processing', 'preview', 'accepted', 'rejected', 'partial', 'failed'
);

CREATE TYPE extraction_item_status AS ENUM (
  'pending', 'accepted', 'rejected', 'edited'
);

CREATE TABLE extractions (
  id              uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid NOT NULL REFERENCES conversations(id),
  workspace_id    uuid NOT NULL REFERENCES workspaces(id),
  status          extraction_status NOT NULL DEFAULT 'pending',
  model           text,
  prompt_version  text,
  raw_response    jsonb,
  extracted_count int NOT NULL DEFAULT 0,
  accepted_count  int NOT NULL DEFAULT 0,
  processing_ms   int,
  error_message   text,
  created_at      timestamptz NOT NULL DEFAULT now(),
  completed_at    timestamptz,
  metadata        jsonb NOT NULL DEFAULT '{}'
);

CREATE INDEX extractions_conversation_id_idx ON extractions(conversation_id);
CREATE INDEX extractions_workspace_id_idx    ON extractions(workspace_id);
CREATE INDEX extractions_status_idx          ON extractions(status);

CREATE TABLE extraction_items (
  id                uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  extraction_id     uuid NOT NULL REFERENCES extractions(id),
  workspace_id      uuid NOT NULL REFERENCES workspaces(id),
  note_type         note_type NOT NULL,
  title             text NOT NULL,
  summary           text,
  details           text,
  tags              text[] NOT NULL DEFAULT '{}',
  confidence        float,
  reasoning         text,
  status            extraction_item_status NOT NULL DEFAULT 'pending',
  resulting_note_id uuid REFERENCES notes(id),
  created_at        timestamptz NOT NULL DEFAULT now(),
  reviewed_at       timestamptz,
  metadata          jsonb NOT NULL DEFAULT '{}'
);

CREATE INDEX extraction_items_extraction_id_idx ON extraction_items(extraction_id);
```

**`packages/db/src/migrations/0006_neo_messages.sql`**
```sql
CREATE TABLE neo_messages (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  uuid NOT NULL REFERENCES workspaces(id),
  user_id       uuid NOT NULL REFERENCES users(id),
  role          text NOT NULL,
  content       text NOT NULL,
  cited_notes   uuid[],
  created_at    timestamptz NOT NULL DEFAULT now(),
  metadata      jsonb NOT NULL DEFAULT '{}'
);

CREATE INDEX neo_messages_workspace_id_idx ON neo_messages(workspace_id);
```

---

#### Drizzle Schema (key files only — repeat pattern for others)

**`packages/db/src/schema/notes.ts`**
```typescript
import { pgTable, uuid, text, real, timestamptz, jsonb, pgEnum, index } from 'drizzle-orm/pg-core'
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
  archivedAt:  timestamptz('archived_at'),
  deletedAt:   timestamptz('deleted_at'),
  createdAt:   timestamptz('created_at').notNull().defaultNow(),
  updatedAt:   timestamptz('updated_at').notNull().defaultNow(),
  metadata:    jsonb('metadata').notNull().default(sql`'{}'`),
}, (t) => ({
  boardIdx:  index('notes_board_id_idx').on(t.boardId),
  activeIdx: index('notes_active_idx').on(t.boardId).where(sql`deleted_at IS NULL`),
}))

export type Note    = typeof notes.$inferSelect
export type NewNote = typeof notes.$inferInsert
```

**`packages/db/src/schema/index.ts`**
```typescript
export * from './users'
export * from './workspaces'
export * from './boards'
export * from './notes'
export * from './note-events'
export * from './note-embeddings'
export * from './note-relationships'
export * from './conversations'
export * from './extractions'
export * from './neo-messages'
```

**`packages/db/src/client.ts`**
```typescript
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

export function createDbClient(connectionString: string) {
  const sql = postgres(connectionString, { max: 10 })
  return drizzle(sql, { schema })
}

export type DbClient = ReturnType<typeof createDbClient>
```

**`packages/db/src/seed.ts`**
```typescript
import { createDbClient } from './client'
import * as schema from './schema'

async function seed() {
  const db = createDbClient(process.env.DATABASE_URL!)

  const [user] = await db.insert(schema.users).values({
    email:       'dev@neo.app',
    displayName: 'Dev User',
  }).returning()

  const [workspace] = await db.insert(schema.workspaces).values({
    ownerId: user.id,
    name:    'Dev Second Brain',
  }).returning()

  await db.insert(schema.boards).values({
    workspaceId: workspace.id,
    name:        'Board',
  })

  console.log('Seed complete:', { userId: user.id, workspaceId: workspace.id })
  process.exit(0)
}

seed()
```

**`packages/db/drizzle.config.ts`**
```typescript
import { defineConfig } from 'drizzle-kit'

export default defineConfig({
  schema:      './src/schema/index.ts',
  out:         './src/migrations',
  dialect:     'postgresql',
  dbCredentials: { url: process.env.DATABASE_URL! },
})
```

---

### Day 3: Auth + Bootstrap

**`packages/types/src/index.ts`**
```typescript
export type NoteType =
  | 'idea' | 'decision' | 'goal' | 'learning'
  | 'task' | 'insight'  | 'question'

export interface Note {
  id:          string
  boardId:     string
  workspaceId: string
  userId:      string
  noteType:    NoteType
  title:       string
  summary:     string | null
  details:     string | null
  tags:        string[]
  posX:        number
  posY:        number
  width:       number
  height:      number
  rotation:    number
  sourceType:  string | null
  sourceId:    string | null
  createdAt:   string
  updatedAt:   string
  metadata:    Record<string, unknown>
}

export interface CreateNoteBody {
  noteType:  NoteType
  title:     string
  summary?:  string
  details?:  string
  tags?:     string[]
  posX:      number
  posY:      number
}

export interface UpdateNoteBody {
  noteType?:  NoteType
  title?:     string
  summary?:   string
  details?:   string
  tags?:      string[]
  posX?:      number
  posY?:      number
}
```

**`apps/api/src/index.ts`**
```typescript
import Fastify from 'fastify'
import { createDbClient } from '@neo/db'
import authPlugin from './plugins/auth'
import dbPlugin   from './plugins/db'
import authRoutes  from './routes/auth'
import boardRoutes from './routes/boards'
import noteRoutes  from './routes/notes'

const app = Fastify({ logger: true })

// Skip auth check for bootstrap route
app.addHook('preHandler', async (request) => {
  if ((request.routeOptions?.config as any)?.skipAuth) return
})

await app.register(dbPlugin)
await app.register(authPlugin)

await app.register(authRoutes,  { prefix: '/v1' })
await app.register(boardRoutes, { prefix: '/v1' })
await app.register(noteRoutes,  { prefix: '/v1' })

await app.listen({ port: Number(process.env.PORT ?? 3001), host: '0.0.0.0' })
```

**`apps/api/src/plugins/db.ts`**
```typescript
import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { createDbClient, type DbClient } from '@neo/db'

declare module 'fastify' {
  interface FastifyInstance { db: DbClient }
}

const dbPlugin: FastifyPluginAsync = async (fastify) => {
  fastify.decorate('db', createDbClient(process.env.DATABASE_URL!))
}

export default fp(dbPlugin)
```

**`apps/api/src/plugins/auth.ts`**
```typescript
import fp from 'fastify-plugin'
import type { FastifyPluginAsync } from 'fastify'
import { createClient } from '@supabase/supabase-js'
import { eq } from 'drizzle-orm'
import { users, workspaces, boards } from '@neo/db'

declare module 'fastify' {
  interface FastifyRequest {
    userId:      string
    workspaceId: string
    boardId:     string
  }
}

const authPlugin: FastifyPluginAsync = async (fastify) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  fastify.addHook('preHandler', async (request, reply) => {
    if ((request.routeOptions?.config as any)?.skipAuth) return

    const token = request.headers.authorization?.slice(7)
    if (!token) return reply.code(401).send({ error: 'Missing token' })

    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user) return reply.code(401).send({ error: 'Invalid token' })

    const [dbUser] = await fastify.db
      .select().from(users).where(eq(users.email, user.email!)).limit(1)
    if (!dbUser) return reply.code(401).send({ error: 'User not bootstrapped' })

    const [workspace] = await fastify.db
      .select().from(workspaces).where(eq(workspaces.ownerId, dbUser.id)).limit(1)

    const [board] = await fastify.db
      .select().from(boards).where(eq(boards.workspaceId, workspace.id)).limit(1)

    request.userId      = dbUser.id
    request.workspaceId = workspace.id
    request.boardId     = board.id
  })
}

export default fp(authPlugin)
```

**`apps/api/src/routes/auth.ts`**
```typescript
import type { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import { createClient } from '@supabase/supabase-js'
import { eq } from 'drizzle-orm'
import { users, workspaces, boards } from '@neo/db'

const authRoutes: FastifyPluginAsync = async (fastify) => {
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
  )

  fastify.post('/auth/bootstrap', {
    schema: { body: Type.Object({ token: Type.String() }) },
    config: { skipAuth: true },
  }, async (request, reply) => {
    const { token } = request.body as { token: string }
    const { data: { user }, error } = await supabase.auth.getUser(token)
    if (error || !user?.email) return reply.code(401).send({ error: 'Invalid token' })

    const existing = await fastify.db
      .select().from(users).where(eq(users.email, user.email)).limit(1)

    if (existing.length > 0) {
      const dbUser = existing[0]
      const [workspace] = await fastify.db
        .select().from(workspaces).where(eq(workspaces.ownerId, dbUser.id)).limit(1)
      const [board] = await fastify.db
        .select().from(boards).where(eq(boards.workspaceId, workspace.id)).limit(1)
      return { user: dbUser, workspace, board }
    }

    return fastify.db.transaction(async (tx) => {
      const [newUser] = await tx.insert(users).values({
        email:       user.email!,
        displayName: user.user_metadata?.full_name ?? user.email!.split('@')[0],
        avatarUrl:   user.user_metadata?.avatar_url,
      }).returning()

      const [workspace] = await tx.insert(workspaces).values({
        ownerId: newUser.id,
        name:    'My Second Brain',
      }).returning()

      const [board] = await tx.insert(boards).values({
        workspaceId: workspace.id,
        name:        'Board',
      }).returning()

      return { user: newUser, workspace, board }
    })
  })
}

export default authRoutes
```

**`apps/web/lib/supabase.ts`**
```typescript
import { createBrowserClient } from '@supabase/ssr'

export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
)
```

**`apps/web/middleware.ts`**
```typescript
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  const response = NextResponse.next()
  const supabase  = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => request.cookies.getAll(),
        setAll: (cookies) => cookies.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)),
      },
    },
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user && request.nextUrl.pathname.startsWith('/board')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }
  return response
}

export const config = { matcher: ['/board/:path*'] }
```

**`apps/web/app/(auth)/login/page.tsx`**
```typescript
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { apiClient } from '@/lib/api-client'

export default function LoginPage() {
  const router = useRouter()
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [error,    setError]    = useState<string | null>(null)
  const [loading,  setLoading]  = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError(null)

    const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
    if (authError) { setError(authError.message); setLoading(false); return }

    await apiClient.post('/auth/bootstrap', { token: data.session!.access_token })
    router.push('/board')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F4EFE8]">
      <form onSubmit={handleSubmit} className="w-80 space-y-4">
        <h1 className="text-2xl font-semibold text-[#1C1B2E]">NEO</h1>
        <p className="text-sm text-gray-500">Sign in to your Second Brain</p>
        {error && <p className="text-sm text-red-500">{error}</p>}
        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
        <input type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
          className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm" required />
        <button type="submit" disabled={loading}
          className="w-full py-2 bg-[#6C63FF] text-white rounded-lg text-sm font-medium disabled:opacity-50">
          {loading ? 'Signing in…' : 'Sign in'}
        </button>
        <p className="text-xs text-center text-gray-500">
          No account? <a href="/signup" className="text-[#6C63FF]">Sign up</a>
        </p>
      </form>
    </div>
  )
}
```

**`apps/web/lib/api-client.ts`**
```typescript
import { supabase } from './supabase'

const BASE_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001/v1'

async function getToken() {
  const { data } = await supabase.auth.getSession()
  return data.session?.access_token ?? null
}

async function request<T>(method: string, path: string, body?: unknown): Promise<T> {
  const token = await getToken()
  const res   = await fetch(`${BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type':  'application/json',
      'Authorization': token ? `Bearer ${token}` : '',
    },
    body: body ? JSON.stringify(body) : undefined,
  })
  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }))
    throw new Error(err.error ?? 'Request failed')
  }
  if (res.status === 204) return undefined as T
  return res.json()
}

export const apiClient = {
  get:    <T>(path: string)                 => request<T>('GET',    path),
  post:   <T>(path: string, body?: unknown) => request<T>('POST',   path, body),
  patch:  <T>(path: string, body?: unknown) => request<T>('PATCH',  path, body),
  delete: <T>(path: string)                 => request<T>('DELETE', path),
}
```

---

## Sprint 1 — Board + Manual Notes (Days 4–7)

### Day 4: Board Canvas + Pan/Zoom

**`apps/web/stores/board.store.ts`**
```typescript
import { create } from 'zustand'
import type { Note } from '@neo/types'

interface BoardStore {
  boardId:        string | null
  notes:          Note[]
  pan:            { x: number; y: number }
  zoom:           number
  selectedNoteId: string | null
  isPanning:      boolean

  setBoardId:   (id: string) => void
  setNotes:     (notes: Note[]) => void
  addNote:      (note: Note) => void
  updateNote:   (id: string, updates: Partial<Note>) => void
  removeNote:   (id: string) => void
  setPan:       (pan: { x: number; y: number }) => void
  setZoom:      (zoom: number) => void
  selectNote:   (id: string | null) => void
  setIsPanning: (v: boolean) => void
}

export const useBoardStore = create<BoardStore>((set) => ({
  boardId:        null,
  notes:          [],
  pan:            { x: 0, y: 0 },
  zoom:           1,
  selectedNoteId: null,
  isPanning:      false,

  setBoardId:   (id) => set({ boardId: id }),
  setNotes:     (notes) => set({ notes }),
  addNote:      (note) => set(s => ({ notes: [...s.notes, note] })),
  updateNote:   (id, updates) => set(s => ({
    notes: s.notes.map(n => n.id === id ? { ...n, ...updates } : n),
  })),
  removeNote:   (id) => set(s => ({ notes: s.notes.filter(n => n.id !== id) })),
  setPan:       (pan) => set({ pan }),
  setZoom:      (zoom) => set({ zoom }),
  selectNote:   (id) => set({ selectedNoteId: id }),
  setIsPanning: (v) => set({ isPanning: v }),
}))
```

**`apps/web/hooks/usePanZoom.ts`**
```typescript
import { useEffect, useRef } from 'react'
import { useBoardStore } from '@/stores/board.store'

const ZOOM_MIN   = 0.2
const ZOOM_MAX   = 3.0
const ZOOM_SPEED = 0.001

export function usePanZoom(containerRef: React.RefObject<HTMLElement>) {
  const setPan      = useBoardStore(s => s.setPan)
  const setZoom     = useBoardStore(s => s.setZoom)
  const setIsPanning = useBoardStore(s => s.setIsPanning)

  const isSpaceDown = useRef(false)
  const isPanning   = useRef(false)
  const panStart    = useRef({ mouseX: 0, mouseY: 0, panX: 0, panY: 0 })

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    function onWheel(e: WheelEvent) {
      e.preventDefault()
      const current = useBoardStore.getState().zoom
      const delta   = -e.deltaY * ZOOM_SPEED
      setZoom(Math.min(ZOOM_MAX, Math.max(ZOOM_MIN, current + current * delta)))
    }

    function onKeyDown(e: KeyboardEvent) {
      if (e.code === 'Space' && !e.repeat) { isSpaceDown.current = true; e.preventDefault() }
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.code === 'Space') isSpaceDown.current = false
    }

    function onMouseDown(e: MouseEvent) {
      if (e.button === 1 || isSpaceDown.current) {
        isPanning.current = true
        setIsPanning(true)
        const { pan } = useBoardStore.getState()
        panStart.current = { mouseX: e.clientX, mouseY: e.clientY, panX: pan.x, panY: pan.y }
        e.preventDefault()
      }
    }
    function onMouseMove(e: MouseEvent) {
      if (!isPanning.current) return
      setPan({
        x: panStart.current.panX + (e.clientX - panStart.current.mouseX),
        y: panStart.current.panY + (e.clientY - panStart.current.mouseY),
      })
    }
    function onMouseUp() {
      if (isPanning.current) { isPanning.current = false; setIsPanning(false) }
    }

    el.addEventListener('wheel', onWheel, { passive: false })
    el.addEventListener('mousedown', onMouseDown)
    window.addEventListener('mousemove', onMouseMove)
    window.addEventListener('mouseup', onMouseUp)
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)

    return () => {
      el.removeEventListener('wheel', onWheel)
      el.removeEventListener('mousedown', onMouseDown)
      window.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('mouseup', onMouseUp)
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [containerRef, setPan, setZoom, setIsPanning])
}
```

**`apps/web/components/board/BoardCanvas.tsx`**
```typescript
'use client'
import { useRef, useCallback } from 'react'
import { useBoardStore } from '@/stores/board.store'
import { usePanZoom } from '@/hooks/usePanZoom'
import NoteCard from './NoteCard'
import NoteDetailPanel from './NoteDetailPanel'
import CreateNoteOverlay from './CreateNoteOverlay'

export default function BoardCanvas() {
  const containerRef = useRef<HTMLDivElement>(null)
  const pan          = useBoardStore(s => s.pan)
  const zoom         = useBoardStore(s => s.zoom)
  const notes        = useBoardStore(s => s.notes)
  const selectedId   = useBoardStore(s => s.selectedNoteId)
  const isPanning    = useBoardStore(s => s.isPanning)
  const selectNote   = useBoardStore(s => s.selectNote)

  usePanZoom(containerRef)

  const onDoubleClick = useCallback((e: React.MouseEvent) => {
    if ((e.target as HTMLElement).closest('[data-note]')) return
    const rect   = containerRef.current!.getBoundingClientRect()
    const canvasX = (e.clientX - rect.left - pan.x) / zoom
    const canvasY = (e.clientY - rect.top  - pan.y) / zoom
    CreateNoteOverlay.open({ posX: canvasX, posY: canvasY })
  }, [pan, zoom])

  return (
    <div className="relative flex h-full overflow-hidden bg-[#F4EFE8]">
      <div
        ref={containerRef}
        className="flex-1 relative overflow-hidden select-none"
        style={{ cursor: isPanning ? 'grabbing' : 'default' }}
        onDoubleClick={onDoubleClick}
        onClick={() => selectNote(null)}
      >
        <div
          style={{
            transform:       `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
            transformOrigin: '0 0',
            position:        'absolute',
            top: 0, left: 0,
            width: '100%', height: '100%',
          }}
        >
          {notes.map(note => (
            <NoteCard key={note.id} note={note} />
          ))}
        </div>
      </div>

      {selectedId && (
        <NoteDetailPanel noteId={selectedId} onClose={() => selectNote(null)} />
      )}
    </div>
  )
}
```

---

### Day 5: NoteCard

**`apps/web/lib/note-config.ts`**
```typescript
import type { NoteType } from '@neo/types'

export interface NoteConfig {
  label:  string
  icon:   string
  bg:     string
  accent: string
  border: string
}

export const NOTE_CONFIG: Record<NoteType, NoteConfig> = {
  idea:     { label: 'Idea',     icon: '💡', bg: '#FFF8E7', accent: '#E8B84B', border: '#F5E1A4' },
  decision: { label: 'Decision', icon: '⚡', bg: '#EBF3FC', accent: '#5B9BD5', border: '#BDD5EE' },
  goal:     { label: 'Goal',     icon: '✅', bg: '#EAF7EE', accent: '#52A86A', border: '#B4DDBE' },
  learning: { label: 'Learning', icon: '📚', bg: '#F4EEFF', accent: '#9B59B6', border: '#D7B8F0' },
  task:     { label: 'Task',     icon: '📌', bg: '#FEF2F2', accent: '#E74C3C', border: '#F5B7B1' },
  insight:  { label: 'Insight',  icon: '🔮', bg: '#E6F7F7', accent: '#1ABC9C', border: '#A8DDD9' },
  question: { label: 'Question', icon: '❓', bg: '#FFF4E6', accent: '#E67E22', border: '#F5CBA7' },
}
```

**`apps/web/lib/rotation.ts`**
```typescript
// Deterministic ±2° rotation from note ID. Same ID always = same rotation.
export function getNoteRotation(noteId: string): number {
  const hex = noteId.replace(/-/g, '').slice(-8)
  const val = parseInt(hex, 16)
  return ((val % 401) - 200) / 100
}
```

**`apps/web/hooks/useNotePosition.ts`**
```typescript
import { useRef, useCallback } from 'react'
import { useBoardStore } from '@/stores/board.store'
import { apiClient } from '@/lib/api-client'
import type { Note } from '@neo/types'

export function useNotePosition(note: Note) {
  const zoom       = useBoardStore(s => s.zoom)
  const updateNote = useBoardStore(s => s.updateNote)
  const hasMoved   = useRef(false)
  const saveTimer  = useRef<NodeJS.Timeout>()

  const onMouseDown = useCallback((e: React.MouseEvent) => {
    if (e.button !== 0) return
    hasMoved.current = false
    const startMouse = { x: e.clientX, y: e.clientY }
    const startPos   = { x: note.posX, y: note.posY }
    e.stopPropagation()

    function onMove(e: MouseEvent) {
      const dx = (e.clientX - startMouse.x) / zoom
      const dy = (e.clientY - startMouse.y) / zoom
      if (Math.abs(dx) > 2 || Math.abs(dy) > 2) hasMoved.current = true
      const newX = startPos.x + dx
      const newY = startPos.y + dy
      updateNote(note.id, { posX: newX, posY: newY })

      clearTimeout(saveTimer.current)
      saveTimer.current = setTimeout(() => {
        apiClient.patch(`/notes/${note.id}`, { posX: newX, posY: newY })
      }, 500)
    }

    function onUp() {
      window.removeEventListener('mousemove', onMove)
      window.removeEventListener('mouseup',  onUp)
    }

    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup',   onUp)
  }, [note.id, note.posX, note.posY, zoom, updateNote])

  return { onMouseDown, hasMoved }
}
```

**`apps/web/components/board/NoteCard.tsx`**
```typescript
'use client'
import { useCallback } from 'react'
import { useBoardStore } from '@/stores/board.store'
import { useNotePosition } from '@/hooks/useNotePosition'
import { NOTE_CONFIG } from '@/lib/note-config'
import { getNoteRotation } from '@/lib/rotation'
import type { Note } from '@neo/types'

export default function NoteCard({ note }: { note: Note }) {
  const selectNote = useBoardStore(s => s.selectNote)
  const selectedId = useBoardStore(s => s.selectedNoteId)
  const config     = NOTE_CONFIG[note.noteType]
  const rotation   = getNoteRotation(note.id)
  const isSelected = selectedId === note.id
  const { onMouseDown, hasMoved } = useNotePosition(note)

  const onClick = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    if (!hasMoved.current) selectNote(note.id)
  }, [note.id, selectNote, hasMoved])

  const date = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'short', day: 'numeric',
  })

  return (
    <div
      data-note
      onMouseDown={onMouseDown}
      onClick={onClick}
      style={{
        position:        'absolute',
        left:            note.posX,
        top:             note.posY,
        width:           note.width,
        minHeight:       note.height,
        transform:       `rotate(${rotation}deg)`,
        backgroundColor: config.bg,
        borderColor:     isSelected ? config.accent : config.border,
        cursor:          'grab',
      }}
      className={`rounded-lg border-2 p-3 shadow-md transition-shadow ${isSelected ? 'shadow-xl' : 'hover:shadow-lg'}`}
    >
      <div className="flex items-center gap-1.5 mb-2">
        <span className="text-base">{config.icon}</span>
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: config.accent }}>
          {config.label}
        </span>
      </div>
      <p className="text-sm font-medium text-[#1C1B2E] leading-snug line-clamp-3">{note.title}</p>
      {note.summary && (
        <p className="mt-1.5 text-xs text-gray-500 leading-snug line-clamp-2">{note.summary}</p>
      )}
      {note.tags.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-1">
          {note.tags.slice(0, 3).map(tag => (
            <span key={tag} className="px-1.5 py-0.5 text-[10px] rounded-full bg-white/60 text-gray-500">
              {tag}
            </span>
          ))}
        </div>
      )}
      <p className="mt-2 text-[10px] text-gray-400">{date}</p>
    </div>
  )
}
```

---

### Day 6: Note CRUD — API Routes

**`apps/api/src/routes/boards.ts`**
```typescript
import type { FastifyPluginAsync } from 'fastify'
import { and, eq, isNull } from 'drizzle-orm'
import { boards, notes } from '@neo/db'

const boardRoutes: FastifyPluginAsync = async (fastify) => {

  fastify.get('/boards', async (request) => {
    const result = await fastify.db
      .select().from(boards)
      .where(and(eq(boards.workspaceId, request.workspaceId), isNull(boards.deletedAt)))
    return { boards: result }
  })

  fastify.get<{ Params: { id: string } }>('/boards/:id', async (request, reply) => {
    const [board] = await fastify.db
      .select().from(boards)
      .where(and(eq(boards.id, request.params.id), eq(boards.workspaceId, request.workspaceId)))
      .limit(1)

    if (!board) return reply.code(404).send({ error: 'Board not found' })

    const boardNotes = await fastify.db
      .select().from(notes)
      .where(and(eq(notes.boardId, board.id), isNull(notes.deletedAt)))
      .orderBy(notes.createdAt)

    return { board, notes: boardNotes }
  })
}

export default boardRoutes
```

**`apps/api/src/routes/notes.ts`**
```typescript
import type { FastifyPluginAsync } from 'fastify'
import { Type } from '@sinclair/typebox'
import { and, eq, isNull } from 'drizzle-orm'
import { notes, noteEvents } from '@neo/db'

const NoteTypeEnum = Type.Union([
  Type.Literal('idea'), Type.Literal('decision'), Type.Literal('goal'),
  Type.Literal('learning'), Type.Literal('task'), Type.Literal('insight'),
  Type.Literal('question'),
])

const CreateBody = Type.Object({
  noteType: NoteTypeEnum,
  title:    Type.String({ minLength: 1, maxLength: 500 }),
  summary:  Type.Optional(Type.String({ maxLength: 1000 })),
  details:  Type.Optional(Type.String()),
  tags:     Type.Optional(Type.Array(Type.String())),
  posX:     Type.Number(),
  posY:     Type.Number(),
})

const UpdateBody = Type.Partial(Type.Object({
  noteType: NoteTypeEnum,
  title:    Type.String({ minLength: 1, maxLength: 500 }),
  summary:  Type.String(),
  details:  Type.String(),
  tags:     Type.Array(Type.String()),
  posX:     Type.Number(),
  posY:     Type.Number(),
}))

const noteRoutes: FastifyPluginAsync = async (fastify) => {

  fastify.post<{ Params: { boardId: string }; Body: typeof CreateBody.static }>(
    '/boards/:boardId/notes',
    { schema: { body: CreateBody } },
    async (request, reply) => {
      const [note] = await fastify.db.insert(notes).values({
        boardId:     request.params.boardId,
        workspaceId: request.workspaceId,
        userId:      request.userId,
        noteType:    request.body.noteType,
        title:       request.body.title,
        summary:     request.body.summary,
        details:     request.body.details,
        tags:        request.body.tags ?? [],
        posX:        request.body.posX,
        posY:        request.body.posY,
        sourceType:  'manual',
      }).returning()

      await fastify.db.insert(noteEvents).values({
        noteId: note.id, userId: request.userId,
        eventType: 'created', afterData: note,
      })

      return reply.code(201).send(note)
    },
  )

  fastify.get<{ Params: { id: string } }>('/notes/:id', async (request, reply) => {
    const [note] = await fastify.db
      .select().from(notes)
      .where(and(eq(notes.id, request.params.id), eq(notes.workspaceId, request.workspaceId)))
      .limit(1)
    if (!note || note.deletedAt) return reply.code(404).send({ error: 'Not found' })
    return note
  })

  fastify.patch<{ Params: { id: string }; Body: typeof UpdateBody.static }>(
    '/notes/:id',
    { schema: { body: UpdateBody } },
    async (request, reply) => {
      const [existing] = await fastify.db
        .select().from(notes)
        .where(and(eq(notes.id, request.params.id), eq(notes.workspaceId, request.workspaceId)))
        .limit(1)
      if (!existing || existing.deletedAt) return reply.code(404).send({ error: 'Not found' })

      const [updated] = await fastify.db
        .update(notes)
        .set({ ...request.body, updatedAt: new Date() })
        .where(eq(notes.id, request.params.id))
        .returning()

      const isContentEdit = request.body.title !== undefined
        || request.body.noteType !== undefined
        || request.body.summary  !== undefined
        || request.body.details  !== undefined
        || request.body.tags     !== undefined

      if (isContentEdit) {
        await fastify.db.insert(noteEvents).values({
          noteId: updated.id, userId: request.userId,
          eventType: 'updated', beforeData: existing, afterData: updated,
        })
      }

      return updated
    },
  )

  fastify.delete<{ Params: { id: string } }>('/notes/:id', async (request, reply) => {
    const [existing] = await fastify.db
      .select().from(notes)
      .where(and(eq(notes.id, request.params.id), eq(notes.workspaceId, request.workspaceId)))
      .limit(1)
    if (!existing || existing.deletedAt) return reply.code(404).send({ error: 'Not found' })

    await fastify.db.update(notes)
      .set({ deletedAt: new Date() })
      .where(eq(notes.id, request.params.id))

    await fastify.db.insert(noteEvents).values({
      noteId: existing.id, userId: request.userId,
      eventType: 'deleted', beforeData: existing,
    })

    return reply.code(204).send()
  })
}

export default noteRoutes
```

---

### Day 6: Create Note Overlay (Frontend)

**`apps/web/components/board/CreateNoteOverlay.tsx`**
```typescript
'use client'
import { useState } from 'react'
import { useBoardStore } from '@/stores/board.store'
import { apiClient } from '@/lib/api-client'
import { NOTE_CONFIG } from '@/lib/note-config'
import type { NoteType, Note } from '@neo/types'

interface OverlayState { open: boolean; posX: number; posY: number }

let _open: ((pos: { posX: number; posY: number }) => void) | null = null

function CreateNoteOverlay() {
  const [state,    setState]    = useState<OverlayState>({ open: false, posX: 0, posY: 0 })
  const [noteType, setNoteType] = useState<NoteType>('idea')
  const [title,    setTitle]    = useState('')
  const [loading,  setLoading]  = useState(false)

  const boardId   = useBoardStore(s => s.boardId)
  const addNote   = useBoardStore(s => s.addNote)
  const selectNote = useBoardStore(s => s.selectNote)

  _open = ({ posX, posY }) => {
    setState({ open: true, posX, posY })
    setTitle(''); setNoteType('idea')
  }

  function close() { setState(s => ({ ...s, open: false })) }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    if (!title.trim() || !boardId) return
    setLoading(true)
    try {
      const note = await apiClient.post<Note>(`/boards/${boardId}/notes`, {
        noteType, title: title.trim(),
        posX: state.posX, posY: state.posY,
      })
      addNote(note)
      selectNote(note.id)
      close()
    } finally { setLoading(false) }
  }

  if (!state.open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20" onClick={close}>
      <form onSubmit={handleCreate} onClick={e => e.stopPropagation()}
        className="bg-white rounded-xl shadow-2xl p-5 w-80 space-y-4">
        <h3 className="text-sm font-semibold text-[#1C1B2E]">New Note</h3>
        <div className="grid grid-cols-4 gap-1.5">
          {(Object.keys(NOTE_CONFIG) as NoteType[]).map(type => {
            const cfg = NOTE_CONFIG[type]
            const sel = noteType === type
            return (
              <button key={type} type="button" onClick={() => setNoteType(type)}
                className="flex flex-col items-center p-1.5 rounded-lg text-xs transition"
                style={{
                  backgroundColor: sel ? cfg.bg : 'transparent',
                  borderWidth: sel ? 2 : 1,
                  borderStyle: 'solid',
                  borderColor: sel ? cfg.accent : '#E5E7EB',
                }}>
                <span>{cfg.icon}</span>
                <span className="mt-0.5 text-[9px] text-gray-600">{cfg.label}</span>
              </button>
            )
          })}
        </div>
        <textarea autoFocus value={title} onChange={e => setTitle(e.target.value)}
          placeholder="What's on your mind?" rows={3}
          className="w-full px-3 py-2 text-sm border border-gray-200 rounded-lg resize-none focus:outline-none focus:ring-2 focus:ring-[#6C63FF]"
          onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleCreate(e as any) } }}
        />
        <div className="flex gap-2 justify-end">
          <button type="button" onClick={close} className="px-3 py-1.5 text-xs text-gray-500">Cancel</button>
          <button type="submit" disabled={!title.trim() || loading}
            className="px-4 py-1.5 text-xs font-medium bg-[#6C63FF] text-white rounded-lg disabled:opacity-50">
            {loading ? 'Creating…' : 'Add to Board'}
          </button>
        </div>
      </form>
    </div>
  )
}

CreateNoteOverlay.open = (pos: { posX: number; posY: number }) => _open?.(pos)

export default CreateNoteOverlay
```

---

### Day 7: Note Detail Panel + Board Page

**`apps/web/components/board/NoteDetailPanel.tsx`**
```typescript
'use client'
import { useState, useEffect } from 'react'
import { useBoardStore } from '@/stores/board.store'
import { apiClient } from '@/lib/api-client'
import { NOTE_CONFIG } from '@/lib/note-config'
import type { Note, NoteType, UpdateNoteBody } from '@neo/types'

export default function NoteDetailPanel({ noteId, onClose }: { noteId: string; onClose: () => void }) {
  const notes      = useBoardStore(s => s.notes)
  const updateNote = useBoardStore(s => s.updateNote)
  const removeNote = useBoardStore(s => s.removeNote)
  const note       = notes.find(n => n.id === noteId)

  const [editing,  setEditing]  = useState(false)
  const [draft,    setDraft]    = useState<Partial<Note>>({})
  const [saving,   setSaving]   = useState(false)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    if (note) {
      setDraft({ noteType: note.noteType, title: note.title,
        summary: note.summary ?? '', details: note.details ?? '', tags: [...note.tags] })
      setEditing(false)
    }
  }, [noteId])

  if (!note) return null
  const config = NOTE_CONFIG[note.noteType]

  async function handleSave() {
    setSaving(true)
    try {
      const updated = await apiClient.patch<Note>(`/notes/${note!.id}`, draft as UpdateNoteBody)
      updateNote(note!.id, updated)
      setEditing(false)
    } finally { setSaving(false) }
  }

  async function handleDelete() {
    if (!confirm('Delete this note?')) return
    setDeleting(true)
    try {
      await apiClient.delete(`/notes/${note!.id}`)
      removeNote(note!.id)
      onClose()
    } finally { setDeleting(false) }
  }

  function removeTag(tag: string) {
    setDraft(d => ({ ...d, tags: d.tags?.filter(t => t !== tag) }))
  }
  function addTag(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key !== 'Enter' && e.key !== ',') return
    e.preventDefault()
    const val = (e.target as HTMLInputElement).value.trim().toLowerCase()
    if (val && !draft.tags?.includes(val)) setDraft(d => ({ ...d, tags: [...(d.tags ?? []), val] }))
    ;(e.target as HTMLInputElement).value = ''
  }

  const date = new Date(note.createdAt).toLocaleDateString('en-US', {
    month: 'long', day: 'numeric', year: 'numeric',
  })

  return (
    <div className="w-80 border-l border-gray-200 bg-white flex flex-col h-full overflow-y-auto shrink-0">
      <div className="flex items-center justify-between px-4 py-3 border-b" style={{ backgroundColor: config.bg }}>
        <div className="flex items-center gap-2">
          <span className="text-lg">{config.icon}</span>
          <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: config.accent }}>
            {config.label}
          </span>
        </div>
        <div className="flex gap-1">
          {!editing && (
            <button onClick={() => setEditing(true)} className="px-2 py-1 text-xs text-gray-500 hover:text-gray-800 rounded">
              Edit
            </button>
          )}
          <button onClick={onClose} className="px-2 py-1 text-gray-400 hover:text-gray-700">✕</button>
        </div>
      </div>

      <div className="flex-1 px-4 py-4 space-y-4">
        {editing ? (
          <textarea value={draft.title} rows={2}
            onChange={e => setDraft(d => ({ ...d, title: e.target.value }))}
            className="w-full text-sm font-medium border border-gray-200 rounded-lg p-2 resize-none focus:outline-none focus:ring-2 focus:ring-[#6C63FF]" />
        ) : (
          <h2 className="text-sm font-semibold text-[#1C1B2E] leading-snug">{note.title}</h2>
        )}

        <div>
          <p className="text-xs font-medium text-gray-400 mb-1">Summary</p>
          {editing ? (
            <textarea value={draft.summary} rows={3} placeholder="Add a summary…"
              onChange={e => setDraft(d => ({ ...d, summary: e.target.value }))}
              className="w-full text-xs border border-gray-200 rounded-lg p-2 resize-none focus:outline-none" />
          ) : (
            <p className="text-xs text-gray-600 leading-relaxed">
              {note.summary || <span className="text-gray-300 italic">No summary</span>}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs font-medium text-gray-400 mb-1">Details</p>
          {editing ? (
            <textarea value={draft.details} rows={5} placeholder="Add details…"
              onChange={e => setDraft(d => ({ ...d, details: e.target.value }))}
              className="w-full text-xs border border-gray-200 rounded-lg p-2 resize-none focus:outline-none" />
          ) : (
            <p className="text-xs text-gray-600 leading-relaxed whitespace-pre-wrap">
              {note.details || <span className="text-gray-300 italic">No details</span>}
            </p>
          )}
        </div>

        <div>
          <p className="text-xs font-medium text-gray-400 mb-1">Tags</p>
          <div className="flex flex-wrap gap-1">
            {(editing ? draft.tags : note.tags)?.map(tag => (
              <span key={tag} className="inline-flex items-center gap-1 px-2 py-0.5 text-[10px] rounded-full bg-gray-100 text-gray-600">
                {tag}
                {editing && <button onClick={() => removeTag(tag)} className="text-gray-400 hover:text-gray-700">×</button>}
              </span>
            ))}
            {editing && (
              <input type="text" placeholder="Add tag…" onKeyDown={addTag}
                className="text-[10px] px-2 py-0.5 border border-dashed border-gray-300 rounded-full focus:outline-none" />
            )}
          </div>
        </div>

        <p className="text-xs text-gray-400">
          {note.sourceType ? `${note.sourceType.replace('_', ' ')} · ` : 'Manual · '}{date}
        </p>
      </div>

      <div className="px-4 py-3 border-t space-y-2">
        {editing ? (
          <div className="flex gap-2">
            <button onClick={() => setEditing(false)}
              className="flex-1 py-1.5 text-xs text-gray-500 border border-gray-200 rounded-lg">
              Cancel
            </button>
            <button onClick={handleSave} disabled={saving || !draft.title?.trim()}
              className="flex-1 py-1.5 text-xs font-medium bg-[#6C63FF] text-white rounded-lg disabled:opacity-50">
              {saving ? 'Saving…' : 'Save'}
            </button>
          </div>
        ) : (
          <button onClick={handleDelete} disabled={deleting}
            className="w-full py-1.5 text-xs text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition disabled:opacity-50">
            {deleting ? 'Deleting…' : 'Delete note'}
          </button>
        )}
      </div>
    </div>
  )
}
```

**`apps/web/app/board/page.tsx`** (server — auth check)
```typescript
import { cookies } from 'next/headers'
import { createServerClient } from '@supabase/ssr'
import { redirect } from 'next/navigation'
import BoardPageClient from './BoardPageClient'

export default async function BoardPage() {
  const cookieStore = await cookies()
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { cookies: { getAll: () => cookieStore.getAll() } },
  )
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')
  return <BoardPageClient />
}
```

**`apps/web/app/board/BoardPageClient.tsx`** (client — data load)
```typescript
'use client'
import { useEffect } from 'react'
import { useBoardStore } from '@/stores/board.store'
import { apiClient } from '@/lib/api-client'
import BoardCanvas from '@/components/board/BoardCanvas'
import CreateNoteOverlay from '@/components/board/CreateNoteOverlay'
import type { Note } from '@neo/types'

export default function BoardPageClient() {
  const setBoardId = useBoardStore(s => s.setBoardId)
  const setNotes   = useBoardStore(s => s.setNotes)

  useEffect(() => {
    async function load() {
      const { boards } = await apiClient.get<{ boards: { id: string }[] }>('/boards')
      if (!boards.length) return
      const boardId = boards[0].id
      setBoardId(boardId)
      const data = await apiClient.get<{ notes: Note[] }>(`/boards/${boardId}`)
      setNotes(data.notes)
    }
    load()
  }, [setBoardId, setNotes])

  return (
    <div className="h-screen flex flex-col bg-[#F4EFE8]">
      <header className="h-12 flex items-center justify-between px-4 bg-white border-b border-gray-200 z-10 shrink-0">
        <span className="text-sm font-semibold text-[#1C1B2E]">NEO</span>
        <button
          onClick={() => CreateNoteOverlay.open({ posX: 200, posY: 200 })}
          className="px-3 py-1.5 text-xs bg-[#6C63FF] text-white rounded-lg font-medium"
        >
          + New Note
        </button>
      </header>
      <div className="flex-1 overflow-hidden">
        <BoardCanvas />
      </div>
      <CreateNoteOverlay />
    </div>
  )
}
```

---

## Environment Variables

**`apps/api/.env.example`**
```
DATABASE_URL=postgresql://user:pass@localhost:5432/neo_dev
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
PORT=3001
```

**`apps/web/.env.local`**
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
NEXT_PUBLIC_API_URL=http://localhost:3001/v1
```

---

## DONE Criteria — Testable Checklist

### Sprint 0

- [ ] `pnpm install` at root succeeds with no errors
- [ ] `pnpm db:migrate` runs all 6 migrations against PostgreSQL 16
- [ ] All 11 tables exist in the database
- [ ] `SELECT * FROM pg_extension WHERE extname = 'vector'` returns a row
- [ ] `pnpm db:seed` inserts 1 user, 1 workspace, 1 board
- [ ] `POST /auth/bootstrap` with valid Supabase token returns `{ user, workspace, board }`
- [ ] `POST /auth/bootstrap` called twice with same token returns identical IDs (idempotent)
- [ ] Visiting `/board` without session redirects to `/login`
- [ ] Completing login redirects to `/board`

### Sprint 1 — Canvas

- [ ] Board page loads with empty canvas (no notes)
- [ ] Mouse wheel zooms in and out
- [ ] Zoom cannot go below 0.2× or above 3.0×
- [ ] Space + drag pans the canvas
- [ ] Middle-mouse drag pans the canvas
- [ ] Cursor shows `grabbing` while panning

### Sprint 1 — NoteCard

- [ ] Each of the 7 note types renders with the correct background color from `note-config.ts`
- [ ] Each type shows the correct icon and label
- [ ] Notes have visible slight rotation (±2°)
- [ ] Two notes with different IDs but same content have different rotations
- [ ] Two notes with the same ID always have the same rotation
- [ ] Title, summary, tags, and date render correctly
- [ ] Tags truncate at 3 on the card

### Sprint 1 — Note CRUD

- [ ] Double-clicking empty canvas opens Create Note overlay
- [ ] `+ New Note` button opens Create Note overlay
- [ ] All 7 type tiles are shown and selectable
- [ ] Submitting with empty title is blocked
- [ ] Enter key in textarea submits the form
- [ ] After creation: note appears on board, `notes` table has a row, `note_events` has a `created` event
- [ ] `GET /boards/:id` includes the new note in its response

### Sprint 1 — Drag

- [ ] Clicking a note (no drag) selects it without moving it
- [ ] Dragging a note moves it on the canvas
- [ ] Position is not saved on every pixel — API called only after drag ends (debounced)
- [ ] Refreshing the page shows notes at their last saved positions

### Sprint 1 — Detail Panel

- [ ] Clicking a note opens the right panel
- [ ] Clicking canvas background closes the panel
- [ ] Panel shows type, title, summary, details, tags, date
- [ ] Edit mode makes all fields editable
- [ ] Save persists changes — note on board updates immediately (optimistic)
- [ ] Cancel discards unsaved edits
- [ ] Delete with confirmation removes note from board and from `GET /boards/:id` response
- [ ] `note_events` has `updated` event after edit, `deleted` event after delete
- [ ] Position-only drags do NOT create `note_events` entries

---

## What Comes Next (Sprint 2 preview)

Tables already exist. Sprint 2 only adds application code:
- `POST /conversations` — save raw pasted text
- `POST /conversations/:id/extract` — trigger Anthropic extraction
- Extraction preview UI
- `POST /extractions/:id/accept` — create notes from extraction
