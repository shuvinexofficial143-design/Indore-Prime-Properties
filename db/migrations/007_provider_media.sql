ALTER TABLE property_media ADD COLUMN archived_at timestamptz;
ALTER TABLE property_media ADD CONSTRAINT archived_media_private CHECK(archived_at IS NULL OR NOT visible);
CREATE TABLE provider_3d_tasks(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL,property_id uuid NOT NULL,source_asset_id uuid NOT NULL,created_by uuid NOT NULL,
 provider text NOT NULL DEFAULT 'meshy' CHECK(provider='meshy'),provider_task_id text UNIQUE,
 status text NOT NULL DEFAULT 'submitting' CHECK(status IN ('submitting','submission_unknown','pending','in_progress','succeeded','failed','canceled','importing','imported')),
 progress int NOT NULL DEFAULT 0 CHECK(progress BETWEEN 0 AND 100),consumed_credits int CHECK(consumed_credits>=0),
 output_job_id uuid, note text NOT NULL DEFAULT '',consent_at timestamptz NOT NULL DEFAULT now(),created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(organization_id,property_id,source_asset_id) REFERENCES property_media(organization_id,property_id,id),
 FOREIGN KEY(organization_id,created_by) REFERENCES users(organization_id,id),
 FOREIGN KEY(organization_id,property_id,output_job_id) REFERENCES ai_generation_jobs(organization_id,property_id,id)
);
CREATE INDEX provider_tasks_org_date_idx ON provider_3d_tasks(organization_id,created_at DESC);
CREATE UNIQUE INDEX provider_one_active_source ON provider_3d_tasks(organization_id,source_asset_id) WHERE status IN ('submitting','submission_unknown','pending','in_progress','succeeded','importing');
