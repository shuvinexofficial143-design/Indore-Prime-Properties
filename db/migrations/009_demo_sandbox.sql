CREATE TABLE demo_sandboxes(token_hash char(64) PRIMARY KEY, state jsonb NOT NULL CHECK(jsonb_typeof(state)='object'),created_at timestamptz NOT NULL DEFAULT now(),expires_at timestamptz NOT NULL);
CREATE INDEX demo_sandboxes_expiry_idx ON demo_sandboxes(expires_at);
