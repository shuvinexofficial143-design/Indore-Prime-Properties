# Database schema
001: organizations/settings, users, hashed sessions, login attempts, properties with tenant constraints.
002: property_media with tenant/property foreign key, visibility and storage metadata; saved_properties relation (account sync pending).
003: panorama_hotspots with source/target scoped by property and tenant.
004: leads, lead_activities, follow_up_tasks, site_visits, notifications, demo_submission_limits. Fictional phone format restricted to 000000XXXX. Owner/agent/customer access is server-enforced; visits use hashed random receipt token and transactional agent-row locking to reject overlaps. No production data or credentials in Git.
Migration runner uses transaction/advisory lock, seed uses idempotent inserts for 26 fictional records. SQL/pg used rather than ORM. Live Neon migration remains unapplied. CI uses disposable PostgreSQL 16.
