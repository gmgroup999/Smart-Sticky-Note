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
