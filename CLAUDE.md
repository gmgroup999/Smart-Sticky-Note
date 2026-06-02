# NEO Second Brain — Project Context

> This file helps Claude Code maintain continuity across sessions.
> Updated: 2026-06-02 (Session 5 — Strategic Planning + Sprint 1 Pre-Analysis)

---

## What Is This Project?

SmartStickyNote is an AI-powered external memory system that extracts structured
knowledge from conversations, organizes it as a spatial knowledge graph, and lets
the user query it through an AI assistant (NEO) that cites the exact notes that
contain the answer.

**One-sentence definition (locked):**
*SmartStickyNote is an AI memory layer that extracts structured knowledge from your conversations, organizes it as a spatial knowledge graph, and lets you query it through an AI assistant that cites the exact notes that contain the answer.*

**Strategic direction (locked — Session 5):** Option C — Memory Layer for NEO.
Not a sticky note app. Not an Obsidian clone. A conversation-to-knowledge pipeline with a spatial UI.

---

## Current Sprint Status

| Sprint | Name | Status | Notes |
|--------|------|--------|-------|
| Sprint 0 | Monorepo + Schema | ✅ COMPLETE | — |
| MVP v0.1 | No Auth, Single User | ✅ LIVE | `https://note.z-node.cc` |
| Phase 1 | Production Foundation | ✅ 72% COMPLETE | Infra, backup, git done |
| **Sprint 1** | **Make Notes Useful** | **🔵 ANALYSIS COMPLETE — NOT YET CODED** | Pre-impl analysis done, awaiting impl |
| Sprint 2 | Make Notes Findable | ⏳ Not started | — |
| Sprint 3 | Make Notes Organized | ⏳ Not started | — |
| Sprint 4 | First AI Value | ⏳ Not started | Sync extraction, no queue |

---

## Work Completed (Sessions 1–5)

### Sessions 1–2 — Architecture + Design + Local Code

| Work | Result |
|------|--------|
| Product design docs (PRD, Architecture, UX, Data Model, etc.) | ✅ In `docs/` |
| MVP Blueprint, Sprint 1 Plan, Sprint 1 Execution Plan | ✅ `docs\09–11` |
| Monorepo scaffolding, package.json files, pnpm install | ✅ Done |
| SQL migrations 0001–0006, journal, all 10 Drizzle schema files | ✅ Done |
| `migrate.ts`, `seed.ts`, `client.ts`, `drizzle.config.ts` | ✅ Done |
| Migration 0007 written (NOT in journal — apply before Sprint 2) | ✅ Done |

### Session 3 — Hetzner Setup + MVP v0.1 Build + Deploy

| Work | Result |
|------|--------|
| Hetzner server setup, PM2, Node.js, pnpm, PostgreSQL Docker | ✅ Done |
| SSL certificates, Nginx for neo.z-node.cc and panel.z-node.cc | ✅ Done |
| DB migrations applied (6/7), seed data verified | ✅ Done |
| All 10 MVP source files written and deployed | ✅ Done |
| **MVP v0.1 LIVE** on Hetzner | ✅ |

### Session 4 — Nginx Fix + Phase 1 Production Foundation

| Work | Result |
|------|--------|
| Fixed: `https://note.z-node.cc` showed NEO login (missing port 443 block) | ✅ Done |
| Added `/api/health`, `/api/stats`, `/api/export` endpoints | ✅ Done |
| Created `.env.example`, `DEPLOYMENT.md`, `ARCHITECTURE.md`, `.gitignore` | ✅ Done |
| PM2 startup on reboot (`pm2-jack.service`) | ✅ Done |
| Daily backup script + cron (02:00, 7-day retention) | ✅ Done |
| `git init` + pushed to `https://github.com/gmgroup999/Smart-Sticky-Note` | ✅ Done |
| Full Project Audit (production readiness: 55/100) | ✅ Done |

### Session 5 — Strategic Planning + Sprint 1 Pre-Analysis (2026-06-02)

| Work | Result |
|------|--------|
| **Strategic Architecture Review** — analyzed all 11 DB tables + full source code | ✅ Done |
| Evaluated 3 options: Canvas app / PKM / NEO Memory Layer | ✅ Done |
| **Decision: Option C — Memory Layer for NEO** (uses 100% of schema, unique moat) | ✅ LOCKED |
| **Official Product Definition** — 1-sentence, 1-paragraph, full vision, workflow, V1/V2 | ✅ Done |
| **Product Validation Review** — identified 10 critical assumptions, ranked by risk | ✅ Done |
| Validated: must test Assumption 1 (review completion) + Assumption 2 (extraction quality ≥80%) before Phase 3 infra | ✅ Done |
| **Founder Daily Use Analysis** — current daily use score: **2/10** | ✅ Done |
| Gap analysis: notes are title-only, no search, no delete button, no detail fields in UI | ✅ Done |
| **Sprint 1 Pre-Implementation Analysis** — full architecture review before coding | ✅ Done |
| Confirmed: store, types, and API need ZERO changes — only frontend files | ✅ Done |
| Identified bug: NoteCard PATCHes position on every click, not just on actual drag | ✅ Documented |
| Sprint 1 implementation plan: 1 new file + 2 modified files, ~10 hrs work | ✅ Ready |

---

## Strategic Decisions Locked (Session 5)

### Product Direction

| Decision | Value |
|----------|-------|
| Product type | AI Memory Layer (Option C) — not a canvas tool or PKM |
| Core workflow | Paste conversation → AI extract → Human review → Approved notes → Canvas → Ask NEO |
| Unique differentiator | NEO cites exact notes on canvas when answering questions |
| Killer assumption | Extraction acceptance rate ≥80% — if wrong, product fails |
| Validate before | Building BullMQ / Redis / embeddings / semantic search / NEO chat |

### Validation Strategy

| Stage | Engineering | Users | Gate |
|-------|-------------|-------|------|
| Stage 0 — Wizard of Oz | 0 | 5 | Concept legible, ≥4/5 say "I'd use this" |
| Stage 1 — Sync extraction | 2 weeks | 15 | Completion ≥65%, acceptance ≥70%, return ≥40% |
| Stage 2 — Full pipeline | 6–8 weeks | — | Only if Stage 1 passes all 5 metrics |

**Do NOT build BullMQ, Redis, or embeddings before Stage 1 validation passes.**

### Founder-First Priority

| Priority | Rationale |
|----------|-----------|
| Make notes useful (Sprint 1) FIRST | Daily use score is 2/10. Can't validate extraction without a working note UI. |
| Then make notes findable (Sprint 2) | Search unblocks daily use |
| Then first AI value (Sprint 4 lite) | Synchronous extraction only — no queue |
| Auth deferred | Single user, private server — auth is not blocking daily use |

---

## Sprint 1 — Make Notes Useful (PRE-ANALYSIS COMPLETE)

### Scope

| Feature | What it adds | Status |
|---------|-------------|--------|
| Note Detail Panel | Click note → slide-in panel: type, summary, details, tags, dates, delete | 🔵 Planned |
| Note Type Selector | 9 colored types in panel (currently hardcoded to 'idea') | 🔵 Planned |
| Delete Button | In panel with confirmation (endpoint exists, no UI) | 🔵 Planned |
| Tags UI | Add/remove pill tags in panel (endpoint exists, no UI) | 🔵 Planned |
| Drag bug fix | Only PATCH position on actual drag (>3px), not on every click | 🔵 Planned |

### Files to change (confirmed from source code analysis)

| Action | File | What Changes |
|--------|------|-------------|
| **CREATE** | `apps/web/components/NoteDetailPanel.tsx` | NEW ~230 lines — full panel component |
| **MODIFY** | `apps/web/components/NoteCard.tsx` | Remove inline edit, fix drag-vs-click bug |
| **MODIFY** | `apps/web/app/page.tsx` | Add `<NoteDetailPanel>` render |

**Files NOT changed:** `board.ts` (store), `BoardCanvas.tsx`, any API files, any types, any migrations.

### Key architectural findings from pre-analysis

- `selectedNoteId` in Zustand store already drives panel open/close — no store changes needed
- `updateNote(id, patch)` in store already covers all panel fields — no store changes needed
- `UpdateNoteBody` type already has all fields (summary, details, noteType, tags) — no type changes needed
- PATCH and DELETE endpoints already handle all operations — no API changes needed
- `BoardCanvas.onMouseDown` already calls `selectNote(null)` on background click — panel closes automatically
- **Bug confirmed (line 54–67 NoteCard.tsx):** `onUp` fires PATCH on every mouseUp including pure clicks

### Interaction model (decided)

- **Single click (mouseDown)** → select note → panel opens
- **Drag** → panel stays open, position updates live, PATCH only if moved >3px
- **Click canvas background** → `selectNote(null)` → panel closes
- **No more inline title edit in NoteCard** — all editing moves to panel
- **Auto-save on blur** for text fields; **immediate save** for type + tags

### Estimated work: 10 hours (2 days)

---

## Files Created / Modified Locally (All Sessions)

### Monorepo Root

| File | Path | Status |
|------|------|--------|
| .gitignore | `h:\NEO Second Brain\.gitignore` | ✅ |
| DEPLOYMENT.md | `h:\NEO Second Brain\DEPLOYMENT.md` | ✅ |
| ARCHITECTURE.md | `h:\NEO Second Brain\ARCHITECTURE.md` | ✅ |
| CLAUDE.md | `h:\NEO Second Brain\CLAUDE.md` | ✅ Updated now |
| package.json | `h:\NEO Second Brain\package.json` | ✅ |
| pnpm-workspace.yaml / turbo.json / tsconfig.base.json | `h:\NEO Second Brain\` | ✅ |

### apps/api

| File | Path | Status |
|------|------|--------|
| package.json | `h:\NEO Second Brain\apps\api\package.json` | ✅ |
| tsconfig.json | `h:\NEO Second Brain\apps\api\tsconfig.json` | ✅ |
| .env.example | `h:\NEO Second Brain\apps\api\.env.example` | ✅ |
| src/index.ts | `h:\NEO Second Brain\apps\api\src\index.ts` | ✅ (error handler + healthRoutes) |
| src/plugins/db.ts | `h:\NEO Second Brain\apps\api\src\plugins\db.ts` | ✅ |
| src/routes/notes.ts | `h:\NEO Second Brain\apps\api\src\routes\notes.ts` | ✅ |
| src/routes/health.ts | `h:\NEO Second Brain\apps\api\src\routes\health.ts` | ✅ |

### apps/web

| File | Path | Status |
|------|------|--------|
| package.json | `h:\NEO Second Brain\apps\web\package.json` | ✅ |
| tsconfig.json | `h:\NEO Second Brain\apps\web\tsconfig.json` | ✅ |
| .env.example | `h:\NEO Second Brain\apps\web\.env.example` | ✅ |
| next.config.mjs | `h:\NEO Second Brain\apps\web\next.config.mjs` | ✅ |
| next.config.ts.disabled | `h:\NEO Second Brain\apps\web\next.config.ts.disabled` | ✅ (excluded from git) |
| app/globals.css | `h:\NEO Second Brain\apps\web\app\globals.css` | ✅ |
| app/layout.tsx | `h:\NEO Second Brain\apps\web\app\layout.tsx` | ✅ |
| app/page.tsx | `h:\NEO Second Brain\apps\web\app\page.tsx` | ✅ → WILL MODIFY in Sprint 1 |
| stores/board.ts | `h:\NEO Second Brain\apps\web\stores\board.ts` | ✅ (no changes in Sprint 1) |
| components/NoteCard.tsx | `h:\NEO Second Brain\apps\web\components\NoteCard.tsx` | ✅ → WILL MODIFY in Sprint 1 |
| components/BoardCanvas.tsx | `h:\NEO Second Brain\apps\web\components\BoardCanvas.tsx` | ✅ (no changes in Sprint 1) |
| components/NoteDetailPanel.tsx | `h:\NEO Second Brain\apps\web\components\NoteDetailPanel.tsx` | ❌ NOT YET CREATED |

### packages/types

| File | Path | Status |
|------|------|--------|
| package.json | `h:\NEO Second Brain\packages\types\package.json` | ✅ |
| src/index.ts | `h:\NEO Second Brain\packages\types\src\index.ts` | ✅ (no changes in Sprint 1) |

### packages/db

| File | Path | Status |
|------|------|--------|
| package.json | `h:\NEO Second Brain\packages\db\package.json` | ✅ |
| drizzle.config.ts | `h:\NEO Second Brain\packages\db\drizzle.config.ts` | ✅ |
| .env.example | `h:\NEO Second Brain\packages\db\.env.example` | ✅ |
| src/index.ts | `h:\NEO Second Brain\packages\db\src\index.ts` | ✅ |
| src/client.ts | `h:\NEO Second Brain\packages\db\src\client.ts` | ✅ |
| src/schema/ (10 files) | `h:\NEO Second Brain\packages\db\src\schema\` | ✅ |
| src/migrations/ (7 SQL + journal) | `h:\NEO Second Brain\packages\db\src\migrations\` | ✅ |

---

## Files on Hetzner Server

| File | Path | Notes |
|------|------|-------|
| Nginx config | `/etc/nginx/sites-available/smartstickynote` | Port 80 redirect + port 443 SSL |
| Backup script | `/opt/smartstickynote/scripts/backup.sh` | pg_dump + gzip + 7-day retention |
| PM2 ecosystem | `/opt/smartstickynote/ecosystem.config.cjs` | Logs to /opt/smartstickynote/logs/ |
| PM2 systemd | `/etc/systemd/system/pm2-jack.service` | Auto-start on reboot |
| API .env | `/opt/smartstickynote/app/apps/api/.env` | DB URL + seeded IDs + PORT=5011 |
| DB .env | `/opt/smartstickynote/app/packages/db/.env` | DATABASE_URL |
| SSL cert | `/etc/ssl/cloudflare/z-node.cc.pem` | Covers *.z-node.cc, expires 2041 |

---

## Project Structure (Current — Sprint 1 Pre-Analysis)

```
h:\NEO Second Brain\                  (git: main, 2 commits → GitHub)
├── .gitignore / CLAUDE.md / DEPLOYMENT.md / ARCHITECTURE.md
├── package.json / pnpm-workspace.yaml / turbo.json / tsconfig.base.json
│
├── apps\
│   ├── api\                          ← NO CHANGES needed for Sprint 1
│   │   └── src\
│   │       ├── index.ts
│   │       ├── plugins\db.ts
│   │       └── routes\notes.ts / health.ts
│   │
│   └── web\
│       ├── next.config.mjs
│       ├── app\
│       │   ├── globals.css / layout.tsx
│       │   └── page.tsx              ← MODIFY in Sprint 1 (add NoteDetailPanel)
│       ├── stores\
│       │   └── board.ts              ← NO CHANGES (already has selectedNoteId)
│       └── components\
│           ├── NoteCard.tsx          ← MODIFY in Sprint 1 (remove inline edit, fix drag bug)
│           ├── BoardCanvas.tsx       ← NO CHANGES
│           └── NoteDetailPanel.tsx   ← CREATE in Sprint 1 (main Sprint 1 deliverable)
│
└── packages\
    ├── db\src\ (schema + migrations)  ← NO CHANGES for Sprint 1
    └── types\src\index.ts             ← NO CHANGES (UpdateNoteBody already has all fields)
```

---

## API Endpoints (Current)

| Method | Browser Path | Description | Auth |
|--------|-------------|-------------|------|
| GET | `/api/health` | `{status,service,timestamp}` | None |
| GET | `/api/stats` | `{notes,users,uptime,version}` | None |
| GET | `/api/export` | All active notes as JSON | None |
| GET | `/api/notes` | Active notes for board | None |
| POST | `/api/notes` | Create note (title, noteType, posX, posY) | None |
| PATCH | `/api/notes/:id` | Update note (all fields supported) | None |
| DELETE | `/api/notes/:id` | Soft delete | None |

---

## Production Database (Active)

```
Container:    smartstickynote-postgres (Docker, pgvector:pg16)
Port:         127.0.0.1:5433
Database:     smartstickynote_prod
Migrations:   6/7 applied (0007 deferred — project/wisdom types, board_type, source_excerpt)
Live data:    3 notes, 1 user, 1 workspace, 1 board
BOARD_ID:     78f4567f-02c1-49e9-9b49-b6dd06d570b3
USER_ID:      2a4b76bf-7aa4-47fd-b225-647e01f7586d
WORKSPACE_ID: fb59d291-3a21-4859-a416-83c7f94daf60
```

---

## Production Readiness Score

| Category | Score | Key Gap |
|----------|-------|---------|
| Infrastructure | 75/100 | `.env.production` missing on server |
| Security | 25/100 | No auth, no rate limiting, no input validation |
| Database | 80/100 | No RLS, migration 0007 not applied |
| API | 60/100 | No auth, no validation, no pagination |
| **Frontend / Daily Use** | **20/100** | **No detail panel, no search, no delete UI** |
| Monitoring | 55/100 | No external monitor, no log rotation |
| Backup | 55/100 | No off-site, no restore docs |
| Documentation | 70/100 | No README, no API docs |
| **OVERALL** | **55/100** | Not production-ready without auth + detail panel |

---

## Git Repository

```
Local:    h:\NEO Second Brain\
Remote:   https://github.com/gmgroup999/Smart-Sticky-Note
Branch:   main
Commits:  2
  6a73a17  feat: MVP v0.1 — SmartStickyNote production foundation
  c2d1d46  docs: update CLAUDE.md for Session 4
Status:   CLAUDE.md updated — needs commit after this session
```

---

## TODO — Prioritized Next Steps

### Immediate — Sprint 1 (Next coding session)

- [ ] **CREATE** `apps/web/components/NoteDetailPanel.tsx`
  - Fixed right panel (360px), slide-in animation, dark theme
  - Fields: type selector, title, summary, details, tags, dates, delete
  - Auto-save on blur (text fields), immediate save (type + tags)
  - Delete: `window.confirm()` → DELETE → `removeNote` → `selectNote(null)`
- [ ] **MODIFY** `apps/web/components/NoteCard.tsx`
  - Remove: `editing` state, `draft` state, `onDoubleClick`, inline textarea
  - Fix: only PATCH position when `rawDx > 3 || rawDy > 3` (not on every click)
- [ ] **MODIFY** `apps/web/app/page.tsx`
  - Add `<NoteDetailPanel noteId={selectedNoteId} onClose={() => selectNote(null)} />`
- [ ] Deploy to server after Sprint 1 complete

### After Sprint 1

- [ ] Sprint 2: Search UI (`GET /api/notes?q=` using existing FTS index)
- [ ] Sprint 2: Type filter bar on canvas
- [ ] Sprint 2: Tag filter
- [ ] Sprint 3: Multiple boards (board selector UI + `POST /api/boards`)
- [ ] Sprint 3: Archive notes
- [ ] Apply migration 0007 (`project` + `wisdom` types)

### Before Phase 3 (AI Extraction)

- [ ] **Stage 0 validation** (Wizard of Oz, 5 users, 0 engineering)
  - Manually extract notes from real conversations
  - Show as Google Slides / Cards to 5 target users
  - Gate: ≥4/5 say "I'd use this regularly"
- [ ] **Stage 1 validation** (synchronous extraction, 15 users, 2 weeks engineering)
  - Gate: completion ≥65%, acceptance ≥70%, 7-day return ≥40%
  - **Do NOT build BullMQ/Redis/embeddings until Stage 1 passes**

### P1 Infrastructure (outstanding)

- [ ] Create `apps/web/.env.production` on server (missing — using hardcoded fallback)
- [ ] Add `@fastify/rate-limit` (no rate limiting on API)
- [ ] Add log rotation (`pm2 install pm2-logrotate`)
- [ ] Set up UptimeRobot on `https://note.z-node.cc/api/health`
- [ ] Add restore procedure to DEPLOYMENT.md

---

## Unresolved Issues

### ✅ Resolved (Sessions 1–4)

Issues 1–3: DATABASE_URL, types barrel, next.config format — fixed.
Issue 6: PM2 startup — `pm2-jack.service` enabled.
Issue 8: `next.config.ts` — renamed to `.disabled`.
Issue 10: Project folder structure — resolved.
Issue 11: No git repository — initialized and pushed.

### Active Issues

**Issue 4 — Supabase Project Not Created (v0.2 blocker)**
Auth needed for multi-user. MVP works without it. Create at supabase.com when starting auth work.

**Issue 5 — Migration 0007 Not Applied**
`0007_future_proof.sql` exists (project, wisdom types, board_type, source_excerpt). NOT in journal. Apply before Sprint 2 by adding to journal + running `pnpm db:migrate` on server.

**Issue 7 — Domain inconsistency**
Golden Rules say `smartstickynote.z-node.cc`. App is on `note.z-node.cc`. Working fine. No action unless domain change requested.

**Issue 9 — `panel.z-node.cc` security warning**
Cloudflare orange cloud not enabled. Resolution: Cloudflare DNS → enable Proxied for panel.z-node.cc.

**Issue 12 — Extraction quality (Sprint 4 risk)**
PRD requires ≥80% acceptance rate. No prompt engineering done. Early spike required.

**Issue 13 — `apps/web/.env.production` missing on server**
File not present. Next.js uses hardcoded fallback `http://127.0.0.1:5011`. Works but not explicit.

**Issue 14 — No input validation on API routes**
`@sinclair/typebox` installed but not wired. Malformed body reaches DB.

**Issue 15 — No rate limiting**
API is open. Any client can flood it.

**Issue 16 — Log files grow unbounded**
`api-err.log` was 76KB from crash cycles. No rotation configured.

**Issue 17 — Backup not off-site**
Daily backup to same server only. Server failure = data loss.

**Issue 18 — No external uptime monitor**
No alerts if app goes down.

**Issue 19 — NoteCard.tsx drag bug (NEW — confirmed in Sprint 1 analysis)**
`NoteCard.tsx:54–67` — `onUp` handler PATCHes position on **every** mouseUp, including pure clicks where `dx === dy === 0`. Every click on a note sends a spurious PATCH request. Fix: only PATCH when `Math.abs(rawDx) > 3 || Math.abs(rawDy) > 3`. Will be fixed in Sprint 1.

**Issue 20 — Notes have no content depth (NEW — root cause of 2/10 daily use score)**
All note fields beyond title (summary, details, noteType, tags) are unreachable in the UI. The PATCH endpoint and DB schema support them fully. The frontend simply has no input fields for them. Root cause: MVP was intentionally minimal. Fix: Sprint 1 (NoteDetailPanel).

---

## Key Product + Architecture Decisions (Locked)

| Decision | Rationale |
|----------|-----------|
| Option C — NEO Memory Layer | Only direction that uses 100% of schema. Unique moat. |
| Validate extraction before building queue | Assumption 2 (AI quality ≥80%) is existential. Test with 15 users first. |
| Founder-first before external validation | Daily use score 2/10 — can't validate with strangers on a broken tool. |
| Sprint 1 before Phase 3 | Detail panel is prerequisite for both daily use AND extraction demos. |
| Store needs no changes for Sprint 1 | `selectedNoteId` already drives panel open/close. |
| Types need no changes for Sprint 1 | `UpdateNoteBody` already has all fields. |
| Modular monolith (not microservices) | Development velocity for MVP. |
| PostgreSQL + pgvector | Operational simplicity; no dedicated vector DB. |
| Claude API for extraction | Best structured JSON output quality. |
| Drizzle ORM with raw SQL migrations | Schema control; additive-only philosophy. |
| `note_type` enum: 7 now + project/wisdom in 0007 | Cannot change enum values after production data. |
| Soft deletes only (`deleted_at`) | Nothing is permanently destroyed. |
| NEO reads memory, never writes directly | AI errors cannot corrupt the knowledge base. |
| `note.z-node.cc` as production domain | User chose this over `smartstickynote.z-node.cc`. |
| `next.config.mjs` (not `.ts`) | Next.js 14.2.0 does not support `.ts` config files. |
| `packages/db/package.json` must have `main`+`exports` | tsx resolver requires explicit entry point for workspace packages. |

---

## Infrastructure Golden Rules (Locked)

| Rule | Value |
|------|-------|
| Database name | `smartstickynote_prod` |
| Database user | `smartstickynote_app` |
| App directory | `/opt/smartstickynote/app/` |
| PM2 process (api) | `smartstickynote-api` |
| PM2 process (web) | `smartstickynote-web` |
| Nginx config | `/etc/nginx/sites-available/smartstickynote` |
| Active domain | `note.z-node.cc` |
| env (api) | `/opt/smartstickynote/app/apps/api/.env` |
| env (web) | `/opt/smartstickynote/app/apps/web/.env.production` |

**Never share DB, tables, env vars, PM2 names, or Nginx configs with any other project.**

---

## Tech Stack (Locked)

| Layer | Technology | Status |
|-------|-----------|--------|
| Frontend | Next.js 14 + TypeScript + Zustand | Active |
| Canvas | CSS transforms (translate + scale) | Active |
| Backend | Fastify 4 + Node.js + TypeScript (tsx) | Active |
| Database | PostgreSQL 16 + pgvector 0.8.2 | Active |
| ORM | Drizzle ORM v0.30 | Active |
| LLM (extraction) | Anthropic Claude API | Planned Phase 3 |
| Embeddings | OpenAI text-embedding-3-small | Planned Phase 4 |
| Queue | BullMQ + Redis | Planned Phase 3 (AFTER validation) |
| Auth | Supabase Auth | Planned v0.2 |
| Domain | `note.z-node.cc` (Cloudflare Orange Cloud) | Active |
| Git | GitHub (`gmgroup999/Smart-Sticky-Note`) | Active |
| Package manager | pnpm 9.15.9 | Active |
| Monorepo | Turborepo | Active |
