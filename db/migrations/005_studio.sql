CREATE TABLE ai_generation_jobs(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL,property_id uuid NOT NULL,
 output_asset_id uuid NOT NULL,created_by uuid NOT NULL,provider text NOT NULL DEFAULT 'manual_upload',model_name text,
 prompt text NOT NULL CHECK(length(prompt)<=4000),visualization_type text NOT NULL CHECK(visualization_type IN ('concept_visualization','virtual_staging','approximate_reconstruction','floor_plan_based')),
 ai_generated boolean NOT NULL DEFAULT false,status text NOT NULL CHECK(status IN ('awaiting_review','approved','published','rejected','cancelled')),
 cost_paise bigint CHECK(cost_paise>=0),started_at timestamptz NOT NULL DEFAULT now(),completed_at timestamptz,reviewed_at timestamptz,reviewed_by uuid,published_at timestamptz,updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(organization_id,property_id,id),UNIQUE(output_asset_id),
 FOREIGN KEY(organization_id,property_id,output_asset_id) REFERENCES property_media(organization_id,property_id,id),
 FOREIGN KEY(organization_id,created_by) REFERENCES users(organization_id,id),
 FOREIGN KEY(organization_id,reviewed_by) REFERENCES users(organization_id,id)
);
CREATE TABLE ai_generation_inputs(
 organization_id uuid NOT NULL,property_id uuid NOT NULL,job_id uuid NOT NULL,asset_id uuid NOT NULL,PRIMARY KEY(job_id,asset_id),
 FOREIGN KEY(organization_id,property_id,job_id) REFERENCES ai_generation_jobs(organization_id,property_id,id),
 FOREIGN KEY(organization_id,property_id,asset_id) REFERENCES property_media(organization_id,property_id,id)
);
ALTER TABLE property_media ADD COLUMN source_type text NOT NULL DEFAULT 'original' CHECK(source_type IN ('original','concept_visualization','virtual_staging','approximate_reconstruction','floor_plan_based'));
ALTER TABLE property_media ADD COLUMN ai_generated boolean NOT NULL DEFAULT false;
ALTER TABLE property_media ADD COLUMN approval_status text NOT NULL DEFAULT 'approved' CHECK(approval_status IN ('pending','approved','rejected'));
ALTER TABLE property_media ADD COLUMN generation_job_id uuid;
ALTER TABLE property_media ADD CONSTRAINT media_review_gate CHECK(NOT visible OR approval_status='approved');
ALTER TABLE property_media ADD CONSTRAINT media_job_scope FOREIGN KEY(organization_id,property_id,generation_job_id) REFERENCES ai_generation_jobs(organization_id,property_id,id);
CREATE INDEX studio_history_idx ON ai_generation_jobs(organization_id,property_id,started_at DESC);
CREATE TABLE enquiry_receipts(receipt_hash char(64) PRIMARY KEY,organization_id uuid NOT NULL,lead_id uuid NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),FOREIGN KEY(organization_id,lead_id) REFERENCES leads(organization_id,id));
