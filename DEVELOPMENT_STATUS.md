# Development status
Current phase: Phase 2 implementation on preview/phase-2-database.
- Phase 0/1 CI run 45815666613: installation, unit tests, TypeScript, production build and HTTP smoke all passed for commit 464bbb2. Browser testing, licensed photos, Vercel preview still pending.
- Phase 2: versioned PostgreSQL migration, idempotent seed, login with scrypt, hashed session tokens, expiry, email-keyed attempt limit, secure cookies, same-origin POST, role-guarded owner/agent/customer pages, organization-scoped property counts. SQL/pg selected rather than ORM. No public credentials.
- Neon list_organizations and list_projects returned Tool not found. Dedicated live database not created/connected; migrations not applied to Neon. CI disposable PostgreSQL service added. Real deployment blocked by prior Vercel create-project 403.
- Phase 2 code implemented; CI and browser testing pending. Public catalog remains static until Phase 3.
- Next: verify CI, resolve dedicated Neon and Vercel permissions, configure DATABASE_URL and APP_ORIGIN securely, apply migrations/seed and bootstrap accounts, verify real browser login; then Phase 3.
- No paid external integration; no production merge.
