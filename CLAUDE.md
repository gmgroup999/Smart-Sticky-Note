# NEO Second Brain — Project Context

> This file helps Claude Code maintain continuity across sessions.
> Updated: 2026-06-02 (Session 3 — Part 2)

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
| **MVP v0.1** | **10 files — No Auth, Single User** | **✅ LIVE** | `http://195.201.81.33/` |
| Sprint 1 | Day 3 — Auth + API Server (v0.2) | ⏳ Not started | Needs Supabase project |
| Sprint 1 | Day 4 — Board Canvas | ⏳ Not started | — |
| Sprint 1 | Day 5 — NoteCard | ⏳ Not started | — |
| Sprint 1 | Day 6 — Note CRUD | ⏳ Not started | — |
| Sprint 1 | Day 7 — Detail Panel + E2E | ⏳ Not started | — |

---

## Work Completed (Sessions 1–3)

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
| Created Nginx config for SmartStickyNote | ✅ Done |
| Both PM2 processes online (`smartstickynote-api`, `smartstickynote-web`) | ✅ Running |
| **MVP v0.1 LIVE** at `http://195.201.81.33/` | ✅ |
| `POST /api/notes` — first note created and persisted | ✅ Verified |

---

## Files Created / Modified on Hetzner Server (Session 3)

### SSL Certificates

| File | Path | Notes |
|------|------|-------|
| Origin Certificate | `/etc/ssl/cloudflare/z-node.cc.pem` | Covers `*.z-node.cc`, expires 2041 |
| Private Key | `/etc/ssl/cloudflare/z-node.cc.key` | chmod 600 |

### Nginx Configs (on server)

| File | Path | Notes |
|------|------|-------|
| neo.z-node.cc | `/etc/nginx/sites-available/neo.z-node.cc` | Updated — added port 443 + SSL |
| panel.z-node.cc | `/etc/nginx/sites-available/panel.z-node.cc` | NEW — port 443 + SSL → 127.0.0.1:3099 |
| panel.z-node.cc symlink | `/etc/nginx/sites-enabled/panel.z-node.cc` | NEW |

### SmartStickyNote on Server

| File | Path | Notes |
|------|------|-------|
| Codebase | `/opt/smartstickynote/app/` | Full monorepo deployed |
| DB .env | `/opt/smartstickynote/app/packages/db/.env` | DATABASE_URL configured |
| Directory tree | `/opt/smartstickynote/{app,logs,backups,scripts}` | Created, owned by jack |
| PostgreSQL container | `smartstickynote-postgres` | pgvector:pg16, port 127.0.0.1:5433 |

### SmartStickyNote on Server — MVP v0.1 Files

| File | Path | Notes |
|------|------|-------|
| API .env | `/opt/smartstickynote/app/apps/api/.env` | DB URL + seeded IDs + PORT=5011 |
| Web .env.local | `/opt/smartstickynote/app/apps/web/.env.local` | NEXT_PUBLIC_API_URL=/api |
| PM2 ecosystem | `/opt/smartstickynote/ecosystem.config.cjs` | Manages api + web processes |
| Nginx config | `/etc/nginx/sites-available/smartstickynote` | HTTP → port 5010 + /api → 5011 |
| Nginx symlink | `/etc/nginx/sites-enabled/smartstickynote` | Active |
| Next.js build | `/opt/smartstickynote/app/apps/web/.next/` | Built and ready |

### Other Server Files

| File | Path | Notes |
|------|------|-------|
| Panel .env | `/opt/apps/server-control-panel/.env` | SSH creds + PG creds for hetzner-panel |
| SSH key | `~/.ssh/smartstickynote_deploy` (local) | ED25519, for Claude Code access |
| scp-relay | `~/.config/systemd/user/scp-relay.service` | DISABLED — was blocking port 3099 |

---

## Files Created / Modified Locally (All Sessions)

### Monorepo Root

| File | Path | Status |
|------|------|--------|
| package.json | `h:\NEO Second Brain\package.json` | ✅ |
| pnpm-workspace.yaml | `h:\NEO Second Brain\pnpm-workspace.yaml` | ✅ |
| turbo.json | `h:\NEO Second Brain\turbo.json` | ✅ |
| tsconfig.base.json | `h:\NEO Second Brain\tsconfig.base.json` | ✅ |

### apps/api — Session 3

| File | Path | Status |
|------|------|--------|
| package.json | `h:\NEO Second Brain\apps\api\package.json` | ✅ Modified (tsx start, dotenv added) |
| tsconfig.json | `h:\NEO Second Brain\apps\api\tsconfig.json` | ✅ |
| src/index.ts | `h:\NEO Second Brain\apps\api\src\index.ts` | ✅ NEW |
| src/plugins/db.ts | `h:\NEO Second Brain\apps\api\src\plugins\db.ts` | ✅ NEW |
| src/routes/notes.ts | `h:\NEO Second Brain\apps\api\src\routes\notes.ts` | ✅ NEW |

### apps/web — Session 3

| File | Path | Status |
|------|------|--------|
| package.json | `h:\NEO Second Brain\apps\web\package.json` | ✅ |
| tsconfig.json | `h:\NEO Second Brain\apps\web\tsconfig.json` | ✅ |
| next.config.mjs | `h:\NEO Second Brain\apps\web\next.config.mjs` | ✅ NEW (replaces .ts) |
| next.config.ts | `h:\NEO Second Brain\apps\web\next.config.ts` | ⚠️ Disabled on server (.disabled) |
| app/globals.css | `h:\NEO Second Brain\apps\web\app\globals.css` | ✅ NEW |
| app/layout.tsx | `h:\NEO Second Brain\apps\web\app\layout.tsx` | ✅ NEW |
| app/page.tsx | `h:\NEO Second Brain\apps\web\app\page.tsx` | ✅ NEW |
| stores/board.ts | `h:\NEO Second Brain\apps\web\stores\board.ts` | ✅ NEW |
| components/NoteCard.tsx | `h:\NEO Second Brain\apps\web\components\NoteCard.tsx` | ✅ NEW |
| components/BoardCanvas.tsx | `h:\NEO Second Brain\apps\web\components\BoardCanvas.tsx` | ✅ NEW |

### packages/types — Session 3

| File | Path | Status |
|------|------|--------|
| package.json | `h:\NEO Second Brain\packages\types\package.json` | ✅ |
| src/index.ts | `h:\NEO Second Brain\packages\types\src\index.ts` | ✅ NEW |

### packages/db — Session 3

| File | Path | Status |
|------|------|--------|
| package.json | `h:\NEO Second Brain\packages\db\package.json` | ✅ Modified (added main/exports → src/index.ts) |
| src/index.ts | `h:\NEO Second Brain\packages\db\src\index.ts` | ✅ NEW (barrel: exports client + schema) |
| drizzle.config.ts | `h:\NEO Second Brain\packages\db\drizzle.config.ts` | ✅ |
| .env.example | `h:\NEO Second Brain\packages\db\.env.example` | ✅ |
| src/client.ts | `h:\NEO Second Brain\packages\db\src\client.ts` | ✅ |
| src/migrate.ts | `h:\NEO Second Brain\packages\db\src\migrate.ts` | ✅ |
| src/seed.ts | `h:\NEO Second Brain\packages\db\src\seed.ts` | ✅ |

### packages/db — Schema (10 files)

| File | Path | Status |
|------|------|--------|
| src/schema/users.ts | `h:\NEO Second Brain\packages\db\src\schema\users.ts` | ✅ Created |
| src/schema/workspaces.ts | `h:\NEO Second Brain\packages\db\src\schema\workspaces.ts` | ✅ Created |
| src/schema/boards.ts | `h:\NEO Second Brain\packages\db\src\schema\boards.ts` | ✅ Created |
| src/schema/notes.ts | `h:\NEO Second Brain\packages\db\src\schema\notes.ts` | ✅ Created |
| src/schema/note-events.ts | `h:\NEO Second Brain\packages\db\src\schema\note-events.ts` | ✅ Created |
| src/schema/note-embeddings.ts | `h:\NEO Second Brain\packages\db\src\schema\note-embeddings.ts` | ✅ Created (customType for vector) |
| src/schema/note-relationships.ts | `h:\NEO Second Brain\packages\db\src\schema\note-relationships.ts` | ✅ Created |
| src/schema/conversations.ts | `h:\NEO Second Brain\packages\db\src\schema\conversations.ts` | ✅ Created |
| src/schema/extractions.ts | `h:\NEO Second Brain\packages\db\src\schema\extractions.ts` | ✅ Created |
| src/schema/neo-messages.ts | `h:\NEO Second Brain\packages\db\src\schema\neo-messages.ts` | ✅ Created |
| src/schema/index.ts | `h:\NEO Second Brain\packages\db\src\schema\index.ts` | ✅ Created |

### packages/db — Migrations (8 files)

| File | Path | Status |
|------|------|--------|
| src/migrations/0001_extensions.sql | `h:\NEO Second Brain\packages\db\src\migrations\0001_extensions.sql` | ✅ Created |
| src/migrations/0002_users_workspaces_boards.sql | `h:\NEO Second Brain\packages\db\src\migrations\0002_users_workspaces_boards.sql` | ✅ Created |
| src/migrations/0003_notes.sql | `h:\NEO Second Brain\packages\db\src\migrations\0003_notes.sql` | ✅ Created |
| src/migrations/0004_note_embeddings_relationships.sql | `h:\NEO Second Brain\packages\db\src\migrations\0004_note_embeddings_relationships.sql` | ✅ Created |
| src/migrations/0005_conversations_extractions.sql | `h:\NEO Second Brain\packages\db\src\migrations\0005_conversations_extractions.sql` | ✅ Created |
| src/migrations/0006_neo_messages.sql | `h:\NEO Second Brain\packages\db\src\migrations\0006_neo_messages.sql` | ✅ Created |
| **src/migrations/0007_future_proof.sql** | `h:\NEO Second Brain\packages\db\src\migrations\0007_future_proof.sql` | ✅ Created — **NOT in journal. Apply before Sprint 2.** |
| src/migrations/meta/_journal.json | `h:\NEO Second Brain\packages\db\src\migrations\meta\_journal.json` | ✅ Created — registers 0001–0006 only |

### Documentation

| File | Path | Status |
|------|------|--------|
| docs/09-mvp-blueprint.md | `h:\NEO Second Brain\docs\09-mvp-blueprint.md` | ✅ Created (previous session) |
| docs/10-sprint-1-plan.md | `h:\NEO Second Brain\docs\10-sprint-1-plan.md` | ✅ Created (previous session) |
| docs/11-sprint-1-execution.md | `h:\NEO Second Brain\docs\11-sprint-1-execution.md` | ✅ Created this session |
| CLAUDE.md | `h:\NEO Second Brain\CLAUDE.md` | ✅ Updated now |

---

## Project Structure (Current State — MVP v0.1)

```
h:\NEO Second Brain\
├── CLAUDE.md
├── package.json
├── pnpm-workspace.yaml / turbo.json / tsconfig.base.json
│
├── apps\
│   ├── api\
│   │   ├── package.json                 ← tsx start script, dotenv added
│   │   ├── tsconfig.json
│   │   └── src\
│   │       ├── index.ts                 ← Fastify server (port 5011)
│   │       ├── plugins\
│   │       │   └── db.ts                ← Drizzle client plugin
│   │       └── routes\
│   │           └── notes.ts             ← GET/POST/PATCH/DELETE /notes
│   │
│   └── web\
│       ├── package.json
│       ├── tsconfig.json
│       ├── next.config.mjs              ← transpilePackages + /api rewrites
│       ├── app\
│       │   ├── globals.css
│       │   ├── layout.tsx
│       │   └── page.tsx                 ← Board page (client component)
│       ├── stores\
│       │   └── board.ts                 ← Zustand: notes, pan, zoom
│       └── components\
│           ├── NoteCard.tsx             ← Sticky note: drag + inline edit
│           └── BoardCanvas.tsx          ← CSS transform canvas: pan/zoom
│
└── packages\
    ├── db\
    │   ├── package.json                 ← main: src/index.ts (CRITICAL)
    │   └── src\
    │       ├── index.ts                 ← Barrel: exports createDbClient + schema
    │       ├── client.ts
    │       ├── migrate.ts / seed.ts
    │       ├── schema\                  ← 11 files (10 tables + index.ts)
    │       └── migrations\              ← 7 SQL files + meta/_journal.json
    │
    └── types\
        ├── package.json
        └── src\
            └── index.ts                 ← Note, NoteType, CreateNoteBody, UpdateNoteBody
```

### Live Server State

```
/opt/smartstickynote/
├── app/                    ← monorepo (synced from local)
├── logs/                   ← PM2 logs
├── backups/
├── scripts/
└── ecosystem.config.cjs    ← PM2 config

PM2 processes:
  smartstickynote-api    ← pnpm start → tsx src/index.ts → port 5011
  smartstickynote-web    ← next start → port 5010

Nginx:
  / → 127.0.0.1:5010 (Next.js)
  /api/* → 127.0.0.1:5011 (Fastify, prefix stripped)

Access: http://195.201.81.33/
```

---

## Production Database (Active)

```
Container:    smartstickynote-postgres (Docker, pgvector:pg16)
Host port:    127.0.0.1:5433
Database:     smartstickynote_prod
User:         smartstickynote_app
11 tables:    users, workspaces, boards, notes, note_events,
              note_embeddings, note_relationships, conversations,
              extractions, neo_messages, __drizzle_migrations
Seed data:    1 user (dev@neo.app), 1 workspace, 1 board
BOARD_ID:     78f4567f-02c1-49e9-9b49-b6dd06d570b3
USER_ID:      2a4b76bf-7aa4-47fd-b225-647e01f7586d
WORKSPACE_ID: fb59d291-3a21-4859-a416-83c7f94daf60
```

---

## TODO — Next Steps

### Immediate (server housekeeping)
- [ ] `pm2 startup systemd` + `pm2 save` — processes survive server reboot
- [ ] DNS: Add A record `smartstickynote.z-node.cc` → `195.201.81.33` in Cloudflare
- [ ] Cloudflare: Enable Proxied (orange cloud) for `smartstickynote.z-node.cc`
- [ ] Update Nginx config to add port 443 + SSL for `smartstickynote.z-node.cc`
- [ ] Clarify and resolve user concern about project folder structure

### MVP v0.1 Testing (browser)
- [ ] Open `http://195.201.81.33/` in browser — verify board loads
- [ ] Click **+ New Note** — verify note appears
- [ ] Double-click note — verify inline edit works
- [ ] Drag note — verify position persists after refresh
- [ ] Scroll wheel — verify zoom works
- [ ] Refresh browser — verify all notes still exist

### MVP v0.2 — Add Authentication (Day 3)
- [ ] Create Supabase Cloud project → get URL, ANON_KEY, SERVICE_ROLE_KEY
- [ ] Write `apps/api/src/plugins/auth.ts` — Supabase JWT middleware
- [ ] Write `apps/api/src/routes/auth.ts` — POST /auth/bootstrap
- [ ] Write `apps/api/src/routes/boards.ts` — GET /boards/:id
- [ ] Write `apps/web/lib/supabase.ts` — browser Supabase client
- [ ] Write `apps/web/lib/api.ts` — fetch wrapper with JWT header
- [ ] Write `apps/web/middleware.ts` — route protection
- [ ] Write `apps/web/app/(auth)/login/page.tsx` — login page
- [ ] Update notes routes to use `request.user` instead of hardcoded env IDs
- [ ] DONE when: login → board loads → note persists

### Before Sprint 2
- [ ] Apply migration 0007 (add to journal + run `pnpm db:migrate`)
- [ ] Update Drizzle schema: `noteTypeEnum`, `boards.boardType`, `notes.sourceExcerpt`
- [ ] Update `NoteType` in `packages/types/src/index.ts` — add `'project'` and `'wisdom'`

---

## Unresolved Issues

### Issue 1 — ✅ RESOLVED — DATABASE_URL (was blocker, now done)
`pnpm db:migrate` and `pnpm db:seed` ran successfully on Hetzner server.
DATABASE_URL: `postgresql://smartstickynote_app:[pass]@127.0.0.1:5433/smartstickynote_prod`

### Issue 1 — ✅ RESOLVED — DATABASE_URL
`pnpm db:migrate` and `pnpm db:seed` complete. 11 tables. Seed data verified.

### Issue 2 — ✅ RESOLVED — `packages/types/src/index.ts`
Written. Exports `Note`, `NoteType`, `CreateNoteBody`, `UpdateNoteBody`.

### Issue 3 — ✅ RESOLVED — `apps/web/next.config`
Using `next.config.mjs` (Next.js 14 doesn't support `.ts` config). API rewrites included.

### Issue 4 — Supabase Project Not Created (v0.2 blocker)
Required for auth. MVP v0.1 runs without it. Create before Day 3 (v0.2).
**Resolution: Create at supabase.com when ready for v0.2.**

### Issue 5 — Migration 0007 Not Applied (Intentional)
`0007_future_proof.sql` exists but is NOT in journal. Apply before Sprint 2 Day 1.

### Issue 6 — PM2 Startup Not Configured
`pm2 startup systemd` not run — processes won't survive server reboot.
**Resolution: Run `pm2 startup systemd && pm2 save` on server.**

### Issue 7 — DNS for SmartStickyNote Not Created
`smartstickynote.z-node.cc` → `195.201.81.33` not yet in Cloudflare DNS.
App accessible via IP (`http://195.201.81.33/`) but not via domain.
**Resolution: Add in Cloudflare DNS + enable orange cloud.**

### Issue 8 — `next.config.ts` Exists Locally But Disabled
`apps/web/next.config.ts` still exists locally (disabled as `.disabled` on server).
**Resolution: Rename locally to `next.config.ts.disabled` to avoid confusion.**

### Issue 9 — `panel.z-node.cc` "ไม่ปลอดภัย" Warning
Cloudflare orange cloud not enabled for `panel.z-node.cc`.
**Resolution: Cloudflare DNS → panel.z-node.cc → enable Proxied.**

### Issue 10 — Project Folder Structure (User Concern — Unresolved)
User mentioned "โปรเจ็คนี้ ไม่ถูกจัดเก็บใน folder โปรเจ็คอื่นๆ จึงรวน" — needs clarification.
Could mean: path has spaces, no git repo, or wants different local structure.
**Resolution: Awaiting clarification from user.**

### Issue 11 — No Git Repository
Code is deployed via scp/tar. No version control. Changes must be manually synced.
**Resolution: `git init` + GitHub remote recommended before v0.2.**

### Issue 12 — Extraction Quality Threshold (Sprint 2 Risk)
PRD requires >80% AI extraction acceptance rate. No prompt engineering done.
**Resolution: Early spike in Sprint 2.**

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

---

## Infrastructure Decision (Updated — Session 3)

**All phases:** Supabase Auth + Hetzner VPS (PostgreSQL 16 + pgvector self-hosted)

Supabase DB phase was skipped entirely. Going directly to Hetzner for database hosting from Day 1.

**Reason:** Full control over pgvector tuning required from the start. No Supabase DB at any phase.

**Permanent:** Keep Supabase Auth indefinitely — database migration is easy, auth migration is not.

**Server:** Hetzner CPX31 — 4 vCPU, 8 GB RAM, 160 GB NVMe (~€14/mo)

**DATABASE_URL (production):**
```
postgresql://smartstickynote_app:[password]@127.0.0.1:5432/smartstickynote_prod
```

---

## Infrastructure Golden Rules (Locked — Session 3)

These rules govern ALL deployments of SmartStickyNote. Never violate them.

| Rule | Value |
|------|-------|
| Database name | `smartstickynote_prod` |
| Database user | `smartstickynote_app` |
| App directory | `/opt/smartstickynote/app/` |
| Logs directory | `/opt/smartstickynote/logs/` |
| Backups directory | `/opt/smartstickynote/backups/` |
| Scripts directory | `/opt/smartstickynote/scripts/` |
| Frontend domain | `smartstickynote.z-node.cc` |
| API domain | `api.smartstickynote.z-node.cc` |
| PM2 process (api) | `smartstickynote-api` |
| PM2 process (web) | `smartstickynote-web` |
| Nginx config | `/etc/nginx/sites-available/smartstickynote` |
| env (db) | `/opt/smartstickynote/app/packages/db/.env` |
| env (api) | `/opt/smartstickynote/app/apps/api/.env` |
| env (web) | `/opt/smartstickynote/app/apps/web/.env.production` |

**Never share database, table, schema, env vars, storage, PM2 process names, or Nginx configs with any other project.**

**The server must be multi-project ready:** Boonma, JoyRide, Kidpost can coexist on the same machine in the future. Each project gets its own `/opt/[project]/` tree, database, user, PM2 processes, and Nginx config. No project knows about another.

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
| Frontend | Next.js 14 + TypeScript + Zustand + Tailwind | Locked |
| Canvas | CSS transforms + quadtree spatial index | Locked |
| Backend | Fastify 4 + Node.js + TypeScript | Locked |
| Database | PostgreSQL 16 + pgvector | Locked |
| ORM | Drizzle ORM v0.30.10 + drizzle-kit v0.21.4 | Locked |
| Cache / Queue | Redis + BullMQ (Sprint 2+) | Pending |
| LLM | Anthropic Claude API (claude-sonnet-4-6) | Locked |
| Embeddings | OpenAI text-embedding-3-small | Locked |
| Storage | Cloudflare R2 | Pending |
| Auth | Supabase Auth | Locked |
| DB Hosting | Hetzner CPX31 (self-hosted PostgreSQL 16 + pgvector) | Locked |
| Frontend hosting | smartstickynote.z-node.cc (Nginx on Hetzner) | Locked |
| Backend hosting | api.smartstickynote.z-node.cc (Nginx on Hetzner) | Locked |
| Package manager | pnpm 9.15.9 | Locked |
| Monorepo | Turborepo | Locked |
