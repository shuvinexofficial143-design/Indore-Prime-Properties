CREATE TABLE property_events(event_id uuid PRIMARY KEY,organization_id uuid NOT NULL,property_id uuid NOT NULL,kind text NOT NULL CHECK(kind='view'),utm_source text,utm_medium text,utm_campaign text,created_at timestamptz NOT NULL DEFAULT now(),FOREIGN KEY(organization_id,property_id) REFERENCES properties(organization_id,id));
CREATE INDEX property_events_report_idx ON property_events(organization_id,created_at,property_id);
ALTER TABLE organization_settings ADD COLUMN branding jsonb NOT NULL DEFAULT '{}'::jsonb;
