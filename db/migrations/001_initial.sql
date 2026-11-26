CREATE TABLE organizations (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), slug text UNIQUE NOT NULL, name text NOT NULL, is_demo boolean NOT NULL DEFAULT true,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE users (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id),
 email text NOT NULL UNIQUE CHECK (email=lower(email)), password_hash text NOT NULL,
 role text NOT NULL CHECK (role IN ('owner','agent','customer')), active boolean NOT NULL DEFAULT true,
 created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(organization_id,id)
);
CREATE TABLE organization_settings (
 organization_id uuid PRIMARY KEY REFERENCES organizations(id), timezone text NOT NULL DEFAULT 'Asia/Kolkata',
 currency text NOT NULL DEFAULT 'INR', locale text NOT NULL DEFAULT 'en', updated_at timestamptz NOT NULL DEFAULT now()
);
CREATE TABLE sessions (
 token_hash char(64) PRIMARY KEY, user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
 expires_at timestamptz NOT NULL, created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX sessions_expiry_idx ON sessions(expires_at);
CREATE INDEX sessions_user_idx ON sessions(user_id);
CREATE TABLE login_attempts (
 email_hash char(64) PRIMARY KEY, attempts int NOT NULL CHECK(attempts>0), window_start timestamptz NOT NULL
);
CREATE TABLE properties (
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(), organization_id uuid NOT NULL REFERENCES organizations(id),
 slug text NOT NULL, title text NOT NULL, location text NOT NULL, property_type text NOT NULL,
 purpose text NOT NULL CHECK(purpose IN ('buy','rent')), price_paise bigint NOT NULL CHECK(price_paise>=0),
 bedrooms int NOT NULL CHECK(bedrooms>=0), bathrooms int NOT NULL CHECK(bathrooms>=0), area_sqft int NOT NULL CHECK(area_sqft>0),
 description text NOT NULL, illustration text, status text NOT NULL DEFAULT 'draft' CHECK(status IN ('draft','published','archived','sold','rented')),
 is_demo boolean NOT NULL DEFAULT true, created_at timestamptz NOT NULL DEFAULT now(), updated_at timestamptz NOT NULL DEFAULT now(),
 UNIQUE(organization_id,slug)
);
CREATE INDEX properties_catalog_idx ON properties(organization_id,status,purpose,location,price_paise);
