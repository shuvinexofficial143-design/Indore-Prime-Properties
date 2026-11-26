ALTER TABLE properties ADD COLUMN IF NOT EXISTS details jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE properties ADD COLUMN IF NOT EXISTS private_details jsonb NOT NULL DEFAULT '{}'::jsonb;
ALTER TABLE properties ADD CONSTRAINT property_details_object CHECK(jsonb_typeof(details)='object' AND jsonb_typeof(private_details)='object');
