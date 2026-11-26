# Indore Prime Properties
Fictional real-estate portfolio demonstration by Shuvi 360, not a real property marketplace. All seeded listings and sample contacts are fictional. Latest development: preview/advanced-completion (draft PR #6).

## Local setup
Node.js 22 and npm. Run npm install, npm test, npm run typecheck, npm run build, npm run dev. Without database credentials, public catalog and local visual demonstrations remain accessible; accounts and persistence require PostgreSQL.

## Database-backed preview
Use a dedicated PostgreSQL database (remote TLS sslmode=verify-full). Set DATABASE_URL and exact APP_ORIGIN in .env.local. Run npm run db:migrate and npm run db:seed. Set BOOTSTRAP_EMAIL (use an authorized .invalid demo address), BOOTSTRAP_PASSWORD (12–128 characters), BOOTSTRAP_ROLE=owner locally; run npm run db:bootstrap-user, then remove bootstrap variables. Owner can create scoped agent/customer demo accounts. Never commit or deploy bootstrap credentials.

## Optional integrations
Private S3-compatible bucket: configure S3_BUCKET, S3_REGION, S3_ACCESS_KEY_ID, S3_SECRET_ACCESS_KEY, optional HTTPS S3_ENDPOINT. Current uploads and provider GLB import limited to 3 MB per file. Meshy and OpenAI are disabled by default; enable only with authorized billing and explicit per-request consent. Internal automation simulation never sends external messages or calls. See AI_INTEGRATION.md and DEPLOYMENT_GUIDE.md.

## Checks
npm test (unit), npm run test:db (disposable seeded PostgreSQL only), npm run typecheck, npm run build, npm run test:browser (running app and seeded test accounts; see CI workflow). See TEST_REPORT.md and DEVELOPMENT_STATUS.md for verified commit and limitations.
