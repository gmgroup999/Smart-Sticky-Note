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
