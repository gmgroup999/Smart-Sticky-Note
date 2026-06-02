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
