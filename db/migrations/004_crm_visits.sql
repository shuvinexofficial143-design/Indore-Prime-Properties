CREATE TABLE leads(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL,property_id uuid NOT NULL,
 customer_name text NOT NULL CHECK(length(customer_name) BETWEEN 2 AND 100),phone text NOT NULL CHECK(phone ~ '^000000[0-9]{4}$'),
 email text, budget_paise bigint CHECK(budget_paise>=0), preferred_location text NOT NULL,
 preferred_bhk int CHECK(preferred_bhk BETWEEN 0 AND 30),purpose text NOT NULL CHECK(purpose IN ('buy','rent')),
 source text NOT NULL DEFAULT 'website',utm_source text,utm_medium text,utm_campaign text,
 status text NOT NULL DEFAULT 'new' CHECK(status IN ('new','contacted','qualified','interested','visit_scheduled','visit_completed','negotiation','closed','lost')),
 assigned_agent_id uuid, consent_at timestamptz NOT NULL DEFAULT now(),created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(organization_id,id), UNIQUE(organization_id,property_id,phone),
 FOREIGN KEY(organization_id,property_id) REFERENCES properties(organization_id,id),
 FOREIGN KEY(organization_id,assigned_agent_id) REFERENCES users(organization_id,id)
);
CREATE INDEX leads_pipeline_idx ON leads(organization_id,status,updated_at DESC);
CREATE INDEX leads_agent_idx ON leads(organization_id,assigned_agent_id,status);
CREATE TABLE lead_activities(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL,lead_id uuid NOT NULL,actor_id uuid,
 event text NOT NULL,detail text NOT NULL CHECK(length(detail)<=2000),created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(organization_id,lead_id) REFERENCES leads(organization_id,id),
 FOREIGN KEY(organization_id,actor_id) REFERENCES users(organization_id,id)
);
CREATE INDEX lead_activities_timeline_idx ON lead_activities(organization_id,lead_id,created_at DESC);
CREATE TABLE follow_up_tasks(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL,lead_id uuid NOT NULL,assigned_user_id uuid NOT NULL,
 due_at timestamptz NOT NULL, note text NOT NULL CHECK(length(note) BETWEEN 1 AND 1000),done boolean NOT NULL DEFAULT false,
 created_at timestamptz NOT NULL DEFAULT now(),completed_at timestamptz,
 FOREIGN KEY(organization_id,lead_id) REFERENCES leads(organization_id,id),
 FOREIGN KEY(organization_id,assigned_user_id) REFERENCES users(organization_id,id)
);
CREATE INDEX follow_up_due_idx ON follow_up_tasks(organization_id,assigned_user_id,done,due_at);
CREATE TABLE site_visits(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL,property_id uuid NOT NULL,lead_id uuid NOT NULL,
 customer_id uuid,agent_id uuid,starts_at timestamptz NOT NULL,ends_at timestamptz NOT NULL CHECK(ends_at>starts_at),
 visitors int NOT NULL CHECK(visitors BETWEEN 1 AND 10),requirements text NOT NULL DEFAULT '' CHECK(length(requirements)<=1000),
 receipt_hash char(64) NOT NULL UNIQUE,
 status text NOT NULL DEFAULT 'requested' CHECK(status IN ('requested','confirmed','rescheduled','cancelled','completed','no_show')),
 created_at timestamptz NOT NULL DEFAULT now(),updated_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(organization_id,property_id) REFERENCES properties(organization_id,id),
 FOREIGN KEY(organization_id,lead_id) REFERENCES leads(organization_id,id),
 FOREIGN KEY(organization_id,customer_id) REFERENCES users(organization_id,id),
 FOREIGN KEY(organization_id,agent_id) REFERENCES users(organization_id,id)
);
CREATE INDEX visits_schedule_idx ON site_visits(organization_id,agent_id,starts_at,status);
CREATE INDEX visits_customer_idx ON site_visits(organization_id,customer_id,starts_at);
CREATE TABLE notifications(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL,user_id uuid NOT NULL,
 kind text NOT NULL,message text NOT NULL CHECK(length(message)<=500),read_at timestamptz,created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(organization_id,user_id) REFERENCES users(organization_id,id)
);
CREATE INDEX notifications_user_idx ON notifications(organization_id,user_id,read_at,created_at DESC);
CREATE TABLE demo_submission_limits(
 key text PRIMARY KEY,attempts int NOT NULL CHECK(attempts>0),window_start timestamptz NOT NULL DEFAULT now()
);
