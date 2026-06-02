# SmartStickyNote — Architecture

## Overview

SmartStickyNote is a spatial note-taking application with an infinite canvas.
Users capture ideas as sticky notes, drag them around a board, and edit them inline.

**Current state:** MVP v0.1 — single user, no auth, board-first UX.

## Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Frontend | Next.js (App Router) | 14.2.0 |
| State | Zustand | 4.5 |
| Canvas | CSS transforms | — |
| API | Fastify | 4.26 |
| ORM | Drizzle ORM | 0.30 |
| Database | PostgreSQL + pgvector (Docker) | 16 |
| Language | TypeScript | 5.4 |
| Package manager | pnpm workspaces | 9.15 |
| Monorepo | Turborepo | — |
| Process manager | PM2 | 7 |
| Reverse proxy | Nginx | 1.24 |
| CDN / DNS | Cloudflare | — |

## Monorepo Layout

```
/
├── apps/
│   ├── api/          ← Fastify REST API (port 5011)
│   └── web/          ← Next.js frontend (port 5010)
└── packages/
    ├── db/           ← Drizzle schema + migrations + client
    └── types/        ← Shared TypeScript interfaces
```

## Frontend

**Framework:** Next.js 14 App Router with `'use client'` components.

**Infinite canvas:**
- Single `<BoardCanvas>` component applies a CSS `transform: translate(x,y) scale(z)` to a container div
- All notes render as `position: absolute` inside the container
- Pan: mousedown + mousemove on background
- Zoom: `wheel` event, factor 0.92/1.08, clamped 0.15–3

**Note state:** Zustand store (`stores/board.ts`):
```
notes[], pan {x,y}, zoom, selectedNoteId
→ setNotes / addNote / updateNote / removeNote
→ setPan / setZoom / selectNote
```

**API calls:** All browser → `/api/*` → Nginx rewrites → `127.0.0.1:5011/*`
```
GET  /api/notes         → fetch board notes on mount
POST /api/notes         → create note
PATCH /api/notes/:id    → save position / title
DELETE /api/notes/:id   → soft delete
```

## API

**Framework:** Fastify 4 with TypeScript via `tsx` (no compile step).

**Route structure:**
```
GET  /health    → {status, service, timestamp}
GET  /stats     → {notes, users, uptime, version}
GET  /export    → {exportedAt, notes[]}
GET  /notes     → active notes for board
POST /notes     → create note
PATCH /notes/:id → update note
DELETE /notes/:id → soft delete
```

**DB plugin:** `fastify-plugin` attaches a Drizzle client as `server.db`.

**Auth:** None (MVP v0.1). Supabase Auth planned for v0.2.

## Storage

**Database:** PostgreSQL 16 with pgvector extension, running in Docker.

**Key tables:**
```
notes            ← primary data — title, type, position, tags
note_events      ← append-only event log (full history)
note_embeddings  ← pgvector embeddings (Sprint 2+)
users            ← auth (Supabase-managed in v0.2+)
workspaces       ← tenant isolation
boards           ← canvas containers
```

**Schema philosophy:**
- Additive-only migrations — no destructive changes after production data
- Soft deletes only (`deleted_at`) — nothing is permanently destroyed
- `timestamptz` on all timestamps

**ORM:** Drizzle ORM with programmatic migrator (`drizzle-orm/postgres-js/migrator`).

## Deployment

```
Browser
  ↓ HTTPS
Cloudflare (Orange Cloud — note.z-node.cc)
  ↓ HTTPS
Nginx (port 443)
  ├── /api/* → rewrite → Fastify (127.0.0.1:5011)
  └── /*     →           Next.js (127.0.0.1:5010)
```

**Process management:** PM2 runs both processes, restarts on crash.
**Logs:** PM2 captures stdout/stderr → `/opt/smartstickynote/logs/`

## Data Flow — Create Note

```
User clicks "+ New Note"
  → page.tsx: POST /api/notes {title, posX, posY}
  → Nginx: strip /api/ → forward to :5011
  → Fastify: INSERT INTO notes → return new row
  → Zustand: addNote(note) → re-render NoteCard
```

## Data Flow — Move Note

```
User drags NoteCard
  → onMouseDown: start drag
  → onMouseMove: updateNote(id, {posX, posY}) in Zustand (instant)
  → onMouseUp: PATCH /api/notes/:id {posX, posY} (persist)
```

## Future NEO Integration

NEO is the AI assistant embedded in the workspace. Architecture constraints:

1. **NEO reads memory, never writes directly** — all writes require user confirmation
2. **Every NEO claim must be citable** — source note referenced
3. **Embeddings:** `note_embeddings` table with pgvector — similarity search for "related notes"
4. **Extraction pipeline:** BullMQ job queue → Claude API → extraction preview → user approval → note created
5. **Conversations:** `conversations` + `neo_messages` tables for persistent chat history

**Planned Sprint 2 additions:**
- `apps/worker/` — BullMQ worker for background extraction
- `apps/api/src/routes/neo.ts` — NEO chat endpoint
- Redis for job queue + session cache
