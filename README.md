# Indore Prime Properties
A fictional portfolio demo by Shuvi 360. No actual properties are offered for sale or rent.

## Local development
Node.js 22 LTS and npm required.
```sh
npm install
npm run dev
npm run test
npm run typecheck
npm run build
```
Open http://localhost:3000. The health endpoint is /api/health. It reports application liveness only, not database readiness.

See PROJECT_SPEC.md and DEVELOPMENT_STATUS.md for scope and verification. Do not use real customer data in the demo. Keep secrets in environment variables and never commit .env.local.
