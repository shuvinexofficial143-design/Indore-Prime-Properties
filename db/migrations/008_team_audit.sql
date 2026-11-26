CREATE TABLE management_audit(
 id uuid PRIMARY KEY DEFAULT gen_random_uuid(),organization_id uuid NOT NULL,actor_id uuid NOT NULL,target_user_id uuid,
 action text NOT NULL CHECK(action IN ('create_account','disable_account','enable_account','reset_password','revoke_sessions')),
 created_at timestamptz NOT NULL DEFAULT now(),
 FOREIGN KEY(organization_id,actor_id) REFERENCES users(organization_id,id),
 FOREIGN KEY(organization_id,target_user_id) REFERENCES users(organization_id,id)
);
CREATE INDEX management_audit_org_idx ON management_audit(organization_id,created_at DESC);
