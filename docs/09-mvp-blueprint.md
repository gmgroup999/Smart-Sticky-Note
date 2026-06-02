# NEO Second Brain — MVP Blueprint

> Generated: 2026-06-02
> This document is the single source of truth for MVP design and build order.

---

## Part 1 — Product Scope

### The One Thing MVP Must Prove

> **Paste a conversation. Get a Second Brain.**

Every decision below is filtered through this test:
*"Does this help prove Conversation → Knowledge?"*
If no → cut.

---

### What's In

| # | Feature | Why It's In |
|---|---------|------------|
| 1 | **Board** | The container. Notes need a home. One board per user at MVP. |
| 2 | **Smart Sticky Note** | The atom of the system. All knowledge lives here. |
| 3 | **Import Conversation** | The entry point. This is the killer demo. |
| 4 | **AI Extraction** | The magic. Conversation → Notes automatically. |
| 5 | **Search** | Retrieval. Notes mean nothing if you can't find them. |
| 6 | **NEO Chat** | The payoff. Ask your memory, get answers from your past self. |

### What's Out of MVP (Explicitly)

| Cut Feature | Reason |
|-------------|--------|
| Multiple boards per user | One board is enough to prove the concept |
| Board sharing / collaboration | Solo tool at MVP |
| Mission Wall / Project Wall as separate types | One Board type, user organizes themselves |
| Mobile app | Desktop-first for focused capture experience |
| Knowledge Graph visualization | Nice to have, not MVP proof |
| Workflow automation | Explicitly out per Vision rules |
| Real-time sync | Single user, no need |
| File attachments | Text-first at MVP |
| Notifications | No push events yet |
| Billing / payments | Not needed for MVP validation |
| User settings / preferences | Defaults only |

---

### MVP User Profile (One Persona)

**Alex — Solo Founder, 28–40**

- Has long ChatGPT / Claude conversations daily
- Loses good ideas, decisions, insights inside those chats
- Currently copies key points to Notion but stops doing it after a week
- Core problem: *"I know I figured this out before. I just can't find it."*
- Jobs to be done:
  1. Save what matters from conversations without effort
  2. Recall past decisions and ideas when relevant
  3. Feel like their knowledge is accumulating, not disappearing

---

## Part 2 — User Journey

### Journey 1: First Use (Onboarding → First Notes Created)

```
STEP 1  Land on /onboarding
        ↓
        "Welcome to NEO. Your second brain starts with one paste."
        No form. No tutorial. One big input box.

STEP 2  Paste a conversation from ChatGPT / Claude / meeting notes
        ↓
        Click "Extract Knowledge"

STEP 3  Watch AI analyze (3–8 seconds)
        ↓
        Extraction Preview appears:
        "Found 4 ideas, 2 decisions, 1 goal"
        User sees draft sticky notes with types + titles

STEP 4  Review & confirm
        ↓
        User can edit titles, change types, delete any
        Click "Add to Board"

STEP 5  Notes appear on Board
        ↓
        Spatial layout: ideas cluster left, decisions cluster right
        User sees their first Second Brain moment

STEP 6  Optional: ask NEO
        ↓
        "What decisions did I just make?"
        NEO answers citing the exact notes just created
```

**Time to value: under 3 minutes.**

---

### Journey 2: Daily Use (Returning User)

```
STEP 1  Open Board
        ↓
        See all notes from previous sessions
        Spatial memory kicks in — "I put that over there"

STEP 2  Import new conversation (paste)
        ↓
        AI extracts new notes
        Duplicates flagged: "Similar to existing note: [X]"
        User merges or keeps separate

STEP 3  Browse / reorganize
        ↓
        Drag notes around
        Open a note for full detail

STEP 4  Search when needed
        ↓
        Type query: "startup pricing"
        Semantic results return relevant notes across all time

STEP 5  Ask NEO when needed
        ↓
        "What did I decide about pricing last month?"
        NEO returns answer + cites exact notes as sources
```

---

### Journey 3: Recall (The Payoff)

```
Problem: User is in a new conversation about a topic they've worked on before.
         They want to know what they already know.

ACTION:  Open NEO Chat panel
         Type: "What do I know about go-to-market for SaaS?"

NEO:     "Based on 6 notes from March–May, you decided to focus on
          direct outbound first. You also had concerns about pricing
          anchoring too early. [Note: GTM Strategy v2] [Note: Pricing Risk]"

RESULT:  User gets a briefing from their past self in 10 seconds.
         This is the moment NEO becomes indispensable.
```

---

## Part 3 — UI Wireframes

### Screen 1: Board (Main Workspace)

```
┌─────────────────────────────────────────────────────────────────────┐
│  NEO                           [Search ___________] [Import] [NEO▶] │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│   ╔═══════════╗    ╔═══════════╗    ╔═══════════╗                  │
│   ║ 💡 IDEA   ║    ║ ✅ GOAL   ║    ║ ⚡ DECISION║                  │
│   ║           ║    ║           ║    ║           ║                  │
│   ║ Pricing   ║    ║ Launch    ║    ║ Use Claude║                  │
│   ║ should be ║    ║ in 30     ║    ║ not GPT-4 ║                  │
│   ║ $29/mo    ║    ║ days      ║    ║           ║                  │
│   ║           ║    ║           ║    ║           ║                  │
│   ║ May 28    ║    ║ May 29    ║    ║ May 30    ║                  │
│   ╚═══════════╝    ╚═══════════╝    ╚═══════════╝                  │
│                                                                     │
│        ╔═══════════╗    ╔═══════════╗                              │
│        ║ 📚 LEARN  ║    ║ ❓ QUEST  ║                              │
│        ║           ║    ║           ║                              │
│        ║ Founders  ║    ║ Who is    ║                              │
│        ║ need JTBD ║    ║ my ICP?   ║                              │
│        ║ clarity   ║    ║           ║                              │
│        ║           ║    ║           ║                              │
│        ║ May 28    ║    ║ May 31    ║                              │
│        ╚═══════════╝    ╚═══════════╝                              │
│                                                                     │
│  [+ New Note]                                          Zoom: ──●── │
└─────────────────────────────────────────────────────────────────────┘
```

**Board behaviors:**
- Drag to pan (hold space + drag or middle mouse)
- Scroll to zoom (mouse wheel)
- Click note → open detail panel on right
- Double-click empty space → create new blank note
- Notes have slight random rotation (±2°)
- Color by type (Idea=yellow, Decision=blue, Goal=green, Learning=purple, Question=orange)

---

### Screen 2: Import Conversation Dialog

```
┌─────────────────────────────────────────────────────────────────────┐
│  Import Conversation                                           [✕]  │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  Source:  ○ ChatGPT  ○ Claude  ○ Meeting Notes  ○ Other           │
│                                                                     │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │                                                               │  │
│  │  Paste your conversation here...                             │  │
│  │                                                               │  │
│  │                                                               │  │
│  │                                                               │  │
│  │                                                               │  │
│  │                                                               │  │
│  │                                                               │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│  Context (optional):                                                │
│  ┌───────────────────────────────────────────────────────────────┐  │
│  │  What was this conversation about? (helps AI extract better)  │  │
│  └───────────────────────────────────────────────────────────────┘  │
│                                                                     │
│                              [Cancel]  [Extract Knowledge →]        │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Screen 3: Extraction Preview

```
┌─────────────────────────────────────────────────────────────────────┐
│  Extraction Preview                                                 │
│  Found 6 knowledge objects in your conversation                     │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  ✓  💡 IDEA      Pricing should start at $29/mo for solo founders  │
│                  "The conversation suggested value-based pricing..." │
│                  Tags: pricing, gtm                    [Edit] [✕]  │
│                                                                     │
│  ✓  ✅ GOAL      Launch beta to 50 users within 30 days            │
│                  "Explicit goal stated: 50 users in 30 days..."     │
│                  Tags: launch, growth                  [Edit] [✕]  │
│                                                                     │
│  ✓  ⚡ DECISION   Use Claude API, not OpenAI                        │
│                  "Decision made: Claude for extraction quality..."  │
│                  Tags: tech, ai                        [Edit] [✕]  │
│                                                                     │
│  ✓  📚 LEARNING  Founders need JTBD clarity before GTM             │
│                  "Key insight: know the job before the channel..."  │
│                  Tags: strategy, jtbd                  [Edit] [✕]  │
│                                                                     │
│  ✗  ❓ QUESTION  Who exactly is the ICP?                            │
│                  "Unresolved: ICP definition still unclear..."      │
│                  Tags: research                        [Edit] [✕]  │
│                                                                     │
│  ─────────────────────────────────────────────────────────────────  │
│  ⚠ Similar to existing note: "Pricing Model" — Merge or Keep Both? │
│                                                                     │
│                [Select All] [Deselect All]  [Add to Board →]        │
└─────────────────────────────────────────────────────────────────────┘
```

---

### Screen 4: Note Detail Panel

```
┌───────────────────────────────────┐
│  ⚡ DECISION                [Edit] │
├───────────────────────────────────┤
│                                   │
│  Use Claude API, not OpenAI       │
│  ─────────────────────────────── │
│                                   │
│  Summary                          │
│  Use Claude API for extraction.   │
│  Better instruction following.    │
│                                   │
│  Details                          │
│  Decided during architecture      │
│  review on May 30. Claude         │
│  claude-sonnet-4-6 selected for   │
│  structured JSON output quality.  │
│                                   │
│  Tags                             │
│  [tech] [ai] [architecture]  [+] │
│                                   │
│  Related Notes                    │
│  → AI Extraction Pipeline design  │
│  → Tech Stack Decision            │
│                               [+] │
│                                   │
│  Source                           │
│  Claude conversation · May 30     │
│                                   │
│  ─────────────────────────────── │
│  Ask NEO about this note          │
│  [________________________] [→]   │
│                                   │
└───────────────────────────────────┘
```

---

### Screen 5: NEO Chat Panel

```
┌───────────────────────────────────┐
│  NEO                         [✕]  │
│  Your Second Brain                │
├───────────────────────────────────┤
│                                   │
│                          You      │
│  What do I know about my         │
│  pricing strategy?                │
│                                   │
│  NEO                              │
│  ┌─────────────────────────────┐  │
│  │ Based on 3 notes from your  │  │
│  │ board:                      │  │
│  │                             │  │
│  │ • You decided on $29/mo for │  │
│  │   solo founders (May 28)    │  │
│  │                             │  │
│  │ • You noted concern about   │  │
│  │   anchoring too early       │  │
│  │   (May 29)                  │  │
│  │                             │  │
│  │ • Open question: enterprise │  │
│  │   pricing still unresolved  │  │
│  │                             │  │
│  │ Sources:                    │  │
│  │ [Pricing Idea] [GTM Notes]  │  │
│  │ [Pricing Risk]              │  │
│  └─────────────────────────────┘  │
│                                   │
│  ─────────────────────────────── │
│  [Ask NEO anything...        ] [→]│
└───────────────────────────────────┘
```

---

### Screen 6: Search Results

```
┌─────────────────────────────────────────────────────────────────────┐
│  🔍 "pricing"                                              [✕]      │
│  4 results                                                          │
├─────────────────────────────────────────────────────────────────────┤
│                                                                     │
│  💡 IDEA · May 28                                                   │
│  Pricing should start at $29/mo for solo founders                   │
│  "...value-based pricing for knowledge workers..."    [Open Note]   │
│                                                                     │
│  ⚡ DECISION · May 30                                               │
│  Don't offer annual plans at launch                                 │
│  "...monthly only for MVP to test willingness to pay..." [Open]    │
│                                                                     │
│  ❓ QUESTION · May 31                                               │
│  What is the right enterprise pricing model?                        │
│  "...seats-based vs usage-based still unclear..."     [Open Note]   │
│                                                                     │
│  📚 LEARNING · May 29                                               │
│  Price anchoring too early destroys negotiation leverage            │
│  "...lesson from podcast: don't name price until..."  [Open Note]   │
│                                                                     │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Part 4 — Database Schema

### Design Principles
- **Additive Only** — no destructive migrations after launch
- All `id` fields use `uuid` (future-safe, portable)
- `metadata jsonb` on every table — extensible without migrations
- `deleted_at` for soft deletes — nothing is ever truly deleted
- Vectors stored in PostgreSQL with pgvector — no separate DB needed for MVP
- Event log from day one — enables history and undo

---

```sql
-- ════════════════════════════════════════════════
-- USERS
-- ════════════════════════════════════════════════

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

-- ════════════════════════════════════════════════
-- WORKSPACES
-- (One per user at MVP. Structure ready for teams in V2)
-- ════════════════════════════════════════════════

CREATE TABLE workspaces (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  owner_id      uuid NOT NULL REFERENCES users(id),
  name          text NOT NULL DEFAULT 'My Second Brain',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  deleted_at    timestamptz,
  metadata      jsonb NOT NULL DEFAULT '{}'
);

-- ════════════════════════════════════════════════
-- BOARDS
-- (One per workspace at MVP)
-- ════════════════════════════════════════════════

CREATE TABLE boards (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  workspace_id  uuid NOT NULL REFERENCES workspaces(id),
  name          text NOT NULL DEFAULT 'Board',
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),
  deleted_at    timestamptz,
  metadata      jsonb NOT NULL DEFAULT '{}'
);

-- ════════════════════════════════════════════════
-- NOTES (Smart Sticky Notes)
-- The atom of the entire system
-- ════════════════════════════════════════════════

CREATE TYPE note_type AS ENUM (
  'idea',
  'decision',
  'goal',
  'learning',
  'task',
  'insight',
  'question'
);

CREATE TABLE notes (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  board_id      uuid NOT NULL REFERENCES boards(id),
  workspace_id  uuid NOT NULL REFERENCES workspaces(id),
  user_id       uuid NOT NULL REFERENCES users(id),

  -- Content
  note_type     note_type NOT NULL DEFAULT 'idea',
  title         text NOT NULL,
  summary       text,
  details       text,
  tags          text[] NOT NULL DEFAULT '{}',

  -- Spatial position on board
  pos_x         float NOT NULL DEFAULT 0,
  pos_y         float NOT NULL DEFAULT 0,
  width         float NOT NULL DEFAULT 240,
  height        float NOT NULL DEFAULT 160,
  rotation      float NOT NULL DEFAULT 0,

  -- Provenance
  source_type   text,     -- 'manual' | 'extraction' | 'neo_suggestion'
  source_id     uuid,     -- FK to conversations.id if extracted

  -- Soft delete
  archived_at   timestamptz,
  deleted_at    timestamptz,
  created_at    timestamptz NOT NULL DEFAULT now(),
  updated_at    timestamptz NOT NULL DEFAULT now(),

  metadata      jsonb NOT NULL DEFAULT '{}'
);

CREATE INDEX notes_board_id_idx       ON notes(board_id);
CREATE INDEX notes_workspace_id_idx   ON notes(workspace_id);
CREATE INDEX notes_tags_idx           ON notes USING GIN(tags);
CREATE INDEX notes_note_type_idx      ON notes(note_type);
CREATE INDEX notes_deleted_at_idx     ON notes(deleted_at) WHERE deleted_at IS NULL;
CREATE INDEX notes_fts_idx ON notes
  USING GIN(to_tsvector('english', coalesce(title,'') || ' ' || coalesce(summary,'') || ' ' || coalesce(details,'')));

-- ════════════════════════════════════════════════
-- NOTE EMBEDDINGS
-- ════════════════════════════════════════════════

CREATE EXTENSION IF NOT EXISTS vector;

CREATE TABLE note_embeddings (
  id            uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  note_id       uuid NOT NULL REFERENCES notes(id) ON DELETE CASCADE,
  embedding     vector(1536) NOT NULL,
  embedded_text text NOT NULL,
  model         text NOT NULL DEFAULT 'text-embedding-3-small',
  created_at    timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX note_embeddings_note_id_idx ON note_embeddings(note_id);
CREATE INDEX note_embeddings_vector_idx  ON note_embeddings USING ivfflat (embedding vector_cosine_ops);

-- ════════════════════════════════════════════════
-- NOTE RELATIONSHIPS
-- ════════════════════════════════════════════════

CREATE TYPE relationship_type AS ENUM (
  'supports',
  'contradicts',
  'leads_to',
  'depends_on',
  'related_to',
  'resulted_in',
  'part_of'
);

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

-- ════════════════════════════════════════════════
-- CONVERSATIONS
-- ════════════════════════════════════════════════

CREATE TYPE conversation_source AS ENUM (
  'chatgpt',
  'claude',
  'meeting_notes',
  'voice_transcript',
  'other'
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

-- ════════════════════════════════════════════════
-- EXTRACTIONS
-- ════════════════════════════════════════════════

CREATE TYPE extraction_status AS ENUM (
  'pending',
  'processing',
  'preview',
  'accepted',
  'rejected',
  'partial',
  'failed'
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

-- ════════════════════════════════════════════════
-- EXTRACTION ITEMS
-- ════════════════════════════════════════════════

CREATE TYPE extraction_item_status AS ENUM (
  'pending',
  'accepted',
  'rejected',
  'edited'
);

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

-- ════════════════════════════════════════════════
-- NOTE EVENTS (append-only log)
-- ════════════════════════════════════════════════

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

-- ════════════════════════════════════════════════
-- NEO CHAT MESSAGES
-- ════════════════════════════════════════════════

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

## Part 5 — API Design

### Base URL
```
https://api.neo.app/v1
```

### Authentication
All endpoints require `Authorization: Bearer <token>` (Supabase JWT).

---

### Boards

```
GET    /boards                    → list user's boards
GET    /boards/:id                → get board with all notes
PATCH  /boards/:id                → update board name/settings
```

---

### Notes

```
GET    /boards/:boardId/notes         → list all notes
                                        ?type=idea,decision
                                        ?tags=pricing,gtm
                                        ?since=2026-05-01
POST   /boards/:boardId/notes         → create single note manually
GET    /notes/:id                     → get note detail
PATCH  /notes/:id                     → update note content/position
DELETE /notes/:id                     → soft delete note
POST   /notes/:id/relationships       → add relationship
DELETE /notes/:id/relationships/:relId → remove relationship
```

**POST /boards/:boardId/notes — body:**
```json
{
  "note_type": "idea",
  "title": "Pricing should start at $29/mo",
  "summary": "Value-based pricing for solo founders",
  "details": "Full context...",
  "tags": ["pricing", "gtm"],
  "pos_x": 120,
  "pos_y": 200
}
```

---

### Import & Extraction

```
POST   /conversations               → save raw text
GET    /conversations/:id           → get conversation
GET    /conversations               → list (paginated)

POST   /conversations/:id/extract   → trigger AI extraction
                                      → returns { extraction_id, status: "pending" }

GET    /extractions/:id             → poll status + preview items
PATCH  /extractions/:id/items/:itemId  → edit extraction item
POST   /extractions/:id/accept      → accept items → create notes
                                       body: { item_ids: [...] } or { all: true }
POST   /extractions/:id/reject      → reject extraction
GET    /extractions/:id/stream      → SSE stream for progress
```

---

### Search

```
GET    /workspaces/:id/search?q=pricing&mode=hybrid&limit=20
```

| Param | Values | Default |
|-------|--------|---------|
| `q` | query string | required |
| `mode` | `text` \| `semantic` \| `hybrid` | `hybrid` |
| `type` | filter by note type | all |
| `limit` | 1–50 | 20 |

**Response:**
```json
{
  "results": [
    {
      "note_id": "uuid",
      "note_type": "idea",
      "title": "Pricing should start at $29/mo",
      "summary": "...",
      "score": 0.94,
      "match_reason": "semantic",
      "tags": ["pricing", "gtm"]
    }
  ],
  "total": 4
}
```

---

### NEO Chat

```
POST   /workspaces/:id/neo/chat     → send message
GET    /workspaces/:id/neo/history  → get history (paginated)
```

**POST /neo/chat — body:**
```json
{
  "message": "What do I know about my pricing strategy?",
  "session_id": "uuid-optional"
}
```

**Response:**
```json
{
  "message_id": "uuid",
  "response": "Based on 3 notes from your board...",
  "cited_notes": [
    { "id": "uuid", "title": "Pricing Idea", "note_type": "idea" }
  ],
  "confidence": "high"
}
```

---

## Part 6 — AI Extraction Pipeline

### Flow

```
User pastes text
      ↓
POST /conversations (save raw_text)
      ↓
POST /conversations/:id/extract
      ↓
BullMQ job queued
      ↓
Worker: Stage 1 → Stage 2 → Stage 3 → Stage 4
      ↓
Extraction preview returned
      ↓
User approves/edits
      ↓
Notes created → embeddings generated (async)
```

---

### Stage 1: Pre-processing

```
1. Strip markdown artifacts
2. Detect conversation turns
3. Prepend context_hint if provided
4. Chunk if > 6,000 tokens

Output: clean_text, token_count
```

---

### Stage 2: Extraction Prompt

**System:**
```
You are an expert at extracting structured knowledge from conversations.
Identify the most important knowledge objects and classify them accurately.

Types: idea | decision | goal | learning | task | insight | question

Rules:
1. Quality over quantity. Extract 3–8 objects maximum.
2. A decision must be clearly stated — not just discussed.
3. Each title must be a standalone statement.
4. Confidence: 0.9+ clearly stated, 0.7–0.9 implied. Below 0.7: don't extract.
5. Tags: lowercase, 1–2 words.

Output ONLY valid JSON. No explanation.
```

**User:**
```
Context: {{context_hint}}

Conversation:
{{clean_text}}

Return JSON array:
[{
  "note_type": "...",
  "title": "...",
  "summary": "...",
  "details": "...",
  "tags": [...],
  "confidence": 0.95,
  "reasoning": "..."
}]
```

---

### Stage 3: Validation

```
1. Parse JSON
2. Validate required fields
3. Filter: drop items confidence < 0.70
4. Auto-suggest relationships between extracted items
   (decision + goal in same extraction → suggest "leads_to")
```

---

### Stage 4: Duplicate Detection

```
For each item:
1. Embed title + summary
2. pgvector similarity search against existing notes
3. If similarity > 0.92: flag { duplicate_warning: true, similar_to: { id, title } }
4. Return to user for decision in preview
```

---

### Stage 5: Auto-layout on Accept

```
Ideas     → x: 100–500,   y: 100–400  (left cluster)
Decisions → x: 600–1000,  y: 100–400  (center cluster)
Goals     → x: 1100–1500, y: 100–400  (right cluster)
Learnings → x: 100–500,   y: 500–800  (bottom left)
Tasks     → x: 600–1000,  y: 500–800  (bottom center)
Others    → x: 1100–1500, y: 500–800  (bottom right)
```

---

### Stage 6: Async Embedding

```
BullMQ job: embed_note
1. Read note (title + summary + details)
2. Call OpenAI text-embedding-3-small
3. Store in note_embeddings
4. Update note.metadata.embedded_at

Retry: 3× exponential backoff
Fallback: full-text search still works if embedding fails
```

---

## Part 7 — Knowledge Object Structure

### Note Object Tree

```
NOTE
├── IDENTITY:    id, workspace_id, user_id, created_at (immutable)
├── TYPE:        note_type (7 types), tags
├── CONTENT:     title (Layer 1) → summary (Layer 2) → details (Layer 3)
├── SPATIAL:     pos_x, pos_y, width, height, rotation
├── RELATIONS:   note_relationships (typed edges)
├── PROVENANCE:  source_type, source_id
├── LIFECYCLE:   updated_at, archived_at, deleted_at
└── EXTENSION:   metadata jsonb (type-specific enrichment, future-proof)
```

---

### The 7 Note Types

| Type | Icon | Color | Definition |
|------|------|-------|------------|
| idea | 💡 | `#FFF8E7` yellow | A new possibility or creative thought |
| decision | ⚡ | `#EBF3FC` blue | Something explicitly chosen or committed to |
| goal | ✅ | `#EAF7EE` green | A target outcome or desired state |
| learning | 📚 | `#F4EEFF` purple | An insight or principle derived from experience |
| task | 📌 | `#FEF2F2` red | A concrete action item |
| insight | 🔮 | `#E6F7F7` teal | A deep observation about a pattern |
| question | ❓ | `#FFF4E6` orange | An open question requiring resolution |

---

### Relationship Types

| Relationship | Example |
|-------------|---------|
| `supports` | "Claude quality" supports "Use Claude" |
| `contradicts` | "Charge more" contradicts "Keep affordable" |
| `leads_to` | "Know ICP" leads_to "Better GTM" |
| `depends_on` | "Launch" depends_on "Finish pipeline" |
| `related_to` | "Pricing idea" related_to "GTM strategy" |
| `resulted_in` | "Architecture review" resulted_in "Claude decision" |
| `part_of` | "Pricing research" part_of "GTM project" |

---

### Metadata Extensions (jsonb, no migration needed)

```json
// decision
{ "decided_at": "2026-05-30", "alternatives_considered": [...], "revisit_trigger": "..." }

// goal
{ "target_date": "2026-06-30", "metric": "50 beta users", "status": "active" }

// task
{ "due_date": "2026-06-05", "priority": "high", "completed_at": null }

// question
{ "urgency": "medium", "resolved_at": null, "resolved_by_note_id": null }
```

---

## Part 8 — Build Order

### Sprint 0 — Foundation (Days 1–3)

```
1. Monorepo: apps/web (Next.js) + apps/api (Fastify) + packages/db (Drizzle)
2. TypeScript strict, ESLint, Prettier
3. Database migrations + pgvector
4. Supabase Auth: sign up, sign in, JWT middleware
5. Seed: 1 user, 1 workspace, 1 board

DONE: Sign in → see empty board page
```

---

### Sprint 1 — Board + Manual Notes (Days 4–7)

```
1. Board canvas: CSS transforms, pan + zoom
2. Zustand store: notes[], pan, zoom
3. NoteCard: type color, icon, title, date, rotation
4. Note CRUD: create, edit, delete, drag to reposition
5. Note detail panel (right sidebar)

DONE: Create, drag, edit, delete notes on canvas
```

---

### Sprint 2 — Import + Extraction (Days 8–14)

```
1. Import dialog: source selector, paste textarea, context hint
2. POST /conversations
3. BullMQ worker + Anthropic SDK
4. Extraction pipeline stages 1–4
5. Extraction preview UI: checkboxes, edit, accept/reject
6. Auto-layout by type cluster

DONE: Paste → Extract → Notes on board
THIS IS THE MVP DEMO MOMENT
```

---

### Sprint 3 — Search (Days 15–18)

```
1. Full-text search endpoint + UI
2. Async embedding pipeline (BullMQ + OpenAI)
3. Semantic search (pgvector cosine similarity)
4. Hybrid search (merge text + semantic)

DONE: Find any note by text or meaning
```

---

### Sprint 4 — NEO Chat (Days 19–25)

```
1. Context assembly: retrieve top 8 relevant notes
2. NEO prompt: answer only from notes, always cite sources
3. Parse cited_notes from response
4. NEO Chat UI: panel, messages, citation chips → scroll to note

DONE: Ask NEO, get cited answers from memory
```

---

### Sprint 5 — Polish + Launch (Days 26–30)

```
1. Onboarding empty state with first-import CTA
2. Error boundaries, loading skeletons
3. Performance: virtual rendering, debounced saves
4. Metrics: log acceptance rate, search queries, NEO sessions
5. Internal testing + bug fixes

DONE: Share with first 10 beta users
```

---

## Part 9 — 30 Day Roadmap

```
WEEK 1 — Foundation & Board
─────────────────────────────────────────────────────────────
Day 1   Monorepo setup, TypeScript, ESLint
Day 2   Database schema migrated, pgvector installed
Day 3   Auth working end-to-end
Day 4   Board canvas (pan + zoom)
Day 5   NoteCard component (types, colors, rotation)
Day 6   Note CRUD (manual creation, edit, delete)
Day 7   Drag-to-reposition + detail panel

MILESTONE: Working board with manual notes.

WEEK 2 — The Killer Feature
─────────────────────────────────────────────────────────────
Day 8   Import dialog UI
Day 9   POST /conversations, raw text storage
Day 10  Anthropic SDK + extraction prompt v1
Day 11  Extraction pipeline: parse + validate
Day 12  Extraction preview UI
Day 13  Accept/reject flow → notes created
Day 14  Auto-layout by type + duplicate detection

MILESTONE: Paste conversation → Smart Sticky Notes on board.
           Show to 3 people. Get feedback.

WEEK 3 — Search & Memory
─────────────────────────────────────────────────────────────
Day 15  Full-text search endpoint + header UI
Day 16  Async embedding: BullMQ + OpenAI API
Day 17  Semantic search with pgvector
Day 18  Hybrid search + search results UI

MILESTONE: Find any note by text or meaning.

WEEK 4 — NEO Chat & Launch
─────────────────────────────────────────────────────────────
Day 19  Context assembly for NEO queries
Day 20  NEO chat prompt + Anthropic API call
Day 21  Citation parsing + cited_notes response
Day 22  NEO Chat panel UI + citation chips
Day 23  Onboarding empty state
Day 24  Error handling + loading states
Day 25  Virtual rendering + debounced saves
Day 26  Duplicate detection in extraction
Day 27  Note relationships (manual linking)
Day 28  End-to-end testing + extraction quality check
Day 29  Fix top 5 issues from internal testing
Day 30  Ship to first 10 beta users 🚀

MILESTONE: MVP complete. First Second Brains being built.
```

---

### Success Metrics

| Metric | Target |
|--------|--------|
| Extraction acceptance rate | > 80% |
| Time to first note (new user) | < 3 minutes |
| Notes per import session | 4–8 average |
| Search-to-click rate | > 60% |
| NEO chat sessions per user | > 3/week |
| Day 7 retention | > 50% |

---

### The Demo Script

```
1. Open NEO (empty board)
   "This is your second brain. Right now it's empty."

2. Open ChatGPT/Claude on another tab. Show a real strategy conversation.

3. Copy the conversation.

4. Paste into NEO Import.

5. Click "Extract Knowledge"

6. Watch preview appear (~5 seconds)
   "NEO found 6 ideas, 2 decisions, 1 goal"

7. Click "Add to Board"

8. Notes appear, spatially organized.

9. Ask NEO: "What did I just decide?"
   NEO answers with citations.

10. "In 30 seconds, a 10-minute conversation became structured knowledge
    that you can search, query, and build on forever."
```
