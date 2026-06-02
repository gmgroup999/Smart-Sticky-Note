# NEO Second Brain — Project Context

> This file helps Claude Code maintain continuity across sessions.
> Updated: 2026-06-02 (Session 4)

---

## What Is This Project?

NEO Second Brain is an Executive Memory System and AI Executive Assistant.
A spatial, AI-powered workspace combining an infinite whiteboard, smart sticky notes,
a knowledge graph, and an embedded AI assistant named NEO.

Target users: Founders, entrepreneurs, creators, and knowledge workers managing
multiple projects who need an external memory and thinking system.

---

## Current Sprint Status

| Sprint | Days | Status | Notes |
|--------|------|--------|-------|
| Sprint 0 | Day 1 — Monorepo + Config | ✅ COMPLETE | — |
| Sprint 0 | Day 2 — DB Migrations + Schema | ✅ COMPLETE | — |
| **MVP v0.1** | **No Auth, Single User** | **✅ LIVE** | `https://note.z-node.cc` |
| **Phase 1** | **Production Foundation** | **✅ 72% COMPLETE** | Session 4 |
| Sprint 1 | Day 3 — Auth + API Server (v0.2) | ⏳ Not started | Needs Supabase project |
| Sprint 1 | Day 4 — Board Canvas | ⏳ Not started | — |
| Sprint 1 | Day 5 — NoteCard | ⏳ Not started | — |
| Sprint 1 | Day 6 — Note CRUD | ⏳ Not started | — |
| Sprint 1 | Day 7 — Detail Panel + E2E | ⏳ Not started | — |

---

## Work Completed (Sessions 1–4)

### Session 1–2 — Architecture + Design + Local Code

| # | Work | Result |
|---|------|--------|
| 1–8 | Product design documents (PRD, Architecture, UX, Data Model, etc.) | ✅ In `docs/` |
| 9 | MVP Blueprint | ✅ `docs\09-mvp-blueprint.md` |
| 10 | Sprint 1 Plan | ✅ `docs\10-sprint-1-plan.md` |
| 11 | Sprint 1 Execution Plan | ✅ `docs\11-sprint-1-execution.md` |
| Day 1 | Monorepo scaffolding, package.json files, pnpm install | ✅ Done |
| Day 2 | SQL migrations 0001–0006, journal, all 10 Drizzle schema files | ✅ Done |
| Day 2 | `migrate.ts`, `seed.ts`, `client.ts`, `drizzle.config.ts` | ✅ Done |
| Day 2 | Migration 0007 written (NOT in journal — apply before Sprint 2) | ✅ Done |

### Session 3 Part 1 — Hetzner Server Setup (2026-06-02)

| Work | Result |
|------|--------|
| Defined 10 Infrastructure Golden Rules (isolation per project) | ✅ Locked |
| SSH key auth set up (`~/.ssh/smartstickynote_deploy`) | ✅ Working |
| Created `/opt/smartstickynote/{app,logs,backups,scripts}` | ✅ Done |
| jack passwordless sudo configured | ✅ Done |
| Node.js 20.20.2 installed (upgraded from 18) | ✅ Done |
| pnpm 9.15.9 installed | ✅ Done |
| PM2 7.0.1 installed | ✅ Done |
| PostgreSQL Docker container (`pgvector/pgvector:pg16`) started | ✅ Running on `127.0.0.1:5433` |
| pgvector 0.8.2 extension enabled in `smartstickynote_prod` | ✅ Done |
| Codebase deployed to `/opt/smartstickynote/app/` | ✅ Done |
| `pnpm install` (310 packages) | ✅ Done |
| `pnpm db:migrate` — 6 migrations applied | ✅ Done |
| `pnpm db:seed` — 1 user, 1 workspace, 1 board | ✅ Done |
| **Day 2 COMPLETE** — 11 tables, enums, seed data verified | ✅ |
| Cloudflare Origin Certificate installed (`*.z-node.cc`, 15yr) | ✅ Done |
| `neo.z-node.cc` Nginx config updated — port 443 + SSL | ✅ Done |
| `panel.z-node.cc` Nginx config created — port 443 + SSL | ✅ Done |
| `hetzner-panel` container recreated (correct nginx mounts) | ✅ Running |
| `scp-relay.service` disabled (was blocking port 3099) | ✅ Done |

### Session 3 Part 2 — MVP v0.1 Build + Deploy (2026-06-02)

| Work | Result |
|------|--------|
| Decided MVP v0.1 = no auth, single user, 10 files | ✅ Locked |
| Wrote `packages/types/src/index.ts` | ✅ Done |
| Wrote `packages/db/src/index.ts` (barrel — exports client + schema) | ✅ Done |
| Wrote `apps/api/src/plugins/db.ts` | ✅ Done |
| Wrote `apps/api/src/routes/notes.ts` (GET/POST/PATCH/DELETE) | ✅ Done |
| Wrote `apps/api/src/index.ts` (Fastify server) | ✅ Done |
| Wrote `apps/web/next.config.mjs` (transpilePackages + API rewrites) | ✅ Done |
| Wrote `apps/web/app/globals.css` | ✅ Done |
| Wrote `apps/web/app/layout.tsx` | ✅ Done |
| Wrote `apps/web/stores/board.ts` (Zustand) | ✅ Done |
| Wrote `apps/web/components/NoteCard.tsx` (drag + inline edit) | ✅ Done |
| Wrote `apps/web/components/BoardCanvas.tsx` (pan/zoom canvas) | ✅ Done |
| Wrote `apps/web/app/page.tsx` (board page + New Note button) | ✅ Done |
| Updated `apps/api/package.json` (tsx start script, added dotenv) | ✅ Done |
| Updated `packages/db/package.json` (added main/exports fields) | ✅ Done |
| `pnpm --filter @neo/web build` succeeded | ✅ Done |
| Created PM2 ecosystem.config.cjs | ✅ Done |
| Created Nginx config for SmartStickyNote (port 80 only) | ✅ Done |
| Both PM2 processes online (`smartstickynote-api`, `smartstickynote-web`) | ✅ Running |
| **MVP v0.1 LIVE** at `http://195.201.81.33/` | ✅ |
| `POST /api/notes` — first note created and persisted | ✅ Verified |

### Session 4 — Nginx Fix + Phase 1 Production Foundation (2026-06-02)

| Work | Result |
|------|--------|
| **Root cause analysis**: `https://note.z-node.cc` showed NEO login page | ✅ Diagnosed |
| Root cause: Nginx had no `listen 443 ssl` block for `note.z-node.cc` → fell through to `neo.z-node.cc` default | ✅ Confirmed |
| Fixed: Added port 443 SSL block to `/etc/nginx/sites-available/smartstickynote` | ✅ Done |
| `https://note.z-node.cc` now serves SmartStickyNote correctly | ✅ Verified |
| Wrote `apps/api/src/routes/health.ts` (GET /health, /stats, /export) | ✅ Done |
| Updated `apps/api/src/index.ts` (register healthRoutes, error handler, uncaughtException/unhandledRejection) | ✅ Done |
| Created `apps/api/.env.example` | ✅ Done |
| Created `apps/web/.env.example` | ✅ Done |
| Created `DEPLOYMENT.md` | ✅ Done |
| Created `ARCHITECTURE.md` | ✅ Done |
| Created `.gitignore` | ✅ Done |
| Renamed `apps/web/next.config.ts` → `apps/web/next.config.ts.disabled` | ✅ Done |
| Configured PM2 startup (`pm2-jack.service` enabled in systemd) | ✅ Done |
| Created backup script `/opt/smartstickynote/scripts/backup.sh` | ✅ Done |
| Daily cron at 02:00 → `/opt/smartstickynote/logs/backup.log` | ✅ Done |
| First backup created: `ssnote_20260602_141014.sql.gz` (4.2 KB) | ✅ Done |
| `git init` + initial commit (57 files, 9,480 lines) | ✅ Done |
| Pushed to GitHub: `https://github.com/gmgroup999/Smart-Sticky-Note` | ✅ Done |
| Full Project Audit completed (production readiness: 55/100) | ✅ Done |

---

## Files Created / Modified Locally (All Sessions)

### Monorepo Root — Session 4 additions

| File | Path | Status |
|------|------|--------|
| .gitignore | `h:\NEO Second Brain\.gitignore` | ✅ NEW |
| DEPLOYMENT.md | `h:\NEO Second Brain\DEPLOYMENT.md` | ✅ NEW |
| ARCHITECTURE.md | `h:\NEO Second Brain\ARCHITECTURE.md` | ✅ NEW |

### apps/api — Session 4

| File | Path | Status |
|------|------|--------|
| src/index.ts | `h:\NEO Second Brain\apps\api\src\index.ts` | ✅ UPDATED (error handler + healthRoutes) |
| src/routes/health.ts | `h:\NEO Second Brain\apps\api\src\routes\health.ts` | ✅ NEW |
| .env.example | `h:\NEO Second Brain\apps\api\.env.example` | ✅ NEW |

### apps/web — Session 4

| File | Path | Status |
|------|------|--------|
| .env.example | `h:\NEO Second Brain\apps\web\.env.example` | ✅ NEW |
| next.config.ts.disabled | `h:\NEO Second Brain\apps\web\next.config.ts.disabled` | ✅ Renamed from .ts (excluded from git) |

### Previously created (Sessions 1–3, unchanged)

| File | Path | Status |
|------|------|--------|
| package.json | `h:\NEO Second Brain\package.json` | ✅ |
| pnpm-workspace.yaml | `h:\NEO Second Brain\pnpm-workspace.yaml` | ✅ |
| turbo.json | `h:\NEO Second Brain\turbo.json` | ✅ |
| tsconfig.base.json | `h:\NEO Second Brain\tsconfig.base.json` | ✅ |
| apps/api/package.json | `h:\NEO Second Brain\apps\api\package.json` | ✅ |
| apps/api/src/plugins/db.ts | `h:\NEO Second Brain\apps\api\src\plugins\db.ts` | ✅ |
| apps/api/src/routes/notes.ts | `h:\NEO Second Brain\apps\api\src\routes\notes.ts` | ✅ |
| apps/web/next.config.mjs | `h:\NEO Second Brain\apps\web\next.config.mjs` | ✅ |
| apps/web/app/globals.css | `h:\NEO Second Brain\apps\web\app\globals.css` | ✅ |
| apps/web/app/layout.tsx | `h:\NEO Second Brain\apps\web\app\layout.tsx` | ✅ |
| apps/web/app/page.tsx | `h:\NEO Second Brain\apps\web\app\page.tsx` | ✅ |
| apps/web/stores/board.ts | `h:\NEO Second Brain\apps\web\stores\board.ts` | ✅ |
| apps/web/components/NoteCard.tsx | `h:\NEO Second Brain\apps\web\components\NoteCard.tsx` | ✅ |
| apps/web/components/BoardCanvas.tsx | `h:\NEO Second Brain\apps\web\components\BoardCanvas.tsx` | ✅ |
| packages/types/src/index.ts | `h:\NEO Second Brain\packages\types\src\index.ts` | ✅ |
| packages/db/src/index.ts | `h:\NEO Second Brain\packages\db\src\index.ts` | ✅ |
| packages/db/src/client.ts | `h:\NEO Second Brain\packages\db\src\client.ts` | ✅ |
| packages/db/src/schema/ (10 files) | `h:\NEO Second Brain\packages\db\src\schema\` | ✅ |
| packages/db/src/migrations/ (7 SQL + journal) | `h:\NEO Second Brain\packages\db\src\migrations\` | ✅ |

---

## Files on Hetzner Server (Session 4 additions)

| File | Path | Notes |
|------|------|-------|
| Nginx config | `/etc/nginx/sites-available/smartstickynote` | UPDATED — added port 443 SSL block |
| Backup script | `/opt/smartstickynote/scripts/backup.sh` | NEW — pg_dump + gzip + 7-day retention |
| First backup | `/opt/smartstickynote/backups/ssnote_20260602_141014.sql.gz` | 4.2 KB |
| PM2 systemd | `/etc/systemd/system/pm2-jack.service` | NEW — auto-start on reboot |
| API health routes | `/opt/smartstickynote/app/apps/api/src/routes/health.ts` | NEW — deployed |
| API index | `/opt/smartstickynote/app/apps/api/src/index.ts` | UPDATED — deployed |

---

## Project Structure (Current State — Phase 1)

```
h:\NEO Second Brain\                  (git: main, 1 commit → GitHub)
├── .gitignore
├── ARCHITECTURE.md
├── CLAUDE.md
├── DEPLOYMENT.md
├── package.json
├── pnpm-workspace.yaml / turbo.json / tsconfig.base.json
│
├── apps\
│   ├── api\
│   │   ├── package.json
│   │   ├── tsconfig.json
│   │   ├── .env.example
│   │   └── src\
│   │       ├── index.ts              ← Fastify server + error handler + startup logs
│   │       ├── plugins\
│   │       │   └── db.ts             ← Drizzle client plugin
│   │       └── routes\
│   │           ├── notes.ts          ← GET/POST/PATCH/DELETE /notes
│   │           └── health.ts         ← GET /health, /stats, /export
│   │
│   └── web\
│       ├── package.json
│       ├── tsconfig.json
│       ├── .env.example
│       ├── next.config.mjs           ← transpilePackages + /api rewrites
│       ├── next.config.ts.disabled   ← renamed, excluded from git
│       ├── app\
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   └── page.tsx              ← Board page (client component)
│       ├── stores\
│       │   └── board.ts              ← Zustand: notes, pan, zoom, selectedNoteId
│       └── components\
│           ├── NoteCard.tsx          ← Sticky note: drag + inline edit
│           └── BoardCanvas.tsx       ← CSS transform canvas: pan/zoom
│
└── packages\
    ├── db\
    │   ├── package.json              ← main: src/index.ts (CRITICAL)
    │   ├── drizzle.config.ts
    │   ├── .env.example
    │   └── src\
    │       ├── index.ts              ← Barrel: exports createDbClient + schema
    │       ├── client.ts
    │       ├── migrate.ts / seed.ts
    │       ├── schema\               ← 11 files (10 tables + index.ts)
    │       └── migrations\           ← 7 SQL files + meta/_journal.json
    │
    └── types\
        ├── package.json
        └── src\
            └── index.ts              ← Note, NoteType, CreateNoteBody, UpdateNoteBody
```

### Live Server State

```
/opt/smartstickynote/
├── app/                    ← monorepo (deployed via scp)
├── logs/                   ← PM2 logs (api-out, api-err, web-out, web-err, backup)
├── backups/                ← daily .sql.gz (7-day retention)
├── scripts/
│   └── backup.sh           ← pg_dump → gzip → rotate
└── ecosystem.config.cjs    ← PM2 config (log paths, restart policy)

PM2 processes (both online):
  smartstickynote-api    ← pnpm start → tsx src/index.ts → 127.0.0.1:5011
  smartstickynote-web    ← next start → 127.0.0.1:5010

PM2 startup: pm2-jack.service ENABLED (auto-start on reboot)

Nginx:
  HTTP  → 301 redirect to HTTPS
  HTTPS → 127.0.0.1:5010 (Next.js)
  HTTPS /api/* → 127.0.0.1:5011 (Fastify, prefix stripped)

Access: https://note.z-node.cc
```

---

## API Endpoints (Current)

| Method | Path (browser) | Description | Auth |
|--------|---------------|-------------|------|
| GET | `/api/health` | `{status,service,timestamp}` | None |
| GET | `/api/stats` | `{notes,users,uptime,version}` | None |
| GET | `/api/export` | `{exportedAt, notes[]}` all active | None |
| GET | `/api/notes` | All active notes for board | None |
| POST | `/api/notes` | Create note | None |
| PATCH | `/api/notes/:id` | Update note | None |
| DELETE | `/api/notes/:id` | Soft delete | None |

---

## Production Database (Active)

```
Container:    smartstickynote-postgres (Docker, pgvector:pg16)
Host port:    127.0.0.1:5433
Database:     smartstickynote_prod
User:         smartstickynote_app
Extensions:   pgvector 0.8.2, uuid-ossp 1.1
11 tables:    users, workspaces, boards, notes, note_events,
              note_embeddings, note_relationships, conversations,
              extractions, extraction_items, neo_messages
Migrations:   6/7 applied (0007 intentionally deferred)
Seed data:    1 user (dev@neo.app), 1 workspace, 1 board, 3 notes
BOARD_ID:     78f4567f-02c1-49e9-9b49-b6dd06d570b3
USER_ID:      2a4b76bf-7aa4-47fd-b225-647e01f7586d
WORKSPACE_ID: fb59d291-3a21-4859-a416-83c7f94daf60
```

---

## Production Readiness Score (After Session 4)

| Category | Score | Key Gap |
|----------|-------|---------|
| Infrastructure | 75/100 | `.env.production` missing on server |
| Security | 25/100 | No auth, no rate limiting, no input validation |
| Database | 80/100 | No RLS, migration 0007 not applied |
| API | 60/100 | No auth, no validation, no pagination |
| Frontend | 55/100 | No delete UI, no detail panel |
| Monitoring | 55/100 | No external monitor, no log rotation |
| Backup | 55/100 | No off-site, no restore docs |
| Documentation | 70/100 | No README, no API docs |
| **OVERALL** | **55/100** | Not production-ready without auth |

---

## Git Repository

```
Local:   h:\NEO Second Brain\
Remote:  https://github.com/gmgroup999/Smart-Sticky-Note
Branch:  main
Commits: 1 (initial — 57 files, 9,480 lines)
Status:  Clean (no uncommitted changes as of Session 4)
```

---

## TODO — Next Steps (Prioritized)

### P0 — Done This Session ✅
- [x] Fix HTTPS routing for `note.z-node.cc` (Nginx port 443)
- [x] `pm2 startup systemd && pm2 save`
- [x] Create backup script + daily cron
- [x] `git init` + push to GitHub

### P1 — Quick Wins (< 1 hour each)
- [ ] Create `apps/web/.env.production` on server (missing — using hardcoded fallback)
- [ ] Add `@fastify/rate-limit` — 100 req/min per IP
- [ ] Add log rotation (`pm2-logrotate` or logrotate cron)
- [ ] Add restore procedure to `DEPLOYMENT.md`
- [ ] Set up UptimeRobot monitor on `https://note.z-node.cc/api/health`
- [ ] Wire TypeBox validation on POST `/notes` and PATCH `/notes/:id`

### P2 — UI Improvements
- [ ] Add Delete button to NoteCard (DELETE endpoint exists)
- [ ] Apply migration 0007 + update NoteType enum (add `project`, `wisdom`)
- [ ] Note detail panel — click to expand `summary` + `details` fields

### P3 — Sprint 1 Day 3 (v0.2 — Auth)
- [ ] Create Supabase Cloud project → get URL, ANON_KEY, SERVICE_ROLE_KEY
- [ ] Write `apps/api/src/plugins/auth.ts` — Supabase JWT middleware
- [ ] Write `apps/api/src/routes/auth.ts` — POST /auth/bootstrap
- [ ] Write `apps/web/lib/supabase.ts` — browser Supabase client
- [ ] Write `apps/web/lib/api.ts` — fetch wrapper with JWT header
- [ ] Write `apps/web/middleware.ts` — route protection
- [ ] Write `apps/web/app/(auth)/login/page.tsx` — login page
- [ ] Update notes routes to use `request.user` instead of hardcoded env IDs

### Before Sprint 2
- [ ] Apply migration 0007 (add to journal + run `pnpm db:migrate`)
- [ ] Update Drizzle schema: `noteTypeEnum`, `boards.boardType`, `notes.sourceExcerpt`
- [ ] Update `NoteType` in `packages/types/src/index.ts` — add `'project'` and `'wisdom'`

---

## Unresolved Issues

### Issue 1–3 — ✅ RESOLVED (Sessions 1–3)
DATABASE_URL, packages/types barrel, next.config format — all fixed.

### Issue 4 — Supabase Project Not Created (v0.2 blocker)
Required for auth. MVP v0.1 runs without it.
**Resolution: Create at supabase.com when ready for v0.2.**

### Issue 5 — Migration 0007 Not Applied (Intentional)
`0007_future_proof.sql` exists but is NOT in journal. Apply before Sprint 2 Day 1.

### Issue 6 — ✅ RESOLVED — PM2 Startup
`pm2-jack.service` enabled. `pm2 save` done. Processes survive reboot.

### Issue 7 — DNS `note.z-node.cc` vs `smartstickynote.z-node.cc`
App is live on `note.z-node.cc` (Cloudflare proxied, orange cloud ON).
Golden Rules say domain should be `smartstickynote.z-node.cc` — but user chose `note.z-node.cc`.
**Status: Working as-is. No action needed unless domain change requested.**

### Issue 8 — ✅ RESOLVED — `next.config.ts`
Renamed locally to `next.config.ts.disabled`. Excluded from git via `.gitignore` (`*.disabled`).

### Issue 9 — `panel.z-node.cc` Security Warning
Cloudflare orange cloud not enabled for `panel.z-node.cc`.
**Resolution: Cloudflare DNS → panel.z-node.cc → enable Proxied.**

### Issue 10 — ✅ RESOLVED — Project Folder Structure
User confirmed resolved. Working directory is `h:\NEO Second Brain\` with git initialized.

### Issue 11 — ✅ RESOLVED — No Git Repository
`git init` done. Pushed to `https://github.com/gmgroup999/Smart-Sticky-Note`.

### Issue 12 — Extraction Quality Threshold (Sprint 2 Risk)
PRD requires >80% AI extraction acceptance rate. No prompt engineering done.
**Resolution: Early spike in Sprint 2.**

### Issue 13 — `apps/web/.env.production` Missing on Server (NEW)
File not present at `/opt/smartstickynote/app/apps/web/.env.production`.
Next.js falls back to hardcoded `http://127.0.0.1:5011` — works but not explicit.
**Resolution: Create file with `API_INTERNAL_URL=http://127.0.0.1:5011` on server.**

### Issue 14 — No Input Validation on API Routes (NEW)
`@sinclair/typebox` installed but not wired into any route.
Malformed POST/PATCH body can reach the database.
**Resolution: Add TypeBox schemas to `/notes` POST and PATCH.**

### Issue 15 — No Rate Limiting (NEW — Security Risk)
Any client can flood the API. No `@fastify/rate-limit` configured.
**Resolution: Install and configure before v0.2 auth launch.**

### Issue 16 — Log Files Will Grow Unbounded (NEW)
`api-err.log` already 76 KB from crash cycles. No rotation configured.
**Resolution: `pm2 install pm2-logrotate` + configure max size.**

### Issue 17 — Backup Not Off-Site (NEW)
Backups stored only on the same server. Server failure = data loss.
**Resolution: Add Cloudflare R2 or Backblaze B2 upload step to `backup.sh`.**

### Issue 18 — No External Uptime Monitor (NEW)
No alerts if the app goes down.
**Resolution: Add UptimeRobot free monitor on `https://note.z-node.cc/api/health`.**

---

## Key Product + Architecture Decisions (Locked)

| Decision | Rationale |
|----------|-----------|
| Modular monolith (not microservices) | Development velocity for MVP |
| PostgreSQL + pgvector | Operational simplicity; no dedicated vector DB needed for MVP |
| Claude API for extraction | Best structured JSON output quality |
| Drizzle ORM with raw SQL migrations | Schema control; additive-only philosophy |
| `drizzle-orm/postgres-js/migrator` (not `drizzle-kit migrate`) | drizzle-kit requires `meta/_journal.json`; programmatic migrator reads it correctly |
| `timestamp({withTimezone: true})` in all Drizzle schema files | `timestamptz` is NOT exported from `drizzle-orm/pg-core` |
| `customType` for pgvector column in Drizzle | `vector` is not a native drizzle-orm/pg-core type in v0.30.x |
| `note_type` enum: 7 types now + project/wisdom in migration 0007 | Cannot change enum values after production data exists |
| Event sourcing via `note_events` append-only log | Full history, undo, temporal queries |
| Soft deletes only (`deleted_at`) | Nothing is permanently destroyed |
| Mobile = capture only, not canvas | Poor UX for infinite canvas on mobile |
| Extraction preview mandatory | User approves all AI notes before they appear |
| NEO reads memory, never writes directly | AI errors cannot corrupt the knowledge base |
| `note.z-node.cc` as production domain | User chose this over `smartstickynote.z-node.cc` |
| `next.config.mjs` (not `.ts`) | Next.js 14.2.0 does not support `.ts` config files |
| `packages/db/package.json` must have `main`+`exports` | tsx resolver requires explicit entry point for workspace packages |

---

## Infrastructure Decision (Locked)

**All phases:** Supabase Auth + Hetzner VPS (PostgreSQL 16 + pgvector self-hosted)

**Reason:** Full control over pgvector tuning. No Supabase DB at any phase.

**Server:** Hetzner Dedicated (Auction #2980542) — Intel i7-8700, 64 GB RAM, 2×1 TB NVMe

**DATABASE_URL (production):**
```
postgresql://smartstickynote_app:[password]@127.0.0.1:5433/smartstickynote_prod
```

---

## Infrastructure Golden Rules (Locked)

| Rule | Value |
|------|-------|
| Database name | `smartstickynote_prod` |
| Database user | `smartstickynote_app` |
| App directory | `/opt/smartstickynote/app/` |
| Logs directory | `/opt/smartstickynote/logs/` |
| Backups directory | `/opt/smartstickynote/backups/` |
| Scripts directory | `/opt/smartstickynote/scripts/` |
| Active domain | `note.z-node.cc` (Cloudflare proxied) |
| PM2 process (api) | `smartstickynote-api` |
| PM2 process (web) | `smartstickynote-web` |
| Nginx config | `/etc/nginx/sites-available/smartstickynote` |
| env (db) | `/opt/smartstickynote/app/packages/db/.env` |
| env (api) | `/opt/smartstickynote/app/apps/api/.env` |
| env (web) | `/opt/smartstickynote/app/apps/web/.env.production` |

**Never share database, table, schema, env vars, storage, PM2 process names, or Nginx configs with any other project.**

---

## Core Design Constraints (Unchanged)

1. **NEO never writes to the knowledge base directly** — only through user-confirmed commands
2. **Every NEO claim must be citable** — no uncited factual statements about the workspace
3. **No forced organization** — capture must work without any project/tag assignment
4. **Silence is a feature** — NEO has strict interruption rules; never interrupts active editing
5. **Physical metaphor is not cosmetic** — spatial positioning is a meaningful memory aid
6. **Abandonment is not failure** — abandoned objects are treated as valuable knowledge, not waste
7. **Additive-only schema** — no destructive migrations after production data exists

---

## Tech Stack (Final for MVP)

| Layer | Technology | Status |
|-------|-----------|--------|
| Frontend | Next.js 14 + TypeScript + Zustand | Locked |
| Canvas | CSS transforms | Locked |
| Backend | Fastify 4 + Node.js + TypeScript | Locked |
| Database | PostgreSQL 16 + pgvector | Locked |
| ORM | Drizzle ORM v0.30 + drizzle-kit v0.21 | Locked |
| Cache / Queue | Redis + BullMQ (Sprint 2+) | Pending |
| LLM | Anthropic Claude API (claude-sonnet-4-6) | Locked |
| Embeddings | OpenAI text-embedding-3-small | Locked |
| Storage | Cloudflare R2 | Pending |
| Auth | Supabase Auth | Locked (v0.2) |
| DB Hosting | Hetzner Dedicated (self-hosted PostgreSQL 16 + pgvector) | Locked |
| Domain | `note.z-node.cc` (Cloudflare Orange Cloud) | Active |
| Package manager | pnpm 9.15.9 | Locked |
| Monorepo | Turborepo | Locked |
| Version control | Git + GitHub (`gmgroup999/Smart-Sticky-Note`) | Active |
