CREATE TABLE IF NOT EXISTS assistant_provider_daily (
 organization_id uuid NOT NULL, user_id uuid NOT NULL, day date NOT NULL, attempts integer NOT NULL DEFAULT 0 CHECK (attempts BETWEEN 0 AND 10),
 PRIMARY KEY (organization_id,user_id,day), FOREIGN KEY (organization_id,user_id) REFERENCES users(organization_id,id) ON DELETE CASCADE
);
