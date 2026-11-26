ALTER TABLE properties ADD CONSTRAINT properties_tenant_id_unique UNIQUE(organization_id,id);
CREATE TABLE property_media (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL, property_id uuid NOT NULL,
 kind text NOT NULL CHECK(kind IN ('photo','floor_plan','brochure','model','panorama')),
 mime text NOT NULL, storage_key text UNIQUE NOT NULL, bytes int NOT NULL CHECK(bytes>0 AND bytes<=3145728),
 title text NOT NULL, visible boolean NOT NULL DEFAULT false, sort_order int NOT NULL DEFAULT 0,
 created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(organization_id,property_id) REFERENCES properties(organization_id,id)
);
CREATE INDEX property_media_property_idx ON property_media(organization_id,property_id,kind,sort_order);
CREATE TABLE saved_properties (
 user_id uuid NOT NULL, organization_id uuid NOT NULL, property_id uuid NOT NULL,
 created_at timestamptz NOT NULL DEFAULT now(), PRIMARY KEY(user_id,property_id),
 FOREIGN KEY(organization_id,user_id) REFERENCES users(organization_id,id),
 FOREIGN KEY(organization_id,property_id) REFERENCES properties(organization_id,id)
);
