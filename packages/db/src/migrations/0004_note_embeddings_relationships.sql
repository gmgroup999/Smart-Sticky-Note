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
