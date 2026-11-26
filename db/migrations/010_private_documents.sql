ALTER TABLE properties ADD COLUMN verification_status text NOT NULL DEFAULT 'unverified' CHECK(verification_status IN ('unverified','under_review','verified','rejected'));
ALTER TABLE properties ADD COLUMN verification_note text NOT NULL DEFAULT '';
CREATE TABLE private_documents(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL,property_id uuid NOT NULL,created_by uuid NOT NULL,
 title text NOT NULL CHECK(length(title) BETWEEN 1 AND 120),category text NOT NULL CHECK(category IN ('floor_plan','brochure','ownership','registration','rera','construction_approval','other')),
 storage_key text NOT NULL UNIQUE,mime text NOT NULL CHECK(mime IN ('application/pdf','image/jpeg','image/png','image/webp')),bytes int NOT NULL CHECK(bytes BETWEEN 1 AND 3145728),
 verification text NOT NULL DEFAULT 'unverified' CHECK(verification IN ('unverified','under_review','verified','rejected')),expiry_date date,notes text NOT NULL DEFAULT '',archived_at timestamptz,created_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(organization_id,property_id,id),UNIQUE(organization_id,id),
 FOREIGN KEY(organization_id,property_id) REFERENCES properties(organization_id,id),FOREIGN KEY(organization_id,created_by) REFERENCES users(organization_id,id));
CREATE TABLE private_document_grants(organization_id uuid NOT NULL,document_id uuid NOT NULL,agent_id uuid NOT NULL,granted_by uuid NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),PRIMARY KEY(document_id,agent_id),FOREIGN KEY(organization_id,document_id) REFERENCES private_documents(organization_id,id),FOREIGN KEY(organization_id,agent_id) REFERENCES users(organization_id,id),FOREIGN KEY(organization_id,granted_by) REFERENCES users(organization_id,id));
CREATE TABLE private_document_access(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL,document_id uuid NOT NULL,user_id uuid NOT NULL,accessed_at timestamptz NOT NULL DEFAULT now(),FOREIGN KEY(organization_id,document_id) REFERENCES private_documents(organization_id,id),FOREIGN KEY(organization_id,user_id) REFERENCES users(organization_id,id));
CREATE INDEX private_document_access_idx ON private_document_access(organization_id,document_id,accessed_at DESC);
