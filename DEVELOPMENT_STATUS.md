# Development status
Current phase: 0 — repository and architecture
Status: Implemented scaffold; build and browser verification pending.
- Repository initialized; strict TypeScript, Next.js App Router, Tailwind, responsive starter screen, about and liveness routes, noindex defaults.
- Scaffold and HTTP smoke test source added; dependency installation, typecheck, production build and runtime smoke tests must be verified before marking Phase 0 Tested.
- Database: planned, not connected. No migrations applied.
- 3D viewer and AI: not started. No external credentials configured.
- Deployment: not started; preview planned in Phase 1.
- Pending: lockfile generation and verified build, then Phase 1 premium public site.
- Phases 1–14: Not Started.
- Blocker: local environment has no network access to npm; use authorized CI or a connected build environment.
- Required credentials later: dedicated Neon database and authentication secret; optional storage and external providers only when authorized.
Last commit: see git log (avoid self-referential SHA).
