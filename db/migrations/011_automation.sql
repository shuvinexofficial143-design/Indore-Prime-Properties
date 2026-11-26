CREATE TABLE automation_consents(
 organization_id uuid NOT NULL,lead_id uuid NOT NULL,channel text NOT NULL CHECK(channel IN ('whatsapp','instagram','call')),
 granted boolean NOT NULL DEFAULT false,changed_by uuid NOT NULL,updated_at timestamptz NOT NULL DEFAULT now(),
 PRIMARY KEY(organization_id,lead_id,channel),FOREIGN KEY(organization_id,lead_id) REFERENCES leads(organization_id,id),FOREIGN KEY(organization_id,changed_by) REFERENCES users(organization_id,id));
CREATE TABLE automation_consent_history(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL,lead_id uuid NOT NULL,channel text NOT NULL CHECK(channel IN ('whatsapp','instagram','call')),granted boolean NOT NULL,actor_id uuid NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(organization_id,lead_id) REFERENCES leads(organization_id,id),FOREIGN KEY(organization_id,actor_id) REFERENCES users(organization_id,id));
CREATE TABLE automation_rules(
 organization_id uuid PRIMARY KEY REFERENCES organizations(id),enabled boolean NOT NULL DEFAULT false,followup_enabled boolean NOT NULL DEFAULT true,visit_reminder_enabled boolean NOT NULL DEFAULT true,updated_at timestamptz NOT NULL DEFAULT now());
CREATE TABLE automation_jobs(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL,lead_id uuid NOT NULL,
 channel text NOT NULL CHECK(channel IN ('whatsapp','instagram','call','internal')),scenario text NOT NULL CHECK(scenario IN ('property_reply','budget_request','brochure','visit_reminder','handover','qualification_call','followup')),
 mode text NOT NULL DEFAULT 'simulation' CHECK(mode='simulation'),status text NOT NULL DEFAULT 'scheduled' CHECK(status IN ('scheduled','in_progress','completed','failed','human_handover','opted_out')),
 due_at timestamptz NOT NULL DEFAULT now(),created_by uuid NOT NULL,dedup_key text,result text NOT NULL DEFAULT '',created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(organization_id,id),UNIQUE(organization_id,dedup_key),FOREIGN KEY(organization_id,lead_id) REFERENCES leads(organization_id,id),FOREIGN KEY(organization_id,created_by) REFERENCES users(organization_id,id));
CREATE INDEX automation_due_idx ON automation_jobs(organization_id,status,due_at);
CREATE TABLE automation_events(id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL,job_id uuid NOT NULL,event text NOT NULL,detail text NOT NULL,created_at timestamptz NOT NULL DEFAULT now(),FOREIGN KEY(organization_id,job_id) REFERENCES automation_jobs(organization_id,id));
CREATE INDEX automation_events_idx ON automation_events(organization_id,created_at DESC);
