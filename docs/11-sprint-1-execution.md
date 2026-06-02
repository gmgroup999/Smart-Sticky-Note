# Sprint 1 Execution Plan

> Principal Engineer execution plan.
> Goal: User → Create Board → Create Note → Drag Note → Edit Note → Persist to DB.
> No new features. No redesign. Fixes only + build.

---

## Priority 1 — Blocker Fixes

Apply all five fixes before writing any Sprint 1 feature code.
Each fix is independent. Apply in any order. All must pass before Day 3 testing begins.

---

### Fix 1 — CORS Not Configured

**File:** `apps/api/src/index.ts`

**Problem:** No CORS plugin registered. Every browser request from `localhost:3000`
to `localhost:3001` is blocked. Nothing works in the browser.

**Required change — `apps/api/src/index.ts`:**

Replace:
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
```

With:
```typescript
import Fastify from 'fastify'
import cors from '@fastify/cors'
import authPlugin from './plugins/auth'
import dbPlugin   from './plugins/db'
import authRoutes  from './routes/auth'
import boardRoutes from './routes/boards'
import noteRoutes  from './routes/notes'

const app = Fastify({ logger: true })

await app.register(cors, {
  origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000',
  credentials: true,
})

await app.register(dbPlugin)
await app.register(authPlugin)
```

**Required change — `apps/api/package.json`:** Add to dependencies:
```json
"@fastify/cors": "^9.0.0"
```

**Required change — `apps/api/.env.example`:** Add:
```
CORS_ORIGIN=http://localhost:3000
```

**Acceptance criteria:**
- `curl -H "Origin: http://localhost:3000" http://localhost:3001/v1/boards` returns
  `Access-Control-Allow-Origin: http://localhost:3000` in response headers
- Browser network tab shows no CORS error on any API call from the board page

---

### Fix 2 — Invalid Drizzle `timestamptz` Import

**Problem:** `timestamptz` is not exported from `drizzle-orm/pg-core`. Every Drizzle
schema file that imports it will fail with a TypeScript compile error.
The correct API is `timestamp('col', { withTimezone: true })`.

**Files to fix — all 10 schema files:**
```
packages/db/src/schema/users.ts
packages/db/src/schema/workspaces.ts
packages/db/src/schema/boards.ts
packages/db/src/schema/notes.ts
packages/db/src/schema/note-events.ts
packages/db/src/schema/note-embeddings.ts
packages/db/src/schema/note-relationships.ts
packages/db/src/schema/conversations.ts
packages/db/src/schema/extractions.ts
packages/db/src/schema/neo-messages.ts
```

**Required change in every schema file:**

Replace in import line:
```typescript
import { ..., timestamptz, ... } from 'drizzle-orm/pg-core'
```
With:
```typescript
import { ..., timestamp, ... } from 'drizzle-orm/pg-core'
```

Replace every column definition:
```typescript
createdAt:  timestamptz('created_at').notNull().defaultNow(),
updatedAt:  timestamptz('updated_at').notNull().defaultNow(),
deletedAt:  timestamptz('deleted_at'),
archivedAt: timestamptz('archived_at'),
// etc.
```
With:
```typescript
createdAt:  timestamp('created_at',  { withTimezone: true }).notNull().defaultNow(),
updatedAt:  timestamp('updated_at',  { withTimezone: true }).notNull().defaultNow(),
deletedAt:  timestamp('deleted_at',  { withTimezone: true }),
archivedAt: timestamp('archived_at', { withTimezone: true }),
// etc.
```

**The pattern is mechanical — every `timestamptz(x)` becomes `timestamp(x, { withTimezone: true })`.**

**Acceptance criteria:**
- `cd packages/db && npx tsc --noEmit` exits 0 with no errors
- `pnpm db:migrate` runs without TypeScript errors

---

### Fix 3 — Missing `apps/api/package.json`

**Problem:** The plan's file tree lists `apps/api/package.json` but never defines its
contents. Without it, `pnpm install` does not install API dependencies. The API server
cannot start.

**Create `apps/api/package.json`:**
```json
{
  "name": "@neo/api",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev":   "tsx watch src/index.ts",
    "build": "tsc --outDir dist",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "fastify":              "^4.26.0",
    "@fastify/cors":        "^9.0.0",
    "fastify-plugin":       "^4.5.0",
    "@sinclair/typebox":    "^0.32.0",
    "@supabase/supabase-js":"^2.43.0",
    "@neo/db":              "workspace:*",
    "@neo/types":           "workspace:*"
  },
  "devDependencies": {
    "tsx":         "^4.7.0",
    "typescript":  "^5.4.0",
    "@types/node": "^20.0.0"
  }
}
```

**Create `apps/api/tsconfig.json`:**
```json
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "outDir": "dist",
    "rootDir": "src",
    "module": "NodeNext",
    "moduleResolution": "NodeNext"
  },
  "include": ["src"]
}
```

**Also create `apps/web/package.json`** (also missing from the plan):
```json
{
  "name": "@neo/web",
  "version": "0.0.1",
  "private": true,
  "scripts": {
    "dev":   "next dev",
    "build": "next build",
    "start": "next start"
  },
  "dependencies": {
    "next":            "14.2.0",
    "react":           "^18.3.0",
    "react-dom":       "^18.3.0",
    "@supabase/ssr":   "^0.3.0",
    "zustand":         "^4.5.0",
    "@neo/types":      "workspace:*"
  },
  "devDependencies": {
    "typescript":        "^5.4.0",
    "@types/node":       "^20.0.0",
    "@types/react":      "^18.3.0",
    "@types/react-dom":  "^18.3.0",
    "tailwindcss":       "^3.4.0",
    "postcss":           "^8.4.0",
    "autoprefixer":      "^10.4.0"
  }
}
```

**Acceptance criteria:**
- `pnpm install` at root exits 0 with no errors
- `ls apps/api/node_modules/fastify` exists
- `ls apps/web/node_modules/next` exists

---

### Fix 4 — Auth Middleware Null Guards

**File:** `apps/api/src/plugins/auth.ts`

**Problem:** After finding `dbUser`, the code immediately accesses `workspace.id` without
checking if `workspace` exists. If bootstrap failed or data is inconsistent, this crashes
with `TypeError: Cannot read properties of undefined (reading 'id')` — a 500, not a 401.
Same for `board`.

**Required change — replace lines 669–677:**

Replace:
```typescript
const [workspace] = await fastify.db
  .select().from(workspaces).where(eq(workspaces.ownerId, dbUser.id)).limit(1)

const [board] = await fastify.db
  .select().from(boards).where(eq(boards.workspaceId, workspace.id)).limit(1)

request.userId      = dbUser.id
request.workspaceId = workspace.id
request.boardId     = board.id
```

With:
```typescript
const [workspace] = await fastify.db
  .select().from(workspaces).where(eq(workspaces.ownerId, dbUser.id)).limit(1)
if (!workspace) return reply.code(401).send({ error: 'Workspace not found. Please log out and back in.' })

const [board] = await fastify.db
  .select().from(boards).where(eq(boards.workspaceId, workspace.id)).limit(1)
if (!board) return reply.code(401).send({ error: 'Board not found. Please log out and back in.' })

request.userId      = dbUser.id
request.workspaceId = workspace.id
request.boardId     = board.id
```

**Acceptance criteria:**
- `DELETE FROM workspaces WHERE ...` then call `GET /v1/boards` → API returns 401, not 500
- No unhandled TypeErrors in the API logs during auth

---

### Fix 5 — Bootstrap Error Handling on Frontend

**File:** `apps/web/app/(auth)/login/page.tsx`

**Problem:** If `POST /auth/bootstrap` throws (API down, network error, server error),
the error is uncaught. `router.push('/board')` runs anyway. The user lands on `/board`,
every API call returns 401, the board is empty with no explanation.

**Required change — replace the `handleSubmit` function body:**

Replace:
```typescript
const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
if (authError) { setError(authError.message); setLoading(false); return }

await apiClient.post('/auth/bootstrap', { token: data.session!.access_token })
router.push('/board')
```

With:
```typescript
const { data, error: authError } = await supabase.auth.signInWithPassword({ email, password })
if (authError) { setError(authError.message); setLoading(false); return }

try {
  await apiClient.post('/auth/bootstrap', { token: data.session!.access_token })
} catch {
  setError('Could not connect to server. Is the API running?')
  setLoading(false)
  return
}

router.push('/board')
```

**Acceptance criteria:**
- Stop the API server, attempt to log in → user sees error message, stays on `/login`
- API running but returning 500 on bootstrap → user sees error, stays on `/login`
- Happy path: API running → login succeeds → redirect to `/board`

---

## Priority 2 — Migration 0007

Run before Sprint 2. Not required for Sprint 1.
Write the file now so it is ready. Do not apply it yet.

---

### Migration file: `packages/db/src/migrations/0007_future_proof.sql`

```sql
-- Add project and wisdom as first-class note types
ALTER TYPE note_type ADD VALUE 'project';
ALTER TYPE note_type ADD VALUE 'wisdom';

-- Add board_type for future Mission / Project / Idea / Wisdom Wall support
ALTER TABLE boards ADD COLUMN board_type text DEFAULT 'general';

-- Add source_excerpt for extraction traceability (Sprint 2)
ALTER TABLE notes ADD COLUMN source_excerpt text;
```

---

### Drizzle schema update: `packages/db/src/schema/notes.ts`

Add `'project'` and `'wisdom'` to the enum array, and add the `sourceExcerpt` column.

In `noteTypeEnum` definition, replace:
```typescript
export const noteTypeEnum = pgEnum('note_type', [
  'idea', 'decision', 'goal', 'learning', 'task', 'insight', 'question',
])
```
With:
```typescript
export const noteTypeEnum = pgEnum('note_type', [
  'idea', 'decision', 'goal', 'learning', 'task', 'insight', 'question',
  'project', 'wisdom',
])
```

In the `notes` table definition, after `sourceId`, add:
```typescript
sourceExcerpt: text('source_excerpt'),
```

---

### Drizzle schema update: `packages/db/src/schema/boards.ts`

In the `boards` table definition, after `name`, add:
```typescript
boardType: text('board_type').default('general'),
```

---

### TypeScript type update: `packages/types/src/index.ts`

Replace `NoteType`:
```typescript
export type NoteType =
  | 'idea' | 'decision' | 'goal' | 'learning'
  | 'task' | 'insight'  | 'question'
  | 'project' | 'wisdom'
```

In the `Note` interface, after `sourceId`, add:
```typescript
sourceExcerpt: string | null
```

In `CreateNoteBody` and `UpdateNoteBody`, no changes required.
`sourceExcerpt` is set by the extraction pipeline, not by manual note creation.

---

### Timing

| Action | When |
|--------|------|
| Write `0007_future_proof.sql` | Day 2 (alongside other migrations) |
| Apply `0007_future_proof.sql` | Before Sprint 2 Day 1 |
| Update Drizzle schema and TypeScript types | Same commit as applying 0007 |

---

## Priority 3 — Sprint 1 Execution Checklist

---

### Day 1 — Monorepo + Config

**Tasks:**

1. Create root `package.json` (from plan)
2. Create `pnpm-workspace.yaml` (from plan)
3. Create `turbo.json` (from plan)
4. Create `tsconfig.base.json` (from plan)
5. Create `apps/api/package.json` **(Fix 3 — use version from Priority 1)**
6. Create `apps/api/tsconfig.json` **(Fix 3 — use version from Priority 1)**
7. Create `apps/web/package.json` **(Fix 3 — use version from Priority 1)**
8. Create `apps/web/tsconfig.json`:
   ```json
   {
     "extends": "../../tsconfig.base.json",
     "compilerOptions": {
       "jsx": "preserve",
       "lib": ["dom", "dom.iterable", "esnext"],
       "paths": { "@/*": ["./"] }
     },
     "include": [".", "next-env.d.ts"],
     "exclude": ["node_modules"]
   }
   ```
9. Create `packages/db/package.json` (from plan)
10. Create `packages/types/package.json` (from plan)
11. Run `pnpm install`

**Expected output:** All packages installed. No install errors.

**DONE criteria:**
- [ ] `pnpm install` exits code 0
- [ ] `node_modules` exists at root and in each app/package
- [ ] `ls apps/api/node_modules/fastify` exists
- [ ] `ls apps/web/node_modules/next` exists

---

### Day 2 — Database Schema + Migrations

**Tasks:**

1. Write all 10 Drizzle schema files in `packages/db/src/schema/`
   **Use `timestamp('col', { withTimezone: true })` everywhere — not `timestamptz`**
   **(Fix 2 applies to every schema file)**
2. Write `packages/db/src/schema/index.ts` (re-export all)
3. Write `packages/db/src/client.ts` (from plan)
4. Write `packages/db/drizzle.config.ts` (from plan)
5. Write `packages/db/src/seed.ts` (from plan)
6. Write migration files `0001` through `0006` (SQL, from plan)
7. Write `0007_future_proof.sql` **(Priority 2 — write now, do NOT apply yet)**
8. Create `apps/api/.env` from `.env.example` with real values
9. Run `pnpm db:migrate`
10. Run `pnpm db:seed`
11. Verify: `cd packages/db && npx tsc --noEmit`

**Expected output:** All 11 tables in database. pgvector active. 1 user, 1 workspace,
1 board seeded. Drizzle types compile without errors.

**DONE criteria:**
- [ ] `pnpm db:migrate` exits 0
- [ ] `psql $DATABASE_URL -c "\dt"` shows: users, workspaces, boards, notes,
  note_events, note_embeddings, note_relationships, conversations, extractions,
  extraction_items, neo_messages
- [ ] `psql $DATABASE_URL -c "SELECT extname FROM pg_extension"` includes `vector`
- [ ] `psql $DATABASE_URL -c "SELECT * FROM boards"` returns 1 row
- [ ] `cd packages/db && npx tsc --noEmit` exits 0 (no `timestamptz` errors)

---

### Day 3 — Auth + API Server Start

**Tasks:**

1. Write `apps/api/src/plugins/db.ts` (from plan)
2. Write `apps/api/src/plugins/auth.ts` **(with Fix 4 null guards)**
3. Write `apps/api/src/routes/auth.ts` (from plan — bootstrap endpoint)
4. Write `apps/api/src/routes/boards.ts` (from plan)
5. Write `apps/api/src/routes/notes.ts` (from plan)
6. Write `apps/api/src/routes/index.ts`:
   ```typescript
   import type { FastifyInstance } from 'fastify'
   import authRoutes  from './auth'
   import boardRoutes from './boards'
   import noteRoutes  from './notes'

   export async function registerRoutes(app: FastifyInstance) {
     await app.register(authRoutes,  { prefix: '/v1' })
     await app.register(boardRoutes, { prefix: '/v1' })
     await app.register(noteRoutes,  { prefix: '/v1' })
   }
   ```
7. Write `apps/api/src/index.ts` **(with Fix 1: CORS registered)**
8. Write `apps/web/lib/supabase.ts` (from plan)
9. Write `apps/web/middleware.ts` (from plan)
10. Write `apps/web/app/(auth)/login/page.tsx` **(with Fix 5: try/catch on bootstrap)**
11. Write `apps/web/app/(auth)/signup/page.tsx` (mirrors login, calls `signUp` instead)
12. Write `apps/web/app/layout.tsx`:
    ```typescript
    import type { Metadata } from 'next'
    import './globals.css'

    export const metadata: Metadata = { title: 'NEO' }

    export default function RootLayout({ children }: { children: React.ReactNode }) {
      return (
        <html lang="en">
          <body>{children}</body>
        </html>
      )
    }
    ```
13. Write `apps/web/app/globals.css` (Tailwind directives)
14. Write `apps/web/tailwind.config.ts`
15. Create `apps/web/.env.local` with Supabase keys and API URL
16. Start API: `cd apps/api && pnpm dev`
17. Start web: `cd apps/web && pnpm dev`
18. Create a test user in Supabase dashboard
19. Test: sign up → sign in → redirect to `/board`
20. Verify: `psql $DATABASE_URL -c "SELECT * FROM users"` shows the new user

**Expected output:** API running on :3001. Web running on :3000. Login works.
`/board` loads (empty). `/board` without auth redirects to `/login`.

**DONE criteria:**
- [ ] `curl http://localhost:3001/v1/boards` without token → 401
- [ ] Stop API, attempt login → error message shown, user stays on `/login` **(Fix 5)**
- [ ] Restart API, sign in → redirected to `/board`
- [ ] `/board` renders without console errors (board empty is fine)
- [ ] `psql $DATABASE_URL -c "SELECT * FROM users"` shows 1 row for test user
- [ ] Response from `/auth/bootstrap` a second time returns same IDs as first call

---

### Day 4 — Board Canvas + Pan/Zoom

**Tasks:**

1. Write `apps/web/stores/board.store.ts` (from plan)
2. Write `apps/web/hooks/usePanZoom.ts` (from plan)
3. Write `apps/web/lib/api-client.ts` (from plan)
4. Write `apps/web/app/board/page.tsx` (server component, auth check — from plan)
5. Write `apps/web/app/board/BoardPageClient.tsx` (client component, loads board data)
6. Write `apps/web/components/board/BoardCanvas.tsx` (from plan — no NoteCard yet,
   render an empty transform layer)
7. Test pan and zoom manually in browser

**Expected output:** Board page loads. Empty canvas visible. Pan works (space+drag,
middle mouse). Zoom works (scroll wheel). Zoom stays within 0.2× and 3.0× limits.

**DONE criteria:**
- [ ] Board page loads with no console errors
- [ ] Space + drag moves the canvas
- [ ] Middle-mouse drag moves the canvas
- [ ] Scroll wheel zooms in and out
- [ ] Zoom does not go below 0.2× (try repeated scroll out)
- [ ] Zoom does not go above 3.0× (try repeated scroll in)
- [ ] Cursor shows `grabbing` style while panning

---

### Day 5 — NoteCard Component

**Tasks:**

1. Write `apps/web/lib/note-config.ts` (from plan — all 7 type configs)
2. Write `apps/web/lib/rotation.ts` (from plan — deterministic formula)
3. Write `apps/web/hooks/useNotePosition.ts` (from plan)
4. Write `apps/web/components/board/NoteCard.tsx` (from plan)
5. Insert 3 test notes directly into DB via `psql`:
   ```sql
   INSERT INTO notes (board_id, workspace_id, user_id, note_type, title, pos_x, pos_y)
   VALUES
     ('<board-id>', '<workspace-id>', '<user-id>', 'idea',     'Test Idea',     100, 100),
     ('<board-id>', '<workspace-id>', '<user-id>', 'decision', 'Test Decision', 400, 150),
     ('<board-id>', '<workspace-id>', '<user-id>', 'goal',     'Test Goal',     700, 100);
   ```
6. Refresh `/board` and verify notes appear
7. Visually verify: colors, icons, rotation, title render

**Expected output:** Three notes visible on board with correct type colors and icons.
Each note has a slight but visible rotation that is different between notes.

**DONE criteria:**
- [ ] 3 test notes appear on board after DB insert + page refresh
- [ ] `idea` note has yellow (`#FFF8E7`) background and 💡 icon
- [ ] `decision` note has blue (`#EBF3FC`) background and ⚡ icon
- [ ] `goal` note has green (`#EAF7EE`) background and ✅ icon
- [ ] Each note has a visually different rotation (inspect computed style)
- [ ] Same note ID always produces the same rotation (hard-refresh twice, compare)
- [ ] Date shows at the bottom of each note

---

### Day 6 — Note CRUD

**Tasks:**

1. Write `apps/web/components/board/CreateNoteOverlay.tsx` (from plan)
2. Wire `+ New Note` button in `BoardPageClient.tsx` header to `CreateNoteOverlay.open`
3. Confirm `boards.ts` API route is already written (Day 3)
4. Confirm `notes.ts` API route is already written (Day 3)
5. Test: double-click canvas → overlay opens
6. Test: select type, enter title, submit → note appears on board
7. Test: drag note to new position → note moves
8. Wait 600ms after drag ends → confirm PATCH called (check network tab)
9. Refresh page → note is at dragged position (persisted)
10. Test: click `+ New Note` button → overlay opens with center-of-canvas position

**Expected output:** Full create + drag + persist flow working. Notes survive a page reload
at their last dragged position.

**DONE criteria:**
- [ ] Double-click on empty canvas opens `CreateNoteOverlay`
- [ ] `+ New Note` button opens `CreateNoteOverlay`
- [ ] All 7 type tiles render and are selectable in the overlay
- [ ] Empty title → submit button is disabled
- [ ] Enter key in title textarea submits
- [ ] Created note appears on board immediately (optimistic)
- [ ] `psql -c "SELECT * FROM notes ORDER BY created_at DESC LIMIT 1"` shows the new note
- [ ] `psql -c "SELECT * FROM note_events WHERE event_type='created'"` shows 1 event
- [ ] Drag note → release → wait 1 second → `psql` confirms updated `pos_x`, `pos_y`
- [ ] Page refresh → note is at the position it was dragged to
- [ ] Clicking a note (not dragging) selects it without moving it

---

### Day 7 — Detail Panel + End-to-End Testing

**Tasks:**

1. Write `apps/web/components/board/NoteDetailPanel.tsx` (from plan)
2. Wire up: clicking a NoteCard opens NoteDetailPanel
3. Test edit flow: Edit → change title → Save → verify in DB and on board
4. Test cancel: Edit → change title → Cancel → original title preserved
5. Test delete: Delete note → confirm dialog → note gone from board and DB
6. Run full 5-step journey end-to-end:
   - Sign in
   - Board loads
   - Create note (double-click)
   - Drag note to new position
   - Click note → Edit → change title → Save
   - Refresh page → note at same position, with updated title
7. Test all 7 note types create and display correctly
8. Verify `note_events` entries exist for created, updated, deleted

**Expected output:** Full journey works without errors. Notes persist across page reloads.
Edit and delete work from the detail panel.

**DONE criteria:**
- [ ] Click any note → detail panel opens on right side
- [ ] Click canvas background → panel closes
- [ ] Panel shows: type badge, title, summary placeholder, details placeholder, tags, date
- [ ] Edit mode: all fields become editable
- [ ] Save with empty title → save button is disabled
- [ ] Save → PATCH called → panel exits edit mode → note title on board updates
- [ ] `psql -c "SELECT * FROM note_events WHERE event_type='updated'"` shows event
- [ ] Cancel → original values restored
- [ ] Delete → confirm → note removed from board
- [ ] `psql -c "SELECT deleted_at FROM notes WHERE id='<id>'"` shows a timestamp (soft delete)
- [ ] `psql -c "SELECT * FROM note_events WHERE event_type='deleted'"` shows event
- [ ] Full journey: sign in → create note → drag → edit → refresh → note at same position with edited title

---

## Sprint 1 DONE Definition

Sprint 1 is complete when a developer can do all of the following without errors,
without database tools, and without looking at logs:

```
1. Open browser at localhost:3000
2. Sign in
3. See the board (empty or with existing notes)
4. Double-click empty canvas → create a note with a title
5. Drag the note to a different position
6. Click the note → edit the title → save
7. Refresh the page
8. Note is at the dragged position with the edited title
```

If all 8 steps work, Sprint 1 is done. Build Sprint 2.

---

## Blocker Fix Summary Table

| Fix | File | Change | Blocks |
|-----|------|--------|--------|
| 1 | `apps/api/src/index.ts` | Register `@fastify/cors` | All browser API calls |
| 2 | All 10 `packages/db/src/schema/*.ts` | `timestamptz` → `timestamp({withTimezone:true})` | DB compile, ORM types |
| 3 | `apps/api/package.json` + `apps/web/package.json` | Create both files with all dependencies | API + web server start |
| 4 | `apps/api/src/plugins/auth.ts` | Add null guards on workspace + board | All auth'd API calls |
| 5 | `apps/web/app/(auth)/login/page.tsx` | Wrap bootstrap in try/catch | Silent broken sessions |

**All five fixes must be applied before Day 3 testing. Fix 2 must be applied before Day 2 migrations.**
