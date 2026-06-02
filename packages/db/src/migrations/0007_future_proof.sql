-- Approved additions from architecture review (2026-06-02).
-- Apply before Sprint 2 begins. NOT registered in journal yet.

ALTER TYPE note_type ADD VALUE 'project';
ALTER TYPE note_type ADD VALUE 'wisdom';

ALTER TABLE boards ADD COLUMN board_type text DEFAULT 'general';

ALTER TABLE notes ADD COLUMN source_excerpt text;
